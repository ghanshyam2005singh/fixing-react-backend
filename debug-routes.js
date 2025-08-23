const fs = require('fs');
const path = require('path');

console.log('🔍 Debugging Routes...');

// Check if routes directory exists
const routesDir = path.join(__dirname, 'routes');
console.log('📁 Routes directory exists:', fs.existsSync(routesDir));

// Check if resume.js file exists
const resumeFile = path.join(__dirname, 'routes', 'resume.js');
console.log('📄 Resume routes file exists:', fs.existsSync(resumeFile));

if (fs.existsSync(resumeFile)) {
  try {
    const resumeRoutes = require('../routes/resume');
    console.log('✅ Resume routes loaded successfully');
    console.log('📋 Route type:', typeof resumeRoutes);
    console.log('📋 Route stack length:', resumeRoutes?.stack?.length || 'unknown');
  } catch (error) {
    console.log('❌ Error loading resume routes:', error.message);
  }
} else {
  console.log('❌ Resume routes file not found');
}

// List all files in routes directory
if (fs.existsSync(routesDir)) {
  const files = fs.readdirSync(routesDir);
  console.log('📂 Files in routes directory:', files);
}