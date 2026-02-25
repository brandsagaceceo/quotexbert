const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Comprehensive realistic job templates organized by category
const DETAILED_JOBS = [
  // High-Detail Kitchen Jobs
  {
    title: "Complete Kitchen Renovation - Modern Design",
    description: "Looking for a skilled contractor to completely renovate my 1980s kitchen. The space is approximately 200 sq ft and needs everything updated.\n\nWHAT NEEDS TO BE DONE:\n- Remove all existing cabinets, countertops, and appliances\n- Install new custom cabinetry (shaker style, soft-close)\n- Install quartz countertops (approx 40 sq ft)\n- New stainless steel appliances (refrigerator, stove, dishwasher, microwave)\n- Replace flooring with luxury vinyl plank\n- Update lighting with recessed LED fixtures\n- New backsplash (subway tiles)\n- Plumbing updates as needed\n\nI have a clear vision and some inspiration photos. Looking for quality work that will last. Available to start immediately.",
    category: "kitchen-renovation",
    budget: "$35,000 - $50,000",
    zipCode: "M5A 1A1"
  },
  {
    title: "Kitchen Cabinet Refacing & Countertop Replacement",
    description: "My kitchen layout is good but the cabinets and countertops are dated. Looking to refresh without a full remodel.\n\nScope: Replace cabinet doors and drawer fronts, new hardware, install granite countertops, update sink and faucet. Keep existing appliances. Timeline flexible.",
    category: "kitchen-renovation",
    budget: "$10,000 - $15,000",
    zipCode: "M4E 2B3"
  },

  // Bathroom Renovations - Detailed
  {
    title: "Master Ensuite Bathroom - Full Renovation",
    description: "Complete gut and renovation of master ensuite bathroom (approximately 90 sq ft). Current state is very dated with pink tiles from the 1970s!\n\nDETAILS:\n- Heated tile flooring (12x24 porcelain tiles)\n- Walk-in shower with frameless glass door and rainfall showerhead\n- New double vanity with quartz countertop\n- Modern fixtures (matte black preferred)\n- Proper ventilation fan installation\n- Updated lighting\n- Some plumbing may need relocation\n\nPermits: I understand permits will be needed and happy to coordinate.\nTimeline: Would like to complete before summer (3-4 months max).\n\nLooking for quality workmanship with good references. This is our forever home!",
    category: "bathroom-renovation",
    budget: "$20,000 - $30,000",
    zipCode: "M6R 1P8"
  },
  {
    title: "Powder Room Update - Small Bathroom",
    description: "Simple update needed for small powder room on main floor (approx 35 sq ft). New pedestal sink, toilet, fresh paint, new light fixture. Pretty straightforward job.",
    category: "bathroom-renovation",
    budget: "$3,000 - $5,000",
    zipCode: "M4C 1M6"
  },

  // Painting - Mixed Detail Levels
  {
    title: "Whole House Interior Painting",
    description: "Need entire interior of 3-bedroom, 2-bathroom bungalow painted. About 1,400 sq ft total. Walls and ceilings. Some minor drywall repair needed in a few spots. Neutral colors throughout. Looking for professional crew that can complete in 5-7 days.",
    category: "painting-interior-exterior",
    budget: "$4,000 - $6,500",
    zipCode: "M2N 5S7"
  },
  {
    title: "Exterior Paint - Two Story Home",
    description: "Two-story colonial home needs exterior painting. Brick on first floor (no paint), vinyl siding on second floor plus all trim, shutters, and front door. Some prep work needed. Colors already selected. House is about 2,400 sq ft.",
    category: "painting-interior-exterior",
    budget: "$5,500 - $8,000",
    zipCode: "M1P 4P5"
  },
  {
    title: "Living Room & Dining Room Paint",
    description: "Just these two rooms - open concept space. Feature wall in dark grey, other walls in light grey. Professional job with clean lines needed.",
    category: "painting-interior-exterior",
    budget: "$800 - $1,200",
    zipCode: "M3C 1B5"
  },

  // Flooring - Detailed
  {
    title: "Hardwood Floor Installation - Main Floor",
    description: "Installing solid oak hardwood throughout main floor (living room, dining room, hallway). Currently has old carpet that will need removal. Approx 600 sq ft. Subfloor is in good condition. Looking for quality installation with proper finishing.",
    category: "flooring-installation-repair",
    budget: "$6,000 - $9,000",
    zipCode: "M4K 3Z1"
  },
  {
    title: "Basement Flooring - LVP Installation",
    description: "Finishing basement, need luxury vinyl plank flooring installed. Concrete floor needs leveling in spots. About 800 sq ft total.",
    category: "flooring-installation-repair",
    budget: "$3,200 - $4,500",
    zipCode: "M5T 1R5"
  },

  // Electrical - From Simple to Complex
  {
    title: "Electrical Panel Upgrade - 200 Amp Service",
    description: "Current panel is 100 amp and outdated. Adding heat pump and EV charger, so need upgrade to 200 amp service. Licensed electrician required, permits needed. House is 1960s construction.",
    category: "electrical-general",
    budget: "$2,500 - $4,000",
    zipCode: "M4S 2C6"
  },
  {
    title: "Add GFCI Outlets in Bathrooms",
    description: "Need to update 3 bathroom outlets to GFCI for safety code compliance. Quick job.",
    category: "electrical-general",
    budget: "$300 - $500",
    zipCode: "M6G 1E2"
  },
  {
    title: "Recessed Lighting Installation - Living Room",
    description: "Want to add 8 recessed LED lights in living room ceiling. Room is 18x14 ft. Existing ceiling light to be removed.",
    category: "lighting-installations",
    budget: "$1,200 - $1,800",
    zipCode: "M4M 2E9"
  },

  // Plumbing - Varied Complexity
  {
    title: "Kitchen Sink Leak - Under Cabinet",
    description: "Slow leak under kitchen sink causing water damage to cabinet. Need repair ASAP before more damage occurs.",
    category: "plumbing",
    budget: "$150 - $350",
    zipCode: "M5R 2Y2"
  },
  {
    title: "Tankless Water Heater Installation",
    description: "Replace old 50-gallon tank water heater with tankless electric unit. Need proper electrical work and venting. House is 3 bedroom with 2.5 baths.",
    category: "plumbing",
    budget: "$3,000 - $4,500",
    zipCode: "M6S 3A1"
  },
  {
    title: "Replace Two Toilets",
    description: "Both upstairs bathrooms need new toilets. Old ones are constantly running. Looking for efficient dual-flush models.",
    category: "plumbing",
    budget: "$600 - $1,000",
    zipCode: "M4W 3H1"
  },

  // Handyman Jobs - Quick Wins
  {
    title: "Mount 65-Inch TV on Living Room Wall",
    description: "Need help mounting new TV on living room wall. Hide cables inside wall. Mount and TV are already purchased.",
    category: "tv-mounting",
    budget: "$200 - $350",
    zipCode: "M4Y 1J9"
  },
  {
    title: "Install Ceiling Fans in 3 Bedrooms",
    description: "Three bedrooms need ceiling fans installed. Existing light fixtures in place but may need reinforcement for fan weight.",
    category: "handyman-services",
    budget: "$450 - $750",
    zipCode: "M5V 3A8"
  },
  {
    title: "Garage Door Opener Not Working",
    description: "Garage door opener stopped responding. Remote batteries are new. Door is heavy, need professional repair or replacement of opener.",
    category: "handyman-services",
    budget: "$200 - $400",
    zipCode: "M6K 3P6"
  },

  // HVAC - Essential Services
  {
    title: "Furnace Maintenance & Tune-Up",
    description: "Annual furnace maintenance before winter. System is 8 years old, works well but want to keep it maintained. Need filter change, inspection, and cleaning.",
    category: "heating-cooling-hvac",
    budget: "$150 - $250",
    zipCode: "M3J 1P3"
  },
  {
    title: "Central AC Installation",
    description: "Home currently has window AC units. Want to install central air conditioning system. House is 1,800 sq ft, existing ductwork from furnace.",
    category: "heating-cooling-hvac",
    budget: "$4,500 - $7,000",
    zipCode: "M1M 3G5"
  },

  // Roofing - Critical Repairs to Full Replacement
  {
    title: "Roof Leak Repair - Master Bedroom",
    description: "Recently noticed water stain on bedroom ceiling after heavy rain. Need inspection and repair before it gets worse.",
    category: "roofing",
    budget: "$400 - $800",
    zipCode: "M2J 4P8"
  },
  {
    title: "Complete Roof Replacement - Asphalt Shingles",
    description: "20-year-old roof showing wear (missing shingles, bare spots). Need full replacement. House is 1-story ranch, approximately 1,600 sq ft roof area. Looking for 30-year architectural shingles. Can provide attic access for inspection.",
    category: "roofing",
    budget: "$8,000 - $12,000",
    zipCode: "M9B 6K1"
  },

  // Landscaping - From Small to Large Projects
  {
    title: "Spring Lawn Care & Garden Cleanup",
    description: "Need help with spring cleanup - remove leaves and debris, edge gardens, mulch flower beds, overseed lawn. Standard residential lot.",
    category: "landscaping-garden-design",
    budget: "$300 - $600",
    zipCode: "M5M 2L4"
  },
  {
    title: "Complete Backyard Landscaping Transformation",
    description: "Looking to transform plain grass backyard into beautiful outdoor living space. Vision includes:\n- Stone patio (approx 300 sq ft)\n- Garden beds with perennials and shrubs\n- Small water feature\n- Ambient lighting\n- Sod for remaining lawn area\n\nBackyard is about 40x30 ft. Have rough sketch of design. Open to professional suggestions. This is a multi-phase project.",
    category: "landscaping-garden-design",
    budget: "$15,000 - $25,000",
    zipCode: "M4P 1H4"
  },

  // Deck & Fence Work
  {
    title: "Build New Composite Deck - 16x12 ft",
    description: "Want to build composite deck off back of house. Needs to be elevated about 2 ft with stairs. Prefer low-maintenance composite material (Trex or similar). Need building permit obtained.",
    category: "decks-fences",
    budget: "$8,000 - $12,000",
    zipCode: "M4G 3B6"
  },
  {
    title: "Privacy Fence Replacement",
    description: "Old wood fence falling apart. Need 75 linear feet of new 6-ft privacy fence along back property line. Cedar preferred.",
    category: "decks-fences",
    budget: "$3,000 - $4,500",
    zipCode: "M6E 2M7"
  },
  {
    title: "Deck Repair & Staining",
    description: "Existing 10-year-old deck needs some board replacement and fresh stain. About 200 sq ft deck, several boards are rotting.",
    category: "decks-fences",
    budget: "$800 - $1,200",
    zipCode: "M1C 4X9"
  },

  // Basement Renovations
  {
    title: "Finish Basement - Recreation Room",
    description: "Unfinished basement to be converted to rec room with home theater area. About 600 sq ft. Needs:\n- Framing and drywall\n- Flooring (LVP)\n- Electrical (outlets, pot lights)\n- Basic bathroom rough-in for future\n- Paint\n\nCeiling height is 7.5 ft. Already has proper egress window.",
    category: "renovation",
    budget: "$18,000 - $28,000",
    zipCode: "M2K 2V7"
  },

  // Drywall Work
  {
    title: "Drywall Repair - Water Damage Ceiling",
    description: "Ceiling drywall damaged from roof leak (leak is fixed). Need about 6x4 ft section replaced, textured to match existing, and painted.",
    category: "drywall-installation-repair",
    budget: "$400 - $700",
    zipCode: "M5G 2R3"
  },

  // Windows & Doors
  {
    title: "Replace 12 Windows - Energy Efficient",
    description: "Replace all windows in 2-story home. Current windows are original (30+ years old), single pane, very drafty. Looking for energy-efficient vinyl windows. Need quotes from reputable companies.",
    category: "window-door-installation",
    budget: "$8,000 - $14,000",
    zipCode: "M9A 4X7"
  },
  {
    title: "Front Door Replacement",
    description: "Replace worn front door with new insulated steel door. Need professional installation including weather stripping and hardware.",
    category: "window-door-installation",
    budget: "$1,200 - $2,000",
    zipCode: "M4N 3M5"
  },

  // Tile Work
  {
    title: "Bathroom Floor & Shower Tile",
    description: "Master bathroom tile project: floor (70 sq ft) in large format porcelain tiles, shower walls and floor in mosaic tiles. Includes waterproofing and all prep work.",
    category: "tile-installation",
    budget: "$4,500 - $7,000",
    zipCode: "M5S 1A1"
  },

  // Countertops
  {
    title: "Kitchen Quartz Countertop Installation",
    description: "Need quartz countertops installed in kitchen. L-shaped layout, approximately 45 sq ft. Undermount sink cutout needed. Existing counters will be removed by contractor.",
    category: "countertops-installation",
    budget: "$3,500 - $5,500",
    zipCode: "M6H 3S3"
  },

  // Smart Home
  {
    title: "Whole Home Smart System Installation",
    description: "Install comprehensive smart home system: video doorbell, smart thermostat (2 zones), smart switches (15 locations), smart door locks (2), security cameras (4). Need professional wiring and setup.",
    category: "smart-home-installation",
    budget: "$2,500 - $4,000",
    zipCode: "M4B 3M9"
  },

  // Insulation
  {
    title: "Attic Insulation Upgrade - Blown-In",
    description: "Attic currently has very little insulation (R-12). Want to upgrade to R-50 with blown-in cellulose. Attic is approximately 1,100 sq ft. Need proper ventilation ensured.",
    category: "insulation",
    budget: "$1,500 - $2,500",
    zipCode: "M1L 4N3"
  },

  // Appliance Work
  {
    title: "Install Built-In Dishwasher",
    description: "Kitchen reno included cabinet space for dishwasher but need installation. Plumbing and electrical rough-in is done, just need appliance connected and tested.",
    category: "dishwasher-installation",
    budget: "$250 - $400",
    zipCode: "M5H 2N2"
  },

  // Cleaning Services
  {
    title: "Whole House Deep Clean After Renovation",
    description: "Just finished major renovation, need thorough deep clean. Construction dust everywhere. 3 bedroom house, all floors and surfaces need cleaning.",
    category: "deep-cleaning",
    budget: "$400 - $700",
    zipCode: "M3H 5R8"
  },
  {
    title: "Duct Cleaning - 2 Story Home",
    description: "Haven't had ducts cleaned in 8 years. Family has allergies. Looking for thorough cleaning of all supply and return ducts.",
    category: "duct-cleaning",
    budget: "$350 - $550",
    zipCode: "M2M 4B9"
  },

  // Carpentry
  {
    title: "Custom Built-In Shelving - Living Room",
    description: "Want custom built-in shelving on either side of fireplace. Floor to ceiling, painted white to match trim. Each side is 36 inches wide, 10 ft tall.",
    category: "cabinets-millwork",
    budget: "$2,500 - $4,000",
    zipCode: "M4T 1M2"
  },

  // Simple Quick Jobs
  {
    title: "Replace Bathroom Exhaust Fan",
    description: "Master bathroom exhaust fan is very loud and not pulling air well. Need replacement with quiet model.",
    category: "handyman-services",
    budget: "$200 - $350",
    zipCode: "M1T 3K9"
  },
  {
    title: "Fix Squeaky Hardwood Floors",
    description: "Several spots in hallway and bedroom have very squeaky floors. Need professional repair.",
    category: "handyman-services",
    budget: "$200 - $400",
    zipCode: "M5P 2N7"
  },
  {
    title: "Closet Organizer Installation",
    description: "Have pre-purchased closet organizer system from Home Depot. Need professional installation in master bedroom walk-in closet.",
    category: "handyman-services",
    budget: "$300 - $500",
    zipCode: "M1S 4P5"
  },

  // Concrete & Masonry
  {
    title: "Driveway Repair - Crack Sealing",
    description: "Concrete driveway has several large cracks forming. Need professional repair and sealing before winter to prevent further damage.",
    category: "concrete-work",
    budget: "$500 - $900",
    zipCode: "M2L 2T9"
  },

  // Siding
  {
    title: "Vinyl Siding Replacement - One Wall",
    description: "North facing wall siding is damaged (storm damage). Need to replace siding on one wall, about 300 sq ft. Match existing siding color (beige).",
    category: "siding-installation",
    budget: "$2,000 - $3,500",
    zipCode: "M1G 1M8"
  },

  // Lighting
  {
    title: "Chandelier Installation - Two Story Foyer",
    description: "Purchased large chandelier for two-story foyer. Need professional installation with proper electrical box reinforcement. Ceiling is about 18 ft high.",
    category: "lighting-installations",
    budget: "$400 - $700",
    zipCode: "M4V 2W4"
  },

  // Gutter Work
  {
    title: "Gutter Cleaning & Minor Repairs",
    description: "2-story home, gutters full of debris. Need cleaning and a few sections reattached. About 120 linear feet total.",
    category: "window-eaves-gutter-cleaning",
    budget: "$250 - $400",
    zipCode: "M6N 1A1"
  },
  {
    title: "New Gutter Installation - Seamless Aluminum",
    description: "Need new seamless aluminum gutters installed on entire house. Approx 140 linear feet. Include downspouts and splash blocks.",
    category: "eavestrough-installation",
    budget: "$1,800 - $2,800",
    zipCode: "M3A 1A3"
  }
];

async function seedJobBoard() {
  try {
    console.log('🌱 Starting Job Board Seed...\n');

    // 1. Check for or create demo homeowner
    let demoHomeowner = await prisma.user.findFirst({
      where: {
        email: 'demo-homeowner@quotexbert.com'
      }
    });

    if (!demoHomeowner) {
      console.log('Creating demo homeowner user...');
      demoHomeowner = await prisma.user.create({
        data: {
          email: 'demo-homeowner@quotexbert.com',
          name: 'Demo Homeowner',
          role: 'homeowner',
          clerkUserId: 'demo_homeowner_' + Date.now()
        }
      });
      console.log('✅ Demo homeowner created\n');
    } else {
      console.log('✅ Demo homeowner already exists\n');
    }

    // 2. Clear existing jobs from demo homeowner (optional - comment out to keep existing)
    // await prisma.lead.deleteMany({
    //   where: { homeownerId: demoHomeowner.id }
    // });
    // console.log('Cleared existing demo jobs\n');

    // 3. Create all jobs
    console.log(`📝 Creating ${DETAILED_JOBS.length} realistic job listings...\n`);
    
    let successCount = 0;
    let failCount = 0;

    for (const jobTemplate of DETAILED_JOBS) {
      try {
        const job = await prisma.lead.create({
          data: {
            title: jobTemplate.title,
            description: jobTemplate.description,
            category: jobTemplate.category,
            budget: jobTemplate.budget,
            zipCode: jobTemplate.zipCode,
            homeownerId: demoHomeowner.id,
            status: 'open',
            published: true,
            maxContractors: 3,
            photos: '[]' // No photos for seed data
          }
        });

        console.log(`  ✅ ${job.title}`);
        console.log(`     Category: ${job.category} | Budget: ${job.budget} | Zip: ${job.zipCode}`);
        successCount++;
      } catch (error) {
        console.error(`  ❌ Failed: ${jobTemplate.title}`);
        console.error(`     Error: ${error.message}`);
        failCount++;
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 SEED SUMMARY:`);
    console.log(`   ✅ Successfully created: ${successCount} jobs`);
    if (failCount > 0) {
      console.log(`   ❌ Failed: ${failCount} jobs`);
    }
    console.log(`   👤 Homeowner: ${demoHomeowner.email} (${demoHomeowner.id})`);
    console.log(`${'='.repeat(60)}\n`);
    
    console.log(`🎉 Job board seeded successfully!`);
    console.log(`   View jobs at: http://localhost:3000/contractor/jobs\n`);

  } catch (error) {
    console.error('❌ Error seeding job board:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
seedJobBoard()
  .then(() => {
    console.log('✅ Seed completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
