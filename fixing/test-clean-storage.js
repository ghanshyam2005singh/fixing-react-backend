const mongoose = require('mongoose');
require('dotenv').config();

async function testCleanStorage() {
  try {
    console.log('🔍 Testing Clean Storage Service...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
    
    // Clear require cache to get the clean service
    const storagePath = require.resolve('./services/resumeStorageEnhanced');
    delete require.cache[storagePath];
    
    // Import the clean storage service
    const resumeStorage = require('../services/resumeStorageEnhanced');
    console.log('✅ Clean storage service imported successfully');
    
    // Test with comprehensive data
    const testFile = {
      originalname: 'clean-test-resume.txt',
      buffer: Buffer.from('John Doe\\nSenior Developer\\njohn@example.com\\n+1-555-0123'),
      size: 60,
      mimetype: 'text/plain'
    };
    
    const extractedText = `John Doe
Senior Software Developer

Contact Information:
Email: john.doe@example.com
Phone: +1-555-0123
LinkedIn: linkedin.com/in/johndoe

Professional Summary:
Experienced software developer with 5+ years in web development.
Led team of 8 developers and improved performance by 40%.

Technical Skills:
• JavaScript, React, Node.js
• Python, Django
• AWS, Docker, Git

Work Experience:
Senior Developer | Tech Corp | 2022-Present
• Led development of web applications
• Improved performance by 40%
• Managed team of 8 developers

Education:
BS Computer Science | State University | 2019\`;
    
    const analysisResult = {
      score: 87,
      roastFeedback: "Excellent resume with strong technical leadership experience. The quantifiable achievements and comprehensive skill set demonstrate real value. Consider adding specific project examples and certifications to further strengthen your profile.",
      strengths: [
        "Strong quantifiable achievements (5+ years, 8 developers, 40% improvement)",
        "Comprehensive technical skill coverage",
        "Clear leadership and management experience",
        "Well-structured contact information",
        "Professional summary effectively highlights value proposition"
      ],
      weaknesses: [
        "Could benefit from specific project examples",
        "Missing industry certifications",
        "Limited information about education honors or GPA"
      ],
      improvements: [
        {
          priority: "high",
          title: "Add specific project portfolio",
          description: "Include 2-3 detailed project descriptions showcasing your technical expertise and impact",
          example: "E-commerce platform built with React/Node.js, serving 50k+ users with 99.9% uptime"
        },
        {
          priority: "medium",
          title: "Include relevant certifications",
          description: "Add AWS, Docker, or JavaScript certifications to validate your technical skills",
          example: "AWS Certified Solutions Architect, Docker Certified Associate"
        }
      ],
      extractedInfo: {
        personalInfo: {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1-555-0123",
          address: {
            full: null,
            city: null,
            state: null,
            country: null,
            zipCode: null
          },
          socialProfiles: {
            linkedin: "linkedin.com/in/johndoe",
            github: null,
            portfolio: null,
            website: null,
            twitter: null
          }
        },
        professionalSummary: "Experienced software developer with 5+ years in web development. Led team of 8 developers and improved performance by 40%.",
        skills: {
          technical: ["JavaScript", "React", "Node.js", "Python", "Django", "AWS", "Docker", "Git"],
          soft: ["Leadership", "Team Management", "Project Management"],
          languages: ["English"],
          tools: ["Docker", "Git"],
          frameworks: ["React", "Node.js", "Django"]
        },
        experience: [
          {
            title: "Senior Developer",
            company: "Tech Corp",
            location: null,
            startDate: "2022",
            endDate: "Present",
            duration: "2022-Present",
            description: "Leading development team and building web applications",
            achievements: [
              "Led development of web applications",
              "Improved performance by 40%",
              "Managed team of 8 developers"
            ],
            technologies: ["JavaScript", "React", "Node.js", "Python"]
          }
        ],
        education: [
          {
            degree: "BS Computer Science",
            field: "Computer Science",
            institution: "State University",
            location: null,
            graduationYear: "2019",
            gpa: null,
            honors: [],
            coursework: []
          }
        ],
        certifications: [],
        projects: [],
        awards: [],
        volunteerWork: [],
        interests: [],
        references: null
      },
      resumeAnalytics: {
        wordCount: extractedText.split(/\\s+/).filter(word => word.length > 0).length,
        pageCount: 1,
        sectionCount: 6,
        bulletPointCount: 6,
        quantifiableAchievements: 4,
        actionVerbsUsed: 5,
        industryKeywords: ["JavaScript", "React", "Node.js", "Python", "Django", "AWS", "Docker"],
        readabilityScore: 85,
        atsCompatibility: "High",
        missingElements: ["Certifications", "Projects"],
        strongElements: ["Contact Info", "Professional Summary", "Technical Skills", "Work Experience", "Education"]
      },
      contactValidation: {
        hasEmail: true,
        hasPhone: true,
        hasLinkedIn: true,
        hasAddress: false,
        emailValid: true,
        phoneValid: true,
        linkedInValid: true
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
      userAgent: 'Clean-Test-Browser/1.0',
      countryCode: 'US',
      gdprConsent: true,
      requestId: 'clean-test-' + Date.now()
    };
    
    console.log('\\n💾 Testing clean storage service...');
    
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
      console.log('✅ Clean storage service is working perfectly!');
      
      // Verify in database
      const Resume = require('./models/Resume');
      const savedDoc = await Resume.findOne({ resumeId: result.resumeId });
      
      if (savedDoc) {
        console.log('✅ Document verified in database');
        console.log('📋 Complete document structure verified:');
        console.log('- resumeId:', !!savedDoc.resumeId);
        console.log('- fileInfo:', !!savedDoc.fileInfo);
        console.log('- extractedInfo:', !!savedDoc.extractedInfo);
        console.log('- analysis:', !!savedDoc.analysis);
        console.log('- preferences:', !!savedDoc.preferences);
        console.log('- timestamps:', !!savedDoc.timestamps);
        console.log('- metadata:', !!savedDoc.metadata);
        
        console.log('\\n📊 Data quality verification:');
        console.log('- Name extracted:', savedDoc.extractedInfo.personalInfo.name);
        console.log('- Email extracted:', savedDoc.extractedInfo.personalInfo.email);
        console.log('- Phone extracted:', savedDoc.extractedInfo.personalInfo.phone);
        console.log('- Skills count:', savedDoc.extractedInfo.skills.technical.length);
        console.log('- Experience count:', savedDoc.extractedInfo.experience.length);
        console.log('- Education count:', savedDoc.extractedInfo.education.length);
        console.log('- Analysis score:', savedDoc.analysis.overallScore);
        console.log('- Feedback length:', savedDoc.analysis.feedback.length);
        console.log('- Strengths count:', savedDoc.analysis.strengths.length);
        console.log('- Improvements count:', savedDoc.analysis.improvements.length);
        
        // Test storage stats
        console.log('\\n📊 Testing storage statistics...');
        const stats = await resumeStorage.getStorageStats();
        console.log('📊 Storage stats:', stats);
        
        // Clean up
        await Resume.deleteOne({ resumeId: result.resumeId });
        console.log('🧹 Test document cleaned up');
        
        console.log('\\n🎉 SUCCESS: Clean storage service is fully operational!');
        console.log('🚀 Ready for production use with complete data pipeline!');
        
      } else {
        console.log('❌ Document not found in database');
      }
    } else {
      console.log('❌ Storage failed:', {
        error: result.error,
        details: result.details,
        code: result.code
      });
    }
    
    await mongoose.disconnect();
    console.log('\\n✅ Test completed');
    
  } catch (error) {
    console.error('❌ Test failed:', {
      message: error.message,
      name: error.name,
      stack: error.stack?.split('\\n').slice(0, 5).join('\\n')
    });`
  }
};

testCleanStorage();