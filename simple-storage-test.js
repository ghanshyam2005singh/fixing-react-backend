const mongoose = require('mongoose');
require('dotenv').config();

async function simpleStorageTest() {
  try {
    console.log('🔍 Simple Storage Test...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
    
    // Clear require cache
    const storagePath = require.resolve('./services/resumeStorageEnhanced');
    delete require.cache[storagePath];
    
    // Import storage service
    const resumeStorage = require('../services/resumeStorageEnhanced');
    console.log('✅ Storage service imported');
    
    // Simple test data
    const testFile = {
      originalname: 'simple-test.txt',
      buffer: Buffer.from('John Doe\nDeveloper\njohn@example.com'),
      size: 30,
      mimetype: 'text/plain'
    };
    
    const extractedText = 'John Doe\nDeveloper\njohn@example.com\n+1-555-0123';
    
    const analysisResult = {
      score: 75,
      roastFeedback: 'Good resume, needs improvement',
      strengths: ['Clear contact info'],
      weaknesses: ['Needs more details'],
      improvements: [{
        priority: 'high',
        title: 'Add more details',
        description: 'Expand experience section'
      }]
    };
    
    const preferences = {
      roastLevel: 'professional',
      language: 'english'
    };
    
    console.log('\n💾 Testing storage...');
    
    const result = await resumeStorage.saveResumeData(
      testFile,
      extractedText,
      analysisResult,
      preferences
    );
    
    console.log('💾 Result:', {
      success: result.success,
      resumeId: result.resumeId,
      error: result.error
    });
    
    if (result.success) {
      console.log('✅ Storage working!');
      
      // Verify
      const Resume = require('../models/Resume');
      const doc = await Resume.findOne({ resumeId: result.resumeId });
      
      if (doc) {
        console.log('✅ Document found in database');
        console.log('📋 Basic info:');
        console.log('- ID:', doc.resumeId);
        console.log('- Score:', doc.analysis.overallScore);
        console.log('- Name:', doc.extractedInfo.personalInfo.name);
        
        // Clean up
        await Resume.deleteOne({ resumeId: result.resumeId });
        console.log('🧹 Cleaned up');
        
        console.log('\n🎉 SUCCESS: Storage is working!');
      }
    } else {
      console.log('❌ Storage failed:', result.error);
    }
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

simpleStorageTest();