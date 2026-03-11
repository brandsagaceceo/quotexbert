const https = require('https');

console.log('🔧 Running production migration...');
console.log('📡 Calling: https://www.quotexbert.com/api/run-migration\n');

https.get('https://www.quotexbert.com/api/run-migration', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      if (result.success) {
        console.log('✅ SUCCESS! Migration completed');
        console.log('\n📝 Now seeding jobs...\n');
        
        // Now seed the jobs
        https.get('https://www.quotexbert.com/api/seed-toronto-jobs', (seedRes) => {
          let seedData = '';
          
          seedRes.on('data', (chunk) => {
            seedData += chunk;
          });
          
          seedRes.on('end', () => {
            try {
              const seedResult = JSON.parse(seedData);
              
              if (seedResult.success) {
                console.log('✅ SUCCESS! Jobs seeded');
                console.log(`\n📊 Stats:`);
                console.log(`   - Jobs created: ${seedResult.stats.totalCreated}`);
                console.log(`   - Homeowners created: ${seedResult.stats.homeownersCreated}`);
                console.log(`\n🌐 View jobs at: https://www.quotexbert.com/dashboard-contractor`);
              } else {
                console.error('❌ Job seeding failed:', seedResult.error);
              }
            } catch (parseError) {
              console.error('❌ Parse error:', seedData);
            }
          });
        }).on('error', (error) => {
          console.error('❌ Seed request error:', error.message);
        });
        
      } else {
        console.error('❌ Migration failed:', result.error);
      }
    } catch (parseError) {
      console.error('❌ Parse error:', data);
    }
  });
}).on('error', (error) => {
  console.error('❌ Migration request error:', error.message);
});
