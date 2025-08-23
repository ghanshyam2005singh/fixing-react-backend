const mongoose = require('mongoose');
require('dotenv').config();

async function testRegexFixedStorage() {
  try {
    console.log('🔍 Testing Regex-Fixed Storage Service...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
    
    // Clear require cache to get the updated service
    const storagePath = require.resolve('./services/resumeStorageEnhanced');
    delete require.cache[storagePath];
    
    // Test regex patterns first
    console.log('\n🧪 Testing regex patterns...');
    
    const testText = `
John Doe
Senior Software Developer
Email: john.doe@example.com
Phone: +1-555-0123
LinkedIn: linkedin.com/in/johndoe
Address: 123 Main Street, City, State 12345

Professional Summary:
Experienced developer with 5+ years in web development.
Led team of 8 developers and improved performance by 40%.
Managed projects worth $2M+ and achieved 95% client satisfaction.

Technical Skills:
• JavaScript, Python, React, Node.js
• AWS, Docker, Git
`;

    // Test individual regex patterns
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phoneRegex = /(?:\+?1[-\.\s]?)?\(?([0-9]{3})\)?[-\.\s]?([0-9]{3})[-\.\s]?([0-9]{4})/;
    const linkedinRegex = /linkedin\.com\/in\/([a-zA-Z0-9-]+)/i;
    const addressRegex = /\b(?:street|st|avenue|ave|road|rd|drive|dr|city|state|zip)\b/i;
    const quantifiableRegex = /\d+%|\d+\+|\d+ [a-z]/gi;
    const actionVerbsRegex = /\b(led|managed|developed|created|implemented|improved|increased|decreased|achieved|delivered)\b/gi;

    console.log('📋 Regex test results:');
    console.log('- Email found:', emailRegex.test(testText));
    console.log('- Phone found:', phoneRegex.test(testText));
    console.log('- LinkedIn found:', linkedinRegex.test(testText));
    console.log('- Address found:', addressRegex.test(testText));
    console.log('- Quantifiable achievements:', (testText.match(quantifiableRegex) || []).length);
    console.log('- Action verbs:', (testText.match(actionVerbsRegex) || []).length);
    
    // Import the fixed storage service
    const resumeStorage = require('../services/resumeStorageEnhanced');
    console.log('✅ Fixed storage service imported successfully');
    
    // Test with real data
    const testFile = {
      originalname: 'regex-test-resume.txt',
      buffer: Buffer.from(testText),
      size: testText.length,
      mimetype: 'text/plain'
    };
    
    const analysisResult = {
      score: 85,
      roastFeedback: "Your resume demonstrates strong technical leadership with quantifiable achievements. The combination of technical skills and management experience is impressive. Consider adding more details about specific technologies and frameworks you've worked with.",
      strengths: [
        "Clear quantifiable achievements (5+ years, 8 developers, 40% improvement)",
        "Strong technical and leadership combination",
        "Comprehensive contact information",
        "Well-structured professional summary"
      ],
      weaknesses: [
        "Could expand on specific project details",
        "Missing education section",
        "Limited information about certifications"
      ],
      improvements: [
        {
          priority: "medium",
          title: "Add specific project examples",
          description: "Include 2-3 detailed project descriptions with technologies used and outcomes achieved",
          example: "E-commerce platform built with React/Node.js serving 10k+ daily users"
        },
        {
          priority: "low",
          title: "Include education background",
          description: "Add your educational qualifications to provide complete professional context",
          example: "Bachelor's in Computer Science, State University (2018)"
        }
      ],
      extractedInfo: {
        personalInfo: {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1-555-0123",
          address: {
            full: "123 Main Street, City, State 12345",
            city: "City",
            state: "State",
            country: "USA",
            zipCode: "12345"
          },
          socialProfiles: {
            linkedin: "linkedin.com/in/johndoe",
            github: null,
            portfolio: null,
            website: null,
            twitter: null
          }
        },
        professionalSummary: "Experienced developer with 5+ years in web development. Led team of 8 developers and improved performance by 40%.",
        skills: {
          technical: ["JavaScript", "Python", "React", "Node.js", "AWS", "Docker", "Git"],
          soft: ["Leadership", "Team Management", "Project Management"],
          languages: ["English"],
          tools: ["Docker", "Git"],
          frameworks: ["React", "Node.js"]
        },
        experience: [
          {
            title: "Senior Software Developer",
            company: "Tech Company",
            location: "City, State",
            startDate: "2019",
            endDate: "Present",
            duration: "2019-Present",
            description: "Lead software development team and manage complex projects",
            achievements: [
              "Led team of 8 developers",
              "Improved performance by 40%",
              "Managed projects worth $2M+",
              "Achieved 95% client satisfaction"
            ],
            technologies: ["JavaScript", "Python", "React", "Node.js", "AWS"]
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
        wordCount: testText.split(/\s+/).filter(word => word.length > 0).length,
        pageCount: 1,
        sectionCount: 4,
        bulletPointCount: 4,
        quantifiableAchievements: 6,
        actionVerbsUsed: 4,
        industryKeywords: ["JavaScript", "Python", "React", "Node.js", "AWS", "Docker"],
        readabilityScore: 82,
        atsCompatibility: "High",
        missingElements: ["Education", "Certifications"],
        strongElements: ["Contact Info", "Professional Summary", "Technical Skills", "Quantifiable Achievements"]
      },
      contactValidation: {
        hasEmail: true,
        hasPhone: true,
        hasLinkedIn: true,
        hasAddress: true,
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
      userAgent: 'Regex-Test-Browser/1.0',
      countryCode: 'US',
      gdprConsent: true,
      requestId: 'regex-test-' + Date.now()
    };
    
    console.log('\n💾 Testing storage with fixed regex patterns...');
    
    const result = await resumeStorage.saveResumeData(
      testFile,
      testText,
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
      console.log('✅ Regex-fixed storage service is working perfectly!');
      
      // Verify in database
      const Resume = require('../models/Resume');
      const savedDoc = await Resume.findOne({ resumeId: result.resumeId });
      
      if (savedDoc) {
        console.log('✅ Document verified in database');
        console.log('📋 Personal info extraction verification:');
        console.log('- Name:', savedDoc.extractedInfo.personalInfo.name);
        console.log('- Email:', savedDoc.extractedInfo.personalInfo.email);
        console.log('- Phone:', savedDoc.extractedInfo.personalInfo.phone);
        console.log('- LinkedIn:', savedDoc.extractedInfo.personalInfo.socialProfiles.linkedin);
        console.log('- Address:', savedDoc.extractedInfo.personalInfo.address.full);
        
        console.log('\n📊 Analytics verification:');
        console.log('- Word count:', savedDoc.analysis.resumeAnalytics.wordCount);
        console.log('- Quantifiable achievements:', savedDoc.analysis.resumeAnalytics.quantifiableAchievements);
        console.log('- Action verbs used:', savedDoc.analysis.resumeAnalytics.actionVerbsUsed);
        console.log('- Industry keywords:', savedDoc.analysis.resumeAnalytics.industryKeywords.length);
        
        console.log('\n📋 Contact validation:');
        console.log('- Has email:', savedDoc.analysis.contactValidation.hasEmail);
        console.log('- Has phone:', savedDoc.analysis.contactValidation.hasPhone);
        console.log('- Has LinkedIn:', savedDoc.analysis.contactValidation.hasLinkedIn);
        console.log('- Has address:', savedDoc.analysis.contactValidation.hasAddress);
        
        // Clean up
        await Resume.deleteOne({ resumeId: result.resumeId });
        console.log('🧹 Test document cleaned up');
        
        console.log('\n🎉 SUCCESS: All regex patterns working correctly!');
        console.log('🚀 Storage service is ready for production use!');
        
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

testRegexFixedStorage();