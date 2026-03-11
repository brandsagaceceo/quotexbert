/**
 * Seed Production Job Board
 * This script calls your production API to populate the job board with 30 realistic jobs
 */

const https = require('https');

const PRODUCTION_URL = 'https://www.quotexbert.com/api/seed-toronto-jobs';

console.log('🚀 Seeding production job board...');
console.log(`📡 Calling: ${PRODUCTION_URL}\n`);

https.get(PRODUCTION_URL, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      if (result.success) {
        console.log('✅ SUCCESS! Job board seeded!\n');
        console.log(`📊 Created ${result.stats.totalCreated} jobs`);
        console.log(`👥 Using ${result.stats.homeowners} homeowners`);
        console.log(`📍 Across ${result.stats.locations} GTA locations`);
        console.log(`📋 In ${result.stats.categories} categories\n`);
        
        if (result.created && result.created.length > 0) {
          console.log('Sample jobs created:');
          result.created.slice(0, 5).forEach((job, i) => {
            console.log(`  ${i + 1}. ${job.title.substring(0, 50)}... → ${job.location}`);
          });
          if (result.created.length > 5) {
            console.log(`  ... and ${result.created.length - 5} more!`);
          }
        }
        
        console.log('\n🎉 Job board is now live! Contractors can browse and apply!');
        console.log('🔗 View jobs at: https://www.quotexbert.com/contractor/jobs\n');
      } else {
        console.error('❌ Failed:', result.error || 'Unknown error');
        if (result.errors) {
          console.error('Errors:', result.errors);
        }
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error.message);
      console.log('Response:', data);
    }
  });
}).on('error', (error) => {
  console.error('❌ Network error:', error.message);
  console.log('\nMake sure:');
  console.log('  1. Your site is deployed at https://www.quotexbert.com');
  console.log('  2. The /api/seed-toronto-jobs endpoint is accessible');
  console.log('  3. You have internet connection\n');
});
