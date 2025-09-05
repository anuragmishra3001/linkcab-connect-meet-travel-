#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to update for production mode
const filesToUpdate = [
  'src/context/AuthContext.jsx',
  'src/services/api.js'
];

console.log('🔒 Disabling Development Mode...\n');

filesToUpdate.forEach(filePath => {
  try {
    const fullPath = path.resolve(filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Update DEV_MODE to false
    content = content.replace(
      /const DEV_MODE = true;/g,
      'const DEV_MODE = false;'
    );
    
    content = content.replace(
      /\/\/ Development mode - enable for testing without backend\s*const DEV_MODE = true;/g,
      '// Development mode - enable for testing without backend\nconst DEV_MODE = false;'
    );

    fs.writeFileSync(fullPath, content);
    console.log(`✅ Updated: ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
});

console.log('\n🔒 Development mode disabled!');
console.log('\nThe app will now use real API endpoints.');
console.log('Make sure your backend server is running.');
console.log('\nTo enable development mode again, run: node enable-dev-mode.js');
