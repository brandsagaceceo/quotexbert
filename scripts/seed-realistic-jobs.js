import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// All categories from the system
const CATEGORIES = [
  'Painting', 'Plumbing', 'Electrical', 'Flooring', 'Roofing', 'HVAC',
  'Drywall', 'Carpentry', 'Kitchen Renovation', 'Bathroom Renovation',
  'Basement Finishing', 'Deck/Patio', 'Fence/Gate', 'Landscaping',
  'Windows/Doors', 'Siding', 'Gutters', 'Tile Work', 'Concrete',
  'Demolition', 'Insulation', 'Waterproofing', 'General Handyman'
];

// GTA locations
const LOCATIONS = [
  'Toronto', 'Mississauga', 'Brampton', 'Markham', 'Vaughan',
  'Richmond Hill', 'Oakville', 'Burlington', 'Oshawa', 'Whitby',
  'Ajax', 'Pickering', 'Newmarket', 'Aurora', 'Clarington',
  'Milton', 'Halton Hills', 'Georgina'
];

// Realistic job templates by category
const JOB_TEMPLATES: Record<string, Array<{title: string, description: string, budgetRange: [number, number]}>> = {
  'Painting': [
    {
      title: 'Interior Painting - 3 Bedrooms & Hallway',
      description: 'Looking to repaint 3 bedrooms and hallway. Walls are in good condition, just need fresh coat. Colors already chosen. Includes ceiling and trim. House is occupied so need clean, professional work.',
      budgetRange: [1500, 2500]
    },
    {
      title: 'Exterior House Painting',
      description: '2-story home exterior painting needed. Includes scraping old paint, priming, and 2 coats. Siding is wood, in decent shape but needs refresh. Looking for quality work that will last.',
      budgetRange: [4000, 7000]
    },
    {
      title: 'Kitchen Cabinet Painting',
      description: 'Want to update kitchen without full reno. Need cabinets professionally painted white. 20 doors + drawer fronts. Current finish is dark wood. Looking for smooth, durable finish.',
      budgetRange: [2000, 3500]
    }
  ],
  'Plumbing': [
    {
      title: 'Bathroom Plumbing Rough-In',
      description: 'Basement bathroom rough-in needed. New location, no existing plumbing. Need toilet, sink, and shower drain/supply lines. Concrete floor will need breaking. Have permits.',
      budgetRange: [2500, 4000]
    },
    {
      title: 'Kitchen Sink & Dishwasher Installation',
      description: 'New kitchen sink and dishwasher installation. Replacing old sink, adding dishwasher for first time. Need proper drain and supply lines run. Existing plumbing is copper.',
      budgetRange: [800, 1500]
    },
    {
      title: 'Water Heater Replacement',
      description: 'Gas water heater needs replacement (40 gallon). Current one is 15 years old and leaking. Need removal of old unit, installation of new, proper venting. Licensed plumber required.',
      budgetRange: [1800, 2800]
    }
  ],
  'Electrical': [
    {
      title: 'Electrical Panel Upgrade to 200A',
      description: '100A panel upgrade to 200A. House built in 1970, original panel. Need ESA permit and inspection. Adding EV charger circuit. Licensed electrician only.',
      budgetRange: [3000, 5000]
    },
    {
      title: 'Basement Electrical for Renovation',
      description: 'Finishing 800 sq ft basement. Need full electrical: 12 pot lights, 8 outlets, 3 switches, 1 subpanel. Separate circuits for bathroom and kitchenette. ESA inspection included.',
      budgetRange: [3500, 5500]
    },
    {
      title: 'Outdoor Electrical - Pool & Shed',
      description: 'Need dedicated 240V circuit for pool equipment and 120V circuit to shed (50ft away). Includes trenching, conduit, GFCI protection. Pool equipment panel needs weatherproof installation.',
      budgetRange: [2200, 3500]
    }
  ],
  'Flooring': [
    {
      title: 'Hardwood Floor Installation - Main Floor',
      description: '1,200 sq ft main floor hardwood installation. 3.25" oak, site-finished. Remove existing carpet and underpad. Subfloor in good condition. Looking for quality craftsmanship.',
      budgetRange: [8000, 12000]
    },
    {
      title: 'Luxury Vinyl Plank - Basement',
      description: 'LVP installation for 600 sq ft finished basement. Concrete subfloor, moisture barrier needed. Mid-range LVP already purchased. Need professional install with transitions.',
      budgetRange: [2400, 3600]
    },
    {
      title: 'Tile Floor - Bathroom & Laundry',
      description: '2 bathrooms and laundry room floor tiling. Total 180 sq ft. 12x24 porcelain tile. Need old vinyl removed, subfloor prep, waterproof membrane, and professional tile work.',
      budgetRange: [3200, 5000]
    }
  ],
  'Roofing': [
    {
      title: 'Full Roof Replacement - Asphalt Shingles',
      description: '2,000 sq ft roof replacement. Remove old shingles (2 layers), new underlayment, architectural shingles (25-year warranty). Includes new flashing, vents, and cleanup. Permit required.',
      budgetRange: [9000, 14000]
    },
    {
      title: 'Roof Repair - Ice Dam Damage',
      description: 'Winter ice dam caused damage to 200 sq ft section. Need damaged shingles replaced, check underlayment, ensure proper ventilation. May need new soffit vents installed.',
      budgetRange: [1500, 2500]
    },
    {
      title: 'Flat Roof - Garage',
      description: 'Detached garage flat roof needs replacement. 600 sq ft, currently tar & gravel. Want to upgrade to rubber membrane (EPDM). Includes new wood if needed and proper drainage.',
      budgetRange: [4000, 6500]
    }
  ],
  'HVAC': [
    {
      title: 'Central AC Installation',
      description: 'Installing central air for first time. House has forced air furnace. Need 2.5 ton AC unit, condenser pad, line set, and ductwork modifications. TSSA licensed contractor.',
      budgetRange: [4500, 6500]
    },
    {
      title: 'Furnace & AC Replacement',
      description: 'Both furnace and AC are 18 years old. Want high-efficiency models (96% furnace, 16 SEER AC). Remove old units, install new, proper sizing. Includes warranty and rebate application.',
      budgetRange: [8000, 12000]
    },
    {
      title: 'Ductwork for Basement Renovation',
      description: 'Adding HVAC to finished basement (3 rooms). Need new ducts, registers, cold air returns. Proper sizing and balancing. Work with existing forced air system.',
      budgetRange: [2800, 4200]
    }
  ],
  'Kitchen Renovation': [
    {
      title: 'Full Kitchen Renovation - 10x12',
      description: 'Complete kitchen gut and rebuild. New cabinets, countertops, backsplash, flooring, lighting. Keep existing layout for plumbing. Mid-range finishes. Need coordinated project management.',
      budgetRange: [25000, 40000]
    },
    {
      title: 'Kitchen Cabinet Refacing & Countertop',
      description: 'Cabinet boxes in good shape, want new doors/drawers and hardware. Replace laminate counters with quartz. Update backsplash with subway tile. Keep existing appliances.',
      budgetRange: [12000, 18000]
    }
  ],
  'Bathroom Renovation': [
    {
      title: 'Ensuite Bathroom Renovation',
      description: 'Full ensuite reno (8x10). New tile floor and shower walls, vanity, toilet, fixtures. Relocating shower. Includes plumbing, electrical, waterproofing. Want frameless shower door.',
      budgetRange: [18000, 28000]
    },
    {
      title: 'Basement Bathroom Addition',
      description: 'Adding 3-piece bathroom in basement. Concrete floor breaking, rough plumbing, electrical, framing, drywall, tile, fixtures. Standard builder-grade finishes. Need permits.',
      budgetRange: [15000, 22000]
    }
  ],
  'Basement Finishing': [
    {
      title: 'Basement Finishing - 900 Sq Ft',
      description: 'Finish entire basement: framing, insulation, drywall, electrical, flooring. 2 bedrooms, rec room, 3-pc bathroom. Includes egress window. Permit and inspection required.',
      budgetRange: [45000, 65000]
    },
    {
      title: 'Basement Rec Room Only',
      description: 'Finish 500 sq ft rec room only. Open concept, pot lights, LVP flooring. Bathroom and bedrooms already done. Just need drywall, paint, electrical, flooring in main area.',
      budgetRange: [18000, 25000]
    }
  ],
  'Deck/Patio': [
    {
      title: 'Composite Deck Build - 12x16',
      description: 'Build new composite deck off back of house. 12x16 size, 2 feet off ground. Trex or similar composite. Includes railings, stairs, permit. Want modern cable railing system.',
      budgetRange: [12000, 18000]
    },
    {
      title: 'Deck Repair & Restaining',
      description: 'Existing pressure-treated deck needs repairs. Replace ~20% of boards, tighten railings, sand, and restain entire deck (400 sq ft). Want to extend life by 5+ years.',
      budgetRange: [2500, 4000]
    }
  ],
  'General Handyman': [
    {
      title: 'Drywall Repair - Multiple Holes',
      description: 'Need 5 drywall holes patched (various sizes from doorknob to 12 inches). Smooth finish, prime and paint to match. Textured ceiling in one room.',
      budgetRange: [400, 800]
    },
    {
      title: 'Door & Trim Installation',
      description: 'Install 3 new interior doors with trim. Doors already purchased (pre-hung). Need professional install with proper shimming, caulking, painting.',
      budgetRange: [600, 1200]
    }
  ]
};

async function createRealisticJobs() {
  console.log('🏗️  Starting to create realistic jobs for all categories...\n');

  // Get a homeowner user (or create test homeowner)
  let homeowner = await prisma.user.findFirst({
    where: { role: 'homeowner' }
  });

  if (!homeowner) {
    console.log('Creating test homeowner...');
    homeowner = await prisma.user.create({
      data: {
        id: 'test-homeowner-' + Date.now(),
        email: 'homeowner@test.com',
        name: 'John Smith',
        role: 'homeowner',
        city: 'Toronto',
        isActive: true
      }
    });
  }

  let totalCreated = 0;

  for (const category of CATEGORIES) {
    const templates = JOB_TEMPLATES[category] || [
      {
        title: `${category} Project`,
        description: `Looking for professional ${category.toLowerCase()} services. Need experienced contractor with references. Project details to be discussed.`,
        budgetRange: [1000, 5000] as [number, number]
      }
    ];

    // Create 2-3 jobs per category
    const jobsToCreate = Math.min(templates.length, 3);

    for (let i = 0; i < jobsToCreate; i++) {
      const template = templates[i];
      const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      const budget = Math.floor(
        Math.random() * (template.budgetRange[1] - template.budgetRange[0]) + template.budgetRange[0]
      );

      const job = await prisma.job.create({
        data: {
          title: template.title,
          description: template.description,
          category: category,
          budget: `$${budget.toLocaleString()} - $${(budget * 1.2).toLocaleString()}`,
          location: location,
          status: 'open',
          homeownerId: homeowner.id,
          maxContractors: 3, // Only 3 contractors can accept
          acceptedCount: 0,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          requirements: [
            'Licensed and insured',
            'References available',
            'Detailed quote required',
            'Timeline estimate needed'
          ].join('\n'),
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Created within last week
        }
      });

      totalCreated++;
      console.log(`✅ Created: ${job.title} (${category}) - ${location}`);
    }
  }

  console.log(`\n🎉 Successfully created ${totalCreated} realistic jobs across ${CATEGORIES.length} categories!`);
  console.log('\n📋 Job Distribution:');
  
  const jobsByCategory = await prisma.job.groupBy({
    by: ['category'],
    _count: true,
    where: { status: 'open' }
  });

  jobsByCategory.forEach(group => {
    console.log(`   ${group.category}: ${group._count} jobs`);
  });
}

createRealisticJobs()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
