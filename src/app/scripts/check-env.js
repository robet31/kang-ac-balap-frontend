#!/usr/bin/env node

/**
 * Check Environment Variables Script
 * Verifies all required environment variables are set
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

const recommendedEnvVars = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_DB_URL',
];

const optionalEnvVars = [
  'NEXT_PUBLIC_APP_NAME',
  'NEXT_PUBLIC_APP_URL',
  'NODE_ENV'
];

console.log('\n🔍 Checking environment variables...\n');

let hasErrors = false;
let hasWarnings = false;

// Check required variables
console.log('📋 Required Variables:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // Mask sensitive values
    const displayValue = varName.includes('KEY') 
      ? value.substring(0, 20) + '...' 
      : value;
    console.log(`  ✅ ${varName}: ${displayValue}`);
  } else {
    console.log(`  ❌ ${varName}: MISSING!`);
    hasErrors = true;
  }
});

// Check recommended variables
console.log('\n📋 Recommended Variables (for full features):');
recommendedEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    const displayValue = varName.includes('KEY') || varName.includes('URL')
      ? value.substring(0, 20) + '...' 
      : value;
    console.log(`  ✅ ${varName}: ${displayValue}`);
  } else {
    console.log(`  ⚠️  ${varName}: Not set (some features may not work)`);
    hasWarnings = true;
  }
});

// Check optional variables
console.log('\n📋 Optional Variables:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: ${value}`);
  } else {
    console.log(`  ℹ️  ${varName}: Not set (using default)`);
  }
});

// Summary
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.log('❌ ERROR: Some required environment variables are missing!');
  console.log('\n📖 Follow these steps:');
  console.log('   1. Copy .env.example to .env.local');
  console.log('   2. Fill in your Supabase credentials');
  console.log('   3. Get credentials from: https://supabase.com/dashboard\n');
  console.log('📚 Read: SETUP_LENGKAP_PEMULA.md for detailed instructions\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  WARNING: Some recommended variables are missing');
  console.log('✅ Basic features will work, but some advanced features may not');
  console.log('🚀 You can run: npm run dev\n');
  process.exit(0);
} else {
  console.log('✅ All environment variables are properly configured!');
  console.log('🚀 You can now run: npm run dev\n');
  process.exit(0);
}