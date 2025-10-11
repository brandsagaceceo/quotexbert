const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSamplePortfolio() {
  try {
    console.log('🎨 Creating sample portfolio items...');

    // Check if contractor exists
    const contractor = await prisma.contractorProfile.findFirst({
      where: { userId: 'demo-contractor' }
    });

    if (!contractor) {
      console.log('❌ Demo contractor not found');
      return;
    }

    // Delete existing portfolio items for demo contractor
    await prisma.portfolioItem.deleteMany({
      where: { contractorId: contractor.id }
    });

    // Sample portfolio items with correct schema fields
    const portfolioItems = [
      {
        contractorId: contractor.id,
        title: 'Modern Kitchen Renovation',
        description: 'Complete kitchen makeover with custom cabinets, quartz countertops, and stainless steel appliances. Project included electrical work for under-cabinet lighting and new island outlet.',
        caption: 'Stunning modern kitchen transformation with premium finishes',
        imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        projectType: 'kitchen',
        projectCost: '$25,000 - $35,000',
        duration: '3 weeks',
        location: 'Toronto, ON',
        clientStory: 'The homeowners wanted a modern, functional kitchen for their growing family. They\'re thrilled with the results!',
        isPublic: true,
        isPinned: true,
        tags: JSON.stringify(['modern', 'kitchen', 'renovation', 'custom'])
      },
      {
        contractorId: contractor.id,
        title: 'Luxury Bathroom Remodel',
        description: 'High-end bathroom renovation featuring heated tile floors, rainfall shower, floating vanity, and LED mirror lighting. Premium finishes throughout.',
        caption: 'Spa-like luxury bathroom with heated floors',
        imageUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop',
        projectType: 'bathroom',
        projectCost: '$18,000 - $25,000',
        duration: '2 weeks',
        location: 'Mississauga, ON',
        clientStory: 'Transformed their outdated bathroom into a spa-like retreat. Quality work and attention to detail!',
        isPublic: true,
        isPinned: false,
        tags: JSON.stringify(['luxury', 'bathroom', 'spa', 'heated-floors'])
      },
      {
        contractorId: contractor.id,
        title: 'Hardwood Flooring Installation',
        description: 'Beautiful oak hardwood flooring installation in living room and dining area. Includes subfloor preparation and finishing with multiple coats of polyurethane.',
        caption: 'Premium oak hardwood throughout main living areas',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        projectType: 'flooring',
        projectCost: '$8,000 - $12,000',
        duration: '5 days',
        location: 'North York, ON',
        materials: 'Premium oak hardwood, polyurethane finish, underlayment',
        isPublic: true,
        isPinned: false,
        tags: JSON.stringify(['hardwood', 'flooring', 'oak', 'refinishing'])
      },
      {
        contractorId: contractor.id,
        title: 'Deck Construction & Staining',
        description: 'Custom cedar deck with composite railings. Weather-resistant stain applied for longevity. Perfect for outdoor entertaining.',
        caption: 'Beautiful cedar deck perfect for outdoor entertaining',
        imageUrl: 'https://images.unsplash.com/photo-1502005229762-cf1b2da02f3f?w=800&h=600&fit=crop',
        projectType: 'outdoor',
        projectCost: '$12,000 - $16,000',
        duration: '1 week',
        location: 'Etobicoke, ON',
        materials: 'Cedar decking, composite railings, weather-resistant stain',
        clientStory: 'Perfect for summer BBQs and family gatherings. Excellent craftsmanship and beautiful finish.',
        isPublic: true,
        isPinned: false,
        tags: JSON.stringify(['deck', 'outdoor', 'cedar', 'entertaining'])
      },
      {
        contractorId: contractor.id,
        title: 'Interior Painting Project',
        description: 'Professional interior painting for entire home. Includes wall preparation, primer, and two coats of premium paint. Color consultation provided.',
        caption: 'Fresh new look with professional interior painting',
        imageUrl: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&h=600&fit=crop',
        projectType: 'painting',
        projectCost: '$4,500 - $6,500',
        duration: '4 days',
        location: 'Scarborough, ON',
        materials: 'Premium paint, primer, brushes, rollers, drop cloths',
        clientStory: 'Fresh new look throughout the home. Clean work and great color advice!',
        isPublic: true,
        isPinned: false,
        tags: JSON.stringify(['painting', 'interior', 'color-consultation', 'premium'])
      }
    ];

    // Create portfolio items
    for (const item of portfolioItems) {
      const portfolioItem = await prisma.portfolioItem.create({
        data: item
      });
      
      console.log(`✅ Created: ${portfolioItem.title}`);
      console.log(`   Type: ${portfolioItem.projectType}`);
      console.log(`   Cost: ${portfolioItem.projectCost}`);
      console.log(`   Duration: ${portfolioItem.duration}`);
      console.log('');
    }

    // Update contractor stats
    await prisma.contractorProfile.update({
      where: { userId: 'demo-contractor' },
      data: {
        avgRating: 4.8,
        reviewCount: 12
      }
    });

    console.log('🎉 Sample portfolio created successfully!');
    console.log('📊 Updated contractor stats:');
    console.log('   - Average Rating: 4.8/5');
    console.log('   - Reviews: 12');
    console.log('   - Portfolio Items: 5');

  } catch (error) {
    console.error('❌ Portfolio creation failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSamplePortfolio();