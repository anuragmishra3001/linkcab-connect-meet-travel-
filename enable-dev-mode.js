#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to update for development mode
const filesToUpdate = [
  'src/context/AuthContext.jsx',
  'src/services/api.js'
];

console.log('🚧 Enabling Development Mode...\n');

filesToUpdate.forEach(filePath => {
  try {
    const fullPath = path.resolve(filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Update DEV_MODE to true
    content = content.replace(
      /const DEV_MODE = false;/g,
      'const DEV_MODE = true;'
    );
    
    content = content.replace(
      /const DEV_MODE = true; \/\/ Set to true for development mode/g,
      'const DEV_MODE = true; // Set to true for development mode'
    );
    
    content = content.replace(
      /\/\/ Development mode - enable for testing without backend\s*const DEV_MODE = false;/g,
      '// Development mode - enable for testing without backend\nconst DEV_MODE = true;'
    );

    fs.writeFileSync(fullPath, content);
    console.log(`✅ Updated: ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
});

console.log('\n🎉 Development mode enabled!');
console.log('\nFeatures available:');
console.log('• Mock authentication (auto-login)');
console.log('• Mock API responses');
console.log('• Sample data for testing');
console.log('• No backend server required');
console.log('\nVisit /dev-test to see the test page');
console.log('\nTo disable development mode, run: node disable-dev-mode.js');
