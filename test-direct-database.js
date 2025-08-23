const mongoose = require('mongoose');
require('dotenv').config();

async function testDirectDatabase() {
  try {
    console.log('🔍 Testing Direct Database Operations...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
    
    // Import the Resume model (after schema fix)
    const Resume = require('../models/Resume');
    console.log('✅ Resume model imported');
    
    // Create a complete test document
    const testResumeData = {
      resumeId: 'direct-test-' + Date.now(),
      fileInfo: {
        fileName: 'direct-test-resume.txt',
        originalFileName: 'direct-test-resume.txt',
        fileSize: 150,
        mimeType: 'text/plain',
        fileHash: 'direct-test-hash'
      },
      extractedInfo: {
        personalInfo: {
          name: 'Direct Test User',
          email: 'directtest@example.com',
          phone: '+1-555-0123',
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
        professionalSummary: 'Test professional summary',
        skills: {
          technical: ['JavaScript', 'Node.js'],
          soft: ['Communication', 'Leadership'],
          languages: ['English'],
          tools: ['Git'],
          frameworks: ['React']
        },
        experience: [{
          title: 'Software Developer',
          company: 'Test Company',
          location: 'Test City',
          startDate: '2022',
          endDate: 'Present',
          duration: '2022-Present',
          description: 'Test description',
          achievements: ['Test achievement'],
          technologies: ['JavaScript', 'React']
        }],
        education: [{
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          institution: 'Test University',
          location: 'Test City',
          graduationYear: '2021',
          gpa: '3.8',
          honors: [],
          coursework: []
        }],
        certifications: [],
        projects: [],
        awards: [],
        volunteerWork: [],
        interests: [],
        references: null
      },
      analysis: {
        overallScore: 78,
        feedback: 'Good resume with solid technical skills. Could benefit from more quantifiable achievements.',
        strengths: ['Clear contact information', 'Relevant technical skills', 'Good education background'],
        weaknesses: ['Lacks quantifiable achievements', 'Could use more project details'],
        improvements: [{
          priority: 'high',
          title: 'Add quantifiable achievements',
          description: 'Include specific numbers and metrics',
          example: 'Led team of 5 developers, increased efficiency by 30%'
        }],
        resumeAnalytics: {
          wordCount: 150,
          pageCount: 1,
          sectionCount: 5,
          bulletPointCount: 3,
          quantifiableAchievements: 1,
          actionVerbsUsed: 5,
          industryKeywords: ['JavaScript', 'React', 'Node.js'],
          readabilityScore: 75,
          atsCompatibility: 'High',
          missingElements: ['Certifications', 'Projects'],
          strongElements: ['Education', 'Skills', 'Experience']
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
      },
      preferences: {
        roastLevel: 'professional',
        language: 'english',
        roastType: 'constructive',
        gender: 'other'
      },
      timestamps: {
        uploadedAt: new Date(),
        analyzedAt: new Date(),
        updatedAt: new Date()
      },
      metadata: {
        clientIP: '127.0.0.1',
        userAgent: 'Direct-Test-Agent',
        countryCode: 'US',
        gdprConsent: true,
        requestId: 'direct-test-request',
        processingTime: 1500
      }
    };
    
    console.log('\n💾 Creating and saving resume document...');
    
    const resume = new Resume(testResumeData);
    const savedResume = await resume.save();
    
    console.log('✅ Resume saved successfully!');
    console.log('📋 Saved resume ID:', savedResume.resumeId);
    console.log('📋 MongoDB _id:', savedResume._id);
    
    // Verify it was saved
    const foundResume = await Resume.findOne({ resumeId: savedResume.resumeId });
    if (foundResume) {
      console.log('✅ Resume found in database');
      console.log('📊 Document structure verified:');
      console.log('- resumeId:', !!foundResume.resumeId);
      console.log('- fileInfo:', !!foundResume.fileInfo);
      console.log('- extractedInfo:', !!foundResume.extractedInfo);
      console.log('- analysis:', !!foundResume.analysis);
      console.log('- timestamps:', !!foundResume.timestamps);
      console.log('- preferences:', !!foundResume.preferences);
      console.log('- metadata:', !!foundResume.metadata);
    }
    
    // Test admin panel query
    console.log('\n🔧 Testing admin panel query format...');
    const adminQuery = await Resume.find({}, {
      resumeId: 1,
      'fileInfo.originalFileName': 1,
      'analysis.overallScore': 1,
      'timestamps.uploadedAt': 1,
      'extractedInfo.personalInfo.name': 1
    }).lean();
    
    console.log('📊 Admin query results:', adminQuery.length);
    if (adminQuery.length > 0) {
      console.log('📋 Sample admin result:', {
        resumeId: adminQuery[0].resumeId,
        fileName: adminQuery[0].fileInfo?.originalFileName,
        score: adminQuery[0].analysis?.overallScore,
        name: adminQuery[0].extractedInfo?.personalInfo?.name,
        uploadedAt: adminQuery[0].timestamps?.uploadedAt
      });
    }
    
    // Clean up test document
    await Resume.deleteOne({ resumeId: savedResume.resumeId });
    console.log('🧹 Test document cleaned up');
    
    console.log('\n🎉 SUCCESS: Direct database operations working perfectly!');
    console.log('💡 The issue is likely in the resumeStorageEnhanced service, not the database or schema.');
    
    await mongoose.disconnect();
    console.log('\n✅ Test completed');
    
  } catch (error) {
    console.error('❌ Test failed:', {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack?.split('\n').slice(0, 5).join('\n')
    });
  }
}

testDirectDatabase();