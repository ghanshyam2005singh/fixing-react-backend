const mongoose = require('mongoose');
require('dotenv').config();

async function testStorageWithRouteData() {
  try {
    console.log('🔍 Testing Storage with Route-Compatible Data...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
    
    // Import storage service
    const resumeStorage = require('../services/resumeStorageEnhanced');
    console.log('✅ ResumeStorage imported');
    
    // Create data structure that matches what your route sends
    const mockFile = {
      originalname: 'john-doe-resume.txt',
      buffer: Buffer.from('John Doe\nSoftware Developer\njohn@example.com\n+1-555-0123'),
      size: 60,
      mimetype: 'text/plain'
    };
    
    const extractedText = 'John Doe\nSoftware Developer\njohn@example.com\n+1-555-0123\nExperienced developer with React skills.';
    
    // This structure matches what your route creates in the analysis object
    const analysisData = {
      // AI Analysis Results (what geminiService.analyzeResume returns)
      roastFeedback: "Your resume shows good technical skills but could benefit from more quantifiable achievements.",
      score: 78,
      strengths: [
        "Clear contact information",
        "Relevant technical skills listed",
        "Good professional summary"
      ],
      weaknesses: [
        "Lacks quantifiable achievements",
        "Could use more project details",
        "Missing industry keywords"
      ],
      improvements: [
        {
          priority: "high",
          title: "Add quantifiable achievements",
          description: "Include specific numbers, percentages, or metrics",
          example: "Led team of 5 developers"
        }
      ],
      
      // Extracted info from your route's extractResumeData function
      extractedInfo: {
        personalInfo: {
          hasName: true,
          hasEmail: true,
          hasPhone: true,
          hasAddress: false,
          hasLinkedIn: false,
          hasGithub: false,
          hasPortfolio: false
        },
        professional: {
          hasJobTitle: true,
          hasSummary: true,
          experienceLevel: 'mid',
          totalExperienceYears: 3,
          industryType: 'tech'
        },
        skills: {
          technicalSkillsCount: 2,
          softSkillsCount: 1,
          programmingLanguages: 1,
          frameworks: 1,
          databases: 0,
          cloudPlatforms: 0,
          certifications: 0
        },
        experience: {
          jobCount: 1,
          hasCurrentRole: true,
          averageJobDuration: 2,
          hasInternships: false,
          hasFreelance: false,
          hasLeadershipRoles: false
        },
        education: {
          degreeCount: 1,
          highestDegree: 'bachelor',
          hasRelevantDegree: true,
          hasOnlineCourses: false,
          hasCertifications: false
        }
      },
      
      // Statistics from your route's analyzeDocumentStats function
      statistics: {
        wordCount: 25,
        pageCount: 1,
        paragraphCount: 3,
        bulletPointCount: 0,
        hasEmail: true,
        hasPhone: true,
        hasLinkedIn: false,
        hasGithub: false,
        hasWebsite: false,
        hasSkills: true,
        hasEducation: true,
        hasExperience: true,
        hasCertifications: false,
        hasProjects: false,
        hasSummary: true,
        textLength: extractedText.length,
        uniqueWordsCount: 20,
        processingTime: 1500,
        extractionTime: 500,
        analysisTime: 1000
      }
    };
    
    // Preferences from route
    const preferences = {
      gender: 'male',
      roastLevel: 'professional',
      roastType: 'constructive',
      language: 'english',
      clientIP: '127.0.0.1',
      userAgent: 'Mozilla/5.0 Test Browser',
      requestId: 'test-request-' + Date.now()
    };
    
    console.log('\n💾 Testing storage with route-compatible data...');
    console.log('📋 Analysis data keys:', Object.keys(analysisData));
    console.log('📋 Preferences keys:', Object.keys(preferences));
    
    try {
      // Try the exact way your route calls it
      const result = await resumeStorage.saveResumeData(
        mockFile,
        extractedText,
        analysisData,
        preferences
      );
      
      console.log('💾 Storage result:', {
        success: result.success,
        resumeId: result.resumeId,
        error: result.error,
        message: result.message,
        code: result.code
      });
      
      if (result.success) {
        // Verify in database
        const collection = mongoose.connection.db.collection('resumes');
        const savedDoc = await collection.findOne({ resumeId: result.resumeId });
        
        if (savedDoc) {
          console.log('✅ Document saved successfully!');
          console.log('📋 Document structure:');
          console.log('- resumeId:', !!savedDoc.resumeId);
          console.log('- fileInfo:', !!savedDoc.fileInfo);
          console.log('- extractedInfo:', !!savedDoc.extractedInfo);
          console.log('- analysis:', !!savedDoc.analysis);
          console.log('- timestamps:', !!savedDoc.timestamps);
          
          console.log('\n🎉 SUCCESS: Storage is working correctly!');
          
          // Test admin panel query
          console.log('\n🔧 Testing admin panel query...');
          const adminDocs = await collection.find({}, {
            projection: {
              resumeId: 1,
              'fileInfo.originalFileName': 1,
              'analysis.overallScore': 1,
              'timestamps.uploadedAt': 1,
              'extractedInfo.personalInfo.name': 1
            }
          }).toArray();
          
          console.log('📊 Admin query results:', adminDocs.length);
          if (adminDocs.length > 0) {
            console.log('📋 Sample admin doc:', {
              resumeId: adminDocs[0].resumeId,
              fileName: adminDocs[0].fileInfo?.originalFileName,
              score: adminDocs[0].analysis?.overallScore,
              uploadedAt: adminDocs[0].timestamps?.uploadedAt
            });
          }
          
        } else {
          console.log('❌ Document not found after save');
        }
      } else {
        console.log('❌ Storage failed:', {
          error: result.error,
          details: result.details,
          validation: result.validation
        });
      }
      
    } catch (saveError) {
      console.log('❌ Save operation threw error:', {
        message: saveError.message,
        name: saveError.name,
        code: saveError.code,
        stack: saveError.stack?.split('\n').slice(0, 5).join('\n')
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

testStorageWithRouteData();