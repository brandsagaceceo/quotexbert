const fs = require('fs');
const path = require('path');

function findRoutes(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findRoutes(full));
    else if (entry.name === 'route.ts') results.push(full);
  }
  return results;
}

const routes = findRoutes('app/api');
let fixed = 0;
for (const file of routes) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('request.url') && !content.includes('export const dynamic')) {
    const lines = content.split('\n');
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ') || lines[i].startsWith('import{')) {
        lastImportIdx = i;
      }
    }
    if (lastImportIdx >= 0) {
      lines.splice(lastImportIdx + 1, 0, '', 'export const dynamic = "force-dynamic";');
      fs.writeFileSync(file, lines.join('\n'), 'utf8');
      fixed++;
      console.log('Fixed:', file.replace(/\\/g, '/'));
    }
  }
}
console.log('\nTotal fixed:', fixed);
