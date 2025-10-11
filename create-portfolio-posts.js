const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PORTFOLIO_POSTS = {
  'test-contractor-1': [ // John's Professional Plumbing
    {
      title: "Master Bathroom Pipe Upgrade",
      caption: "Replaced old galvanized pipes with modern PEX in this beautiful master bathroom! 💧✨",
      description: "Complete replumbing of master bathroom including new supply lines, drain installation, and fixture connections. Customer was dealing with low water pressure and old corroded pipes.",
      projectType: "plumbing",
      beforeImages: ["before-bathroom-pipes.jpg"],
      afterImages: ["after-bathroom-pipes.jpg", "new-fixtures.jpg"],
      projectCost: "2500-3200",
      duration: "3 days",
      materials: "PEX piping, new fixtures, copper fittings",
      location: "Bellevue, WA",
      clientStory: "The Johnsons were so happy with the improved water pressure! They said it felt like a whole new bathroom.",
      tags: ["plumbing", "bathroom", "pipes", "renovation"],
      isPublic: true,
      isPinned: true
    },
    {
      title: "Kitchen Sink & Garbage Disposal Install",
      caption: "New farmhouse sink and disposal installation in this gorgeous kitchen renovation! 🏠",
      description: "Installed new undermount farmhouse sink with garbage disposal. Had to modify plumbing to accommodate the deeper basin and added new electrical for the disposal.",
      projectType: "plumbing",
      beforeImages: ["old-kitchen-sink.jpg"],
      afterImages: ["new-farmhouse-sink.jpg"],
      projectCost: "800-1200",
      duration: "1 day",
      materials: "Undermount sink, garbage disposal, new drain assembly",
      location: "Seattle, WA",
      clientStory: "Perfect timing! They were doing a full kitchen remodel and needed everything to work perfectly. Mission accomplished!",
      tags: ["kitchen", "sink", "disposal", "install"],
      isPublic: true,
      isPinned: false
    },
    {
      title: "Water Heater Replacement",
      caption: "Out with the old, in with the new! Upgraded this family to a high-efficiency tankless system 🔥",
      description: "Replaced 15-year-old tank water heater with new tankless unit. Included gas line upgrade and new venting system for optimal performance.",
      projectType: "plumbing",
      beforeImages: ["old-tank-heater.jpg"],
      afterImages: ["new-tankless-heater.jpg"],
      projectCost: "3500-4500",
      duration: "1 day",
      materials: "Tankless water heater, new gas line, venting materials",
      location: "Redmond, WA",
      clientStory: "They love having unlimited hot water and the energy savings are already showing on their bills!",
      tags: ["water-heater", "tankless", "energy-efficient"],
      isPublic: true,
      isPinned: false
    }
  ],
  
  'test-contractor-2': [ // ElectricWorks Pro
    {
      title: "Smart Home Electrical Upgrade",
      caption: "Brought this 1980s home into the 21st century with a complete smart home setup! ⚡🏡",
      description: "Full electrical panel upgrade and smart home integration including smart switches, outlets, and whole-home automation system.",
      projectType: "electrical",
      beforeImages: ["old-electrical-panel.jpg"],
      afterImages: ["new-smart-panel.jpg", "smart-switches.jpg"],
      projectCost: "4500-6000",
      duration: "2 days",
      materials: "200A panel, smart switches, automation hub, new circuits",
      location: "Kirkland, WA",
      clientStory: "They can now control their entire home from their phone! The kids love showing off the voice-controlled lights to friends.",
      tags: ["smart-home", "electrical", "automation", "upgrade"],
      isPublic: true,
      isPinned: true
    },
    {
      title: "Outdoor Lighting & Landscape Electrical",
      caption: "Transformed this backyard into an evening oasis with beautiful landscape lighting! 🌙✨",
      description: "Installed low-voltage landscape lighting system with pathway lights, uplights for trees, and deck accent lighting. All weatherproof and timer-controlled.",
      projectType: "electrical",
      beforeImages: ["dark-backyard.jpg"],
      afterImages: ["lit-pathways.jpg", "tree-uplighting.jpg"],
      projectCost: "1800-2500",
      duration: "2 days",
      materials: "Low-voltage transformer, LED pathway lights, tree uplights, buried cable",
      location: "Bellevue, WA",
      clientStory: "Now they actually use their backyard in the evenings! Perfect for entertaining and adds great curb appeal.",
      tags: ["landscape", "lighting", "outdoor", "LED"],
      isPublic: true,
      isPinned: false
    },
    {
      title: "Kitchen Electrical Renovation",
      caption: "Rewired this kitchen for modern living - more outlets, under-cabinet lighting, and proper GFCI protection! 👨‍🍳",
      description: "Complete kitchen electrical renovation including new circuits for appliances, under-cabinet LED lighting, and upgraded outlet placement for modern cooking needs.",
      projectType: "electrical",
      beforeImages: ["old-kitchen-electrical.jpg"],
      afterImages: ["new-kitchen-outlets.jpg", "under-cabinet-lights.jpg"],
      projectCost: "2200-3000",
      duration: "2 days",
      materials: "GFCI outlets, under-cabinet LED strips, new circuits, electrical boxes",
      location: "Seattle, WA",
      clientStory: "No more extension cords on the counters! They finally have enough outlets for all their appliances.",
      tags: ["kitchen", "GFCI", "under-cabinet", "renovation"],
      isPublic: true,
      isPinned: false
    }
  ],
  
  'test-contractor-3': [ // PaintMaster Solutions
    {
      title: "Victorian Home Exterior Restoration",
      caption: "Brought this beautiful Victorian back to its former glory! 6 weeks of detailed restoration work 🎨🏠",
      description: "Complete exterior paint restoration of 1920s Victorian home. Included extensive prep work, wood repair, primer, and multi-coat paint system with period-appropriate colors.",
      projectType: "painting",
      beforeImages: ["victorian-before.jpg"],
      afterImages: ["victorian-after.jpg", "detail-work.jpg"],
      projectCost: "12000-15000",
      duration: "6 weeks",
      materials: "Premium exterior paint, wood filler, primer, brushes, scaffolding",
      location: "Capitol Hill, Seattle",
      clientStory: "The neighbors keep stopping by to compliment the transformation! It's like having a brand new historic home.",
      tags: ["exterior", "victorian", "restoration", "historic"],
      isPublic: true,
      isPinned: true
    },
    {
      title: "Modern Living Room Feature Wall",
      caption: "Created this stunning accent wall with geometric patterns and bold colors! 🎨✨",
      description: "Designed and painted custom geometric accent wall in modern living room. Used painter's tape for crisp lines and premium paint for rich color saturation.",
      projectType: "painting",
      beforeImages: ["plain-living-room.jpg"],
      afterImages: ["geometric-accent-wall.jpg"],
      projectCost: "800-1200",
      duration: "3 days",
      materials: "Premium interior paint, painter's tape, rollers, brushes",
      location: "Bellevue, WA",
      clientStory: "It's become the focal point of their home! Everyone who visits asks about the amazing wall design.",
      tags: ["interior", "accent-wall", "geometric", "modern"],
      isPublic: true,
      isPinned: false
    },
    {
      title: "Whole House Interior Refresh",
      caption: "5 bedrooms, 3 baths, and all common areas - transformed this family home in just 2 weeks! 🏡",
      description: "Complete interior painting of 3,200 sq ft home. Color consultation, premium paint selection, and meticulous attention to detail throughout.",
      projectType: "painting",
      beforeImages: ["house-before-interior.jpg"],
      afterImages: ["house-after-interior.jpg", "master-bedroom.jpg", "kids-room.jpg"],
      projectCost: "6500-8500",
      duration: "2 weeks",
      materials: "Premium interior paint, primers, brushes, rollers, drop cloths",
      location: "Redmond, WA",
      clientStory: "It feels like a completely different house! The colors are perfect and the quality is outstanding.",
      tags: ["interior", "whole-house", "family-home", "refresh"],
      isPublic: true,
      isPinned: false
    }
  ]
};

async function createPortfolioPosts() {
  try {
    console.log('Creating portfolio posts for test contractors...');
    
    let totalPostsCreated = 0;

    for (const [contractorUserId, posts] of Object.entries(PORTFOLIO_POSTS)) {
      console.log(`\nCreating posts for contractor: ${contractorUserId}`);
      
      // Get contractor profile
      const contractorProfile = await prisma.contractorProfile.findUnique({
        where: { userId: contractorUserId }
      });

      if (!contractorProfile) {
        console.log(`  ❌ Contractor profile not found for ${contractorUserId}`);
        continue;
      }

      for (const post of posts) {
        try {
          const portfolioItem = await prisma.portfolioItem.create({
            data: {
              contractorId: contractorProfile.id,
              title: post.title,
              caption: post.caption,
              description: post.description || null,
              projectType: post.projectType,
              beforeImages: JSON.stringify(post.beforeImages || []),
              afterImages: JSON.stringify(post.afterImages || []),
              projectCost: post.projectCost || null,
              duration: post.duration || null,
              materials: post.materials || null,
              location: post.location || null,
              clientStory: post.clientStory || null,
              tags: JSON.stringify(post.tags || []),
              isPublic: post.isPublic !== undefined ? post.isPublic : true,
              isPinned: post.isPinned !== undefined ? post.isPinned : false,
            }
          });

          console.log(`  ✅ Created: ${portfolioItem.title}`);
          totalPostsCreated++;
        } catch (error) {
          console.log(`  ❌ Failed to create post: ${post.title} - ${error.message}`);
        }
      }
    }

    console.log(`\n🎉 Successfully created ${totalPostsCreated} portfolio posts!`);
    console.log('Portfolio posts are now available at: http://localhost:3000/contractor/portfolio');

  } catch (error) {
    console.error('Error creating portfolio posts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createPortfolioPosts();