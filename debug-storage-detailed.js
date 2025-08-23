const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

async function debugStorageDetailed() {
  try {
    console.log('🔍 Debugging Storage Service in Detail...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
    
    // Check if resumeStorageEnhanced exists and what it exports
    const storagePath = path.join(__dirname, 'services', 'resumeStorageEnhanced.js');
    console.log('📁 Storage file path:', storagePath);
    console.log('📁 File exists:', require('fs').existsSync(storagePath));
    
    // Try to import and check methods
    try {
      const resumeStorage = require('../services/resumeStorageEnhanced');
      console.log('✅ ResumeStorage imported successfully');
      console.log('📋 Available methods:', Object.getOwnPropertyNames(resumeStorage).filter(name => typeof resumeStorage[name] === 'function'));
      console.log('📋 Has saveResumeData:', typeof resumeStorage.saveResumeData === 'function');
      
      // Test with minimal data first
      console.log('\n🧪 Testing with minimal data...');
      
      const minimalFile = {
        originalname: 'test.txt',
        buffer: Buffer.from('test content'),
        size: 12,
        mimetype: 'text/plain'
      };
      
      const minimalText = 'John Doe\nSoftware Developer';
      
      const minimalAnalysis = {
        score: 75,
        roastFeedback: 'Test feedback',
        strengths: ['Test strength'],
        improvements: [{ priority: 'high', title: 'Test improvement', description: 'Test desc' }],
        weaknesses: ['Test weakness']
      };
      
      const minimalPreferences = {
        roastLevel: 'professional',
        language: 'english'
      };
      
      const minimalMetadata = {
        clientIP: '127.0.0.1',
        userAgent: 'Test'
      };
      
      console.log('📝 Calling saveResumeData with minimal data...');
      
      try {
        const result = await resumeStorage.saveResumeData(
          minimalFile,
          minimalText,
          minimalAnalysis,
          minimalPreferences,
          minimalMetadata
        );
        
        console.log('💾 Minimal test result:', {
          success: result.success,
          resumeId: result.resumeId,
          error: result.error,
          message: result.message,
          code: result.code
        });
        
        if (!result.success && result.error) {
          console.log('❌ Error details:', result.error);
          console.log('📚 Error stack:', result.stack);
        }
        
      } catch (saveError) {
        console.log('❌ saveResumeData threw error:', {
          message: saveError.message,
          name: saveError.name,
          stack: saveError.stack?.split('\n').slice(0, 5).join('\n')
        });
        
        // Check if it's a validation error
        if (saveError.name === 'ValidationError') {
          console.log('📋 Validation errors:', saveError.errors);
        }
        
        // Check if it's a MongoDB connection issue
        if (saveError.name === 'MongoError' || saveError.name === 'MongooseError') {
          console.log('🔌 MongoDB connection state:', mongoose.connection.readyState);
          console.log('🔌 MongoDB connection name:', mongoose.connection.name);
        }
      }
      
    } catch (importError) {
      console.log('❌ Failed to import resumeStorage:', {
        message: importError.message,
        stack: importError.stack?.split('\n').slice(0, 3).join('\n')
      });
    }
    
    // Check MongoDB collection directly
    console.log('\n🔍 Checking MongoDB collection directly...');
    const db = mongoose.connection.db;
    const collection = db.collection('resumes');
    
    console.log('📊 Collection stats:');
    const stats = await collection.stats().catch(() => null);
    if (stats) {
      console.log('- Document count:', stats.count);
      console.log('- Collection size:', stats.size);
    } else {
      console.log('- Collection may not exist yet');
    }
    
    // Try direct insert to test MongoDB connection
    console.log('\n🧪 Testing direct MongoDB insert...');
    try {
      const testDoc = {
        testId: 'direct-test-' + Date.now(),
        createdAt: new Date(),
        testData: 'direct insert test'
      };
      
      const insertResult = await collection.insertOne(testDoc);
      console.log('✅ Direct insert successful:', insertResult.insertedId);
      
      // Clean up test document
      await collection.deleteOne({ _id: insertResult.insertedId });
      console.log('🧹 Test document cleaned up');
      
    } catch (insertError) {
      console.log('❌ Direct insert failed:', insertError.message);
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

debugStorageDetailed();