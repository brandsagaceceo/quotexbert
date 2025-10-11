const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Realistic job templates for each category
const JOB_TEMPLATES = {
  // Appliances
  "appliance-installation": [
    { title: "Install New Washer & Dryer", description: "Need help installing a new Samsung washer and dryer set in laundry room. Hookups are ready, just need professional installation and testing.", budget: "300-500", zipCode: "98101" },
    { title: "Dishwasher Installation", description: "Installing a new Bosch dishwasher in kitchen. Old one removed, need plumbing and electrical connections.", budget: "200-400", zipCode: "98102" }
  ],
  "appliance-repair": [
    { title: "Refrigerator Not Cooling", description: "Kitchen refrigerator stopped cooling properly. Ice maker also not working. Need diagnostic and repair.", budget: "150-300", zipCode: "98103" },
    { title: "Oven Temperature Issues", description: "Gas oven not heating to correct temperature. Takes very long to preheat. Need repair or parts replacement.", budget: "100-250", zipCode: "98104" }
  ],
  "dishwasher-installation": [
    { title: "Replace Old Dishwasher", description: "Replacing 15-year-old dishwasher with new KitchenAid model. Need removal of old unit and installation of new one.", budget: "250-400", zipCode: "98105" }
  ],
  "bbq-cleaning-repair": [
    { title: "BBQ Deep Clean & Tune-Up", description: "Outdoor gas BBQ needs thorough cleaning and burner inspection. Used heavily this summer and needs maintenance.", budget: "150-250", zipCode: "98106" },
    { title: "Gas BBQ Won't Light", description: "Having trouble getting BBQ to light. Suspect ignition system or gas line issue. Need professional repair.", budget: "100-200", zipCode: "98107" }
  ],
  "gas-fireplace-tuneup": [
    { title: "Annual Gas Fireplace Service", description: "Need annual maintenance on living room gas fireplace before winter. Clean, inspect, and test all components.", budget: "200-350", zipCode: "98108" }
  ],

  // Cleaning & Maintenance
  "carpet-upholstery-cleaning": [
    { title: "Deep Clean Living Room Carpets", description: "Three bedrooms and living room carpets need deep cleaning. High traffic areas with pet stains.", budget: "200-400", zipCode: "98109" },
    { title: "Upholstery Cleaning - Sectional Sofa", description: "Large sectional sofa needs professional cleaning. Light colored fabric with some stains from kids.", budget: "150-300", zipCode: "98110" }
  ],
  "duct-cleaning": [
    { title: "Whole House Duct Cleaning", description: "2-story home, haven't had ducts cleaned in 5 years. Noticing more dust and allergies recently.", budget: "300-500", zipCode: "98111" }
  ],
  "window-eaves-gutter-cleaning": [
    { title: "Fall Gutter & Window Cleaning", description: "2-story house needs gutter cleaning and exterior window washing before winter. About 25 windows total.", budget: "250-400", zipCode: "98112" },
    { title: "Spring Window Cleaning Service", description: "Inside and outside window cleaning for ranch-style home. 18 windows including sliding patio doors.", budget: "150-250", zipCode: "98113" }
  ],

  // Construction & Renovation
  "bathroom-renovation": [
    { title: "Master Bathroom Renovation", description: "Complete master bath remodel. New tile, vanity, toilet, shower. About 80 sq ft space.", budget: "15000-25000", zipCode: "98114" },
    { title: "Guest Bathroom Update", description: "Updating guest bathroom - new flooring, vanity, and fixtures. Keep existing shower/tub.", budget: "8000-12000", zipCode: "98115" }
  ],
  "kitchen-renovation": [
    { title: "Full Kitchen Remodel", description: "Complete kitchen renovation - new cabinets, countertops, appliances, flooring. 200 sq ft galley kitchen.", budget: "25000-40000", zipCode: "98116" },
    { title: "Kitchen Cabinet Refacing", description: "Update existing kitchen with new cabinet doors, hardware, and countertops. Keep current layout.", budget: "8000-15000", zipCode: "98117" }
  ],
  "painting-interior-exterior": [
    { title: "Interior House Painting", description: "Paint 3 bedrooms, 2 bathrooms, living room, and hallways. Mostly neutral colors. About 1800 sq ft.", budget: "2500-4000", zipCode: "98118" },
    { title: "Exterior House Painting", description: "2-story colonial home exterior painting. Siding and trim work. Some prep work needed.", budget: "4000-7000", zipCode: "98119" },
    { title: "Accent Wall & Touch-ups", description: "Create accent wall in master bedroom and touch up paint throughout house. Small project.", budget: "500-800", zipCode: "98120" }
  ],
  "flooring-installation-repair": [
    { title: "Hardwood Floor Installation", description: "Install hardwood flooring in living room and dining room. About 400 sq ft total area.", budget: "3000-5000", zipCode: "98121" },
    { title: "Tile Floor Repair", description: "Several cracked tiles in kitchen need replacement. Matching tiles available.", budget: "300-600", zipCode: "98122" }
  ],

  // Electrical & Smart Home
  "electrical-general": [
    { title: "Add New Electrical Outlets", description: "Need 4 new outlets installed in basement workshop area. Currently no power down there.", budget: "400-800", zipCode: "98123" },
    { title: "Panel Upgrade", description: "Old electrical panel needs upgrading to handle new appliances and increased power needs.", budget: "1500-2500", zipCode: "98124" },
    { title: "Kitchen GFCI Outlets", description: "Update kitchen outlets to GFCI for safety compliance. 3 outlets near sink and counters.", budget: "300-500", zipCode: "98125" }
  ],
  "lighting-installations": [
    { title: "Recessed Lighting Installation", description: "Install 6 recessed lights in living room. Existing light fixture to be removed.", budget: "600-1000", zipCode: "98126" },
    { title: "Chandelier Installation", description: "Install new dining room chandelier. Need electrical box reinforcement for heavy fixture.", budget: "200-400", zipCode: "98127" }
  ],
  "smart-home-installation": [
    { title: "Smart Home Setup", description: "Install smart doorbell, thermostat, and light switches throughout house. About 10 switches total.", budget: "800-1200", zipCode: "98128" },
    { title: "Home Security System", description: "Install wireless security system with cameras and motion sensors. 4 cameras and door sensors.", budget: "1000-1800", zipCode: "98129" }
  ],
  "tv-mounting": [
    { title: "Mount 65\" TV Above Fireplace", description: "Mount large TV above stone fireplace in living room. Need cord concealment and soundbar mounting.", budget: "200-350", zipCode: "98130" },
    { title: "Bedroom TV Wall Mount", description: "Mount 42\" TV on bedroom wall with articulating arm. Hide cables in wall.", budget: "150-250", zipCode: "98131" }
  ],

  // HVAC
  "heating-cooling-hvac": [
    { title: "Replace Furnace & AC Unit", description: "20-year-old system needs replacement. Looking for energy efficient option for 1800 sq ft home.", budget: "5000-8000", zipCode: "98132" },
    { title: "Ductwork Repair", description: "Several ducts in crawl space are disconnected. Poor airflow to back bedrooms.", budget: "500-1000", zipCode: "98133" }
  ],
  "insulation": [
    { title: "Attic Insulation Upgrade", description: "Add blown-in insulation to attic. Current insulation is old and insufficient. 1200 sq ft attic.", budget: "800-1500", zipCode: "98134" }
  ],

  // Exterior & Landscaping  
  "landscaping-garden-design": [
    { title: "Front Yard Landscaping", description: "Design and install new front yard landscaping. Remove old shrubs and create modern design with native plants.", budget: "3000-5000", zipCode: "98135" },
    { title: "Backyard Garden Design", description: "Create vegetable garden and flower beds in backyard. Need soil preparation and plant selection.", budget: "1500-2500", zipCode: "98136" }
  ],
  "decks-fences": [
    { title: "Build Deck Addition", description: "Build 12x16 deck off back of house. Need permits and professional construction.", budget: "4000-7000", zipCode: "98137" },
    { title: "Privacy Fence Installation", description: "Install 6ft privacy fence along back property line. About 100 linear feet.", budget: "2000-3500", zipCode: "98138" },
    { title: "Deck Repair & Staining", description: "Existing deck needs board replacement and fresh stain. About 200 sq ft deck.", budget: "800-1200", zipCode: "98139" }
  ],
  "roofing": [
    { title: "Roof Replacement", description: "Replace asphalt shingle roof on 2-story house. About 2000 sq ft. Some leak damage to repair.", budget: "8000-15000", zipCode: "98140" },
    { title: "Roof Leak Repair", description: "Small leak in roof above master bedroom. Need inspection and repair before winter.", budget: "300-800", zipCode: "98141" }
  ],

  // Handyman & Small Jobs
  "handyman-services": [
    { title: "Kitchen Faucet Replacement", description: "Replace old kitchen faucet with new pull-down spray model. Under-sink shutoffs available.", budget: "150-300", zipCode: "98142" },
    { title: "Bathroom Exhaust Fan Installation", description: "Install new exhaust fan in master bathroom. Current one is very loud and ineffective.", budget: "200-400", zipCode: "98143" },
    { title: "Interior Door Installation", description: "Replace 3 interior doors that are warped. Standard size openings, trim work needed.", budget: "400-700", zipCode: "98144" },
    { title: "Garage Door Opener Repair", description: "Garage door opener stopped working. Door is heavy and hard to lift manually.", budget: "100-250", zipCode: "98145" },
    { title: "Ceiling Fan Installation", description: "Install ceiling fan in master bedroom. Existing light fixture box may need reinforcement.", budget: "150-300", zipCode: "98146" }
  ],
  "furniture-assembly": [
    { title: "IKEA Furniture Assembly", description: "Need help assembling new bedroom set from IKEA - dresser, nightstands, and bed frame.", budget: "150-250", zipCode: "98147" },
    { title: "Office Desk Assembly", description: "Large executive desk needs assembly. Multiple pieces and complex instructions.", budget: "100-200", zipCode: "98148" }
  ],
  "small-repairs-odd-jobs": [
    { title: "Fix Squeaky Stairs", description: "Several stairs squeak badly. Need to identify and fix loose boards or nails.", budget: "100-200", zipCode: "98149" },
    { title: "Caulk Bathroom Tiles", description: "Re-caulk around bathtub and shower tiles. Old caulk is cracked and needs replacement.", budget: "75-150", zipCode: "98150" },
    { title: "Replace Weather Stripping", description: "Front door weather stripping is worn out. Cold air coming in around door frame.", budget: "50-100", zipCode: "98151" }
  ],

  // Plumbing
  "plumbing": [
    { title: "Fix Kitchen Sink Leak", description: "Kitchen sink has leak under cabinet. Water damage starting to show on cabinet floor.", budget: "150-350", zipCode: "98152" },
    { title: "Install New Toilet", description: "Replace old toilet in guest bathroom. Toilet is cracked and needs replacement.", budget: "200-400", zipCode: "98153" },
    { title: "Water Heater Replacement", description: "20-year-old water heater needs replacement. Looking for tankless or high-efficiency option.", budget: "1200-2500", zipCode: "98154" },
    { title: "Shower Head & Faucet Upgrade", description: "Update shower with new rainfall shower head and modern faucet handles.", budget: "200-400", zipCode: "98155" },
    { title: "Garbage Disposal Installation", description: "Install new garbage disposal in kitchen sink. Existing plumbing but no disposal currently.", budget: "200-350", zipCode: "98156" }
  ]
};

// Cities and zip codes for variety
const LOCATIONS = [
  { city: "Seattle", zips: ["98101", "98102", "98103", "98104", "98105", "98106", "98107", "98108", "98109", "98110"] },
  { city: "Bellevue", zips: ["98004", "98005", "98006", "98007", "98008"] },
  { city: "Redmond", zips: ["98052", "98053", "98073"] },
  { city: "Kirkland", zips: ["98033", "98034"] },
  { city: "Renton", zips: ["98055", "98056", "98057", "98058"] },
  { city: "Tacoma", zips: ["98402", "98403", "98404", "98405", "98406"] },
  { city: "Spokane", zips: ["99201", "99202", "99203", "99204", "99205"] },
  { city: "Vancouver", zips: ["98660", "98661", "98662", "98663", "98664"] },
  { city: "Everett", zips: ["98201", "98203", "98204", "98208"] },
  { city: "Kent", zips: ["98030", "98031", "98032", "98042"] }
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomLocation() {
  const location = getRandomElement(LOCATIONS);
  const zipCode = getRandomElement(location.zips);
  return { city: location.city, zipCode };
}

// Add plumbing to JOB_TEMPLATES if not exists
if (!JOB_TEMPLATES["plumbing"]) {
  JOB_TEMPLATES["plumbing"] = JOB_TEMPLATES["plumbing"] || [];
}

async function createRealisticJobs() {
  try {
    console.log('Creating comprehensive job database...');

    // Get all unique categories from templates
    const categories = Object.keys(JOB_TEMPLATES);
    console.log(`Generating jobs for ${categories.length} categories`);

    let totalJobsCreated = 0;

    for (const category of categories) {
      const templates = JOB_TEMPLATES[category];
      console.log(`\nCreating jobs for category: ${category}`);
      
      for (const template of templates) {
        const location = getRandomLocation();
        
        // Create variations of each template
        const variations = [
          { ...template, zipCode: location.zipCode },
          { 
            ...template, 
            zipCode: getRandomLocation().zipCode,
            // Slight variation in budget for different locations
            budget: template.budget.includes('-') ? 
              template.budget.split('-').map(price => {
                const num = parseInt(price);
                const variation = Math.floor(num * (0.8 + Math.random() * 0.4)); // ±20% variation
                return variation.toString();
              }).join('-') : template.budget
          }
        ];

        for (const variation of variations) {
          try {
            const job = await prisma.lead.create({
              data: {
                title: variation.title,
                description: variation.description,
                budget: variation.budget,
                category: category,
                zipCode: variation.zipCode,
                status: 'open',
                maxContractors: 3,
                homeownerId: 'demo-homeowner',
                published: true
              }
            });

            console.log(`  ✅ Created: ${job.title} (${job.zipCode}) - $${job.budget}`);
            totalJobsCreated++;
          } catch (error) {
            console.log(`  ❌ Failed to create job: ${variation.title} - ${error.message}`);
          }
        }
      }
    }

    console.log(`\n🎉 Successfully created ${totalJobsCreated} jobs across ${categories.length} categories!`);
    console.log('Jobs are now available at: http://localhost:3000/contractor/jobs');

  } catch (error) {
    console.error('Error creating realistic jobs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createRealisticJobs();