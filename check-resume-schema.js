const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

function checkResumeSchema() {
  console.log('🔍 Checking Resume Schema...');
  
  // Look for schema files
  const possiblePaths = [
    './models/Resume.js',
    './models/resume.js',
    './schemas/Resume.js',
    './schemas/resume.js',
    './services/resumeStorageEnhanced.js'
  ];
  
  for (const schemaPath of possiblePaths) {
    const fullPath = path.join(__dirname, schemaPath);
    if (fs.existsSync(fullPath)) {
      console.log('📁 Found file:', schemaPath);
      
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check for schema definition
      if (content.includes('mongoose.Schema') || content.includes('new Schema')) {
        console.log('✅ Contains mongoose schema');
        
        // Extract schema fields
        const schemaMatch = content.match(/new\s+(?:mongoose\.)?Schema\s*\(\s*{([\s\S]*?)}\s*(?:,|\))/);
        if (schemaMatch) {
          console.log('📋 Schema structure found');
          const schemaContent = schemaMatch[1];
          
          // Check for required fields
          const requiredFields = ['resumeId', 'fileInfo', 'extractedInfo', 'analysis', 'timestamps'];
          console.log('🔍 Checking required fields:');
          
          requiredFields.forEach(field => {
            const hasField = schemaContent.includes(field);
            console.log(`- ${field}: ${hasField ? '✅' : '❌'}`);
          });
        }
      }
      
      // Check for model export
      if (content.includes('mongoose.model') || content.includes('model(')) {
        console.log('✅ Contains model definition');
      }
      
      console.log('');
    }
  }
  
  // Check if models are already registered
  console.log('🔍 Registered mongoose models:', Object.keys(mongoose.models));
}

checkResumeSchema();