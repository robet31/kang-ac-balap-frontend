// Quick script to fix table name in server file
// Run with: node fix_server_table_name.js

const fs = require('fs');
const path = require('path');

const filePath = './supabase/functions/server/index.tsx';

console.log('🔧 Fixing table name in server file...');
console.log('File:', filePath);

// Read file
let content = fs.readFileSync(filePath, 'utf8');

// Count occurrences before
const beforeCount = (content.match(/\.from\('jobs'\)/g) || []).length;
console.log(`\n📊 Found ${beforeCount} occurrences of .from('jobs')`);

// Replace all occurrences
content = content.replace(/\.from\('jobs'\)/g, ".from('job_orders')");

// Count occurrences after
const afterCount = (content.match(/\.from\('jobs'\)/g) || []).length;

// Write back
fs.writeFileSync(filePath, content, 'utf8');

console.log(`✅ Replaced ${beforeCount - afterCount} occurrences`);
console.log(`📊 Remaining occurrences: ${afterCount}`);

if (afterCount === 0) {
  console.log('\n🎉 SUCCESS! All table names fixed!');
} else {
  console.log('\n⚠️  Warning: Some occurrences remaining!');
}

console.log('\n✅ File updated:', filePath);
