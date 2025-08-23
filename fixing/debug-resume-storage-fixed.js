const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import your services
const resumeStorageEnhanced = require('../services/resumeStorageEnhanced');
const geminiService = require('../services/geminiService');

// Import fileProcessor with error handling
let fileProcessor;
try {
  fileProcessor = require('../services/fileProcessor');
  console.log('📋 FileProcessor imported successfully');
} catch (error) {
  console.log('❌ FileProcessor import failed:', error.message);
}

async function debugResumeStorageFixed() {
  try {
    console.log('🔍 Starting Resume Storage Debug (Fixed)...');
    
    // 1. Check MongoDB Connection
    console.log('📡 Checking MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
    
    // 2. Check collection before test
    const collection = mongoose.connection.db.collection('resumes');
    const beforeCount = await collection.countDocuments();
    console.log('📊 Resumes before test:', beforeCount);
    
    // 3. Create test file
    console.log('\n📄 Creating test file...');
    const testContent = `
John Doe
Senior Software Developer

Contact Information:
Email: john.doe@example.com
Phone: +1-555-0123
LinkedIn: linkedin.com/in/johndoe

Professional Summary:
Experienced software developer with 5+ years in web development.

Technical Skills:
• JavaScript, React, Node.js
• Python, Django
• MongoDB, PostgreSQL

Work Experience:
Senior Developer | Tech Corp | 2022-Present
• Led development of web applications
• Improved performance by 40%
• Mentored junior developers

Education:
BS Computer Science | State University | 2019
`;
    
    const mockFile = {
      originalname: 'john-doe-resume.txt',
      buffer: Buffer.from(testContent.trim()),
      size: Buffer.from(testContent.trim()).length,
      mimetype: 'text/plain'
    };
    
    console.log('✅ Test file created:', {
      name: mockFile.originalname,
      size: mockFile.size,
      type: mockFile.mimetype
    });
    
    // 4. Test text extraction
    console.log('\n📄 Testing text extraction...');
    let extractedText;
    
    if (fileProcessor && typeof fileProcessor.extractTextFromFile === 'function') {
      try {
        extractedText = await fileProcessor.extractTextFromFile(mockFile);
        console.log('✅ Text extracted successfully');
        console.log('📝 Length:', extractedText.length, 'characters');
        console.log('📝 Sample:', extractedText.substring(0, 150) + '...');
      } catch (extractError) {
        console.log('❌ FileProcessor extraction failed:', extractError.message);
        // Fallback to direct text extraction
        extractedText = mockFile.buffer.toString('utf8');
        console.log('⚠️ Using fallback text extraction');
      }
    } else {
      // Direct extraction for text files
      extractedText = mockFile.buffer.toString('utf8');
      console.log('⚠️ Using direct text extraction (no fileProcessor)');
    }
    
    console.log('📊 Final extracted text length:', extractedText.length);
    
    // 5. Test AI analysis
    console.log('\n🤖 Testing AI analysis...');
    const preferences = {
      roastLevel: 'professional',
      language: 'english',
      roastType: 'constructive'
    };
    
    try {
      // Check if geminiService has the method
      if (typeof geminiService.getComprehensiveAnalysis !== 'function') {
        throw new Error('getComprehensiveAnalysis method not found in geminiService');
      }
      
      const analysisResult = await geminiService.getComprehensiveAnalysis(
        extractedText,
        preferences,
        mockFile.originalname
      );
      
      console.log('✅ AI analysis completed');
      console.log('📊 Analysis result keys:', Object.keys(analysisResult || {}));
      
      if (analysisResult) {
        console.log('📊 Analysis details:');
        console.log('- score:', analysisResult.score);
        console.log('- roastFeedback length:', analysisResult.roastFeedback?.length || 0);
        console.log('- strengths count:', analysisResult.strengths?.length || 0);
        console.log('- improvements count:', analysisResult.improvements?.length || 0);
        console.log('- extractedInfo:', !!analysisResult.extractedInfo);
        console.log('- resumeAnalytics:', !!analysisResult.resumeAnalytics);
        
        // 6. Test data storage
        console.log('\n💾 Testing data storage...');
        const metadata = {
          clientIP: '127.0.0.1',
          userAgent: 'Test Agent',
          countryCode: 'US',
          gdprConsent: true
        };
        
        try {
          const storageResult = await resumeStorageEnhanced.saveResumeData(
            mockFile,
            extractedText,
            analysisResult,
            preferences,
            metadata
          );
          
          console.log('💾 Storage result:', {
            success: storageResult.success,
            resumeId: storageResult.resumeId,
            message: storageResult.message,
            error: storageResult.error
          });
          
          if (storageResult.success) {
            // 7. Verify saved data
            console.log('\n🔍 Verifying saved data...');
            const savedDoc = await collection.findOne({ resumeId: storageResult.resumeId });
            
            if (savedDoc) {
              console.log('✅ Document successfully saved to MongoDB');
              console.log('📋 Document structure verification:');
              console.log('- resumeId:', !!savedDoc.resumeId);
              console.log('- fileInfo:', !!savedDoc.fileInfo);
              console.log('- extractedInfo:', !!savedDoc.extractedInfo);
              console.log('- analysis:', !!savedDoc.analysis);
              console.log('- timestamps:', !!savedDoc.timestamps);
              
              // Check final count
              const afterCount = await collection.countDocuments();
              console.log('\n📊 Database summary:');
              console.log('- Before:', beforeCount);
              console.log('- After:', afterCount);
              console.log('- Added:', afterCount - beforeCount);
              
            } else {
              console.log('❌ Document not found after save!');
            }
          } else {
            console.log('❌ Storage failed:', storageResult.error);
          }
          
        } catch (storageError) {
          console.log('❌ Storage error:', {
            message: storageError.message,
            name: storageError.name,
            stack: storageError.stack?.split('\n').slice(0, 3).join('\n')
          });
        }
        
      } else {
        console.log('❌ AI analysis returned null/undefined');
      }
      
    } catch (aiError) {
      console.log('❌ AI analysis error:', {
        message: aiError.message,
        name: aiError.name,
        stack: aiError.stack?.split('\n').slice(0, 3).join('\n')
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

debugResumeStorageFixed();