/**
 * Enable Dual-Role Access
 * This script creates both ContractorProfile and HomeownerProfile for a user
 * so they can test the full workflow from both perspectives
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function enableDualRole(email) {
  try {
    console.log(`\n🔄 Enabling dual-role access for ${email}...`);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        contractorProfile: true,
        homeownerProfile: true
      }
    });

    if (!user) {
      console.error(`❌ User not found with email: ${email}`);
      return;
    }

    console.log(`✅ Found user: ${user.name || user.email} (ID: ${user.id})`);
    console.log(`   Current role: ${user.role}`);

    // Create HomeownerProfile if it doesn't exist
    if (!user.homeownerProfile) {
      console.log('   Creating HomeownerProfile...');
      await prisma.homeownerProfile.create({
        data: {
          userId: user.id,
          name: user.name || 'Homeowner',
          city: null,
          phone: null
        }
      });
      console.log('   ✅ HomeownerProfile created');
    } else {
      console.log('   ✅ HomeownerProfile already exists');
    }

    // Create ContractorProfile if it doesn't exist
    if (!user.contractorProfile) {
      console.log('   Creating ContractorProfile...');
      await prisma.contractorProfile.create({
        data: {
          userId: user.id,
          companyName: user.name || 'Test Company',
          trade: 'General',
          bio: 'Test contractor account for dual-role testing',
          city: null,
          serviceRadiusKm: 25,
          verified: true, // Auto-verify for testing
          isActive: true
        }
      });
      console.log('   ✅ ContractorProfile created and verified');
    } else {
      console.log('   ✅ ContractorProfile already exists');
      
      // Make sure it's verified
      if (!user.contractorProfile.verified) {
        await prisma.contractorProfile.update({
          where: { userId: user.id },
          data: { verified: true }
        });
        console.log('   ✅ ContractorProfile verified');
      }
    }

    // Fetch updated user
    const updatedUser = await prisma.user.findUnique({
      where: { email },
      include: {
        contractorProfile: true,
        homeownerProfile: true
      }
    });

    console.log('\n✅ Dual-role access enabled successfully!');
    console.log('   User can now:');
    console.log('   - Post jobs as homeowner');
    console.log('   - Accept jobs as contractor');
    console.log('   - Use /select-role page to switch between roles');
    console.log('\nProfiles:');
    console.log(`   HomeownerProfile ID: ${updatedUser.homeownerProfile.id}`);
    console.log(`   ContractorProfile ID: ${updatedUser.contractorProfile.id}`);
    console.log(`   Contractor Verified: ${updatedUser.contractorProfile.verified}`);

  } catch (error) {
    console.error('❌ Error enabling dual-role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
const email = process.argv[2] || 'brandsagaceo@gmail.com';
enableDualRole(email);
