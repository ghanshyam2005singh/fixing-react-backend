const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import your services
const resumeStorageEnhanced = require('../services/resumeStorageEnhanced');

// Import geminiService with error handling for API key
let geminiService;
try {
  // Temporarily set API key if missing for testing
  if (!process.env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = 'test-key-for-debugging';
    console.log('⚠️ Using temporary API key for debugging');
  }
  geminiService = require('../services/geminiService');
  console.log('📋 GeminiService imported successfully');
} catch (error) {
  console.log('❌ GeminiService import failed:', error.message);
}

// Import fileProcessor with error handling
let fileProcessor;
try {
  fileProcessor = require('../services/fileProcessor');
  console.log('📋 FileProcessor imported successfully');
  console.log('📋 FileProcessor methods:', Object.getOwnPropertyNames(fileProcessor).filter(name => typeof fileProcessor[name] === 'function'));
} catch (error) {
  console.log('❌ FileProcessor import failed:', error.message);
}

async function debugResumeStorageFinal() {
  try {
    console.log('🔍 Starting Resume Storage Debug (Final Version)...');
    
    // 1. Check MongoDB Connection
    console.log('\n📡 Checking MongoDB connection...');
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
Experienced software developer with 5+ years in web development, specializing in JavaScript, React, and Node.js.

Technical Skills:
• JavaScript, TypeScript, React, Vue.js
• Node.js, Express.js, Django
• MongoDB, PostgreSQL, MySQL
• AWS, Docker, Git

Work Experience:
Senior Software Developer | Tech Corp | 2022-Present
• Led development of microservices architecture serving 100k+ daily users
• Improved application performance by 40% through code optimization
• Mentored 5 junior developers and conducted code reviews
• Technologies: React, Node.js, MongoDB, AWS

Software Developer | StartupXYZ | 2020-2022
• Developed and maintained 3 client-facing web applications
• Implemented CI/CD pipeline reducing deployment time by 60%
• Collaborated with UI/UX team to improve user experience

Education:
Bachelor of Science in Computer Science
State University | 2015-2019
GPA: 3.8/4.0

Projects:
E-commerce Platform | 2023
• Full-stack web application with payment integration
• Technologies: React, Node.js, Stripe API, MongoDB

Certifications:
• AWS Certified Developer Associate (2023)
• MongoDB Certified Developer (2022)
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
        console.log('✅ Text extracted via FileProcessor');
        console.log('📝 Length:', extractedText.length, 'characters');
      } catch (extractError) {
        console.log('❌ FileProcessor extraction failed:', extractError.message);
        extractedText = mockFile.buffer.toString('utf8');
        console.log('⚠️ Using fallback text extraction');
      }
    } else {
      extractedText = mockFile.buffer.toString('utf8');
      console.log('⚠️ Using direct text extraction');
    }
    
    console.log('📊 Final extracted text length:', extractedText.length);
    console.log('📝 Sample text:', extractedText.substring(0, 200) + '...');
    
    // 5. Test AI analysis using correct method name
    console.log('\n🤖 Testing AI analysis...');
    const preferences = {
      roastLevel: 'professional',
      language: 'english',
      roastType: 'constructive'
    };
    
    let analysisResult;
    
    if (geminiService && typeof geminiService.analyzeResume === 'function') {
      try {
        console.log('📝 Using geminiService.analyzeResume method...');
        
        // Create mock analysis result since API key might not work
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'test-key-for-debugging') {
          console.log('⚠️ Creating mock analysis result (no valid API key)');
          analysisResult = {
            score: 78,
            roastFeedback: "Your resume shows good technical skills, but could benefit from more quantifiable achievements. Consider adding specific metrics to demonstrate your impact.",
            strengths: [
              "Clear contact information",
              "Relevant technical skills listed",
              "Good work experience progression",
              "Education details included"
            ],
            improvements: [
              {
                priority: "high",
                title: "Add quantifiable achievements",
                description: "Include specific numbers, percentages, or metrics to show your impact",
                example: "Instead of 'improved performance', say 'improved performance by 40%'"
              },
              {
                priority: "medium",
                title: "Expand project descriptions",
                description: "Provide more details about your projects and their outcomes",
                example: "Add user numbers, technologies used, and business impact"
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
              professionalSummary: "Experienced software developer with 5+ years in web development, specializing in JavaScript, React, and Node.js.",
              skills: {
                technical: ["JavaScript", "TypeScript", "React", "Vue.js", "Node.js", "Express.js", "Django", "MongoDB", "PostgreSQL", "MySQL", "AWS", "Docker", "Git"],
                soft: ["Leadership", "Mentoring", "Collaboration"],
                languages: [],
                tools: ["Docker", "Git"],
                frameworks: ["React", "Vue.js", "Express.js", "Django"]
              },
              experience: [
                {
                  title: "Senior Software Developer",
                  company: "Tech Corp",
                  location: null,
                  startDate: "2022",
                  endDate: "Present",
                  duration: "2022-Present",
                  description: "Led development of microservices architecture serving 100k+ daily users",
                  achievements: [
                    "Led development of microservices architecture serving 100k+ daily users",
                    "Improved application performance by 40% through code optimization",
                    "Mentored 5 junior developers and conducted code reviews"
                  ],
                  technologies: ["React", "Node.js", "MongoDB", "AWS"]
                }
              ],
              education: [
                {
                  degree: "Bachelor of Science in Computer Science",
                  field: "Computer Science",
                  institution: "State University",
                  location: null,
                  graduationYear: "2019",
                  gpa: "3.8",
                  honors: [],
                  coursework: []
                }
              ],
              certifications: [
                {
                  name: "AWS Certified Developer Associate",
                  issuer: "AWS",
                  dateObtained: "2023",
                  expirationDate: null,
                  credentialId: null,
                  url: null
                },
                {
                  name: "MongoDB Certified Developer",
                  issuer: "MongoDB",
                  dateObtained: "2022",
                  expirationDate: null,
                  credentialId: null,
                  url: null
                }
              ],
              projects: [
                {
                  name: "E-commerce Platform",
                  description: "Full-stack web application with payment integration",
                  role: null,
                  duration: "2023",
                  technologies: ["React", "Node.js", "Stripe API", "MongoDB"],
                  achievements: [],
                  url: null,
                  github: null
                }
              ],
              awards: [],
              volunteerWork: [],
              interests: [],
              references: null
            },
            resumeAnalytics: {
              wordCount: extractedText.split(/\s+/).length,
              pageCount: 1,
              sectionCount: 6,
              bulletPointCount: 8,
              quantifiableAchievements: 3,
              actionVerbsUsed: 5,
              industryKeywords: ["JavaScript", "React", "Node.js", "AWS", "MongoDB"],
              readabilityScore: 75,
              atsCompatibility: "High",
              missingElements: ["References", "Volunteer Work"],
              strongElements: ["Technical Skills", "Work Experience", "Education"]
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
        } else {
          // Try real API call
          analysisResult = await geminiService.analyzeResume(
            extractedText,
            preferences,
            mockFile.originalname
          );
        }
        
        console.log('✅ AI analysis completed');
        console.log('📊 Analysis result structure:');
        console.log('- score:', analysisResult.score);
        console.log('- roastFeedback length:', analysisResult.roastFeedback?.length || 0);
        console.log('- strengths count:', analysisResult.strengths?.length || 0);
        console.log('- improvements count:', analysisResult.improvements?.length || 0);
        console.log('- extractedInfo:', !!analysisResult.extractedInfo);
        console.log('- resumeAnalytics:', !!analysisResult.resumeAnalytics);
        console.log('- contactValidation:', !!analysisResult.contactValidation);
        
        // 6. Test data storage
        console.log('\n💾 Testing data storage...');
        const metadata = {
          clientIP: '127.0.0.1',
          userAgent: 'Test Agent Debug',
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
              console.log('✅ Document successfully saved to MongoDB!');
              console.log('📋 Document structure verification:');
              console.log('- resumeId:', !!savedDoc.resumeId);
              console.log('- fileInfo:', !!savedDoc.fileInfo);
              console.log('- extractedInfo:', !!savedDoc.extractedInfo);
              console.log('- analysis:', !!savedDoc.analysis);
              console.log('- timestamps:', !!savedDoc.timestamps);
              console.log('- preferences:', !!savedDoc.preferences);
              
              if (savedDoc.extractedInfo?.personalInfo) {
                console.log('👤 Personal info saved:');
                console.log('- name:', savedDoc.extractedInfo.personalInfo.name);
                console.log('- email:', savedDoc.extractedInfo.personalInfo.email);
              }
              
              if (savedDoc.analysis) {
                console.log('📊 Analysis saved:');
                console.log('- overallScore:', savedDoc.analysis.overallScore);
                console.log('- feedback:', !!savedDoc.analysis.feedback);
              }
              
              // Check final count
              const afterCount = await collection.countDocuments();
              console.log('\n📊 Database summary:');
              console.log('- Documents before:', beforeCount);
              console.log('- Documents after:', afterCount);
              console.log('- New documents added:', afterCount - beforeCount);
              
              console.log('\n🎉 SUCCESS: Data storage pipeline is working correctly!');
              
            } else {
              console.log('❌ Document not found after save!');
            }
          } else {
            console.log('❌ Storage failed:', storageResult.error);
            console.log('📋 Storage details:', storageResult.details);
          }
          
        } catch (storageError) {
          console.log('❌ Storage error:', {
            message: storageError.message,
            name: storageError.name,
            stack: storageError.stack?.split('\n').slice(0, 3).join('\n')
          });
        }
        
      } catch (aiError) {
        console.log('❌ AI analysis error:', {
          message: aiError.message,
          name: aiError.name,
          stack: aiError.stack?.split('\n').slice(0, 3).join('\n')
        });
      }
    } else {
      console.log('❌ GeminiService analyzeResume method not available');
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

debugResumeStorageFinal();