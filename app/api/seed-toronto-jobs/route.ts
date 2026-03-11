import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Toronto neighborhoods focused on Scarborough and GTA
const torontoLocations = [
  { name: "Scarborough - Agincourt", zipCode: "M1S 3B5" },
  { name: "Scarborough - Malvern", zipCode: "M1E 4Z8" },
  { name: "Scarborough - Rouge", zipCode: "M1C 3A9" },
  { name: "Scarborough - Cliffside", zipCode: "M1N 2V5" },
  { name: "Scarborough - West Hill", zipCode: "M1E 1X7" },
  { name: "Scarborough - Guildwood", zipCode: "M1E 4Y3" },
  { name: "North York - Willowdale", zipCode: "M2N 6K1" },
  { name: "North York - Don Mills", zipCode: "M3C 1B8" },
  { name: "Markham", zipCode: "L3R 9S3" },
  { name: "Richmond Hill", zipCode: "L4C 6Z5" },
  { name: "Vaughan", zipCode: "L4L 8B4" },
  { name: "Pickering", zipCode: "L1V 6K5" },
  { name: "Ajax", zipCode: "L1S 7K5" },
  { name: "Whitby", zipCode: "L1N 9G8" },
  { name: "Mississauga", zipCode: "L5N 2X2" },
  { name: "Brampton", zipCode: "L6S 3J7" },
  { name: "Etobicoke", zipCode: "M9W 5E8" },
  { name: "East York", zipCode: "M4C 3E7" },
];

// Sample of professional job leads (first 20 for testing, can expand)
const jobLeads = [
  {
    title: "Emergency Kitchen Sink Leak Repair",
    description: "Kitchen sink has a major leak under the cabinet. Water is pooling and needs immediate attention before it causes floor damage. Pipe appears corroded. Available all day for immediate service.",
    category: "Plumbing",
    budget: "$300 - $800",
  },
  {
    title: "Replace 40-Gallon Gas Water Heater",
    description: "12-year-old gas water heater is leaking and needs replacement. Looking for licensed plumber for removal and installation of energy-efficient model. Basement installation with existing gas line.",
    category: "Plumbing",
    budget: "$1,800 - $3,200",
  },
  {
    title: "Bathroom Shower Installation & Renovation",
    description: "Complete bathroom plumbing work: remove old bathtub, install walk-in shower with glass doors, new vanity with dual sinks, new toilet, rain shower head, proper waterproofing. 8x6 ft bathroom.",
    category: "Plumbing",
    budget: "$6,000 - $11,000",
  },
  {
    title: "Whole House Repiping - Replace Galvanized Pipes",
    description: "1950s home with original galvanized pipes causing leaks and low pressure. Need complete repipe with PEX or copper. 2,200 sq ft, 2-story, 3 bathrooms. Licensed contractor with older home experience required.",
    category: "Plumbing",
    budget: "$18,000 - $28,000",
  },
  {
    title: "Electrical Panel Upgrade - 100 to 200 Amp",
    description: "Upgrade electrical service from 100 to 200 amp. Current panel is 30 years old, planning to add EV charger and central AC. Licensed ESA electrician required with permits.",
    category: "Electrical",
    budget: "$3,500 - $6,500",
  },
  {
    title: "Install Tesla EV Charger in Garage",
    description: "Need Level 2 EV charger installed in detached garage (35ft from panel). Proper wiring, dedicated breaker, Tesla wall connector. Must meet ESA requirements.",
    category: "Electrical",
    budget: "$1,800 - $3,200",
  },
  {
    title: "Kitchen LED Pot Lights & Under-Cabinet Lighting",
    description: "Kitchen renovation needs 12 LED pot lights and LED strip under cabinets with dimmers. One pendant over island. 14x12 ft kitchen. Clean installation, drywall already painted.",
    category: "Electrical",
    budget: "$2,200 - $4,000",
  },
  {
    title: "Add 6 Electrical Outlets in Basement",
    description: "Finishing basement, need 6 outlets for TV, office, general use. Basement unfinished with exposed studs. Need dedicated 20-amp circuit for office. Licensed electrician required.",
    category: "Electrical",
    budget: "$800 - $1,400",
  },
  {
    title: "Replace Old Furnace Before Winter",
    description: "28-year-old furnace making strange noises. Need urgent replacement with high-efficiency natural gas furnace (95%+ AFUE). 1,900 sq ft home. Licensed HVAC contractor with TSSA certification.",
    category: "HVAC",
    budget: "$5,500 - $9,000",
  },
  {
    title: "Central Air Conditioning Installation",
    description: "Home has forced air heating but no AC. Want to install central AC system. 2,400 sq ft with existing ductwork. Energy-efficient 16+ SEER. Licensed HVAC contractor required.",
    category: "HVAC",
    budget: "$7,000 - $13,000",
  },
  {
    title: "Complete Roof Replacement - Asphalt Shingles",
    description: "24-year-old asphalt roof with multiple leaks. Need complete tear-off and replacement with 30-year architectural shingles. 2,100 sq ft. Licensed, insured contractor with WSIB coverage.",
    category: "Roofing",
    budget: "$14,000 - $21,000",
  },
  {
    title: "Emergency Roof Leak Repair - Chimney Flashing",
    description: "Water stain on ceiling after heavy rain. Leak around brick chimney, likely flashing failure. Need inspection and repair ASAP before more rain. Emergency service needed.",
    category: "Roofing",
    budget: "$600 - $1,800",
  },
  {
    title: "Full Kitchen Renovation - Modern Design",
    description: "Complete kitchen renovation, 13x16 ft. Custom cabinets, quartz countertops, large island, tile backsplash, new appliances, hardwood floors, LED lighting. Need general contractor for all trades coordination.",
    category: "Kitchen Renovation",
    budget: "$45,000 - $70,000",
  },
  {
    title: "Kitchen Cabinet Refacing - White Shaker Style",
    description: "Structurally sound cabinets need modern update. Reface with white shaker doors. 20 doors, 8 drawers. Includes soft-close hinges, brushed nickel hardware, crown molding. Professional spray finish preferred.",
    category: "Kitchen Renovation",
    budget: "$9,500 - $16,000",
  },
  {
    title: "Master Bathroom Complete Renovation",
    description: "Full bathroom reno, 11x9 ft. Double vanity, walk-in tile shower with glass door, heated tile floors, modern lighting. Spa-inspired design. Need contractor for all trades.",
    category: "Bathroom Renovation",
    budget: "$28,000 - $45,000",
  },
  {
    title: "Replace Bathtub with Walk-In Shower",
    description: "Replace old tub with modern walk-in tile shower, 5x3 ft. Large format tile, glass door, rain showerhead, handheld spray, built-in niche. Experienced bathroom contractor needed.",
    category: "Bathroom Renovation",
    budget: "$7,500 - $13,000",
  },
  {
    title: "Whole House Interior Painting",
    description: "Paint entire 2,400 sq ft home interior. 3 bedrooms, 2 baths, living, dining, kitchen, hallways, staircase. Ceilings and walls, neutral colors. Proper prep, 2 coats, cleanup.",
    category: "Painting",
    budget: "$7,000 - $11,500",
  },
  {
    title: "Exterior House Painting - 2 Story",
    description: "2-story exterior painting, 2,600 sq ft surface. Siding in gray-blue, trim in white. Proper prep, power wash, scraping, priming, 2 coats. Include soffit, fascia, window trim.",
    category: "Painting",
    budget: "$9,500 - $17,000",
  },
  {
    title: "Hardwood Floor Installation - Main Floor",
    description: "Engineered hardwood throughout main floor, 1,400 sq ft. Medium-tone oak, 5-inch planks. Subfloor inspection, leveling, underlayment, professional installation, baseboards, transitions.",
    category: "Flooring",
    budget: "$10,500 - $17,000",
  },
  {
    title: "Basement Waterproof LVP Flooring",
    description: "Finished basement needs waterproof luxury vinyl plank, 950 sq ft. Wood-look style (Shaw or LifeProof). Include baseboards. Professional installation with warranty.",
    category: "Flooring",
    budget: "$5,500 - $8,500",
  },
  {
    title: "Front Yard Landscaping Redesign",
description: "Complete front yard update, 1,800 sq ft. Remove overgrown shrubs, create modern flower beds with perennials, decorative rock, pathway lighting, fresh sod. Professional design and installation.",
    category: "Landscaping",
    budget: "$10,000 - $18,000",
  },
  {
    title: "Backyard Interlock Patio Installation",
    description: "New interlock patio, 18x16 ft. Proper excavation, grading, compacted base, quality pavers, polymeric sand. Modern gray tones with border. Include 3 steps from back door.",
    category: "Landscaping",
    budget: "$8,500 - $14,000",
  },
  {
    title: "Complete Basement Finishing - Rec Room & Bedroom",
    description: "Transform unfinished basement, 1,100 sq ft. Rec room with bar, bedroom with egress window, 3-piece bath, laundry, storage. Full service: framing, electrical, plumbing, insulation, drywall, painting, LVP flooring, pot lights.",
    category: "Basement Finishing",
    budget: "$55,000 - $85,000",
  },
  {
    title: "Basement Waterproofing System",
    description: "Basement shows moisture and musty smell, 1,300 sq ft. Need interior perimeter drainage, vapor barrier, sump pump with battery backup. Licensed waterproofing company with warranty required.",
    category: "Basement Finishing",
    budget: "$11,000 - $19,000",
  },
  {
    title: "Build New Composite Deck",
    description: "New composite deck, 20x20 ft (400 sq ft). Trex or TimberTech in gray. Proper footings, pressure-treated frame, composite decking and railing, integrated lighting. Building permit required.",
    category: "Deck Construction",
    budget: "$18,000 - $28,000",
  },
  {
    title: "Privacy Fence Installation - Cedar",
    description: "6-foot cedar privacy fence, 140 linear feet. Quality cedar, pressure-treated posts in concrete, one double gate. Professional installation with warranty.",
    category: "Fencing",
    budget: "$10,000 - $17,000",
  },
  {
    title: "Concrete Driveway Replacement",
    description: "Replace cracked driveway, 650 sq ft (20x32 ft). Remove old concrete, proper grading, compacted base, 4-inch reinforced pour, broom finish. Licensed contractor.",
    category: "Concrete",
    budget: "$7,500 - $12,000",
  },
  {
    title: "Replace All Windows - Energy Efficient",
    description: "Replace 18 windows (25 years old) with modern triple-pane, Low-E, argon fill vinyl windows. Proper installation with insulation and trim. Licensed installer with warranty.",
    category: "Window Installation",
    budget: "$14,000 - $22,000",
  },
  {
    title: "Garage Door Replacement - Insulated",
    description: "New insulated garage door (16x7 double). Modern style gray or black, R-16 insulation, quiet belt-drive opener. Include installation and disposal of old door.",
    category: "Garage Door",
    budget: "$2,200 - $3,800",
  },
  {
    title: "Multiple Small Home Repairs",
    description: "Need handyman for various repairs: fix squeaky stairs, patch drywall, replace door handles, caulk around tub, fix baseboards, touch-up paint. About half day of work.",
    category: "General Repairs",
    budget: "$300 - $600",
  },
];

export async function GET(request: Request) {
  try {
    // Security: Only allow in development or with special token
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    
    // You can set a secret token in your environment variables
    if (process.env.NODE_ENV === "production" && token !== process.env.SEED_TOKEN) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Starting Toronto GTA job seeding...");

    // Find or create homeowners
    let homeowners = await prisma.user.findMany({
      where: { role: "homeowner" },
      take: 10,
    });

    if (homeowners.length < 3) {
      const homeownerNames = [
        { name: "Michael Chen", email: "m.chen.scarborough@example.com" },
        { name: "Sarah Patel", email: "s.patel.northyork@example.com" },
        { name: "James Rodriguez", email: "j.rodriguez.markham@example.com" },
        { name: "Emily Wong", email: "e.wong.richmond@example.com" },
        { name: "David Kumar", email: "d.kumar.mississauga@example.com" },
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
        } catch (error) {
          // Skip if exists
          console.log(`Skipped ${homeownerData.email}`);
        }
      }
    }

    // Refetch homeowners
    homeowners = await prisma.user.findMany({
      where: { role: "homeowner" },
      take: 10,
    });

    const created = [];
    const errors = [];

    // Create jobs
    for (const jobTemplate of jobLeads) {
      try {
        const location = torontoLocations[Math.floor(Math.random() * torontoLocations.length)];
        const homeowner = homeowners[Math.floor(Math.random() * homeowners.length)];

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
            viewCount: Math.floor(Math.random() * 15),
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)),
          },
        });

        created.push({
          title: lead.title,
          location: location.name,
          category: lead.category,
        });
      } catch (error: any) {
        errors.push({
          job: jobTemplate.title,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created ${created.length} Toronto GTA job leads!`,
      created,
      errors: errors.length > 0 ? errors : undefined,
      stats: {
        totalCreated: created.length,
        homeowners: homeowners.length,
        locations: torontoLocations.length,
        categories: [...new Set(jobLeads.map((j) => j.category))].length,
      },
    });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
