const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const jobCategories = [
  "Plumbing", "Electrical", "HVAC", "Roofing", "Flooring", 
  "Painting", "Kitchen Renovation", "Bathroom Renovation",
  "Landscaping", "Fencing", "Deck Construction", "Concrete",
  "Drywall", "Insulation", "Window Installation", "Door Installation",
  "Tile Work", "Hardwood Flooring", "Carpet Installation", "Basement Finishing"
];

const torontoNeighborhoods = [
  { name: "Downtown Toronto", postal: "M5V 3A8" },
  { name: "North York", postal: "M2N 6K1" },
  { name: "Scarborough", postal: "M1P 4P5" },
  { name: "Etobicoke", postal: "M9W 4X9" },
  { name: "East York", postal: "M4C 3E7" },
  { name: "York", postal: "M6E 1Z5" },
  { name: "The Beaches", postal: "M4E 2Y5" },
  { name: "Rosedale", postal: "M4W 1Z3" },
  { name: "High Park", postal: "M6R 1P4" },
  { name: "Leslieville", postal: "M4M 1J2" },
  { name: "Liberty Village", postal: "M6K 3P6" },
  { name: "Bloor West Village", postal: "M6S 1N5" },
  { name: "The Annex", postal: "M5R 1X8" },
  { name: "Cabbagetown", postal: "M5A 3C4" },
  { name: "Forest Hill", postal: "M5P 2M8" }
];

const realisticJobs = [
  // Plumbing Jobs
  {
    category: "Plumbing",
    title: "Emergency Kitchen Sink Leak Repair",
    description: "My kitchen sink developed a major leak under the cabinet. Water is pooling and I need someone to come fix this ASAP before it causes more damage. The pipe seems to be corroded. I'm available all day today and tomorrow.",
    budgetMin: 300,
    budgetMax: 800,
    urgency: "urgent",
    timeline: "Within 24 hours",
    images: ["https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800", "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800"]
  },
  {
    category: "Plumbing",
    title: "Bathroom Shower Installation",
    description: "Looking to replace old bathtub with a modern walk-in shower. Bathroom is approximately 8x6 feet. Would like glass doors, rain shower head, and modern fixtures. Need proper waterproofing and drainage. Prefer someone with experience in bathroom renovations.",
    budgetMin: 5000,
    budgetMax: 9000,
    urgency: "flexible",
    timeline: "Within 1 month",
    images: ["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800"]
  },
  {
    category: "Plumbing",
    title: "Water Heater Replacement",
    description: "40-gallon gas water heater needs replacement. It's 12 years old and starting to leak. Need licensed plumber to remove old unit and install new energy-efficient model. Basement installation with existing gas line.",
    budgetMin: 1500,
    budgetMax: 3000,
    urgency: "urgent",
    timeline: "Within 1 week",
    images: ["https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=800"]
  },
  {
    category: "Plumbing",
    title: "Whole House Repiping",
    description: "1950s home with galvanized pipes that need complete replacement. Frequent leaks and low water pressure. Looking for complete repipe with PEX or copper. House is 2,200 sq ft, 2-story with 3 bathrooms.",
    budgetMin: 15000,
    budgetMax: 25000,
    urgency: "normal",
    timeline: "Within 2 months",
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800"]
  },
  {
    category: "Plumbing",
    title: "Bathroom Toilet and Sink Installation",
    description: "Renovated bathroom needs new toilet and vanity sink installed. Already purchased Kohler toilet and modern floating vanity. Need plumbing connections, proper sealing, and cleanup. Simple installation job.",
    budgetMin: 600,
    budgetMax: 1200,
    urgency: "normal",
    timeline: "Within 2 weeks",
    images: ["https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800"]
  },

  // Electrical Jobs
  {
    category: "Electrical",
    title: "Full Home Electrical Panel Upgrade",
    description: "Need to upgrade from 100amp to 200amp service panel. Current panel is outdated and can't handle modern appliances. Adding EV charger and central AC soon. Licensed electrician required with ESA permit.",
    budgetMin: 3000,
    budgetMax: 6000,
    urgency: "normal",
    timeline: "Within 1 month",
    images: ["https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800"]
  },
  {
    category: "Electrical",
    title: "Outdoor Landscape Lighting Installation",
    description: "Want to install landscape lighting around front yard and walkway. About 12-15 LED fixtures, timer system, and weatherproof connections. Looking for professional design and installation. Yard is approximately 1,500 sq ft.",
    budgetMin: 2500,
    budgetMax: 5000,
    urgency: "flexible",
    timeline: "Within 2 months",
    images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800"]
  },
  {
    category: "Electrical",
    title: "Ceiling Fan Installation - 3 Rooms",
    description: "Need ceiling fans installed in master bedroom, living room, and office. Two rooms have existing light fixtures that need to be replaced, one needs new wiring. Looking for modern, quiet fans with remote controls.",
    budgetMin: 800,
    budgetMax: 1500,
    urgency: "normal",
    timeline: "Within 3 weeks",
    images: ["https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800"]
  },
  {
    category: "Electrical",
    title: "Kitchen Pot Lights and Under-Cabinet Lighting",
    description: "Kitchen renovation needs 10 LED pot lights installed in ceiling and LED strip lighting under all upper cabinets. Modern dimmer switches required. Kitchen is 14x12 feet. Clean installation required.",
    budgetMin: 1800,
    budgetMax: 3500,
    urgency: "urgent",
    timeline: "Within 1 week",
    images: ["https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800"]
  },
  {
    category: "Electrical",
    title: "EV Charger Installation in Garage",
    description: "Just bought a Tesla and need Level 2 EV charger installed in garage. Need 240V outlet, proper wiring from panel, and wall-mounted charger installation. Garage is detached, about 30 feet from main panel.",
    budgetMin: 1200,
    budgetMax: 2500,
    urgency: "normal",
    timeline: "Within 2 weeks",
    images: ["https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800"]
  },

  // HVAC Jobs
  {
    category: "HVAC",
    title: "Central Air Conditioning Installation",
    description: "2,400 sq ft home needs new central AC system. Currently have forced air heating but no cooling. Looking for energy-efficient system (16+ SEER). Need ductwork inspection and any necessary modifications. Licensed HVAC contractor required.",
    budgetMin: 6000,
    budgetMax: 12000,
    urgency: "urgent",
    timeline: "Within 2 weeks",
    images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800"]
  },
  {
    category: "HVAC",
    title: "Furnace Replacement Before Winter",
    description: "25-year-old furnace needs replacement before winter. Looking for high-efficiency natural gas furnace (95%+ efficiency). House is 1,800 sq ft. Need proper sizing and installation with warranty.",
    budgetMin: 4500,
    budgetMax: 8000,
    urgency: "urgent",
    timeline: "Within 1 week",
    images: ["https://images.unsplash.com/photo-1581513506946-3b9bf8f69735?w=800"]
  },
  {
    category: "HVAC",
    title: "Ductwork Cleaning and Sanitization",
    description: "Haven't had ducts cleaned in 8 years. Noticing dust buildup and reduced airflow. Need complete duct cleaning, sanitization, and inspection for any leaks or damage. 3-bedroom home with basement.",
    budgetMin: 400,
    budgetMax: 800,
    urgency: "normal",
    timeline: "Within 1 month",
    images: ["https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800"]
  },
  {
    category: "HVAC",
    title: "Mini-Split Heat Pump Installation",
    description: "Adding finished space above garage and need heating/cooling solution. Looking to install ductless mini-split system. Space is approximately 400 sq ft. Need professional sizing and installation.",
    budgetMin: 3500,
    budgetMax: 6500,
    urgency: "flexible",
    timeline: "Within 2 months",
    images: ["https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=800"]
  },

  // Roofing Jobs
  {
    category: "Roofing",
    title: "Complete Roof Replacement",
    description: "Asphalt shingle roof is 22 years old and showing wear. Multiple leaks during last rain. Need complete tear-off and replacement. House is 2,000 sq ft with standard pitch. Looking for 30-year architectural shingles. Need licensed, insured contractor.",
    budgetMin: 12000,
    budgetMax: 18000,
    urgency: "urgent",
    timeline: "Within 2 weeks",
    images: ["https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800", "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800"]
  },
  {
    category: "Roofing",
    title: "Skylight Installation in Master Bedroom",
    description: "Want to add two skylights to master bedroom for natural light. Room is on second floor directly under roof. Need proper flashing, waterproofing, and drywall finishing. Looking for Velux or similar quality.",
    budgetMin: 3500,
    budgetMax: 6000,
    urgency: "flexible",
    timeline: "Within 3 months",
    images: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800"]
  },
  {
    category: "Roofing",
    title: "Emergency Roof Leak Repair",
    description: "Noticed water stain on ceiling after yesterday's storm. Need roofer to inspect and repair leak ASAP. Appears to be around chimney flashing. Can't wait long as more rain is forecasted this week.",
    budgetMin: 500,
    budgetMax: 1500,
    urgency: "urgent",
    timeline: "Within 24 hours",
    images: ["https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800"]
  },
  {
    category: "Roofing",
    title: "Flat Roof Repair and Coating",
    description: "Flat roof on garage addition needs repair and protective coating. Some ponding water and minor cracks. Approximately 600 sq ft. Looking for proper drainage solution and waterproof membrane.",
    budgetMin: 2500,
    budgetMax: 5000,
    urgency: "normal",
    timeline: "Within 1 month",
    images: ["https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800"]
  },

  // Kitchen Renovation Jobs
  {
    category: "Kitchen Renovation",
    title: "Complete Kitchen Renovation",
    description: "Full kitchen gut and renovation. 12x15 ft kitchen. Want new cabinets, quartz countertops, tile backsplash, under-cabinet lighting, new appliances, and flooring. Modern contemporary style. Need general contractor to coordinate all trades.",
    budgetMin: 35000,
    budgetMax: 55000,
    urgency: "flexible",
    timeline: "Within 4 months",
    images: ["https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800", "https://images.unsplash.com/photo-1565183928294-7d22f2d8b32a?w=800"]
  },
  {
    category: "Kitchen Renovation",
    title: "Kitchen Cabinet Refacing and Hardware",
    description: "Kitchen cabinets are structurally sound but dated. Looking to reface with modern shaker style doors, new soft-close hinges, and contemporary hardware. 18 cabinet doors and 6 drawer fronts. Paint finish preferred.",
    budgetMin: 8000,
    budgetMax: 14000,
    urgency: "normal",
    timeline: "Within 6 weeks",
    images: ["https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800"]
  },
  {
    category: "Kitchen Renovation",
    title: "Quartz Countertop Installation",
    description: "Need quartz countertops installed in kitchen. Approximately 45 sq ft with waterfall edge on island. Already selected material. Need template, fabrication, and professional installation. Includes undermount sink cutout.",
    budgetMin: 4500,
    budgetMax: 7500,
    urgency: "normal",
    timeline: "Within 1 month",
    images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800"]
  },
  {
    category: "Kitchen Renovation",
    title: "Kitchen Tile Backsplash Installation",
    description: "Need subway tile backsplash installed in kitchen. Approximately 40 sq ft area behind counters. White 3x6 subway tiles with gray grout. Clean, professional installation required. Already purchased materials.",
    budgetMin: 1200,
    budgetMax: 2500,
    urgency: "normal",
    timeline: "Within 3 weeks",
    images: ["https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800"]
  },

  // Bathroom Renovation Jobs
  {
    category: "Bathroom Renovation",
    title: "Master Bathroom Complete Renovation",
    description: "Full master bathroom renovation. 10x8 ft space. Want double vanity, walk-in shower with glass doors, new toilet, heated floors, modern fixtures. Spa-like contemporary design. Need demolition, plumbing, electrical, tile work.",
    budgetMin: 25000,
    budgetMax: 40000,
    urgency: "flexible",
    timeline: "Within 3 months",
    images: ["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800", "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800"]
  },
  {
    category: "Bathroom Renovation",
    title: "Bathroom Tile Shower Replacement",
    description: "Old fiberglass shower stall needs replacing with custom tile shower. 4x3 ft shower area. Want large format tiles, glass door, rain shower head, and built-in niche. Proper waterproofing essential.",
    budgetMin: 6000,
    budgetMax: 11000,
    urgency: "normal",
    timeline: "Within 6 weeks",
    images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800"]
  },
  {
    category: "Bathroom Renovation",
    title: "Bathroom Vanity and Mirror Installation",
    description: "Purchased new 60-inch double vanity and medicine cabinet mirror. Need professional installation including plumbing hookups, proper leveling, and wall anchoring. Bathroom already prepped.",
    budgetMin: 800,
    budgetMax: 1500,
    urgency: "normal",
    timeline: "Within 2 weeks",
    images: ["https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800"]
  },
  {
    category: "Bathroom Renovation",
    title: "Bathroom Floor Heated Tile Installation",
    description: "Want to install heated floor system in bathroom with porcelain tile. 8x6 ft bathroom. Need electric radiant heating mat, tile installation, and thermostat. Looking for quality craftsmanship.",
    budgetMin: 3500,
    budgetMax: 6000,
    urgency: "flexible",
    timeline: "Within 2 months",
    images: ["https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800"]
  },

  // Painting Jobs
  {
    category: "Painting",
    title: "Whole House Interior Painting",
    description: "Need entire house interior painted. 2,200 sq ft, 3 bedrooms, living room, dining room, kitchen, hallways, and staircase. Neutral colors (will provide color selections). Need ceiling and walls, trim touch-ups. Professional prep and cleanup required.",
    budgetMin: 6000,
    budgetMax: 10000,
    urgency: "normal",
    timeline: "Within 6 weeks",
    images: ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800"]
  },
  {
    category: "Painting",
    title: "Exterior House Painting",
    description: "2-story house exterior needs painting. Approximately 2,400 sq ft of paintable surface. Want trim in white, siding in gray blue. Need proper prep, primer, and quality exterior paint. Include soffit and fascia.",
    budgetMin: 8000,
    budgetMax: 15000,
    urgency: "urgent",
    timeline: "Within 1 month",
    images: ["https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800"]
  },
  {
    category: "Painting",
    title: "Accent Wall and Feature Painting",
    description: "Want accent wall in living room painted in deep blue. Also need geometric pattern painted in nursery. Looking for skilled painter with experience in detailed work. Two rooms total.",
    budgetMin: 800,
    budgetMax: 1800,
    urgency: "normal",
    timeline: "Within 3 weeks",
    images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800"]
  },
  {
    category: "Painting",
    title: "Kitchen Cabinet Painting",
    description: "Want kitchen cabinets professionally painted. 22 cabinet doors and 8 drawer fronts. From dark wood to white. Need proper prep, primer, spray application, and protective topcoat. Smooth factory-like finish desired.",
    budgetMin: 3500,
    budgetMax: 6500,
    urgency: "flexible",
    timeline: "Within 2 months",
    images: ["https://images.unsplash.com/photo-1565183928294-7d22f2d8b32a?w=800"]
  },

  // Flooring Jobs
  {
    category: "Flooring",
    title: "Hardwood Floor Installation - Main Floor",
    description: "Want engineered hardwood flooring installed throughout main floor. Approximately 1,200 sq ft including living room, dining room, hallway, and kitchen. Medium brown oak preferred. Need subfloor prep and professional installation.",
    budgetMin: 8000,
    budgetMax: 14000,
    urgency: "normal",
    timeline: "Within 2 months",
    images: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800"]
  },
  {
    category: "Flooring",
    title: "Luxury Vinyl Plank Basement Installation",
    description: "Finished basement needs flooring. About 800 sq ft. Want waterproof luxury vinyl plank (LVP) in wood-look style. Basement is level and dry. Need baseboards installed as well.",
    budgetMin: 4500,
    budgetMax: 7500,
    urgency: "normal",
    timeline: "Within 6 weeks",
    images: ["https://images.unsplash.com/photo-1595814432314-90095f342694?w=800"]
  },
  {
    category: "Flooring",
    title: "Hardwood Floor Refinishing",
    description: "Original hardwood floors need refinishing. Approximately 1,000 sq ft. Floors are scratched and dull. Want sanding, staining (medium tone), and polyurethane finish. Need professional with dustless equipment.",
    budgetMin: 3500,
    budgetMax: 6000,
    urgency: "flexible",
    timeline: "Within 3 months",
    images: ["https://images.unsplash.com/photo-1615873968403-89e068629265?w=800"]
  },
  {
    category: "Flooring",
    title: "Tile Flooring Kitchen and Bathroom",
    description: "Need porcelain tile installed in kitchen (200 sq ft) and two bathrooms (120 sq ft total). 12x24 inch tiles. Need proper substrate preparation, waterproofing in bathrooms, and professional installation.",
    budgetMin: 5500,
    budgetMax: 9500,
    urgency: "normal",
    timeline: "Within 2 months",
    images: ["https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800"]
  },

  // Landscaping Jobs
  {
    category: "Landscaping",
    title: "Front Yard Complete Landscaping",
    description: "Need full front yard landscaping redesign. Approximately 1,500 sq ft. Want flower beds with perennials, decorative stones, pathway lighting, and sod. Need design and installation. Remove existing overgrown shrubs.",
    budgetMin: 8000,
    budgetMax: 15000,
    urgency: "flexible",
    timeline: "Within 3 months",
    images: ["https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800", "https://images.unsplash.com/photo-1584479898061-15742e14b50f?w=800"]
  },
  {
    category: "Landscaping",
    title: "Backyard Patio and Garden Design",
    description: "Want new patio area with interlocking stones (400 sq ft) and surrounding garden beds. Looking for modern design with low-maintenance plants. Need grading, drainage, and quality installation.",
    budgetMin: 12000,
    budgetMax: 20000,
    urgency: "normal",
    timeline: "Within 2 months",
    images: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800"]
  },
  {
    category: "Landscaping",
    title: "Lawn Sod Installation",
    description: "Need new sod installed in front and back yard. Approximately 2,500 sq ft total. Current grass is patchy and full of weeds. Want proper grading, topsoil, and quality sod installation. Include initial fertilizing.",
    budgetMin: 4000,
    budgetMax: 7000,
    urgency: "urgent",
    timeline: "Within 3 weeks",
    images: ["https://images.unsplash.com/photo-1584479898061-15742e14b50f?w=800"]
  },
  {
    category: "Landscaping",
    title: "Retaining Wall Construction",
    description: "Need retaining wall built along property line. Approximately 30 feet long, 3 feet high. Backyard has slope and erosion issues. Want natural stone or concrete block. Include proper drainage and backfill.",
    budgetMin: 6000,
    budgetMax: 12000,
    urgency: "normal",
    timeline: "Within 2 months",
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"]
  },

  // Basement Finishing
  {
    category: "Basement Finishing",
    title: "Full Basement Finishing - Recreation Room",
    description: "Unfinished basement needs complete renovation. 1,000 sq ft. Want rec room, bedroom, bathroom, and storage. Need framing, electrical, plumbing, insulation, drywall, flooring. Licensed contractor with basement experience required.",
    budgetMin: 40000,
    budgetMax: 65000,
    urgency: "flexible",
    timeline: "Within 4 months",
    images: ["https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800"]
  },
  {
    category: "Basement Finishing",
    title: "Basement Waterproofing and Moisture Control",
    description: "Basement has moisture issues. Need interior waterproofing, vapor barrier, and sump pump installation. 1,200 sq ft basement. Want to ensure dry space before finishing. Need licensed waterproofing specialist.",
    budgetMin: 8000,
    budgetMax: 15000,
    urgency: "urgent",
    timeline: "Within 1 month",
    images: ["https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=800"]
  },
  {
    category: "Basement Finishing",
    title: "Basement Egress Window Installation",
    description: "Need code-compliant egress window installed for basement bedroom. Includes window well, concrete cutting, window installation, and interior/exterior finishing. Need permit and inspection.",
    budgetMin: 4500,
    budgetMax: 8000,
    urgency: "normal",
    timeline: "Within 6 weeks",
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"]
  },

  // Deck Construction
  {
    category: "Deck Construction",
    title: "Composite Deck Construction",
    description: "Want new composite deck built in backyard. Approximately 350 sq ft, single level with stairs. Prefer Trex or similar composite material. Need pressure-treated frame, proper footings, and railing. Include building permit.",
    budgetMin: 15000,
    budgetMax: 25000,
    urgency: "normal",
    timeline: "Within 2 months",
    images: ["https://images.unsplash.com/photo-1598128558393-70ff21433be0?w=800", "https://images.unsplash.com/photo-1519643381401-22c77e60520e?w=800"]
  },
  {
    category: "Deck Construction",
    title: "Deck Staining and Refinishing",
    description: "Existing pressure-treated deck needs cleaning, sanding, and staining. Approximately 400 sq ft. Want semi-transparent stain in cedar tone. Include cleaning, repairs to any loose boards, and 2 coats of stain.",
    budgetMin: 2000,
    budgetMax: 4000,
    urgency: "urgent",
    timeline: "Within 3 weeks",
    images: ["https://images.unsplash.com/photo-1598128558393-70ff21433be0?w=800"]
  },
  {
    category: "Deck Construction",
    title: "Deck Repair and Safety Upgrade",
    description: "15-year-old deck needs safety inspection and repairs. Some boards are loose, railing is wobbly. Approximately 300 sq ft. Need assessment and repair of any structural issues. Must meet current code requirements.",
    budgetMin: 2500,
    budgetMax: 5500,
    urgency: "urgent",
    timeline: "Within 2 weeks",
    images: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800"]
  },

  // Concrete Work
  {
    category: "Concrete",
    title: "Driveway Replacement",
    description: "Old cracked concrete driveway needs complete replacement. Approximately 600 sq ft. Want removal of old concrete, proper base preparation, and new 4-inch concrete pour. Standard brush finish. Two-car driveway.",
    budgetMin: 6000,
    budgetMax: 10000,
    urgency: "normal",
    timeline: "Within 6 weeks",
    images: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800"]
  },
  {
    category: "Concrete",
    title: "Concrete Patio and Steps",
    description: "Need concrete patio poured off back door. 12x14 ft patio with 3 steps. Want stamped concrete finish to look like stone. Include proper grading and drainage away from house.",
    budgetMin: 5000,
    budgetMax: 9000,
    urgency: "flexible",
    timeline: "Within 3 months",
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"]
  },
  {
    category: "Concrete",
    title: "Concrete Walkway Installation",
    description: "Need concrete walkway from driveway to front door. Approximately 50 feet long, 4 feet wide. Want decorative exposed aggregate finish. Include excavation and proper base.",
    budgetMin: 3500,
    budgetMax: 6500,
    urgency: "normal",
    timeline: "Within 2 months",
    images: ["https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800"]
  },

  // Fencing
  {
    category: "Fencing",
    title: "Privacy Fence Installation",
    description: "Need 6-foot privacy fence installed along back and side property lines. Approximately 120 linear feet. Want cedar or pressure-treated wood. Include gates on both sides. Posts set in concrete.",
    budgetMin: 8000,
    budgetMax: 14000,
    urgency: "normal",
    timeline: "Within 2 months",
    images: ["https://images.unsplash.com/photo-1598128558393-70ff21433be0?w=800"]
  },
  {
    category: "Fencing",
    title: "Fence Repair and Reinforcement",
    description: "Existing fence has several damaged sections. About 40 feet needs new posts and panels. Some gates are sagging and need adjustment. Want to match existing fence style.",
    budgetMin: 2000,
    budgetMax: 4000,
    urgency: "normal",
    timeline: "Within 1 month",
    images: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800"]
  },
  {
    category: "Fencing",
    title: "Vinyl Fence Installation",
    description: "Want low-maintenance vinyl fence installed around front yard. Approximately 80 linear feet, 4 feet high. White picket style. Include one gate. Professional installation required.",
    budgetMin: 5500,
    budgetMax: 9500,
    urgency: "flexible",
    timeline: "Within 3 months",
    images: ["https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800"]
  }
];

async function seedRealisticJobs() {
  try {
    console.log("🌱 Starting to seed realistic jobs...\n");

    // First, find or create homeowners
    let homeowners = await prisma.user.findMany({
      where: { role: "homeowner" },
      take: 5
    });

    // If no homeowners exist, create some
    if (homeowners.length === 0) {
      console.log("No homeowners found. Creating sample homeowners...");
      
      const homeownerData = [
        { email: "john.smith@example.com", name: "John Smith", phone: "416-555-0101" },
        { email: "sarah.johnson@example.com", name: "Sarah Johnson", phone: "416-555-0102" },
        { email: "michael.brown@example.com", name: "Michael Brown", phone: "416-555-0103" },
        { email: "emily.davis@example.com", name: "Emily Davis", phone: "416-555-0104" },
        { email: "david.wilson@example.com", name: "David Wilson", phone: "416-555-0105" }
      ];

      for (const data of homeownerData) {
        const homeowner = await prisma.user.create({
          data: {
            ...data,
            role: "homeowner",
            clerkId: `clerk_homeowner_${Math.random().toString(36).substr(2, 9)}`
          }
        });
        homeowners.push(homeowner);
      }
      console.log(`✅ Created ${homeowners.length} homeowners\n`);
    }

    let jobCount = 0;

    // Create jobs
    for (const jobTemplate of realisticJobs) {
      // Randomly select a neighborhood
      const neighborhood = torontoNeighborhoods[Math.floor(Math.random() * torontoNeighborhoods.length)];
      
      // Randomly select a homeowner
      const homeowner = homeowners[Math.floor(Math.random() * homeowners.length)];

      // Random status (80% published, 15% pending, 5% closed)
      const statusRand = Math.random();
      let status;
      if (statusRand < 0.80) status = "published";
      else if (statusRand < 0.95) status = "pending";
      else status = "closed";

      // Create the job
      const job = await prisma.job.create({
        data: {
          title: jobTemplate.title,
          description: jobTemplate.description,
          category: jobTemplate.category,
          location: neighborhood.name,
          postalCode: neighborhood.postal,
          budgetMin: jobTemplate.budgetMin,
          budgetMax: jobTemplate.budgetMax,
          budget: `$${jobTemplate.budgetMin.toLocaleString()} - $${jobTemplate.budgetMax.toLocaleString()}`,
          urgency: jobTemplate.urgency,
          timeline: jobTemplate.timeline,
          status: status,
          homeownerId: homeowner.id,
          images: jobTemplate.images || [],
          tags: [jobTemplate.category, neighborhood.name, jobTemplate.urgency].join(", "),
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)), // Random date within last 30 days
        }
      });

      jobCount++;
      console.log(`✅ Created job ${jobCount}/${realisticJobs.length}: ${job.title} in ${neighborhood.name}`);
    }

    console.log(`\n🎉 Successfully created ${jobCount} realistic jobs!\n`);
    console.log("📊 Summary:");
    console.log(`   - Total Jobs: ${jobCount}`);
    console.log(`   - Homeowners: ${homeowners.length}`);
    console.log(`   - Categories: ${[...new Set(realisticJobs.map(j => j.category))].length}`);
    console.log(`   - Neighborhoods: ${torontoNeighborhoods.length}`);

  } catch (error) {
    console.error("❌ Error seeding realistic jobs:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedRealisticJobs()
  .then(() => {
    console.log("\n✨ Seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Seeding failed:", error);
    process.exit(1);
  });
