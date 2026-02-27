require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedLeads() {
  try {
    console.log("🌱 Starting to seed GTA & Durham Region leads...\n");

    // First, find or create homeowners
    let homeowners = await prisma.user.findMany({
      where: { role: "homeowner" },
      take: 10
    });

    // If no homeowners exist, create sample ones
    if (homeowners.length === 0) {
      console.log("No homeowners found. Creating sample homeowners...");
      
      const homeownerData = [
        { email: "john.smith@example.com", name: "John Smith", phone: "416-555-0101" },
        { email: "sarah.johnson@example.com", name: "Sarah Johnson", phone: "416-555-0102" },
        { email: "michael.brown@example.com", name: "Michael Brown", phone: "416-555-0103" },
        { email: "emily.davis@example.com", name: "Emily Davis", phone: "416-555-0104" },
        { email: "david.wilson@example.com", name: "David Wilson", phone: "416-555-0105" },
        { email: "lisa.anderson@example.com", name: "Lisa Anderson", phone: "905-555-0106" },
        { email: "robert.taylor@example.com", name: "Robert Taylor", phone: "905-555-0107" },
        { email: "jennifer.thomas@example.com", name: "Jennifer Thomas", phone: "905-555-0108" },
        { email: "william.moore@example.com", name: "William Moore", phone: "289-555-0109" },
        { email: "amanda.martin@example.com", name: "Amanda Martin", phone: "289-555-0110" }
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

    // Comprehensive GTA & Durham Region leads - ALL PUBLISHED for contractor browsing
    const leadTemplates = [
      // TORONTO LEADS
      {
        category: "Kitchen Renovation",
        title: "Complete Kitchen Renovation - North York",
        description:
          "Complete kitchen renovation in North York. Replace cabinets, countertops, backsplash, and appliances. Approximately 10x12 kitchen. Looking for experienced contractor with portfolio.",
        budgetMin: 18000,
        budgetMax: 28000,
        zipCode: "M2N 5V7",
        city: "Toronto",
        province: "ON",
        tags: "kitchen, renovation, cabinets, countertops, appliances",
      },
      {
        category: "Bathroom Renovation",
        title: "Full Bathroom Remodel - Downtown Condo",
        description:
          "Full bathroom remodel in downtown condo. New tub, vanity, toilet, tile work, and fixtures. 8x6 bathroom. Want modern, spa-like finish.",
        budgetMin: 12000,
        budgetMax: 18000,
        zipCode: "M5V 3A8",
        city: "Toronto",
        province: "ON",
        tags: "bathroom, renovation, tile, fixtures, condo",
      },
      {
        category: "Basement Finishing",
        title: "Finish Basement - Scarborough",
        description:
          "Finish unfinished basement in Scarborough. Add bedroom, bathroom, rec room, and storage. Approximately 800 sq ft. Need proper permits and insulation.",
        budgetMin: 25000,
        budgetMax: 40000,
        zipCode: "M1P 4P5",
        city: "Toronto",
        province: "ON",
        tags: "basement, finishing, bedroom, bathroom, permits",
      },
      {
        category: "Deck Construction",
        title: "Composite Deck - Etobicoke",
        description:
          "Build 16x12 composite deck in Etobicoke backyard. Need stairs, railing, and proper drainage. Prefer Trex or similar premium materials.",
        budgetMin: 8000,
        budgetMax: 14000,
        zipCode: "M9W 5G4",
        city: "Toronto",
        province: "ON",
        tags: "deck, composite, trex, backyard, stairs",
      },
      {
        category: "Flooring",
        title: "Hardwood Flooring Installation - East York",
        description:
          "Replace carpet with hardwood throughout main floor. Approx 1,200 sq ft. Prefer engineered hardwood. House is in East York.",
        budgetMin: 6000,
        budgetMax: 10000,
        zipCode: "M4H 1C9",
        city: "Toronto",
        province: "ON",
        tags: "flooring, hardwood, engineered, carpet removal",
      },
      
      // MISSISSAUGA LEADS
      {
        category: "Roofing",
        title: "Complete Roof Replacement - Mississauga",
        description:
          "Replace entire roof on 2-storey house in Mississauga. Approximately 2,000 sq ft. Current shingles are 18 years old. Need asphalt shingles with proper ventilation.",
        budgetMin: 8000,
        budgetMax: 12000,
        zipCode: "L5B 3Y3",
        city: "Mississauga",
        province: "ON",
        tags: "roofing, shingles, replacement, ventilation",
      },
      {
        category: "Landscaping",
        title: "Backyard Landscaping - Port Credit",
        description:
          "Complete backyard landscaping in Port Credit. Sod, garden beds, interlock pathway, small retaining wall. Approximately 1,500 sq ft lot.",
        budgetMin: 12000,
        budgetMax: 18000,
        zipCode: "L5G 1H7",
        city: "Mississauga",
        province: "ON",
        tags: "landscaping, sod, interlock, retaining wall, pathway",
      },
      {
        category: "Painting",
        title: "Whole House Interior Painting - Mississauga",
        description:
          "Interior painting for entire house - 3 bedrooms, living room, kitchen, hallways. Approximately 2,200 sq ft. Looking for quality finish and quick turnaround.",
        budgetMin: 4500,
        budgetMax: 7000,
        zipCode: "L5M 5Z5",
        city: "Mississauga",
        province: "ON",
        tags: "painting, interior, whole house, quality finish",
      },

      // BRAMPTON LEADS
      {
        category: "Fencing",
        title: "Privacy Fence Installation - Brampton",
        description:
          "Install 6ft privacy fence around backyard perimeter in Brampton. Approximately 150 linear feet. Prefer cedar or vinyl. Need gates on both sides.",
        budgetMin: 5000,
        budgetMax: 8000,
        zipCode: "L6Y 4G6",
        city: "Brampton",
        province: "ON",
        tags: "fence, privacy, cedar, vinyl, gates, backyard",
      },
      {
        category: "HVAC",
        title: "Furnace Replacement - Brampton",
        description:
          "Replace old furnace and install new high-efficiency unit. House is 2,000 sq ft. Current furnace is 22 years old and inefficient. Need licensed HVAC contractor.",
        budgetMin: 4500,
        budgetMax: 7500,
        zipCode: "L6T 3J1",
        city: "Brampton",
        province: "ON",
        tags: "hvac, furnace, replacement, high-efficiency, heating",
      },

      // MARKHAM LEADS
      {
        category: "Kitchen Renovation",
        title: "Kitchen Update - Markham",
        description:
          "Modern kitchen update in Markham. New quartz countertops, backsplash, sink, and faucet. Keep existing cabinets but repaint white. Medium-sized kitchen.",
        budgetMin: 8000,
        budgetMax: 13000,
        zipCode: "L3R 5H3",
        city: "Markham",
        province: "ON",
        tags: "kitchen, countertops, quartz, backsplash, cabinet painting",
      },
      {
        category: "Electrical",
        title: "Electrical Panel Upgrade - Markham",
        description:
          "Upgrade electrical panel from 100A to 200A service. House built in 1985. Also need some outlets moved and pot lights installed in living room.",
        budgetMin: 3500,
        budgetMax: 6000,
        zipCode: "L6B 1A5",
        city: "Markham",
        province: "ON",
        tags: "electrical, panel upgrade, pot lights, electrician",
      },

      // VAUGHAN LEADS
      {
        category: "Basement Finishing",
        title: "Basement Home Theater & Gym - Vaughan",
        description:
          "Convert unfinished basement to home theater and gym. Need framing, drywall, flooring, electrical, and sound insulation. Approximately 900 sq ft.",
        budgetMin: 30000,
        budgetMax: 45000,
        zipCode: "L4L 8Y3",
        city: "Vaughan",
        province: "ON",
        tags: "basement, home theater, gym, finishing, soundproofing",
      },
      {
        category: "Windows & Doors",
        title: "Window & Door Replacement - Vaughan",
        description:
          "Replace 8 windows and front door in Vaughan home. Looking for energy-efficient vinyl windows and insulated steel door. Must meet building code.",
        budgetMin: 12000,
        budgetMax: 18000,
        zipCode: "L4H 2M9",
        city: "Vaughan",
        province: "ON",
        tags: "windows, doors, energy-efficient, vinyl, replacement",
      },

      // RICHMOND HILL LEADS
      {
        category: "Bathroom Renovation",
        title: "Master Ensuite Addition - Richmond Hill",
        description:
          "Add ensuite bathroom to master bedroom in Richmond Hill. Need full plumbing rough-in, tiling, vanity, shower. Approximately 60 sq ft space.",
        budgetMin: 20000,
        budgetMax: 30000,
        zipCode: "L4C 9T6",
        city: "Richmond Hill",
        province: "ON",
        tags: "bathroom, ensuite, addition, plumbing, tile, shower",
      },
      {
        category: "Painting",
        title: "Exterior House Painting - Richmond Hill",
        description:
          "Exterior house painting for 2-storey house. Trim, soffits, fascia, and front door. Approximately 2,800 sq ft exterior. Prefer Benjamin Moore paint.",
        budgetMin: 5000,
        budgetMax: 8500,
        zipCode: "L4B 4M4",
        city: "Richmond Hill",
        province: "ON",
        tags: "painting, exterior, house, trim, benjamin moore",
      },

      // PICKERING LEADS
      {
        category: "Plumbing",
        title: "Multiple Plumbing Repairs - Pickering",
        description:
          "Fix multiple plumbing issues - leaky basement toilet, slow kitchen drain, and water heater making noise. Need licensed plumber for inspection and repairs.",
        budgetMin: 800,
        budgetMax: 1500,
        zipCode: "L1V 6K5",
        city: "Pickering",
        province: "ON",
        tags: "plumbing, toilet, drain, water heater, repairs",
      },
      {
        category: "Flooring",
        title: "Luxury Vinyl Plank Installation - Pickering",
        description:
          "Install luxury vinyl plank flooring in main floor and upstairs hallway. Approximately 1,400 sq ft. Remove existing laminate. Looking for waterproof LVP.",
        budgetMin: 7000,
        budgetMax: 11000,
        zipCode: "L1W 3V4",
        city: "Pickering",
        province: "ON",
        tags: "flooring, luxury vinyl, lvp, waterproof, installation",
      },

      // AJAX LEADS
      {
        category: "Deck Construction",
        title: "Large Composite Deck with Pergola - Ajax",
        description:
          "Build large composite deck with pergola in Ajax. Deck is 20x16, pergola is 12x12. Need proper footings and building permit. Prefer low-maintenance materials.",
        budgetMin: 18000,
        budgetMax: 28000,
        zipCode: "L1S 7K4",
        city: "Ajax",
        province: "ON",
        tags: "deck, pergola, composite, large, footings, permit",
      },
      {
        category: "Kitchen Renovation",
        title: "1980s Kitchen Update - Ajax",
        description:
          "Update 1980s kitchen in Ajax bungalow. New cabinets, quartz counters, subway tile backsplash, sink, faucet. Keep appliances. Approximately 11x13 kitchen.",
        budgetMin: 22000,
        budgetMax: 32000,
        zipCode: "L1T 4A2",
        city: "Ajax",
        province: "ON",
        tags: "kitchen, renovation, cabinets, quartz, backsplash",
      },

      // WHITBY LEADS
      {
        category: "Roofing",
        title: "Full Roof Replacement - Whitby Bungalow",
        description:
          "Re-roof entire house in Whitby. 2,400 sq ft ranch bungalow. Replace old asphalt shingles with architectural shingles. Include new vents and flashing.",
        budgetMin: 9000,
        budgetMax: 14000,
        zipCode: "L1N 8X2",
        city: "Whitby",
        province: "ON",
        tags: "roofing, replacement, architectural shingles, bungalow",
      },
      {
        category: "Basement Finishing",
        title: "Basement with Bar Area - Whitby",
        description:
          "Finish basement with bedroom, full bath, family room, and bar area. Approximately 1,000 sq ft. Need spray foam insulation, proper egress window, and permits.",
        budgetMin: 35000,
        budgetMax: 50000,
        zipCode: "L1R 2P7",
        city: "Whitby",
        province: "ON",
        tags: "basement, finishing, bedroom, bathroom, bar, egress",
      },
      {
        category: "HVAC",
        title: "Central AC Installation - Whitby",
        description:
          "Install central air conditioning in Whitby home. House currently has forced air heating only. Need 3-ton AC unit with proper ductwork modifications.",
        budgetMin: 5500,
        budgetMax: 8500,
        zipCode: "L1N 5S4",
        city: "Whitby",
        province: "ON",
        tags: "hvac, air conditioning, ac, installation, ductwork",
      },

      // OSHAWA LEADS
      {
        category: "Siding",
        title: "Vinyl Siding Replacement - Oshawa",
        description:
          "Replace old vinyl siding on 2-storey house in Oshawa. Approximately 2,200 sq ft exterior. Want modern board & batten style vinyl. Include soffit and fascia.",
        budgetMin: 15000,
        budgetMax: 22000,
        zipCode: "L1H 7K6",
        city: "Oshawa",
        province: "ON",
        tags: "siding, vinyl, replacement, board and batten, exterior",
      },
      {
        category: "Electrical",
        title: "Knob and Tube Rewiring - Oshawa",
        description:
          "Rewire old knob and tube wiring in Oshawa century home. Full electrical upgrade needed for safety and insurance. Need licensed ESA contractor.",
        budgetMin: 12000,
        budgetMax: 18000,
        zipCode: "L1G 4S9",
        city: "Oshawa",
        province: "ON",
        tags: "electrical, rewiring, knob and tube, esa, safety",
      },
      {
        category: "Fencing",
        title: "Privacy Fence - 180ft - Oshawa",
        description:
          "Install 180 feet of 6ft privacy fence in Oshawa backyard. Prefer pressure-treated wood with black chain link on one side (neighbor's request). Need two gates.",
        budgetMin: 6500,
        budgetMax: 9500,
        zipCode: "L1J 6Z8",
        city: "Oshawa",
        province: "ON",
        tags: "fence, privacy, wood, chain link, gates, installation",
      },

      // BOWMANVILLE LEADS
      {
        category: "Kitchen Renovation",
        title: "Farmhouse Kitchen Renovation - Bowmanville",
        description:
          "Gut and renovate kitchen in Bowmanville home. New everything - cabinets, counters, flooring, appliances, lighting. 12x14 kitchen. Want farmhouse style.",
        budgetMin: 35000,
        budgetMax: 50000,
        zipCode: "L1C 3K5",
        city: "Bowmanville",
        province: "ON",
        tags: "kitchen, gut renovation, farmhouse, cabinets, appliances",
      },
      {
        category: "Bathroom Renovation",
        title: "Walk-In Shower Installation - Bowmanville",
        description:
          "Renovate outdated main bathroom in Bowmanville. Replace tub with walk-in shower, new vanity, toilet, tile floor and walls. Approximately 7x9 bathroom.",
        budgetMin: 14000,
        budgetMax: 20000,
        zipCode: "L1C 4M2",
        city: "Bowmanville",
        province: "ON",
        tags: "bathroom, renovation, walk-in shower, tile, vanity",
      },
      {
        category: "Deck Construction",
        title: "Deck Refinishing - Bowmanville",
        description:
          "Repair and refinish existing wood deck in Bowmanville. Replace rotten boards, sand, stain. Deck is 14x10. Prefer natural cedar tone stain.",
        budgetMin: 2500,
        budgetMax: 4500,
        zipCode: "L1C 1S7",
        city: "Bowmanville",
        province: "ON",
        tags: "deck, repair, refinish, stain, cedar, wood",
      },

      // COURTICE LEADS
      {
        category: "Landscaping",
        title: "Front Yard Redesign - Courtice",
        description:
          "Front yard landscaping redesign in Courtice. Remove old shrubs, add river rock garden, plant new trees and perennials. Include interlock border.",
        budgetMin: 5500,
        budgetMax: 9000,
        zipCode: "L1E 2L9",
        city: "Courtice",
        province: "ON",
        tags: "landscaping, front yard, river rock, trees, interlock",
      },
      {
        category: "Roofing",
        title: "Urgent Roof Leak Repair - Courtice",
        description:
          "Repair roof leak in Courtice. Few shingles missing after wind storm, water staining in attic. Need immediate inspection and repair before more damage.",
        budgetMin: 800,
        budgetMax: 2000,
        zipCode: "L1E 1G3",
        city: "Courtice",
        province: "ON",
        tags: "roofing, leak, repair, urgent, storm damage, shingles",
      },

      // NEWCASTLE LEADS
      {
        category: "Flooring",
        title: "Ceramic Tile Installation - Newcastle",
        description:
          "Install ceramic tile in kitchen and both bathrooms in Newcastle. Approximately 400 sq ft total. Remove existing vinyl. Want large-format modern tiles.",
        budgetMin: 5000,
        budgetMax: 8000,
        zipCode: "L1B 1M2",
        city: "Newcastle",
        province: "ON",
        tags: "flooring, ceramic tile, kitchen, bathroom, large-format",
      },

      // OAKVILLE LEADS
      {
        category: "Pool Installation",
        title: "In-Ground Pool Installation - Oakville",
        description:
          "Install in-ground vinyl pool in Oakville backyard. Looking for 16x32 pool with heater, salt system, and automatic cover. Level lot.",
        budgetMin: 45000,
        budgetMax: 65000,
        zipCode: "L6H 5R7",
        city: "Oakville",
        province: "ON",
        tags: "pool, in-ground, vinyl, heater, salt system, backyard",
      },
      {
        category: "Kitchen Renovation",
        title: "Luxury Kitchen Renovation - Oakville",
        description:
          "Luxury kitchen renovation in Oakville executive home. Custom cabinets, marble counters, high-end appliances, wine fridge. 14x18 kitchen. No budget limits.",
        budgetMin: 60000,
        budgetMax: 85000,
        zipCode: "L6M 3G5",
        city: "Oakville",
        province: "ON",
        tags: "kitchen, luxury, custom cabinets, marble, high-end",
      },

      // BURLINGTON LEADS
      {
        category: "Bathroom Renovation",
        title: "Spa Master Bath - Burlington",
        description:
          "Master bathroom renovation in Burlington. Heated floors, rain shower, soaker tub, double vanity. Approximately 10x12 bathroom. Want spa-like luxury finish.",
        budgetMin: 25000,
        budgetMax: 38000,
        zipCode: "L7R 3Y2",
        city: "Burlington",
        province: "ON",
        tags: "bathroom, luxury, heated floors, rain shower, soaker tub",
      },

      // MORE TORONTO TRADES
      {
        category: "Plumbing",
        title: "Whole Home Re-Piping - Toronto",
        description:
          "Replace old galvanized pipes with copper throughout Toronto house. Experiencing low water pressure and rusty water. Need full re-piping.",
        budgetMin: 8000,
        budgetMax: 14000,
        zipCode: "M6E 3B1",
        city: "Toronto",
        province: "ON",
        tags: "plumbing, pipes, copper, re-piping, water pressure",
      },
      {
        category: "Concrete",
        title: "New Concrete Driveway - Toronto",
        description:
          "Pour new concrete driveway in Toronto. Remove old cracked driveway. Approximately 20x40 feet. Need proper drainage slope and control joints.",
        budgetMin: 6000,
        budgetMax: 9000,
        zipCode: "M4C 1M5",
        city: "Toronto",
        province: "ON",
        tags: "concrete, driveway, replacement, drainage, masonry",
      },
      {
        category: "Garage",
        title: "Detached Garage Construction - Scarborough",
        description:
          "Build detached 20x24 garage in Scarborough backyard. Include overhead door, electrical, concrete floor. Need building permits and inspections.",
        budgetMin: 28000,
        budgetMax: 40000,
        zipCode: "M1B 5N4",
        city: "Toronto",
        province: "ON",
        tags: "garage, construction, detached, permits, concrete",
      },

      // MORE MISSISSAUGA
      {
        category: "Waterproofing",
        title: "Basement Waterproofing - Mississauga",
        description:
          "Basement waterproofing in Mississauga. Water seeping through foundation walls after heavy rain. Need interior membrane system or exterior excavation quote.",
        budgetMin: 6000,
        budgetMax: 12000,
        zipCode: "L5L 5V5",
        city: "Mississauga",
        province: "ON",
        tags: "waterproofing, basement, foundation, drainage, membrane",
      },
      {
        category: "Drywall",
        title: "Basement Drywall & Taping - Mississauga",
        description:
          "Drywall and taping for basement renovation in Mississauga. Approximately 1,200 sq ft including ceiling. Need level 4 finish for painting.",
        budgetMin: 4500,
        budgetMax: 7000,
        zipCode: "L5N 2X2",
        city: "Mississauga",
        province: "ON",
        tags: "drywall, taping, basement, level 4 finish, ceiling",
      },

      // MORE BRAMPTON
      {
        category: "Insulation",
        title: "Attic Insulation Upgrade - Brampton",
        description:
          "Blow-in attic insulation in Brampton. Current insulation is inadequate (R-12). Want to upgrade to R-50 for energy savings. Approximately 1,800 sq ft attic.",
        budgetMin: 2500,
        budgetMax: 4000,
        zipCode: "L6R 3K7",
        city: "Brampton",
        province: "ON",
        tags: "insulation, attic, blow-in, r-50, energy efficiency",
      },
      {
        category: "Plumbing",
        title: "Basement Bathroom Rough-In - Brampton",
        description:
          "Install new bathroom in Brampton basement. Need full rough-in plumbing for toilet, shower, and vanity. Connect to existing stack.",
        budgetMin: 3500,
        budgetMax: 6000,
        zipCode: "L6V 4M3",
        city: "Brampton",
        province: "ON",
        tags: "plumbing, bathroom, rough-in, basement, installation",
      },

      // MORE MARKHAM
      {
        category: "Interlocking",
        title: "Interlock Driveway & Walkway - Markham",
        description:
          "Install interlock driveway and front walkway in Markham. Remove old concrete. Approximately 600 sq ft driveway + 200 sq ft walkway. Want charcoal grey interlock.",
        budgetMin: 12000,
        budgetMax: 18000,
        zipCode: "L3S 3G7",
        city: "Markham",
        province: "ON",
        tags: "interlock, driveway, walkway, stonework, concrete removal",
      },
      {
        category: "Windows & Doors",
        title: "French Doors & Egress Windows - Markham",
        description:
          "Replace sliding patio door with French doors in Markham home. Also replace 4 basement windows with larger egress windows. Need permits for egress.",
        budgetMin: 8500,
        budgetMax: 13000,
        zipCode: "L6C 1T7",
        city: "Markham",
        province: "ON",
        tags: "doors, windows, french doors, egress, permits",
      },

      // MORE VAUGHAN
      {
        category: "Painting",
        title: "Whole House Painting - Vaughan",
        description:
          "Exterior and interior painting for entire house in Vaughan. 3,500 sq ft home. Exterior: siding, trim, doors. Interior: all rooms. Want Sherwin Williams Duration paint.",
        budgetMin: 12000,
        budgetMax: 18000,
        zipCode: "L4K 4Y6",
        city: "Vaughan",
        province: "ON",
        tags: "painting, interior, exterior, whole house, sherwin williams",
      },

      // MORE RICHMOND HILL
      {
        category: "Flooring",
        title: "White Oak Hardwood Installation - Richmond Hill",
        description:
          "Install European white oak hardwood flooring throughout main and second floor. Approximately 2,400 sq ft. Want 5-inch planks with natural finish.",
        budgetMin: 15000,
        budgetMax: 24000,
        zipCode: "L4S 1P3",
        city: "Richmond Hill",
        province: "ON",
        tags: "flooring, hardwood, white oak, european, natural finish",
      },

      // MORE AJAX
      {
        category: "Electrical",
        title: "Tesla EV Charger Installation - Ajax",
        description:
          "Install EV charger in Ajax garage for Tesla Model 3. Need 240V 50A circuit from panel to garage. Approximately 40ft run. Panel has space.",
        budgetMin: 1200,
        budgetMax: 2200,
        zipCode: "L1S 2H9",
        city: "Ajax",
        province: "ON",
        tags: "electrical, ev charger, tesla, 240v, garage",
      },
      {
        category: "Roofing",
        title: "Flat Roof Replacement - Ajax Garage",
        description:
          "Replace flat roof section over garage in Ajax. Approximately 400 sq ft. Current EPDM rubber is cracking. Want TPO membrane with 20-year warranty.",
        budgetMin: 3500,
        budgetMax: 5500,
        zipCode: "L1T 3M6",
        city: "Ajax",
        province: "ON",
        tags: "roofing, flat roof, tpo, rubber, garage, warranty",
      },

      // MORE WHITBY
      {
        category: "Plumbing",
        title: "Basement Bathroom Installation - Whitby",
        description:
          "Install roughed-in bathroom in Whitby basement. Stack is ready, need all fixtures connected. Includes toilet, shower, vanity sink. Want quality Moen fixtures.",
        budgetMin: 2800,
        budgetMax: 4500,
        zipCode: "L1N 9G4",
        city: "Whitby",
        province: "ON",
        tags: "plumbing, bathroom, fixtures, basement, moen, installation",
      },
      {
        category: "Drywall",
        title: "Drywall Patching - Whitby",
        description:
          "Patch drywall damage in Whitby home. Large holes from removed built-ins in living room and bedroom. Need professional matching finish and painting.",
        budgetMin: 800,
        budgetMax: 1500,
        zipCode: "L1R 1S6",
        city: "Whitby",
        province: "ON",
        tags: "drywall, patching, repair, taping, painting, finish",
      },

      // MORE OSHAWA
      {
        category: "Concrete",
        title: "Concrete Steps Repair - Oshawa",
        description:
          "Repair cracked and settling concrete front steps in Oshawa. Steps are pulling away from house. Need proper footings and drainage solution.",
        budgetMin: 3000,
        budgetMax: 5500,
        zipCode: "L1H 3L8",
        city: "Oshawa",
        province: "ON",
        tags: "concrete, masonry, steps, repair, footings, drainage",
      },
      {
        category: "Landscaping",
        title: "Backyard Transformation - Oshawa",
        description:
          "Backyard transformation in Oshawa. Level uneven grade, install sod, build small patio with pavers. Approximately 1,200 sq ft yard. Want low-maintenance design.",
        budgetMin: 9000,
        budgetMax: 14000,
        zipCode: "L1K 2M7",
        city: "Oshawa",
        province: "ON",
        tags: "landscaping, grading, sod, patio, pavers, backyard",
      },

      // MORE BOWMANVILLE
      {
        category: "Siding",
        title: "Storm Damage Siding Repair - Bowmanville",
        description:
          "Replace damaged siding sections after tree fell on house in Bowmanville. Need approximately 200 sq ft of matching vinyl siding. Insurance claim approved.",
        budgetMin: 2500,
        budgetMax: 4000,
        zipCode: "L1C 5A1",
        city: "Bowmanville",
        province: "ON",
        tags: "siding, repair, vinyl, storm damage, insurance, exterior",
      },
      {
        category: "HVAC",
        title: "Mini-Split AC Installation - Bowmanville",
        description:
          "Install ductless mini-split AC in Bowmanville home office addition. Need 12,000 BTU unit for 300 sq ft space. Include electrical work.",
        budgetMin: 3500,
        budgetMax: 5500,
        zipCode: "L1C 4T9",
        city: "Bowmanville",
        province: "ON",
        tags: "hvac, mini-split, ac, ductless, office, installation",
      },

      // MORE TORONTO DIVERSITY
      {
        category: "Bathroom Renovation",
        title: "Powder Room Addition - Toronto Semi",
        description:
          "Convert bedroom closet to powder room in Toronto semi-detached. Need plumbing rough-in, toilet, pedestal sink. Compact space - approximately 35 sq ft.",
        budgetMin: 8000,
        budgetMax: 13000,
        zipCode: "M6H 2S8",
        city: "Toronto",
        province: "ON",
        tags: "bathroom, powder room, addition, plumbing, compact",
      },
      {
        category: "Tile Work",
        title: "Shower Retiling - Toronto Condo",
        description:
          "Retile shower in Toronto condo bathroom. Remove old tile, waterproof properly, install new 12x24 porcelain. Approximately 80 sq ft tile area.",
        budgetMin: 3500,
        budgetMax: 6000,
        zipCode: "M5A 3Y1",
        city: "Toronto",
        province: "ON",
        tags: "tile, shower, bathroom, porcelain, waterproofing, condo",
      },
      {
        category: "Carpentry",
        title: "Custom Built-In Entertainment Unit - Toronto",
        description:
          "Build custom built-in shelving and entertainment unit in Toronto living room. 16ft wall, white painted finish. Include soft-close doors and LED lighting.",
        budgetMin: 5500,
        budgetMax: 9000,
        zipCode: "M4J 1G8",
        city: "Toronto",
        province: "ON",
        tags: "carpentry, built-in, shelving, entertainment unit, custom",
      },

      // MORE MISSISSAUGA
      {
        category: "Landscaping",
        title: "Artificial Turf Installation - Mississauga",
        description:
          "Install artificial turf in Mississauga backyard. Remove existing grass. Approximately 800 sq ft. Want pet-friendly, high-quality turf with proper drainage.",
        budgetMin: 6500,
        budgetMax: 10000,
        zipCode: "L5B 1M6",
        city: "Mississauga",
        province: "ON",
        tags: "landscaping, artificial turf, pet-friendly, drainage, backyard",
      },
      {
        category: "Windows",
        title: "Triple-Pane Window Replacement - Mississauga",
        description:
          "Replace 12 windows in Mississauga home with triple-pane vinyl. Energy Star rated required. Include installation and disposal of old windows.",
        budgetMin: 14000,
        budgetMax: 20000,
        zipCode: "L5C 2R4",
        city: "Mississauga",
        province: "ON",
        tags: "windows, triple-pane, vinyl, energy star, replacement",
      },

      // HIGH-VALUE PROJECTS
      {
        category: "Home Addition",
        title: "Second-Storey Addition - Whitby",
        description:
          "Build 400 sq ft second-storey addition in Whitby. Includes bedroom and ensuite bathroom. Need architect drawings, permits, structural engineer approval.",
        budgetMin: 80000,
        budgetMax: 120000,
        zipCode: "L1N 7B3",
        city: "Whitby",
        province: "ON",
        tags: "addition, second storey, bedroom, ensuite, permits, architect",
      },
      {
        category: "Kitchen Renovation",
        title: "Kitchen & 2 Bath Renovation - Toronto",
        description:
          "Renovate kitchen and 2 bathrooms in Toronto home. All new finishes, fixtures, cabinets. Total project. Looking for full-service general contractor.",
        budgetMin: 55000,
        budgetMax: 75000,
        zipCode: "M6S 3B2",
        city: "Toronto",
        province: "ON",
        tags: "kitchen, bathroom, renovation, complete, general contractor",
      },

      // QUICK JOBS
      {
        category: "Handyman",
        title: "Handyman Services - Various Repairs - Pickering",
        description:
          "Various small repairs in Pickering house. Fix leaky faucet, patch drywall holes, repair loose deck boards, hang TV mount. Looking for reliable handyman.",
        budgetMin: 400,
        budgetMax: 800,
        zipCode: "L1V 5B2",
        city: "Pickering",
        province: "ON",
        tags: "handyman, repairs, small jobs, faucet, drywall, deck",
      },
      {
        category: "Painting",
        title: "Powder Room Painting - Ajax",
        description:
          "Paint main floor powder room in Ajax. Small 5x5 room. Ceiling, walls, trim. Want Benjamin Moore Chantilly Lace white. Quick 1-day job.",
        budgetMin: 350,
        budgetMax: 650,
        zipCode: "L1S 6J3",
        city: "Ajax",
        province: "ON",
        tags: "painting, powder room, small job, benjamin moore, quick",
      },
      {
        category: "Electrical",
        title: "Pot Lights Installation - Courtice",
        description:
          "Install 6 pot lights in Courtice living room. Room is 14x16. Connect to existing switch. Prefer slim LED 4-inch lights. Quick job for licensed electrician.",
        budgetMin: 800,
        budgetMax: 1400,
        zipCode: "L1E 2G6",
        city: "Courtice",
        province: "ON",
        tags: "electrical, pot lights, led, living room, installation",
      },

      // DOWNTOWN CONDO PROJECTS
      {
        category: "Bathroom Renovation",
        title: "Modern Condo Bathroom - Downtown Toronto",
        description:
          "Modern condo bathroom in downtown Toronto. Small 5x7 space. Floating vanity, frameless glass shower, heated floors. High-end finishes. Building has strict rules.",
        budgetMin: 16000,
        budgetMax: 24000,
        zipCode: "M5J 2Y2",
        city: "Toronto",
        province: "ON",
        tags: "bathroom, condo, modern, heated floors, glass shower, downtown",
      },
      {
        category: "Kitchen Renovation",
        title: "Condo Kitchen Counters - King West",
        description:
          "Condo kitchen update in King West. Replace counters and backsplash only. Keep cabinets. White quartz counters, grey subway tile. Small galley kitchen.",
        budgetMin: 6000,
        budgetMax: 9500,
        zipCode: "M5V 3T9",
        city: "Toronto",
        province: "ON",
        tags: "kitchen, condo, counters, quartz, backsplash, galley",
      },

      // URGENT PROJECTS
      {
        category: "Roofing",
        title: "URGENT Roof Leak - Oshawa",
        description:
          "URGENT: Roof leak repair in Oshawa. Active leak in bedroom ceiling after rain. Need immediate tarp and proper repair. Will pay premium for quick response.",
        budgetMin: 1200,
        budgetMax: 3000,
        zipCode: "L1H 5M1",
        city: "Oshawa",
        province: "ON",
        tags: "roofing, urgent, leak, emergency, repair, quick",
      },
      {
        category: "HVAC",
        title: "Emergency Furnace Replacement - Whitby",
        description:
          "Furnace died in Whitby home. Need emergency replacement. House is 1,800 sq ft. Want 95%+ AFUE efficiency. Family with young kids - need heat ASAP.",
        budgetMin: 5000,
        budgetMax: 7500,
        zipCode: "L1N 4E2",
        city: "Whitby",
        province: "ON",
        tags: "hvac, furnace, emergency, replacement, urgent, high-efficiency",
      },

      // SPECIALTY
      {
        category: "Tile Work",
        title: "Herringbone Backsplash - Markham",
        description:
          "Install mosaic tile backsplash in Markham kitchen. Behind stove and sink. Approximately 35 sq ft. Want herringbone pattern with white subway tile.",
        budgetMin: 1200,
        budgetMax: 2200,
        zipCode: "L3P 7R2",
        city: "Markham",
        province: "ON",
        tags: "tile, backsplash, mosaic, herringbone, kitchen",
      },
      {
        category: "Masonry",
        title: "Foundation Parging - Bowmanville",
        description:
          "Repair and parget foundation in Bowmanville. Cracked parging on front and side of house. Approximately 500 sq ft. Need color-matched finish.",
        budgetMin: 2500,
        budgetMax: 4000,
        zipCode: "L1C 3A7",
        city: "Bowmanville",
        province: "ON",
        tags: "masonry, parging, foundation, repair, concrete",
      },
      {
        category: "Carpentry",
        title: "Fascia & Soffit Replacement - Pickering",
        description:
          "Replace rotted fascia and soffit on Pickering house. Approximately 120 linear feet. Use PVC trim for durability. Include proper ventilation.",
        budgetMin: 3500,
        budgetMax: 5500,
        zipCode: "L1W 2E4",
        city: "Pickering",
        province: "ON",
        tags: "carpentry, fascia, soffit, pvc, trim, ventilation",
      },

      // PREMIUM
      {
        category: "Basement Finishing",
        title: "Luxury Basement - Home Theater & Wine Cellar - Richmond Hill",
        description:
          "Luxury basement renovation in Richmond Hill. Home theater, wet bar, wine cellar, gym area. 1,400 sq ft. High-end finishes throughout. Budget flexible for quality.",
        budgetMin: 65000,
        budgetMax: 95000,
        zipCode: "L4E 4S5",
        city: "Richmond Hill",
        province: "ON",
        tags: "basement, luxury, home theater, wine cellar, gym, premium",
      },
      {
        category: "Outdoor Living",
        title: "Complete Outdoor Living Space - Oakville",
        description:
          "Build complete outdoor living space in Oakville. 20x16 composite deck, 12x12 pergola, stone fire pit, landscape lighting. Premium materials only.",
        budgetMin: 35000,
        budgetMax: 50000,
        zipCode: "L6H 6R3",
        city: "Oakville",
        province: "ON",
        tags: "outdoor living, deck, pergola, fire pit, lighting, premium",
      },

      // MAINTENANCE
      {
        category: "HVAC",
        title: "AC & Furnace Tune-Up - Mississauga",
        description:
          "Annual AC tune-up and furnace cleaning in Mississauga. System is 6 years old Carrier unit. Want preventative maintenance before summer/winter.",
        budgetMin: 250,
        budgetMax: 450,
        zipCode: "L5M 4Z5",
        city: "Mississauga",
        province: "ON",
        tags: "hvac, maintenance, tune-up, furnace, ac, carrier",
      },
      {
        category: "Plumbing",
        title: "Water Filtration System - Brampton",
        description:
          "Install whole-home water filtration system in Brampton. Want reverse osmosis under sink + whole-home softener. Need professional installation and warranty.",
        budgetMin: 2500,
        budgetMax: 4500,
        zipCode: "L6Y 5R7",
        city: "Brampton",
        province: "ON",
        tags: "plumbing, water filtration, reverse osmosis, softener, installation",
      },

      // ACCESSIBILITY
      {
        category: "Bathroom Renovation",
        title: "Accessible Walk-In Shower - Ajax",
        description:
          "Convert bathtub to walk-in shower for elderly parent in Ajax. Need grab bars, bench, low-threshold entry, slip-resistant tiles. Safety is priority.",
        budgetMin: 9000,
        budgetMax: 14000,
        zipCode: "L1S 4K2",
        city: "Ajax",
        province: "ON",
        tags: "bathroom, accessibility, walk-in shower, grab bars, safety, senior",
      },

      // HERITAGE
      {
        category: "Painting",
        title: "Victorian Home Exterior Painting - Leslieville",
        description:
          "Repaint Victorian home exterior in Leslieville. Detailed trim work, 3 accent colors. Approximately 2,400 sq ft exterior. Want heritage-appropriate colors and quality.",
        budgetMin: 9000,
        budgetMax: 14000,
        zipCode: "M4M 2Y3",
        city: "Toronto",
        province: "ON",
        tags: "painting, exterior, victorian, heritage, trim, detail",
      },
      {
        category: "Flooring",
        title: "Hardwood Refinishing - High Park",
        description:
          "Refinish original hardwood floors in High Park area home. Approximately 1,600 sq ft. Sand, stain natural, 3 coats poly. Floor is red oak.",
        budgetMin: 4500,
        budgetMax: 7000,
        zipCode: "M6P 3T7",
        city: "Toronto",
        province: "ON",
        tags: "flooring, hardwood, refinishing, sanding, staining, red oak",
      },

      // MORE DURHAM REGION
      {
        category: "Fencing",
        title: "Fence Repair - Wind Damage - Courtice",
        description:
          "Repair wind-damaged fence sections in Courtice. 3 panels blown down, 2 posts need replacing. 6ft pressure-treated fence. Match existing style.",
        budgetMin: 1200,
        budgetMax: 2000,
        zipCode: "L1E 1K8",
        city: "Courtice",
        province: "ON",
        tags: "fence, repair, wind damage, pressure-treated, panels",
      },
      {
        category: "Electrical",
        title: "Garage Workshop Electrical - Newcastle",
        description:
          "Add 4 new dedicated circuits in Newcastle garage for workshop. Need 240V for welder, 120V for tools. Upgrade subpanel if needed. Licensed electrician required.",
        budgetMin: 2200,
        budgetMax: 3800,
        zipCode: "L1B 0A3",
        city: "Newcastle",
        province: "ON",
        budgetMin: 2200,
        budgetMax: 3800,
        tags: "electrical, garage, circuits, 240v, workshop, subpanel",
      },

      // FINISHING TOUCHES
      {
        category: "Trim & Millwork",
        title: "Crown Molding Installation - Vaughan",
        description:
          "Install crown molding throughout main floor in Vaughan. Approximately 200 linear feet. Want 5.5-inch traditional profile, painted white. Professional miters required.",
        budgetMin: 2800,
        budgetMax: 4500,
        zipCode: "L4L 6C5",
        city: "Vaughan",
        province: "ON",
        tags: "trim, millwork, crown molding, carpentry, finishing",
      },
      {
        category: "Lighting",
        title: "Complete Home Lighting Upgrade - Richmond Hill",
        description:
          "Complete lighting upgrade in Richmond Hill home. Replace all fixtures with modern LED. Includes 8 ceiling lights, 4 vanity lights, 3 pendant lights over island.",
        budgetMin: 3200,
        budgetMax: 5500,
        zipCode: "L4S 2K9",
        city: "Richmond Hill",
        province: "ON",
        tags: "lighting, led, fixtures, modern, pendant, vanity",
      },

      // FOUNDATION
      {
        category: "Waterproofing",
        title: "Foundation Crack Repair - Oshawa",
        description:
          "Crack injection for hairline foundation crack in Oshawa basement. Crack is 6 feet long, starting to leak during heavy rain. Need waterproof epoxy injection.",
        budgetMin: 800,
        budgetMax: 1500,
        zipCode: "L1G 7B5",
        city: "Oshawa",
        province: "ON",
        tags: "foundation, crack injection, waterproofing, repair, basement",
      },
      {
        category: "Garage Door",
        title: "Garage Door Replacement - Bowmanville",
        description:
          "Replace old garage door with insulated 16x7 door in Bowmanville. Include new opener with WiFi. Want modern carriage-house style door in black.",
        budgetMin: 2500,
        budgetMax: 4000,
        zipCode: "L1C 2J9",
        city: "Bowmanville",
        province: "ON",
        tags: "garage door, opener, insulated, carriage-house, wifi",
      },

      // EXTERIOR
      {
        category: "Eavestroughs",
        title: "Eavestrough Replacement - Whitby",
        description:
          "Replace all eavestroughs and downspouts in Whitby. Approximately 140 linear feet. Want 5-inch aluminum seamless gutters in white. Include leaf guards.",
        budgetMin: 2200,
        budgetMax: 3500,
        zipCode: "L1R 2K4",
        city: "Whitby",
        province: "ON",
        tags: "eavestroughs, gutters, downspouts, seamless, leaf guards",
      },
      {
        category: "Soffit & Fascia",
        title: "Soffit & Fascia Repair - Ajax",
        description:
          "Replace damaged soffit and fascia on Ajax home. Squirrels caused damage. Approximately 80 linear feet. Want aluminum maintenance-free material in white.",
        budgetMin: 2800,
        budgetMax: 4200,
        zipCode: "L1T 1M8",
        city: "Ajax",
        province: "ON",
        tags: "soffit, fascia, aluminum, repair, animal damage, maintenance-free",
      },

      // ENERGY EFFICIENCY
      {
        category: "Insulation",
        title: "Basement Spray Foam - Pickering",
        description:
          "Add spray foam insulation to Pickering basement walls. Approximately 1,200 sq ft. Want closed-cell foam R-20. Preparing to finish basement afterwards.",
        budgetMin: 4500,
        budgetMax: 7000,
        zipCode: "L1V 3R2",
        city: "Pickering",
        province: "ON",
        tags: "insulation, spray foam, basement, closed-cell, r-20, energy",
      },
      {
        category: "Windows",
        title: "Glass Block Windows - Toronto Basement",
        description:
          "Replace drafty basement windows with glass block in Toronto. 6 small windows. Want frosted glass block for privacy and security. Improve energy efficiency.",
        budgetMin: 3000,
        budgetMax: 5000,
        zipCode: "M4K 2R5",
        city: "Toronto",
        province: "ON",
        tags: "windows, glass block, basement, privacy, energy efficiency",
      },

      // LUXURY
      {
        category: "Bathroom Renovation",
        title: "Custom Walk-In Shower - Vaughan",
        description:
          "Build custom walk-in shower in Vaughan master ensuite. Curbless entry, linear drain, large-format tile, rain head + hand shower. Approximately 5x6 shower.",
        budgetMin: 12000,
        budgetMax: 18000,
        zipCode: "L4H 3M7",
        city: "Vaughan",
        province: "ON",
        tags: "shower, custom, walk-in, curbless, tile, rain head, luxury",
      },
      {
        category: "Mudroom",
        title: "Mudroom from Garage - Richmond Hill",
        description:
          "Convert part of garage to mudroom in Richmond Hill. Add built-in benches, hooks, cubbies. Insulate and finish walls. Approximately 80 sq ft space.",
        budgetMin: 6000,
        budgetMax: 10000,
        zipCode: "L4C 5W8",
        city: "Richmond Hill",
        province: "ON",
        tags: "mudroom, addition, built-in, garage conversion, storage",
      },

      // FINAL
      {
        category: "Drywall",
        title: "Water Damage Drywall Repair - Mississauga",
        description:
          "Large drywall repair in Mississauga house. Water damage from old roof leak (now fixed). Family room ceiling - approximately 200 sq ft. Need texture match and painting.",
        budgetMin: 1800,
        budgetMax: 3200,
        zipCode: "L5A 3K2",
        city: "Mississauga",
        province: "ON",
        tags: "drywall, repair, water damage, ceiling, texture, painting",
      },
      {
        category: "Landscaping",
        title: "Retaining Wall & Stone Steps - Toronto Ravine",
        description:
          "Install retaining wall and stone steps in Toronto ravine lot. Addressing erosion issues. Approximately 40 feet of wall, 8 steps. Need engineered solution.",
        budgetMin: 15000,
        budgetMax: 24000,
        zipCode: "M4E 3H5",
        city: "Toronto",
        province: "ON",
        tags: "landscaping, retaining wall, stone steps, erosion, engineered",
      },
      {
        category: "General Contractor",
        title: "Whole-House Renovation - Oshawa",
        description:
          "Whole-house renovation in Oshawa. Kitchen, 3 bathrooms, flooring, paint, lighting. 2,600 sq ft home. Looking for experienced general contractor for turnkey project.",
        budgetMin: 85000,
        budgetMax: 120000,
        zipCode: "L1L 0B6",
        city: "Oshawa",
        province: "ON",
        tags: "renovation, whole house, kitchen, bathrooms, general contractor, turnkey",
      },
    ];

    // Limit to first 20 leads for more realistic demo data
    const leadsToCreate = leadTemplates.slice(0, 20);
    console.log(`Creating ${leadsToCreate.length} realistic GTA & Durham Region leads...\n`);

    let leadCount = 0;
    for (const leadTemplate of leadsToCreate) {
      // Randomly assign to a homeowner
      const homeowner = homeowners[Math.floor(Math.random() * homeowners.length)];
      
      const lead = await prisma.lead.create({
        data: {
          title: leadTemplate.title,
          description: leadTemplate.description,
          category: leadTemplate.category,
          budget: `$${leadTemplate.budgetMin.toLocaleString()} - $${leadTemplate.budgetMax.toLocaleString()}`,
          zipCode: leadTemplate.zipCode,
          status: "open",
          published: true, // All leads are published for contractors to browse
          homeownerId: homeowner.id,
          photos: "[]",
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 15 * 24 * 60 * 60 * 1000)), // Random date within last 15 days
        },
      });
      
      leadCount++;
      console.log(
        `✓ ${leadCount}/${leadsToCreate.length}: ${lead.title} - $${leadTemplate.budgetMin.toLocaleString()}-$${leadTemplate.budgetMax.toLocaleString()}`,
      );
    }

    console.log(`\n🎉 Successfully seeded ${leadCount} leads!`);
    console.log("📊 Summary:");
    console.log(`   - Total Leads: ${leadCount} (reduced from 93 for more realistic demo)`);
    console.log(`   - All Status: OPEN & PUBLISHED`);
    console.log(`   - Cities: Toronto, Mississauga, Brampton, Markham, Vaughan, Richmond Hill, Pickering, Ajax, Whitby, Oshawa`);
    console.log(`   - Categories: ${[...new Set(leadsToCreate.map(l => l.category))].length} different trades`);
    console.log(`   - Budget Range: $250 - $120,000`);
    console.log("\n✅ All leads are ready for contractors to browse on /contractor/jobs");
  } catch (error) {
    console.error("Error creating sample leads:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedLeads();
