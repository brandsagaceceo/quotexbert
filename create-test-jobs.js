const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestJobs() {
  try {
    console.log('Creating test homeowner...');
    
    // Create or get demo homeowner
    let homeowner = await prisma.user.findUnique({
      where: { id: 'demo-homeowner' }
    });

    if (!homeowner) {
      homeowner = await prisma.user.create({
        data: {
          id: 'demo-homeowner',
          email: 'homeowner@quotexbert.com',
          name: 'Demo Homeowner',
          role: 'homeowner'
        }
      });
    }

    console.log('Creating test jobs...');

    // Create some test jobs in the new format
    const testJobs = [
      {
        title: 'Kitchen Plumbing Repair',
        description: 'Need to fix a leaky kitchen sink faucet and replace the garbage disposal. The faucet has been dripping for weeks and the disposal stopped working last week.',
        budget: '$300-500',
        zipCode: '90210',
        category: 'plumbing',
        status: 'open',
        published: true,
        maxContractors: 3,
        homeownerId: homeowner.id
      },
      {
        title: 'Living Room Electrical Work',
        description: 'Install 3 new ceiling fans in living room and dining room. Also need to add some additional outlets near the entertainment center.',
        budget: '$600-800',
        zipCode: '90210',
        category: 'electrical',
        status: 'open',
        published: true,
        maxContractors: 3,
        homeownerId: homeowner.id
      },
      {
        title: 'Bathroom Painting Project',
        description: 'Need to paint two bathrooms - one full bath and one powder room. Walls need primer and two coats of paint. Prefer neutral colors.',
        budget: '$400-600',
        zipCode: '90210',
        category: 'painting',
        status: 'open',
        published: true,
        maxContractors: 3,
        homeownerId: homeowner.id
      },
      {
        title: 'HVAC Maintenance',
        description: 'Annual HVAC system maintenance and tune-up. System is about 5 years old and needs filter replacement and general inspection.',
        budget: '$200-300',
        zipCode: '90210',
        category: 'hvac',
        status: 'open',
        published: true,
        maxContractors: 3,
        homeownerId: homeowner.id
      },
      {
        title: 'General Handyman Work',
        description: 'Multiple small tasks: fix squeaky door hinges, patch small holes in drywall, caulk around bathtub, and install new door handles.',
        budget: '$250-400',
        zipCode: '90210',
        category: 'handyman-services',
        status: 'open',
        published: true,
        maxContractors: 3,
        homeownerId: homeowner.id
      }
    ];

    for (const job of testJobs) {
      const created = await prisma.lead.create({
        data: job
      });
      console.log(`Created job: ${created.title} (${created.id})`);
    }

    console.log('\n✅ Test jobs created successfully!');
    console.log('Jobs are now available for contractors to apply to.');
    
  } catch (error) {
    console.error('Error creating test jobs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestJobs();