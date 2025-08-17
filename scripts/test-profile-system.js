/**
 * Test script for the QuotexBert profile system
 * Tests all the new profile features we implemented
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testProfileSystem() {
  console.log('🧪 Testing QuotexBert Profile System...\n');

  try {
    // Test 1: Check if our new models exist
    console.log('1. Testing database models...');
    
    const contractorProfileCount = await prisma.contractorProfile.count();
    const homeownerProfileCount = await prisma.homeownerProfile.count();
    const portfolioItemCount = await prisma.portfolioItem.count();
    const reviewCount = await prisma.review.count();
    
    console.log(`   ✅ ContractorProfile table: ${contractorProfileCount} records`);
    console.log(`   ✅ HomeownerProfile table: ${homeownerProfileCount} records`);
    console.log(`   ✅ PortfolioItem table: ${portfolioItemCount} records`);
    console.log(`   ✅ Review table: ${reviewCount} records`);

    // Test 2: Create a test contractor profile
    console.log('\n2. Testing contractor profile creation...');
    
    // First, find or create a test user
    let testUser = await prisma.user.findFirst({
      where: { role: 'contractor' }
    });

    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          email: 'test-contractor@example.com',
          role: 'contractor'
        }
      });
      console.log('   ✅ Created test contractor user');
    } else {
      console.log('   ✅ Found existing contractor user');
    }

    // Create or update contractor profile
    const contractorProfile = await prisma.contractorProfile.upsert({
      where: { userId: testUser.id },
      update: {
        companyName: 'Test Contracting Co.',
        trade: 'general',
        bio: 'Professional contractor with 10 years of experience.',
        city: 'Test City',
        serviceRadiusKm: 25,
        verified: true,
      },
      create: {
        userId: testUser.id,
        companyName: 'Test Contracting Co.',
        trade: 'general',
        bio: 'Professional contractor with 10 years of experience.',
        city: 'Test City',
        serviceRadiusKm: 25,
        verified: true,
      }
    });
    console.log('   ✅ Contractor profile created/updated');

    // Test 3: Create a portfolio item
    console.log('\n3. Testing portfolio creation...');
    
    const portfolioItem = await prisma.portfolioItem.create({
      data: {
        contractorId: contractorProfile.id,
        title: 'Kitchen Renovation',
        caption: 'Complete kitchen remodel with modern appliances',
        imageUrl: 'https://example.com/kitchen.jpg'
      }
    });
    console.log('   ✅ Portfolio item created');

    // Test 4: Create a test homeowner and review
    console.log('\n4. Testing review system...');
    
    let testHomeowner = await prisma.user.findFirst({
      where: { role: 'homeowner' }
    });

    if (!testHomeowner) {
      testHomeowner = await prisma.user.create({
        data: {
          email: 'test-homeowner@example.com',
          role: 'homeowner'
        }
      });
      console.log('   ✅ Created test homeowner user');
    }

    // Create homeowner profile
    const homeownerProfile = await prisma.homeownerProfile.upsert({
      where: { userId: testHomeowner.id },
      update: {
        name: 'Test Homeowner',
        city: 'Test City'
      },
      create: {
        userId: testHomeowner.id,
        name: 'Test Homeowner',
        city: 'Test City'
      }
    });

    // Create a test lead for the review
    const testLead = await prisma.lead.create({
      data: {
        title: 'Test Job for Review',
        description: 'A test job to create a review',
        budget: 1000,
        zipCode: '12345',
        category: 'general',
        homeownerId: testHomeowner.id,
        status: 'closed'
      }
    });

    // Create a review
    const review = await prisma.review.create({
      data: {
        leadId: testLead.id,
        contractorId: testUser.id, // Use the User ID, not ContractorProfile ID
        homeownerId: testHomeowner.id,
        rating: 5,
        text: 'Excellent work! Very professional and completed on time.'
      }
    });
    console.log('   ✅ Review created');

    // Test 5: Update contractor rating
    console.log('\n5. Testing rating aggregation...');
    
    const reviews = await prisma.review.findMany({
      where: { contractorId: testUser.id } // Use the User ID
    });
    
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    await prisma.contractorProfile.update({
      where: { id: contractorProfile.id },
      data: {
        avgRating: avgRating,
        reviewCount: reviews.length
      }
    });
    console.log(`   ✅ Updated contractor rating: ${avgRating} (${reviews.length} reviews)`);

    // Test 6: Test queries with relations
    console.log('\n6. Testing complex queries...');
    
    const contractorWithDetails = await prisma.contractorProfile.findUnique({
      where: { id: contractorProfile.id },
      include: {
        user: true,
        portfolio: true,
        _count: {
          select: {
            portfolio: true
          }
        }
      }
    });
    
    console.log(`   ✅ Contractor query: ${contractorWithDetails.companyName}`);
    console.log(`   ✅ Portfolio items: ${contractorWithDetails._count.portfolio}`);
    console.log(`   ✅ Average rating: ${contractorWithDetails.avgRating}`);

    console.log('\n🎉 All profile system tests passed!');
    console.log('\n📊 Summary:');
    console.log(`   • Contractor profiles: ${await prisma.contractorProfile.count()}`);
    console.log(`   • Homeowner profiles: ${await prisma.homeownerProfile.count()}`);
    console.log(`   • Portfolio items: ${await prisma.portfolioItem.count()}`);
    console.log(`   • Reviews: ${await prisma.review.count()}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testProfileSystem();
