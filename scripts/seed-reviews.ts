import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedReviews() {
  console.log('🌟 Starting reviews seed...');

  try {
    // Get all contractors and their accepted leads
    const contractors = await prisma.user.findMany({
      where: { role: 'contractor' },
      include: {
        acceptedLeads: {
          where: { status: 'ACCEPTED' },
          include: { homeowner: true }
        }
      }
    });

    const reviews = [
      {
        rating: 5,
        title: "Outstanding Kitchen Renovation",
        text: "Absolutely thrilled with the kitchen renovation! The team was professional, punctual, and the quality exceeded my expectations. They transformed our outdated kitchen into a modern masterpiece. Highly recommend!",
        qualityRating: 5,
        timelinessRating: 5,
        communicationRating: 5,
        cleanlinessRating: 5,
        valueRating: 5,
        projectType: "Kitchen Remodel",
        projectDuration: "3 weeks"
      },
      {
        rating: 5,
        title: "Exceptional Bathroom Work",
        text: "From start to finish, this contractor was amazing. Great communication, showed up on time every day, and the bathroom looks incredible. They even helped us source materials at a discount. Will definitely hire again!",
        qualityRating: 5,
        timelinessRating: 5,
        communicationRating: 5,
        cleanlinessRating: 4,
        valueRating: 5,
        projectType: "Bathroom Renovation",
        projectDuration: "2 weeks"
      },
      {
        rating: 5,
        title: "Fantastic Basement Finishing",
        text: "Our basement went from unfinished storage to a beautiful living space. The attention to detail was impressive, and they kept us informed throughout the entire process. Very happy with the results!",
        qualityRating: 5,
        timelinessRating: 4,
        communicationRating: 5,
        cleanlinessRating: 5,
        valueRating: 5,
        projectType: "Basement Renovation",
        projectDuration: "4 weeks"
      },
      {
        rating: 5,
        title: "Perfect Deck Installation",
        text: "The deck they built is absolutely beautiful and very sturdy. They used high-quality materials and their craftsmanship is top-notch. Our backyard is now our favorite place to relax. Thank you!",
        qualityRating: 5,
        timelinessRating: 5,
        communicationRating: 4,
        cleanlinessRating: 5,
        valueRating: 4,
        projectType: "Deck Construction",
        projectDuration: "1 week"
      },
      {
        rating: 4,
        title: "Great Roofing Service",
        text: "Very professional roofing team. They completed the work quickly and cleaned up thoroughly afterward. The new roof looks great and we haven't had any issues. Only minor communication delays, but overall excellent service.",
        qualityRating: 5,
        timelinessRating: 4,
        communicationRating: 3,
        cleanlinessRating: 5,
        valueRating: 4,
        projectType: "Roof Replacement",
        projectDuration: "3 days"
      },
      {
        rating: 5,
        title: "Excellent Flooring Installation",
        text: "The flooring installation was flawless. They took great care with the measurements and the final result is stunning. The team was respectful of our home and cleaned up perfectly each day. Highly recommend!",
        qualityRating: 5,
        timelinessRating: 5,
        communicationRating: 5,
        cleanlinessRating: 5,
        valueRating: 5,
        projectType: "Flooring Replacement",
        projectDuration: "4 days"
      },
      {
        rating: 5,
        title: "Top-Notch Plumbing Work",
        text: "Had a complex plumbing issue and they diagnosed and fixed it quickly. Very knowledgeable and explained everything clearly. Price was fair and the work was done right the first time. Will call them for all future plumbing needs!",
        qualityRating: 5,
        timelinessRating: 5,
        communicationRating: 5,
        cleanlinessRating: 4,
        valueRating: 5,
        projectType: "Plumbing Repair",
        projectDuration: "1 day"
      },
      {
        rating: 5,
        title: "Professional Electrical Upgrade",
        text: "Upgraded our electrical panel and added new outlets throughout the house. Very professional, licensed electrician who clearly knew what he was doing. Everything passed inspection with flying colors. Great experience!",
        qualityRating: 5,
        timelinessRating: 5,
        communicationRating: 5,
        cleanlinessRating: 5,
        valueRating: 4,
        projectType: "Electrical Upgrade",
        projectDuration: "2 days"
      },
      {
        rating: 5,
        title: "Beautiful Interior Painting",
        text: "Our home looks brand new! The painters were meticulous with prep work and the finish is perfect. They protected all our furniture and floors, and the color consultation was very helpful. Couldn't be happier!",
        qualityRating: 5,
        timelinessRating: 5,
        communicationRating: 4,
        cleanlinessRating: 5,
        valueRating: 5,
        projectType: "Interior Painting",
        projectDuration: "5 days"
      },
      {
        rating: 4,
        title: "Quality Fence Installation",
        text: "Very happy with our new fence. It's well-built and looks great. The installation took a bit longer than expected due to weather, but they communicated well and the final result was worth the wait.",
        qualityRating: 5,
        timelinessRating: 3,
        communicationRating: 5,
        cleanlinessRating: 4,
        valueRating: 4,
        projectType: "Fence Installation",
        projectDuration: "2 days"
      }
    ];

    let reviewCount = 0;

    // Create 3-6 reviews per contractor
    for (const contractor of contractors) {
      const numReviews = Math.floor(Math.random() * 4) + 3; // 3-6 reviews
      
      for (let i = 0; i < numReviews && i < contractor.acceptedLeads.length; i++) {
        const lead = contractor.acceptedLeads[i]!;
        const reviewTemplate = reviews[Math.floor(Math.random() * reviews.length)]!;
        
        // Add some variation to the cost
        const baseCost = lead.budget ? parseFloat(lead.budget) : 5000;
        const projectCost = baseCost * (0.9 + Math.random() * 0.2); // 90-110% of budget
        
        await prisma.review.create({
          data: {
            leadId: lead.id,
            contractorId: contractor.id,
            homeownerId: lead.homeownerId,
            rating: reviewTemplate.rating,
            title: reviewTemplate.title,
            text: reviewTemplate.text,
            qualityRating: reviewTemplate.qualityRating,
            timelinessRating: reviewTemplate.timelinessRating,
            communicationRating: reviewTemplate.communicationRating,
            cleanlinessRating: reviewTemplate.cleanlinessRating,
            valueRating: reviewTemplate.valueRating,
            projectType: lead.category || reviewTemplate.projectType,
            projectCost: projectCost,
            projectDuration: reviewTemplate.projectDuration,
            status: 'published',
            isVerified: true,
            helpfulCount: Math.floor(Math.random() * 20) + 5, // 5-25 helpful votes
          }
        });

        reviewCount++;
        const contractorProfile = await prisma.contractorProfile.findUnique({
          where: { userId: contractor.id }
        });
        console.log(`✅ Created review for ${contractorProfile?.companyName || contractor.name}`);
      }
    }

    console.log(`\n🎉 Reviews seed completed!`);
    console.log(`   - ${reviewCount} reviews created`);
    console.log(`   - Average ${(reviewCount / contractors.length).toFixed(1)} reviews per contractor`);

  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedReviews();