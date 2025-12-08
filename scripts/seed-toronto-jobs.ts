import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Real Toronto area postal codes by neighborhood
const torontoPostalCodes = [
  // Downtown Toronto
  'M5A 1A1', 'M5B 2K3', 'M5C 1C4', 'M5E 1E5', 'M5G 1R8', 'M5H 3S5', 'M5J 2R8', 'M5K 1B7',
  // North York
  'M2J 4W5', 'M2K 2X1', 'M2M 3G7', 'M2N 5N7', 'M2P 1M2', 'M2R 3N2',
  // Scarborough
  'M1B 3B6', 'M1C 4A5', 'M1E 4X2', 'M1G 3S7', 'M1H 2W5', 'M1J 2H9', 'M1K 4L3', 'M1L 4M1',
  // Etobicoke
  'M8V 1A1', 'M8W 2X8', 'M8X 2Y8', 'M8Y 1M9', 'M8Z 5G1', 'M9A 1C2', 'M9B 4C1', 'M9C 1B1',
  // East York
  'M4B 1B5', 'M4C 1M2', 'M4E 3S8', 'M4G 1V9', 'M4H 1E1', 'M4J 1M5', 'M4K 1N2', 'M4L 3P1',
  // Whitby
  'L1M 1A1', 'L1N 8Z2', 'L1P 1R7', 'L1R 0A3',
  // Pickering
  'L1V 1A1', 'L1W 3W9', 'L1X 2S5',
  // Ajax
  'L1S 1A1', 'L1T 4A3', 'L1Z 1G3',
  // Oshawa
  'L1G 1A1', 'L1H 7K4', 'L1J 5Y1', 'L1K 0C7',
  // Mississauga
  'L4T 1A1', 'L4W 1N2', 'L4X 2G7', 'L4Y 1H7', 'L4Z 1V9', 'L5A 2S6', 'L5B 3Y3',
  // Vaughan
  'L4H 0A1', 'L4J 8E4', 'L4K 1A3', 'L4L 8B3', 'L6A 1A3',
  // Markham
  'L3P 1A1', 'L3R 9W6', 'L3S 3K4', 'L3T 7X7', 'L6B 0A1', 'L6C 1G4', 'L6E 1M7',
  // Richmond Hill
  'L4B 1A1', 'L4C 6M6', 'L4E 0T1', 'L4S 0A1',
  // Brampton
  'L6P 1A1', 'L6R 0H1', 'L6S 0C5', 'L6T 3S4', 'L6V 1A1', 'L6W 1S5', 'L6X 0W6', 'L6Y 0K9', 'L6Z 1C8', 'L7A 0A1'
];

const torontoCities = [
  'Toronto', 'North York', 'Scarborough', 'Etobicoke', 'East York',
  'Whitby', 'Oshawa', 'Ajax', 'Pickering',
  'Mississauga', 'Brampton', 'Vaughan', 'Markham', 'Richmond Hill'
];

const contractorCompanies = [
  { name: 'Elite Home Renovations', trade: 'General Contractor', bio: 'Full-service renovation specialists serving the GTA for over 15 years. Licensed and insured.' },
  { name: 'ProBuild Construction', trade: 'General Contractor', bio: 'Award-winning construction company focused on quality craftsmanship and customer satisfaction.' },
  { name: 'Toronto Plumbing Pros', trade: 'Plumbing', bio: 'Master plumbers available 24/7 for all your plumbing needs. Emergency service available.' },
  { name: 'ElectriTech Solutions', trade: 'Electrical', bio: 'Licensed electricians specializing in residential and commercial electrical work.' },
  { name: 'Perfect Paint Co', trade: 'Painting', bio: 'Professional painters delivering flawless finishes on every project.' },
  { name: 'Apex Roofing Toronto', trade: 'Roofing', bio: 'Certified roofing contractors with 20+ years experience. Free estimates.' },
  { name: 'GTA Flooring Masters', trade: 'Flooring', bio: 'Hardwood, tile, and laminate installation experts. Quality work guaranteed.' },
  { name: 'Basement Builders Plus', trade: 'Basement Finishing', bio: 'Transform your basement into beautiful living space. Specialists in waterproofing.' },
  { name: 'Kitchen Kreations', trade: 'Kitchen Renovation', bio: 'Custom kitchen design and installation. From cabinets to countertops.' },
  { name: 'Bath Innovations GTA', trade: 'Bathroom Renovation', bio: 'Modern bathroom renovations that increase your home value.' },
  { name: 'DeckMaster Outdoor Living', trade: 'Decking', bio: 'Custom deck design and construction. Cedar, composite, and pressure-treated options.' },
  { name: 'Fence Craft Toronto', trade: 'Fencing', bio: 'Quality fencing solutions for residential and commercial properties.' },
  { name: 'Climate Control HVAC', trade: 'HVAC', bio: 'Heating and cooling experts. Installation, repair, and maintenance.' },
  { name: 'Drywall Dynamics', trade: 'Drywall', bio: 'Professional drywall installation and finishing. Smooth walls every time.' },
  { name: 'Tile Artisans', trade: 'Tiling', bio: 'Expert tile installation for kitchens, bathrooms, and floors.' },
];

const jobTypes = [
  { type: 'Basement Renovation', description: 'Complete basement finishing with new flooring, drywall, lighting, and bathroom', budget: '$25,000 - $50,000' },
  { type: 'Kitchen Remodel', description: 'Full kitchen renovation including new cabinets, countertops, backsplash, and appliances', budget: '$30,000 - $60,000' },
  { type: 'Bathroom Renovation', description: 'Complete bathroom remodel with new fixtures, tiling, vanity, and lighting', budget: '$15,000 - $30,000' },
  { type: 'Deck Construction', description: 'Build new outdoor deck with composite decking and modern railing system', budget: '$10,000 - $20,000' },
  { type: 'Roof Replacement', description: 'Replace aging roof with new architectural shingles, including ventilation upgrade', budget: '$8,000 - $15,000' },
  { type: 'Fence Installation', description: 'Install privacy fence around backyard perimeter, cedar or vinyl options', budget: '$5,000 - $10,000' },
  { type: 'Flooring Replacement', description: 'Remove old flooring and install new hardwood or laminate throughout main floor', budget: '$8,000 - $18,000' },
  { type: 'Plumbing Repair', description: 'Fix leaking pipes, replace fixtures, and upgrade water heater', budget: '$2,000 - $5,000' },
  { type: 'Electrical Upgrade', description: 'Upgrade electrical panel, add new outlets, and install pot lights', budget: '$3,000 - $8,000' },
  { type: 'Interior Painting', description: 'Professional painting of all interior rooms including trim and ceilings', budget: '$4,000 - $10,000' },
  { type: 'Exterior Siding', description: 'Replace old siding with new vinyl or fiber cement siding', budget: '$12,000 - $25,000' },
  { type: 'Window Replacement', description: 'Replace old windows with energy-efficient double or triple-pane windows', budget: '$8,000 - $16,000' },
  { type: 'HVAC Installation', description: 'Install new high-efficiency furnace and air conditioning system', budget: '$6,000 - $12,000' },
  { type: 'Driveway Paving', description: 'Remove old driveway and install new asphalt or concrete surface', budget: '$4,000 - $10,000' },
  { type: 'Garage Door Replacement', description: 'Replace old garage door with new insulated door and modern opener', budget: '$2,500 - $5,000' },
];

async function seedTorontoJobs() {
  console.log('🌱 Starting Toronto jobs seed...');

  // Create contractor users
  const contractors = [];
  for (let i = 0; i < contractorCompanies.length; i++) {
    const company = contractorCompanies[i];
    const city = torontoCities[i % torontoCities.length];
    
    const contractor = await prisma.user.create({
      data: {
        id: `contractor_${i + 1}`,
        email: `${company.name.toLowerCase().replace(/\s+/g, '_')}@example.com`,
        name: company.name,
        role: 'contractor',
        contractorProfile: {
          create: {
            companyName: company.name,
            trade: company.trade,
            bio: company.bio,
            city: city,
            serviceRadiusKm: 50,
            phone: `(416) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
            verified: true,
            isActive: true,
            avgRating: 4.5 + Math.random() * 0.5, // 4.5 to 5.0
          }
        }
      }
    });
    
    contractors.push(contractor);
    console.log(`✅ Created contractor: ${company.name}`);
  }

  // Create homeowner users and jobs
  for (let i = 0; i < 50; i++) {
    const jobType = jobTypes[i % jobTypes.length];
    const postalCode = torontoPostalCodes[i % torontoPostalCodes.length];
    const city = torontoCities[i % torontoCities.length];
    
    const homeowner = await prisma.user.create({
      data: {
        id: `homeowner_${i + 1}`,
        email: `homeowner${i + 1}@example.com`,
        name: `Homeowner ${i + 1}`,
        role: 'homeowner',
        homeownerProfile: {
          create: {
            name: `Homeowner ${i + 1}`,
            city: city,
            phone: `(647) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
          }
        },
        leads: {
          create: {
            title: jobType.type,
            description: jobType.description,
            category: jobType.type,
            budget: jobType.budget,
            city: city,
            postalCode: postalCode,
            timeline: ['Within 1 month', 'Within 3 months', 'Flexible'][Math.floor(Math.random() * 3)],
            status: ['OPEN', 'PENDING', 'ACCEPTED'][Math.floor(Math.random() * 3)],
            urgency: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
            propertyType: ['house', 'condo', 'townhouse'][Math.floor(Math.random() * 3)],
          }
        }
      },
      include: {
        leads: true
      }
    });
    
    console.log(`✅ Created job #${i + 1}: ${jobType.type} in ${city} (${postalCode})`);
  }

  console.log('\n🎉 Toronto jobs seed completed!');
  console.log(`   - ${contractors.length} contractors created`);
  console.log(`   - 50 jobs created across GTA`);
}

seedTorontoJobs()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
