const mongoose = require('mongoose');
require('dotenv').config();

async function testFixedStorage() {
  try {
    console.log('🔍 Testing Fixed Storage Service...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
    
    // Clear require cache to get the updated service
    const storagePath = require.resolve('./services/resumeStorageEnhanced');
    delete require.cache[storagePath];
    
    // Import the fixed storage service
    const resumeStorage = require('../services/resumeStorageEnhanced');
    console.log('✅ Fixed storage service imported');
    
    // Test with complete data structure
    const testFile = {
      originalname: 'fixed-test-resume.txt',
      buffer: Buffer.from('John Doe\nSoftware Developer\njohn@example.com\n+1-555-0123\nExperienced developer with React and Node.js'),
      size: 95,
      mimetype: 'text/plain'
    };
    
    const extractedText = 'John Doe\nSoftware Developer\njohn@example.com\n+1-555-0123\nExperienced developer with React and Node.js skills. Led team of 5 developers.';
    
    const analysisResult = {
      score: 82,
      roastFeedback: "Your resume shows excellent technical skills and leadership experience. Consider adding more quantifiable achievements to strengthen your impact statements.",
      strengths: [
        "Clear contact information",
        "Strong technical skills",
        "Leadership experience mentioned",
        "Relevant job title"
      ],
      weaknesses: [
        "Could use more quantifiable metrics",
        "Missing educational background",
        "No certifications listed"
      ],
      improvements: [
        {
          priority: "high",
          title: "Add quantifiable achievements",
          description: "Include specific numbers, percentages, or metrics to show your impact",
          example: "Instead of 'Led team', say 'Led team of 5 developers, reduced deployment time by 40%'"
        },
        {
          priority: "medium",
          title: "Include education section",
          description: "Add your educational background to provide more context",
          example: "Bachelor's in Computer Science, State University (2019)"
        }
      ],
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
        professionalSummary: "Experienced developer with React and Node.js skills",
        skills: {
          technical: ["React", "Node.js", "JavaScript"],
          soft: ["Leadership", "Team Management"],
          languages: ["English"],
          tools: ["Git"],
          frameworks: ["React"]
        },
        experience: [
          {
            title: "Software Developer",
            company: "Current Company",
            location: null,
            startDate: "2022",
            endDate: "Present",
            duration: "2022-Present",
            description: "Leading development team and building web applications",
            achievements: ["Led team of 5 developers"],
            technologies: ["React", "Node.js"]
          }
        ],
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
        sectionCount: 4,
        bulletPointCount: 0,
        quantifiableAchievements: 2,
        actionVerbsUsed: 3,
        industryKeywords: ["React", "Node.js", "JavaScript", "developer"],
        readabilityScore: 78,
        atsCompatibility: "High",
        missingElements: ["Education", "Certifications"],
        strongElements: ["Contact Info", "Skills", "Experience"]
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
      roastType: 'constructive',
      gender: 'male'
    };
    
    const metadata = {
      clientIP: '127.0.0.1',
      userAgent: 'Fixed-Test-Browser/1.0',
      countryCode: 'US',
      gdprConsent: true,
      requestId: 'fixed-test-' + Date.now()
    };
    
    console.log('\n💾 Testing fixed storage service...');
    
    const result = await resumeStorage.saveResumeData(
      testFile,
      extractedText,
      analysisResult,
      preferences,
      metadata
    );
    
    console.log('💾 Storage result:', {
      success: result.success,
      resumeId: result.resumeId,
      message: result.message,
      error: result.error,
      processingTime: result.processingTime
    });
    
    if (result.success) {
      console.log('✅ Fixed storage service is working!');
      
      // Verify in database
      const Resume = require('../models/Resume');
      const savedDoc = await Resume.findOne({ resumeId: result.resumeId });
      
      if (savedDoc) {
        console.log('✅ Document verified in database');
        console.log('📋 Document details:');
        console.log('- resumeId:', savedDoc.resumeId);
        console.log('- fileName:', savedDoc.fileInfo.originalFileName);
        console.log('- score:', savedDoc.analysis.overallScore);
        console.log('- name:', savedDoc.extractedInfo.personalInfo.name);
        console.log('- email:', savedDoc.extractedInfo.personalInfo.email);
        console.log('- processingTime:', savedDoc.metadata.processingTime);
        
        // Test storage stats
        console.log('\n📊 Testing storage stats...');
        const stats = await resumeStorage.getStorageStats();
        console.log('📊 Storage stats:', stats);
        
        // Clean up
        await Resume.deleteOne({ resumeId: result.resumeId });
        console.log('🧹 Test document cleaned up');
        
        console.log('\n🎉 SUCCESS: Fixed storage service is fully functional!');
        
      } else {
        console.log('❌ Document not found in database');
      }
    } else {
      console.log('❌ Storage still failing:', {
        error: result.error,
        details: result.details,
        code: result.code
      });
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Test completed');
    
  } catch (error) {
    console.error('❌ Test failed:', {
      message: error.message,
      name: error.name,
      stack: error.stack?.split('\n').slice(0, 5).join('\n')
    });
  }
}

testFixedStorage();