const mongoose = require('mongoose');
require('dotenv').config();

async function testCompleteStorage() {
  try {
    console.log('🔍 Testing Complete Storage Pipeline...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
    
    // Import services
    const resumeStorage = require('../services/resumeStorageEnhanced');
    console.log('✅ ResumeStorage imported');
    
    // Create proper test data structure
    const mockFile = {
      originalname: 'john-doe-test-resume.txt',
      buffer: Buffer.from('John Doe\nSoftware Developer\njohn@example.com'),
      size: 50,
      mimetype: 'text/plain'
    };
    
    const extractedText = 'John Doe\nSoftware Developer\njohn@example.com\n+1-555-0123\nExperienced developer with React and Node.js skills.';
    
    const analysisResult = {
      score: 78,
      roastFeedback: "Your resume shows good technical skills but needs more details.",
      strengths: ["Clear contact info", "Relevant skills"],
      improvements: [
        {
          priority: "high",
          title: "Add quantifiable achievements",
          description: "Include specific numbers and metrics",
          example: "Led team of 5 developers"
        }
      ],
      weaknesses: ["Lacks specific achievements", "Could be more detailed"],
      extractedInfo: {
        personalInfo: {
          name: "John Doe",
          email: "john@example.com",
          phone: "+1-555-0123",
          address: {
            full: null,
            city: null,
            state: null,
            country: null,
            zipCode: null
          },
          socialProfiles: {
            linkedin: null,
            github: null,
            portfolio: null,
            website: null,
            twitter: null
          }
        },
        skills: {
          technical: ["React", "Node.js"],
          soft: ["Leadership"],
          languages: [],
          tools: [],
          frameworks: ["React"]
        },
        experience: [],
        education: [],
        certifications: [],
        projects: [],
        awards: [],
        volunteerWork: [],
        interests: [],
        references: null
      },
      resumeAnalytics: {
        wordCount: extractedText.split(/\s+/).length,
        pageCount: 1,
        sectionCount: 3,
        bulletPointCount: 0,
        quantifiableAchievements: 0,
        actionVerbsUsed: 1,
        industryKeywords: ["React", "Node.js"],
        readabilityScore: 75,
        atsCompatibility: "Medium",
        missingElements: ["Education", "Experience"],
        strongElements: ["Contact Info", "Skills"]
      },
      contactValidation: {
        hasEmail: true,
        hasPhone: true,
        hasLinkedIn: false,
        hasAddress: false,
        emailValid: true,
        phoneValid: true,
        linkedInValid: false
      }
    };
    
    const preferences = {
      roastLevel: 'professional',
      language: 'english',
      roastType: 'constructive'
    };
    
    const metadata = {
      clientIP: '127.0.0.1',
      userAgent: 'Test-Debug-Agent',
      countryCode: 'US',
      gdprConsent: true
    };
    
    console.log('\n💾 Testing storage with proper data structure...');
    
    const storageResult = await resumeStorage.saveResumeData(
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
      error: storageResult.error,
      code: storageResult.code
    });
    
    if (storageResult.success) {
      // Verify in database
      const collection = mongoose.connection.db.collection('resumes');
      const savedDoc = await collection.findOne({ resumeId: storageResult.resumeId });
      
      if (savedDoc) {
        console.log('✅ Document found in database!');
        console.log('📋 Saved structure:');
        console.log('- resumeId:', !!savedDoc.resumeId);
        console.log('- fileInfo:', !!savedDoc.fileInfo);
        console.log('- extractedInfo:', !!savedDoc.extractedInfo);
        console.log('- analysis:', !!savedDoc.analysis);
        console.log('- timestamps:', !!savedDoc.timestamps);
        
        if (savedDoc.extractedInfo?.personalInfo) {
          console.log('👤 Personal info:');
          console.log('- name:', savedDoc.extractedInfo.personalInfo.name);
          console.log('- email:', savedDoc.extractedInfo.personalInfo.email);
        }
        
        if (savedDoc.analysis) {
          console.log('📊 Analysis:');
          console.log('- score:', savedDoc.analysis.overallScore);
          console.log('- feedback:', !!savedDoc.analysis.feedback);
        }
        
        console.log('\n🎉 SUCCESS: Complete storage pipeline working!');
        
      } else {
        console.log('❌ Document not found in database');
      }
    } else {
      console.log('❌ Storage failed:', storageResult);
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Test completed');
    
  } catch (error) {
    console.error('❌ Test failed:', {
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 5)
    });
  }
}

testCompleteStorage();