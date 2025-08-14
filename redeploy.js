/**
 * Redeploy Helper Script for LinkCab
 * 
 * This script helps rebuild the project with updated configuration
 * 
 * Usage: node redeploy.js
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Starting rebuild process for Vercel deployment...');

// Ensure environment variables are correctly set
console.log('✅ Checking environment variables...');
const envContent = fs.readFileSync('.env', 'utf8');
if (!envContent.includes('VITE_API_URL=https://')) {
  console.log('⚠️ Warning: VITE_API_URL may not be set correctly for production');
}

// Clean build artifacts
console.log('🧹 Cleaning previous build...');
try {
  if (fs.existsSync('./dist')) {
    fs.rmSync('./dist', { recursive: true, force: true });
  }
  console.log('✅ Previous build cleaned successfully');
} catch (error) {
  console.error('❌ Error cleaning previous build:', error.message);
}

// Rebuild the project
console.log('🔨 Rebuilding project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Project rebuilt successfully');
} catch (error) {
  console.error('❌ Error rebuilding project:', error.message);
  process.exit(1);
}

console.log('\n🎉 Rebuild complete! You can now redeploy to Vercel with:');
console.log('   - Push changes to your GitHub repository');
console.log('   - Or manually redeploy from the Vercel dashboard');