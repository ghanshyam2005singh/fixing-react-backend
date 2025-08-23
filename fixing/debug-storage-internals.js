const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

async function debugStorageInternals() {
  try {
    console.log('🔍 Debugging Storage Service Internals...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
    
    // First, let's check what the storage service actually looks like
    const storagePath = path.join(__dirname, 'services', 'resumeStorageEnhanced.js');
    const storageContent = fs.readFileSync(storagePath, 'utf8');
    
    console.log('📁 Storage service structure:');
    
    // Look for the saveResumeData function
    const saveResumeDataMatch = storageContent.match(/saveResumeData[\s\S]*?(?=^[a-zA-Z_]|\nexports|\nmodule.exports|$)/m);
    if (saveResumeDataMatch) {
      console.log('✅ Found saveResumeData function');
      console.log('📝 Function length:', saveResumeDataMatch[0].length, 'characters');
      
      // Check for try-catch blocks
      const hasTryCatch = saveResumeDataMatch[0].includes('try') && saveResumeDataMatch[0].includes('catch');
      console.log('🔧 Has try-catch:', hasTryCatch);
      
      // Check for error logging
      const hasErrorLogging = saveResumeDataMatch[0].includes('logger') || saveResumeDataMatch[0].includes('console.log');
      console.log('📝 Has error logging:', hasErrorLogging);
    } else {
      console.log('❌ saveResumeData function not found in expected format');
    }
    
    // Check if the Resume model is being imported correctly
    const hasResumeImport = storageContent.includes('require') && (storageContent.includes('Resume') || storageContent.includes('resume'));
    console.log('📦 Has Resume model import:', hasResumeImport);
    
    // Try to manually load the Resume model and test it
    console.log('\n🧪 Testing Resume model directly...');
    
    try {
      // First update the schema
      console.log('📝 Updating Resume schema...');
      require('../fix-resume-schema.js');
      
      // Clear require cache to get updated model
      const resumeModelPath = path.resolve(__dirname, 'models', 'Resume.js');
      delete require.cache[resumeModelPath];
      
      // Import the Resume model
      const Resume = require('../models/Resume.js');
      console.log('✅ Resume model imported successfully');
      console.log('📋 Resume model name:', Resume.modelName);
      console.log('📋 Resume collection name:', Resume.collection.name);
      
      // Test creating a resume document
      console.log('\n🧪 Testing Resume model creation...');
      
      const testResumeData = {
        resumeId: 'test-' + Date.now(),
        fileInfo: {
          fileName: 'test-resume.txt',
          originalFileName: 'test-resume.txt',
          fileSize: 100,
          mimeType: 'text/plain',
          fileHash: 'test-hash'
        },
        extractedInfo: {
          personalInfo: {
            name: 'Test User',
            email: 'test@example.com',
            phone: '+1234567890'
          },
          skills: {
            technical: ['JavaScript'],
            soft: ['Communication']
          }
        },
        analysis: {
          overallScore: 75,
          feedback: 'Good resume with room for improvement',
          strengths: ['Clear contact info'],
          weaknesses: ['Needs more details'],
          improvements: [{
            priority: 'high',
            title: 'Add more details',
            description: 'Expand on your experience'
          }]
        },
        preferences: {
          roastLevel: 'professional',
          language: 'english'
        },
        timestamps: {
          uploadedAt: new Date()
        }
      };
      
      const testResume = new Resume(testResumeData);
      
      // Validate without saving
      const validationError = testResume.validateSync();
      if (validationError) {
        console.log('❌ Validation failed:', validationError.message);
        console.log('📋 Validation errors:', Object.keys(validationError.errors));
        
        for (const [field, error] of Object.entries(validationError.errors)) {
          console.log(`- ${field}: ${error.message}`);
        }
      } else {
        console.log('✅ Resume model validation passed');
        
        // Try to save
        try {
          const savedResume = await testResume.save();
          console.log('✅ Resume saved successfully:', savedResume.resumeId);
          
          // Clean up
          await Resume.deleteOne({ resumeId: savedResume.resumeId });
          console.log('🧹 Test resume cleaned up');
          
        } catch (saveError) {
          console.log('❌ Save failed:', {
            message: saveError.message,
            name: saveError.name,
            code: saveError.code
          });
        }
      }
      
    } catch (modelError) {
      console.log('❌ Resume model test failed:', {
        message: modelError.message,
        stack: modelError.stack?.split('\n').slice(0, 3).join('\n')
      });
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Debug completed');
    
  } catch (error) {
    console.error('❌ Debug failed:', {
      message: error.message,
      name: error.name,
      stack: error.stack?.split('\n').slice(0, 5).join('\n')
    });
  }
}

debugStorageInternals();