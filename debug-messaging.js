// TEMPORARY DEBUG SCRIPT — delete after debugging
// Run: node debug-messaging.js
// Checks database for identity, thread, and message consistency issues

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== QuoteXbert Messaging Debug Report ===\n');

  // 1. Check for duplicate users (same clerkUserId with different id)
  console.log('--- 1. DUPLICATE USER CHECK ---');
  const allUsers = await prisma.user.findMany({
    select: { id: true, email: true, clerkUserId: true, role: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });
  
  const byClerkId = {};
  const byEmail = {};
  for (const u of allUsers) {
    if (u.clerkUserId) {
      if (!byClerkId[u.clerkUserId]) byClerkId[u.clerkUserId] = [];
      byClerkId[u.clerkUserId].push(u);
    }
    if (!byEmail[u.email]) byEmail[u.email] = [];
    byEmail[u.email].push(u);
  }
  
  const dupsByClerkId = Object.entries(byClerkId).filter(([, users]) => users.length > 1);
  const dupsByEmail = Object.entries(byEmail).filter(([, users]) => users.length > 1);
  
  if (dupsByClerkId.length) {
    console.log('⚠️  DUPLICATES BY clerkUserId:');
    for (const [cid, users] of dupsByClerkId) {
      console.log(`  clerkUserId="${cid}":`, users.map(u => `id=${u.id} role=${u.role}`));
    }
  } else {
    console.log('✅ No duplicate clerkUserIds');
  }
  
  if (dupsByEmail.length) {
    console.log('⚠️  DUPLICATES BY email:');
    for (const [email, users] of dupsByEmail) {
      console.log(`  email="${email}":`, users.map(u => `id=${u.id} clerk=${u.clerkUserId} role=${u.role}`));
    }
  } else {
    console.log('✅ No duplicate emails');
  }

  // 2. Users where id != clerkUserId (webhook-created)
  console.log('\n--- 2. ID vs CLERKUSERID MISMATCH ---');
  const mismatchUsers = allUsers.filter(u => u.clerkUserId && u.id !== u.clerkUserId);
  if (mismatchUsers.length) {
    console.log(`Found ${mismatchUsers.length} users where id ≠ clerkUserId (webhook path):`);
    for (const u of mismatchUsers) {
      console.log(`  id=${u.id} | clerkUserId=${u.clerkUserId} | role=${u.role}`);
    }
  } else {
    console.log('✅ All users have id === clerkUserId (all role-selection path)');
  }

  // 3. Users with null clerkUserId
  console.log('\n--- 3. NULL CLERKUSERID ---');
  const nullClerk = allUsers.filter(u => !u.clerkUserId);
  if (nullClerk.length) {
    console.log(`⚠️  ${nullClerk.length} users with null clerkUserId:`);
    for (const u of nullClerk) {
      console.log(`  id=${u.id} | email=${u.email} | role=${u.role}`);
    }
  } else {
    console.log('✅ All users have clerkUserId set');
  }

  // 4. Thread/Message consistency
  console.log('\n--- 4. THREAD & MESSAGE DATA ---');
  const threads = await prisma.thread.findMany({
    include: {
      lead: { select: { id: true, title: true, homeownerId: true, contractorId: true } },
      messages: {
        select: { id: true, fromUserId: true, toUserId: true, body: true, readAt: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  console.log(`Total threads: ${threads.length}`);
  
  const userIds = new Set(allUsers.map(u => u.id));
  
  for (const t of threads) {
    const lead = t.lead;
    const homeownerExists = userIds.has(lead.homeownerId);
    const contractorExists = lead.contractorId ? userIds.has(lead.contractorId) : true;
    
    console.log(`\nThread ${t.id}:`);
    console.log(`  Lead: "${lead.title}" homeowner=${lead.homeownerId}${homeownerExists ? '' : ' ⚠️ NOT FOUND'} contractor=${lead.contractorId || 'none'}${contractorExists ? '' : ' ⚠️ NOT FOUND'}`);
    console.log(`  Messages: ${t.messages.length}`);
    
    for (const m of t.messages) {
      const fromExists = userIds.has(m.fromUserId);
      const toExists = userIds.has(m.toUserId);
      const fromUser = allUsers.find(u => u.id === m.fromUserId);
      const toUser = allUsers.find(u => u.id === m.toUserId);
      
      // Check if fromUserId matches either homeowner or contractor
      const fromIsParticipant = m.fromUserId === lead.homeownerId || m.fromUserId === lead.contractorId;
      const toIsParticipant = m.toUserId === lead.homeownerId || m.toUserId === lead.contractorId;
      
      console.log(`    msg ${m.id.substring(0, 8)}... from=${m.fromUserId.substring(0, 15)}(${fromUser?.role || '?'})${fromIsParticipant ? '' : ' ⚠️ NOT_PARTICIPANT'} to=${m.toUserId.substring(0, 15)}(${toUser?.role || '?'})${toIsParticipant ? '' : ' ⚠️ NOT_PARTICIPANT'} read=${m.readAt ? 'yes' : 'no'} body="${m.body.substring(0, 30)}"`);
      
      if (!fromExists) console.log(`    ⚠️ fromUserId ${m.fromUserId} NOT IN USERS TABLE`);
      if (!toExists) console.log(`    ⚠️ toUserId ${m.toUserId} NOT IN USERS TABLE`);
    }
  }

  // 5. Check for orphaned typing indicators
  console.log('\n--- 5. TYPING INDICATORS ---');
  const typing = await prisma.typingIndicator.findMany({
    select: { threadId: true, userId: true, expiresAt: true },
  });
  console.log(`Active typing indicators: ${typing.length}`);
  for (const ti of typing) {
    const userExists = userIds.has(ti.userId);
    const expired = ti.expiresAt < new Date();
    console.log(`  thread=${ti.threadId.substring(0, 8)} user=${ti.userId.substring(0, 15)} ${userExists ? '✅' : '⚠️ USER NOT FOUND'} ${expired ? '(expired)' : '(active)'}`);
  }

  // 6. Simulate selfUserId resolution for each user
  console.log('\n--- 6. SELFUSERID RESOLUTION SIMULATION ---');
  const realUsers = allUsers.filter(u => u.role && u.clerkUserId);
  for (const u of realUsers) {
    const clerkId = u.clerkUserId;
    const matches = await prisma.user.findMany({
      where: { OR: [{ id: clerkId }, { clerkUserId: clerkId }] },
      select: { id: true },
    });
    const resolvedSelfUserId = matches[0]?.id || clerkId;
    const allMatchIds = matches.map(m => m.id);
    
    if (allMatchIds.length > 1) {
      console.log(`⚠️  User "${u.email}" (clerk=${clerkId}): MULTIPLE matches: [${allMatchIds.join(', ')}] → selfUserId=${resolvedSelfUserId}`);
    } else if (resolvedSelfUserId !== u.id) {
      console.log(`⚠️  User "${u.email}" (clerk=${clerkId}): selfUserId=${resolvedSelfUserId} ≠ user.id=${u.id}`);
    } else {
      console.log(`✅ User "${u.email}" (clerk=${clerkId}): selfUserId=${resolvedSelfUserId} ✓`);
    }
  }

  console.log('\n=== Debug Report Complete ===');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
