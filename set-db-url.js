const { execSync } = require('child_process');

const dbUrl = 'postgresql://neondb_owner:npg_h1DmvsUPiC5G@ep-gentle-shape-ah9bdry8-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

console.log('Removing old DATABASE_URL...');
try {
  execSync('vercel env rm DATABASE_URL production --yes', { stdio: 'inherit' });
} catch (e) {
  console.log('No existing DATABASE_URL to remove');
}

console.log('Adding new DATABASE_URL...');
console.log('URL length:', dbUrl.length);
console.log('URL:', dbUrl);

// Write to temp file and pipe it
const fs = require('fs');
fs.writeFileSync('temp_db_url.txt', dbUrl, { encoding: 'utf8', flag: 'w' });

execSync('type temp_db_url.txt | vercel env add DATABASE_URL production', { stdio: 'inherit', shell: 'cmd.exe' });

fs.unlinkSync('temp_db_url.txt');

console.log('Done!');
