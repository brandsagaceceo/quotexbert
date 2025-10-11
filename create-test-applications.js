const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestApplications() {
  try {
    console.log('Creating test contractors and applications...');

    // First, create some test contractors
    const contractor1 = await prisma.user.create({
      data: {
        id: 'test-contractor-1',
        email: 'john@plumbingpro.com',
        name: 'John Smith',
        role: 'contractor',
        contractorProfile: {
          create: {
            companyName: 'John\'s Professional Plumbing',
            trade: 'plumbing',
            bio: 'Licensed plumber with 15+ years experience',
            city: 'Seattle',
            serviceRadiusKm: 30,
            phone: '(555) 123-4567',
            verified: true,
            avgRating: 4.8,
            reviewCount: 127
          }
        }
      }
    });

    const contractor2 = await prisma.user.create({
      data: {
        id: 'test-contractor-2',
        email: 'mike@electricworks.com',
        name: 'Mike Johnson',
        role: 'contractor',
        contractorProfile: {
          create: {
            companyName: 'ElectricWorks Pro',
            trade: 'electrical',
            bio: 'Certified electrician specializing in residential and commercial work',
            city: 'Seattle',
            serviceRadiusKm: 25,
            phone: '(555) 987-6543',
            verified: true,
            avgRating: 4.9,
            reviewCount: 89
          }
        }
      }
    });

    const contractor3 = await prisma.user.create({
      data: {
        id: 'test-contractor-3',
        email: 'sarah@paintmaster.com',
        name: 'Sarah Wilson',
        role: 'contractor',
        contractorProfile: {
          create: {
            companyName: 'PaintMaster Solutions',
            trade: 'painting',
            bio: 'Professional painter with expertise in interior and exterior projects',
            city: 'Seattle',
            serviceRadiusKm: 20,
            phone: '(555) 456-7890',
            verified: true,
            avgRating: 4.7,
            reviewCount: 56
          }
        }
      }
    });

    // Get the first job to add applications to
    const jobs = await prisma.lead.findMany({
      where: { homeownerId: 'demo-homeowner' },
      take: 1
    });

    if (jobs.length === 0) {
      console.log('No jobs found. Please run create-test-jobs.js first.');
      return;
    }

    const job = jobs[0];
    console.log(`Adding applications to job: ${job.title}`);

    // Create applications
    const application1 = await prisma.jobApplication.create({
      data: {
        leadId: job.id,
        contractorId: contractor1.id,
        status: 'pending',
        message: 'I\'d be happy to help with your kitchen plumbing repair. I have 15+ years of experience and can start next week. I\'ll provide a detailed assessment and use only high-quality materials.',
        proposedPrice: '850',
        estimatedDays: 2
      }
    });

    const application2 = await prisma.jobApplication.create({
      data: {
        leadId: job.id,
        contractorId: contractor2.id,
        status: 'pending',
        message: 'Hello! I noticed this is electrical work. While I specialize in electrical, I also do basic plumbing. I can complete this project efficiently and safely.',
        proposedPrice: '920',
        estimatedDays: 3
      }
    });

    const application3 = await prisma.jobApplication.create({
      data: {
        leadId: job.id,
        contractorId: contractor3.id,
        status: 'pending',
        message: 'Hi there! I have experience with plumbing work in addition to painting. I can offer competitive pricing and flexible scheduling.',
        proposedPrice: '780',
        estimatedDays: 2
      }
    });

    console.log(`✅ Created ${contractor1.name} application: $${application1.proposedPrice} (${application1.estimatedDays} days)`);
    console.log(`✅ Created ${contractor2.name} application: $${application2.proposedPrice} (${application2.estimatedDays} days)`);
    console.log(`✅ Created ${contractor3.name} application: $${application3.proposedPrice} (${application3.estimatedDays} days)`);

    console.log('\n🎉 Test applications created successfully!');
    console.log(`Visit the applications page to test acceptance: http://localhost:3000/homeowner/jobs/${job.id}/applications`);

  } catch (error) {
    console.error('Error creating test applications:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestApplications();