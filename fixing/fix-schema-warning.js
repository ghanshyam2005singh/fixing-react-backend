const fs = require('fs');
const path = require('path');

const adminAuthPath = path.join(__dirname, 'services', 'adminAuth.js');
let content = fs.readFileSync(adminAuthPath, 'utf8');

// Comment out the duplicate index line
content = content.replace(/^adminSchema\.index\(\s*\{\s*email:\s*1\s*\}\s*\);/gm, '// adminSchema.index({ email: 1 }); // Removed duplicate index');

fs.writeFileSync(adminAuthPath, content);
console.log('✅ Fixed duplicate schema index warning');