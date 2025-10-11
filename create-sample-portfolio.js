const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSamplePortfolio() {
  try {
    console.log('🎨 Creating sample portfolio items...\n');

    // Check if contractor exists
    const contractor = await prisma.user.findUnique({
      where: { id: 'demo-contractor' }
    });

    if (!contractor) {
      console.log('❌ Demo contractor not found');
      return;
    }

    // Sample portfolio items
    const portfolioItems = [
      {
        contractorId: 'demo-contractor',
        title: 'Modern Kitchen Renovation',
        description: 'Complete kitchen makeover with custom cabinets, quartz countertops, and stainless steel appliances. Project included electrical work for under-cabinet lighting and new island outlet.',
        imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        category: 'Kitchen',
        projectDate: new Date('2024-09-15'),
        budgetRange: '$25,000 - $35,000'
      },
      {
        contractorId: 'demo-contractor',
        title: 'Luxury Bathroom Remodel',
        description: 'Master bathroom transformation featuring walk-in shower with glass doors, floating vanity, and heated floors. All plumbing and electrical work completed to code.',
        imageUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop',
        category: 'Bathroom',
        projectDate: new Date('2024-08-20'),
        budgetRange: '$15,000 - $22,000'
      },
      {
        contractorId: 'demo-contractor',
        title: 'Hardwood Floor Installation',
        description: 'Installed premium oak hardwood flooring throughout main floor. Included subfloor preparation, professional sanding, and three coats of polyurethane finish.',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        category: 'Flooring',
        projectDate: new Date('2024-07-10'),
        budgetRange: '$8,000 - $12,000'
      },
      {
        contractorId: 'demo-contractor',
        title: 'Deck Construction & Staining',
        description: 'Built custom cedar deck with composite railings. Includes proper drainage, structural support, and weather-resistant staining for long-lasting protection.',
        imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
        category: 'Outdoor',
        projectDate: new Date('2024-06-05'),
        budgetRange: '$6,000 - $9,000'
      },
      {
        contractorId: 'demo-contractor',
        title: 'Interior Painting Project',
        description: 'Professional interior painting for 3-bedroom home. Used premium paint, proper prep work including patching and priming. Two-tone color scheme with accent walls.',
        imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop',
        category: 'Painting',
        projectDate: new Date('2024-05-15'),
        budgetRange: '$3,500 - $5,000'
      }
    ];

    // Create portfolio items
    for (const item of portfolioItems) {
      const portfolioItem = await prisma.portfolioItem.create({
        data: item
      });
      
      console.log(`✅ Created: ${portfolioItem.title}`);
      console.log(`   Category: ${portfolioItem.category}`);
      console.log(`   Budget: ${portfolioItem.budgetRange}`);
      console.log('');
    }

    // Update contractor stats
    await prisma.contractorProfile.update({
      where: { userId: 'demo-contractor' },
      data: {
        completedJobs: 15,
        avgRating: 4.8,
        reviewCount: 12
      }
    });

    console.log('🎉 Sample portfolio created successfully!');
    console.log('📊 Updated contractor stats:');
    console.log('   - Completed Jobs: 15');
    console.log('   - Average Rating: 4.8/5');
    console.log('   - Reviews: 12');

  } catch (error) {
    console.error('❌ Portfolio creation failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSamplePortfolio();