const { PrismaClient } = require("@prisma/client");

// Use production database URL
const DATABASE_URL = process.env.PRODUCTION_DATABASE_URL || 
  "postgresql://neondb_owner:npg_h1DmvsUPiC5G@ep-gentle-shape-a09bdry8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

// Toronto neighborhoods focused on Scarborough and GTA
const torontoLocations = [
  { name: "Scarborough - Agincourt", zipCode: "M1S 3B5" },
  { name: "Scarborough - Malvern", zipCode: "M1E 4Z8" },
  { name: "Scarborough - Rouge", zipCode: "M1C 3A9" },
  { name: "Scarborough - Cliffside", zipCode: "M1N 2V5" },
  { name: "Scarborough - West Hill", zipCode: "M1E 1X7" },
  { name: "Scarborough - Guildwood", zipCode: "M1E 4Y3" },
  { name: "Scarborough - Birchcliff", zipCode: "M1N 3S4" },
  { name: "Scarborough - Clairlea", zipCode: "M1N 2L7" },
  { name: "North York - Willowdale", zipCode: "M2N 6K1" },
  { name: "North York - Don Mills", zipCode: "M3C 1B8" },
  { name: "North York - Bayview Village", zipCode: "M2K 2X9" },
  { name: "Markham", zipCode: "L3R 9S3" },
  { name: "Richmond Hill", zipCode: "L4C 6Z5" },
  { name: "Vaughan", zipCode: "L4L 8B4" },
  { name: "Pickering", zipCode: "L1V 6K5" },
  { name: "Ajax", zipCode: "L1S 7K5" },
  { name: "Whitby", zipCode: "L1N 9G8" },
  { name: "Oshawa", zipCode: "L1H 8L7" },
  { name: "Mississauga - Meadowvale", zipCode: "L5N 2X2" },
  { name: "Mississauga - Streetsville", zipCode: "L5M 5V5" },
  { name: "Brampton - Bramalea", zipCode: "L6S 3J7" },
  { name: "Etobicoke - Rexdale", zipCode: "M9W 5E8" },
  { name: "East York", zipCode: "M4C 3E7" },
  { name: "Downtown Toronto", zipCode: "M5V 3A8" },
];

// Professional, realistic job leads for Toronto GTA
const jobLeads = [
  // PLUMBING JOBS
  {
    title: "Emergency Kitchen Sink Leak Repair Needed Today",
    description: "My kitchen sink has developed a major leak under the cabinet that started this morning. Water is pooling and I need a licensed plumber to come fix this ASAP before it causes water damage to the floor and cabinet. The pipe appears to be corroded near the connection. I'm home all day and can accommodate immediate service. Please bring replacement parts if needed.",
    category: "Plumbing",
    budget: "$300 - $800",
  },
  {
    title: "Replace 40-Gallon Gas Water Heater",
    description: "My 12-year-old 40-gallon gas water heater is leaking from the bottom and needs immediate replacement. Looking for a licensed plumber to remove the old unit and install a new energy-efficient model. The water heater is in the basement with existing gas line hookup. Need proper permits and ESA approval. Can you provide a quote for both standard and tankless options?",
    category: "Plumbing",
    budget: "$1,800 - $3,200",
  },
  {
    title: "Complete Bathroom Renovation - Shower & Plumbing",
    description: "I'm renovating my main bathroom and need a professional plumber for a complete installation. The work includes: removing old bathtub and installing modern walk-in shower with glass doors, installing new vanity with dual sinks, new toilet, rain shower head system, and proper waterproofing. Bathroom is 8x6 feet. Looking for someone with extensive bathroom renovation experience. Photos of the current bathroom available upon request.",
    category: "Plumbing",
    budget: "$6,000 - $11,000",
  },
  {
    title: "Whole House Repiping - 1950s Galvanized Pipes",
    description: "My 1950s home has original galvanized pipes that are causing frequent leaks and very low water pressure. I need a complete house repipe with either PEX or copper piping. The house is 2,200 sq ft, 2-story with 3 full bathrooms, kitchen, and laundry room. Looking for a licensed contractor with experience in older homes. Need detailed quote and timeline. Will this require opening walls?",
    category: "Plumbing",
    budget: "$18,000 - $28,000",
  },
  {
    title: "Install New Toilet and Bathroom Vanity",
    description: "I've already purchased a Kohler toilet and modern 48-inch floating vanity for my renovated bathroom. Need a plumber to install both with proper connections, sealing, and cleanup. The bathroom is ready - just needs the fixtures installed and tested. Simple installation job for the right professional.",
    category: "Plumbing",
    budget: "$500 - $900",
  },

  // ELECTRICAL JOBS
  {
    title: "Upgrade Electrical Panel from 100 Amp to 200 Amp",
    description: "I need to upgrade my home's electrical service from 100 amp to 200 amp panel. The current panel is 30 years old and can't handle modern appliances. I'm planning to add an EV charger and central AC system, so I need the extra capacity. Must be done by licensed ESA electrician with proper permits and inspection. House is 2,000 sq ft. How long will the power be off during the upgrade?",
    category: "Electrical",
    budget: "$3,500 - $6,500",
  },
  {
    title: "Install Tesla EV Charger in Detached Garage",
    description: "Just bought a Tesla Model Y and need a Level 2 EV charger (240V) installed in my detached garage. The garage is about 35 feet from the main electrical panel. Need proper wiring run underground or overhead, dedicated circuit breaker, and Tesla wall connector mounted and configured. Must meet ESA requirements. Licensed electrician with EV charger experience preferred.",
    category: "Electrical",
    budget: "$1,800 - $3,200",
  },
  {
    title: "Kitchen Renovation - Pot Lights & Under-Cabinet LED",
    description: "My kitchen renovation is almost complete and I need an electrician for the lighting. Need 12 LED pot lights installed in the ceiling (4-inch slim LED), LED strip lighting under all upper cabinets with dimmer switches, and one pendant light over the island. Kitchen is 14x12 feet. Clean, professional installation required - drywall is already painted. When can you start?",
    category: "Electrical",
    budget: "$2,200 - $4,000",
  },
  {
    title: "Add 6 New Electrical Outlets in Basement",
    description: "Finishing my basement and need 6 new electrical outlets installed throughout the space for TV, office area, and general use. The basement is currently unfinished with exposed studs, so this is good timing. Existing panel has capacity. Need dedicated 20-amp circuit for office equipment. Licensed electrician with permit required.",
    category: "Electrical",
    budget: "$800 - $1,400",
  },
  {
    title: "Outdoor Landscape Lighting Installation",
    description: "Want professional landscape lighting installed around my front yard and walkway for safety and curb appeal. Need about 15 low-voltage LED fixtures along the walkway, around trees, and highlighting the front of the house. Include transformer, timer system, and weatherproof connections. Front yard is approximately 1,800 sq ft. Can you provide design consultation?",
    category: "Electrical",
    budget: "$2,800 - $5,500",
  },

  // HVAC JOBS
  {
    title: "Replace Old Furnace Before Winter - Urgent",
    description: "My 28-year-old furnace is making strange noises and barely keeping the house warm. With winter approaching, I need it replaced ASAP. Looking for a high-efficiency natural gas furnace (95%+ AFUE rating). House is 1,900 sq ft, 2-story. Need proper sizing, installation with warranty, and disposal of old unit. Licensed HVAC contractor with TSSA certification required. How quickly can you do this?",
    category: "HVAC",
    budget: "$5,500 - $9,000",
  },
  {
    title: "Central Air Conditioning Installation",
    description: "My home has forced air heating but no central AC. With summers getting hotter, I want to install a new central air conditioning system. House is 2,400 sq ft with existing ductwork. Looking for energy-efficient system (16+ SEER rating). Need ductwork inspection and any modifications required. Licensed HVAC contractor with references preferred. What brands do you recommend?",
    category: "HVAC",
    budget: "$7,000 - $13,000",
  },
  {
    title: "Ductless Mini-Split for Home Office Addition",
    description: "I converted my garage into a home office (450 sq ft) and need heating and cooling. Looking to install a ductless mini-split heat pump system. Space has good insulation. Need professional sizing recommendation, installation of outdoor unit, and indoor wall-mounted unit with remote control. Must be quiet for video calls. Licensed HVAC technician required.",
    category: "HVAC",
    budget: "$3,800 - $6,800",
  },
  {
    title: "Complete Ductwork Cleaning - 3 Bedroom Home",
    description: "Haven't had our ducts cleaned in 9 years and there's noticeable dust buildup. Family members are experiencing allergies. Need complete duct cleaning, sanitization, and inspection for any leaks or damage. 3-bedroom, 2-bathroom home with basement. About 2,000 sq ft total. Prefer company with camera inspection. What's your cleaning process?",
    category: "HVAC",
    budget: "$450 - $850",
  },

  // ROOFING JOBS
  {
    title: "Complete Roof Replacement - Asphalt Shingles",
    description: "My asphalt shingle roof is 24 years old with multiple leaks after recent storms. Need complete tear-off and replacement with quality 30-year architectural shingles. House is 2,100 sq ft with standard pitch. Want proper ventilation, new flashing, and full warranty. Must be licensed, insured contractor with WSIB coverage. Can you provide references and photos of recent work? Need written quote with material specifications.",
    category: "Roofing",
    budget: "$14,000 - $21,000",
  },
  {
    title: "Emergency Roof Leak Repair Around Chimney",
    description: "Discovered water stain on my ceiling after yesterday's heavy rain. Leak appears to be around the brick chimney - probably flashing failure. Need experienced roofer to inspect and repair ASAP before more rain this week. Can you come today or tomorrow? Emergency service needed.",
    category: "Roofing",
    budget: "$600 - $1,800",
  },
  {
    title: "Install Two Velux Skylights in Master Bedroom",
    description: "Want to add natural light to my master bedroom by installing two Velux skylights. Room is on the second floor directly under the roof. Need proper flashing, waterproofing, interior drywall finishing, and painting around openings. Looking for 32x32 inch solar-powered opening skylights. Experienced skylight installer required.",
    category: "Roofing",
    budget: "$4,500 - $7,500",
  },
  {
    title: "Flat Garage Roof Repair & Membrane Replacement",
    description: "The flat roof on my detached garage is showing its age with some ponding water and small cracks. About 650 sq ft. Need repairs and new waterproof membrane installed. Want proper drainage solution to prevent future ponding. Looking for contractor experienced with flat roofs. What membrane system do you recommend?",
    category: "Roofing",
    budget: "$3,500 - $6,500",
  },

  // KITCHEN RENOVATION
  {
    title: "Full Kitchen Renovation - Modern Contemporary Design",
    description: "Planning a complete kitchen renovation and need an experienced general contractor or kitchen specialist. Kitchen is 13x16 feet. Want: custom cabinets with soft-close, quartz countertops, large island with seating, tile backsplash, new stainless appliances, undermount sink, hardwood flooring, and LED lighting throughout. Modern contemporary style. Need coordination of all trades (plumbing, electrical, flooring, tile). Looking for detailed quote with 3D rendering if possible.",
    category: "Kitchen Renovation",
    budget: "$45,000 - $70,000",
  },
  {
    title: "Kitchen Cabinet Refacing - White Shaker Style",
    description: "My kitchen cabinets are structurally sound but the wood finish is dated. Want to reface all cabinets with modern white shaker-style doors. 20 cabinet doors and 8 drawer fronts total. Include new soft-close hinges, modern brushed nickel hardware, and crown molding. Professional spray finish preferred for smooth look. Kitchen stays functional during work?",
    category: "Kitchen Renovation",
    budget: "$9,500 - $16,000",
  },
  {
    title: "Quartz Countertop Installation with Waterfall Edge",
    description: "Need quartz countertops installed in my renovated kitchen. Approximately 52 sq ft including island with waterfall edge on one side. I've selected Caesarstone in Frosty Carrina. Need professional template, fabrication, and installation with undermount sink cutout and faucet holes. Existing laminate counters to be removed. How long from template to installation?",
    category: "Kitchen Renovation",
    budget: "$5,500 - $8,500",
  },
  {
    title: "Subway Tile Kitchen Backsplash Installation",
    description: "Need subway tile backsplash installed behind kitchen counters and stove. Approximately 45 sq ft. Using classic white 3x6 inch subway tiles with light gray grout. Clean, professional installation with proper spacing and finishing required. I've already purchased all materials. Experienced tile installer needed. Can you start this week?",
    category: "Kitchen Renovation",
    budget: "$1,400 - $2,800",
  },

  // BATHROOM RENOVATION
  {
    title: "Master Bathroom Complete Renovation - Spa Design",
    description: "Complete master bathroom renovation from floor to ceiling. Bathroom is 11x9 feet. Want: double vanity with quartz top, walk-in tile shower with frameless glass door, new toilet, heated tile floors, modern lighting, proper ventilation fan. Spa-inspired contemporary design. Need contractor to handle all trades - demolition, plumbing, electrical, tile, painting. Looking for detailed proposal with timeline. Can you provide portfolio?",
    category: "Bathroom Renovation",
    budget: "$28,000 - $45,000",
  },
  {
    title: "Replace Bathtub with Walk-In Tile Shower",
    description: "Want to replace our old bathtub with a modern walk-in tile shower. Shower area is 5x3 feet. Want: large format tile, glass door, rain showerhead, handheld spray, built-in shelf niche, and proper waterproofing. Need experienced bathroom contractor familiar with Schluter systems. How long will bathroom be out of service?",
    category: "Bathroom Renovation",
    budget: "$7,500 - $13,000",
  },
  {
    title: "Bathroom Heated Floor Tile Installation",
    description: "Renovating bathroom floor and want to install electric heated floor system with porcelain tile. Bathroom is 8x7 feet. Need: removal of old vinyl, proper subfloor prep, electric heating mat installation, quality porcelain tile (12x24 inch), programmable thermostat. Looking for experienced tile installer with heated floor experience.",
    category: "Bathroom Renovation",
    budget: "$4,200 - $7,000",
  },
  {
    title: "Install New Vanity and Medicine Cabinet",
    description: "Already purchased a beautiful 60-inch double vanity and matching medicine cabinet for our bathroom. Need professional installation including: plumbing hookups for two sinks, proper wall mounting, and ensuring everything is level and secure. Bathroom is ready for installation. Looking for neat, professional work.",
    category: "Bathroom Renovation",
    budget: "$700 - $1,300",
  },

  // PAINTING JOBS
  {
    title: "Whole House Interior Painting - 3 Bedroom Home",
    description: "Need entire house interior painted professionally. 2,400 sq ft includes 3 bedrooms, 2 bathrooms, living room, dining room, kitchen, hallways, and staircase. Want ceiling and walls done in neutral colors (will provide color selections). Includes proper prep, filling holes, light sanding, 2 coats paint, and cleanup. Professional painters with references required. Timeline?",
    category: "Painting",
    budget: "$7,000 - $11,500",
  },
  {
    title: "Exterior House Painting - 2 Story Home",
    description: "2-story home exterior needs complete painting. Approximately 2,600 sq ft of paintable surface. Want siding in modern gray-blue and trim in crisp white. Need proper prep work, power washing, scraping, priming, and 2 coats quality exterior paint. Include soffit, fascia, and window trim. Must be licensed and insured. How weather-dependent is scheduling?",
    category: "Painting",
    budget: "$9,500 - $17,000",
  },
  {
    title: "Kitchen Cabinet Painting - White Finish",
    description: "Want my kitchen cabinets professionally spray painted from dark wood to bright white. 24 cabinet doors and 10 drawer fronts. Need proper prep, degreasing, priming, and smooth spray finish with protective topcoat. Looking for factory-quality finish. Can you do the work on-site or do cabinets need to be removed?",
    category: "Painting",
    budget: "$4,200 - $7,500",
  },
  {
    title: "Interior Accent Wall and 2 Bedrooms",
    description: "Want to freshen up a few rooms: create dramatic accent wall in living room (deep navy blue), and paint two bedrooms in soft neutral tones. Includes proper prep, taping, 2 coats, and cleanup. Looking for neat, professional painter. Can you start next week?",
    category: "Painting",
    budget: "$1,100 - $2,200",
  },

  // FLOORING JOBS
  {
    title: "Hardwood Floor Installation - Main Floor 1,400 Sq Ft",
    description: "Want engineered hardwood flooring installed throughout main floor. 1,400 sq ft including living room, dining room, hallway, and kitchen. Prefer medium-tone oak, 5-inch planks. Need subfloor inspection, leveling if needed, proper underlayment, and professional installation. Include baseboards and transitions. Remove existing carpet. Experienced hardwood installer required.",
    category: "Flooring",
    budget: "$10,500 - $17,000",
  },
  {
    title: "Luxury Vinyl Plank (LVP) Basement Installation",
    description: "Finished basement needs flooring. 950 sq ft. Want waterproof luxury vinyl plank in wood-look style (like Shaw or LifeProof). Basement is level and dry. Need baseboards installed as well. Looking for professional installation with warranty. What thickness/wear layer do you recommend for basement?",
    category: "Flooring",
    budget: "$5,500 - $8,500",
  },
  {
    title: "Refinish Original Hardwood Floors",
    description: "My home has beautiful original red oak hardwood floors that need refinishing. Approximately 1,100 sq ft. Floors are scratched and worn but structurally sound. Want proper sanding (need dustless system), staining in medium brown tone, and 3 coats polyurethane finish. Experienced hardwood refinisher with modern equipment required. How long to cure?",
    category: "Flooring",
    budget: "$4,000 - $6,800",
  },
  {
    title: "Porcelain Tile Flooring - Kitchen & Bathrooms",
    description: "Need large format porcelain tile installed in kitchen (220 sq ft) and two bathrooms (140 sq ft combined). Using 12x24 inch modern gray tiles. Need proper substrate prep, leveling, waterproofing in bathrooms, and professional installation with thin grout lines. Include baseboards. Experienced tile installer required.",
    category: "Flooring",
    budget: "$6,500 - $11,000",
  },

  // LANDSCAPING JOBS
  {
    title: "Complete Front Yard Landscaping Redesign",
    description: "My front yard needs major update. 1,800 sq ft area. Want: remove overgrown shrubs, create modern flower beds with perennials and ornamental grasses, add decorative river rock, install pathway lighting, and fresh sod. Need professional design and installation. Looking for low-maintenance, water-wise planting. Portfolio required. Can you provide design consultation?",
    category: "Landscaping",
    budget: "$10,000 - $18,000",
  },
  {
    title: "Backyard Interlock Patio Installation",
    description: "Want new interlock stone patio in backyard for entertaining. 18x16 foot area. Need proper excavation, grading for drainage, compacted base, quality interlock pavers, and polymeric sand. Prefer modern gray tones with border pattern. Include 3 steps down from back door. Licensed landscaper with interlock experience required.",
    category: "Landscaping",
    budget: "$8,500 - $14,000",
  },
  {
    title: "New Sod Installation - Front & Back Yard",
    description: "Current grass is mostly weeds and bare patches. Need complete lawn renovation with quality sod. Front yard 1,200 sq ft, back yard 2,100 sq ft. Want proper grading, new topsoil (2 inches), premium Kentucky bluegrass sod, and initial fertilizing. When is the best time to install? What's your warranty?",
    category: "Landscaping",
    budget: "$4,500 - $7,500",
  },
  {
    title: "Natural Stone Retaining Wall - 35 Feet",
    description: "Need retaining wall built along property line to address slope and erosion. Approximately 35 feet long, 2.5 feet high. Want natural stone (armor stone or similar). Must include proper drainage, geotextile fabric, and compacted backfill. Licensed landscaper with retaining wall experience required. Can you provide engineering if needed?",
    category: "Landscaping",
    budget: "$7,500 - $14,000",
  },

  // BASEMENT FINISHING
  {
    title: "Complete Basement Finishing - Rec Room & Bedroom",
    description: "Unfinished basement ready to be transformed. 1,100 sq ft. Want: large rec room with bar area, bedroom with egress window, 3-piece bathroom, laundry room, and storage. Need full service: framing, electrical, plumbing, insulation, drywall, painting, flooring (LVP), pot lights. Licensed contractor with basement finishing experience required. Building permit included?",
    category: "Basement Finishing",
    budget: "$55,000 - $85,000",
  },
  {
    title: "Basement Waterproofing - Interior System",
    description: "My basement shows moisture issues and musty smell. Need professional waterproofing solution before finishing the space. Basement is 1,300 sq ft. Want interior perimeter drainage system, vapor barrier on walls, and reliable sump pump with battery backup. Licensed waterproofing company with warranty required. What causes the moisture?",
    category: "Basement Finishing",
    budget: "$11,000 - $19,000",
  },
  {
    title: "Basement Egress Window Installation for Bedroom",
    description: "Need code-compliant egress window installed for new basement bedroom. Includes: concrete cutting, proper-sized well installation, quality egress window, ladder, professional installation with waterproofing, interior framing and drywall finishing. Permit and inspection coordination required. Must meet Ontario Building Code.",
    category: "Basement Finishing",
    budget: "$5,500 - $9,500",
  },

  // DECK & FENCE JOBS
  {
    title: "Build New Composite Deck - 400 Sq Ft",
    description: "Want new composite deck built in backyard for entertaining. 20x20 feet, single level with stairs. Prefer Trex or TimberTech in gray tones. Need: proper footings below frost line, pressure-treated frame, composite decking and railing, integrated lighting. Building permit required. Licensed deck builder with portfolio needed. Timeline estimate?",
    category: "Deck Construction",
    budget: "$18,000 - $28,000",
  },
  {
    title: "Privacy Fence Installation - Cedar 6 Foot",
    description: "Need 6-foot privacy fence installed along back and side property lines. Approximately 140 linear feet. Want: quality cedar boards, pressure-treated posts set in concrete, one double gate for yard access. Professional installation with warranty required. How long will this take? Need survey?",
    category: "Fencing",
    budget: "$10,000 - $17,000",
  },
  {
    title: "Deck Power Washing & Restaining",
    description: "Existing pressure-treated deck needs refreshing. 450 sq ft. Want: thorough power washing, sanding any rough spots, replacement of a few damaged boards, and 2 coats of quality semi-transparent stain in cedar tone. Deck is 8 years old. Need experienced deck restoration specialist. Best time of year?",
    category: "Deck Construction",
    budget: "$2,400 - $4,500",
  },

  // CONCRETE WORK
  {
    title: "Concrete Driveway Replacement - 2 Car Driveway",
    description: "Old concrete driveway is cracked and settling. Need complete replacement. Driveway is approximately 650 sq ft (20x32 feet). Want: removal and disposal of old concrete, proper grading, compacted granular base, 4-inch reinforced concrete pour, broom finish. Licensed concrete contractor required. Includes city permit?",
    category: "Concrete",
    budget: "$7,500 - $12,000",
  },
  {
    title: "Stamped Concrete Patio & Steps",
    description: "Want beautiful stamped concrete patio off back door. 14x16 foot patio with 4 steps. Want stamped pattern to look like natural stone in earth tones. Need proper grading, drainage away from house, reinforced concrete, and quality stamps/coloring. Experienced decorative concrete contractor required.",
    category: "Concrete",
    budget: "$6,500 - $11,000",
  },
  {
    title: "Front Walkway - Exposed Aggregate Concrete",
    description: "Need new concrete walkway from driveway to front door. 55 feet long, 4 feet wide. Want attractive exposed aggregate finish. Include: excavation, proper base, reinforced concrete, professional exposed aggregate installation. Need licensed contractor. How slippery in winter?",
    category: "Concrete",
    budget: "$4,200 - $7,500",
  },

  // INSULATION & ENERGY EFFICIENCY
  {
    title: "Attic Insulation Upgrade - Blown-In",
    description: "My heating bills are too high and the house is drafty. Current attic insulation is old and insufficient. Want to upgrade to R-60 with blown-in cellulose or fiberglass. Attic is 1,400 sq ft. Need proper ventilation maintained. Licensed insulation contractor required. Eligible for any rebates?",
    category: "Insulation",
    budget: "$2,200 - $4,000",
  },

  // GENERAL CONTRACTOR / HOME REPAIR
  {
    title: "Multiple Small Repairs - Handyman Needed",
    description: "Need a skilled handyman for various small repairs: fix squeaky stairs, patch drywall holes, replace interior door handles, caulk around bathtub, fix loose baseboards, touch-up paint. About half day of work. Looking for reliable professional with tools. Can you provide hourly rate?",
    category: "General Repairs",
    budget: "$300 - $600",
  },
  {
    title: "Drywall Repair & Painting - Water Damage",
    description: "Had a roof leak (now fixed) that damaged ceiling drywall in bedroom. Need section cut out, replaced, properly taped and mudded, textured to match, primed and painted. About 6x4 foot area. Need experienced drywall repair specialist who can match existing texture. How soon available?",
    category: "Drywall",
    budget: "$500 - $1,100",
  },

  // WINDOW & DOOR JOBS
  {
    title: "Replace All Windows - Energy Efficient",
    description: "My 25-year-old windows are drafty and inefficient. Want to replace all 18 windows with modern energy-efficient vinyl windows (triple pane, Low-E, argon fill). Various sizes. Need proper installation with insulation and trim work. Licensed window installer with warranty required. Can you measure and quote?",
    category: "Window Installation",
    budget: "$14,000 - $22,000",
  },
  {
    title: "Install New Front Entry Door - Steel Insulated",
    description: "Want to upgrade front door for better security and insulation. Looking for quality steel insulated door with decorative glass insert, modern hardware, and professional installation. Need proper weatherstripping and threshold. Licensed installer preferred. Can I see door options?",
    category: "Door Installation",
    budget: "$1,800 - $3,500",
  },

  // GARAGE JOBS
  {
    title: "Garage Door Replacement - Insulated Double Door",
    description: "Need new insulated garage door (16x7 double). Current door is damaged and noisy. Want modern style in gray or black, R-16 insulation rating, with quiet belt-drive opener. Include installation and disposal of old door. Licensed garage door company required. What brands do you carry?",
    category: "Garage Door",
    budget: "$2,200 - $3,800",
  },
];

async function seedTorontoProductionJobs() {
  try {
    console.log("🏗️  Starting Toronto GTA Job Board Seeding (PRODUCTION)...\n");
    console.log(`📡 Connecting to: ${DATABASE_URL.substring(0, 50)}...\n`);

    // Find or create test homeowners
    let homeowners = await prisma.user.findMany({
      where: { role: "homeowner" },
      take: 10,
    });

    if (homeowners.length < 3) {
      console.log("Creating Toronto area homeowners...");

      const homeownerNames = [
        { name: "Michael Chen", email: "m.chen.scarborough@example.com", phone: "416-555-0101" },
        { name: "Sarah Patel", email: "s.patel.northyork@example.com", phone: "416-555-0102" },
        { name: "James Rodriguez", email: "j.rodriguez.markham@example.com", phone: "905-555-0103" },
        { name: "Emily Wong", email: "e.wong.richmond@example.com", phone: "905-555-0104" },
        { name: "David Kumar", email: "d.kumar.mississauga@example.com", phone: "905-555-0105" },
        { name: "Lisa Thompson", email: "l.thompson.ajax@example.com", phone: "905-555-0106" },
        { name: "Robert Singh", email: "r.singh.brampton@example.com", phone: "905-555-0107" },
        { name: "Jennifer Lee", email: "j.lee.pickering@example.com", phone: "905-555-0108" },
      ];

      for (const homeownerData of homeownerNames) {
        try {
          const homeowner = await prisma.user.create({
            data: {
              email: homeownerData.email,
              name: homeownerData.name,
              displayName: homeownerData.name,
              role: "homeowner",
              clerkUserId: `demo_${Math.random().toString(36).substr(2, 11)}`,
            },
          });
          homeowners.push(homeowner);
          console.log(`✅ Created homeowner: ${homeowner.name}`);
        } catch (error) {
          // Skip if homeowner already exists
          console.log(`⚠️  Skipped ${homeownerData.email} (may already exist)`);
        }
      }
    }

    console.log(`\n📋 Found ${homeowners.length} homeowners\n`);

    let jobCount = 0;
    const errors = [];

    // Create jobs
    for (const jobTemplate of jobLeads) {
      try {
        // Randomly select location
        const location = torontoLocations[Math.floor(Math.random() * torontoLocations.length)];

        // Randomly select homeowner
        const homeowner = homeowners[Math.floor(Math.random() * homeowners.length)];

        // Create the job lead
        const lead = await prisma.lead.create({
          data: {
            title: jobTemplate.title,
            description: jobTemplate.description,
            category: jobTemplate.category,
            budget: jobTemplate.budget,
            zipCode: location.zipCode,
            status: "open",
            published: true,
            homeownerId: homeowner.id,
            maxContractors: 5,
            acceptedContractors: "[]",
            photos: "[]",
            viewCount: Math.floor(Math.random() * 15), // Random view count 0-15
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)), // Random date within last 2 weeks
          },
        });

        jobCount++;
        console.log(
          `✅ [${jobCount}/${jobLeads.length}] ${lead.title.substring(0, 50)}... → ${location.name}`
        );
      } catch (error) {
        errors.push({
          job: jobTemplate.title,
          error: error.message,
        });
        console.error(`❌ Failed to create: ${jobTemplate.title.substring(0, 40)}...`);
      }
    }

    console.log("\n" + "=".repeat(70));
    console.log("🎉 SEEDING COMPLETE!");
    console.log("=".repeat(70));
    console.log(`✅ Successfully created: ${jobCount} job leads`);
    console.log(`📍 Locations covered: ${torontoLocations.length} GTA areas`);
    console.log(`👥 Homeowners: ${homeowners.length}`);
    console.log(`📊 Categories: ${[...new Set(jobLeads.map((j) => j.category))].length} types`);

    if (errors.length > 0) {
      console.log(`\n⚠️  Errors encountered: ${errors.length}`);
      errors.forEach((err) => {
        console.log(`   - ${err.job}: ${err.error}`);
      });
    }

    console.log("\n📂 Jobs are now live on the job board!");
    console.log("🔍 Contractors can browse and apply to these jobs");
    console.log("📍 Focus areas: Scarborough, North York, Markham, Mississauga, Ajax, Pickering");
    console.log("=".repeat(70) + "\n");
  } catch (error) {
    console.error("\n❌ SEEDING FAILED:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the seed function
seedTorontoProductionJobs()
  .then(() => {
    console.log("✨ Database seeding completed successfully!\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Database seeding failed:", error);
    process.exit(1);
  });
