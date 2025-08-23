const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import your services
const resumeStorageEnhanced = require('./services/resumeStorageEnhanced');
const geminiService = require('./services/geminiService');
const fileProcessor = require('./services/fileProcessor');

async function debugResumeStorage() {
  try {
    console.log('🔍 Starting Resume Storage Debug...');
    
    // Check available methods first
    console.log('📋 Available fileProcessor methods:');
    console.log(Object.getOwnPropertyNames(fileProcessor).filter(name => typeof fileProcessor[name] === 'function'));
    
    // 1. Check MongoDB Connection
    console.log('\n📡 Checking MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
    
    // 2. Check collection before test
    const collection = mongoose.connection.db.collection('resumes');
    const beforeCount = await collection.countDocuments();
    console.log('📊 Resumes before test:', beforeCount);
    
    // 3. Test file processing pipeline
    console.log('\n🔧 Testing file processing pipeline...');
    
    // Create a more realistic test content
    const testContent = `
JOHN DOE
Software Developer
Email: john.doe@example.com
Phone: +1-555-0123
LinkedIn: linkedin.com/in/johndoe

EXPERIENCE
Senior Software Developer - Tech Corp (2022-Present)
- Developed web applications using React and Node.js
- Led a team of 5 developers
- Improved system performance by 40%

Software Developer - StartupXYZ (2020-2022)
- Built RESTful APIs using Express.js
- Implemented authentication and authorization
- Collaborated with cross-functional teams

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2016-2020)
GPA: 3.8/4.0

SKILLS
Technical: JavaScript, React, Node.js, Python, MongoDB, PostgreSQL
Soft Skills: Leadership, Communication, Problem Solving

PROJECTS
E-commerce Platform
- Built full-stack e-commerce application
- Technologies: React, Node.js, MongoDB
- Deployed on AWS with CI/CD pipeline
    `;
    
    const testFileBuffer = Buffer.from(testContent);
    const mockFile = {
      originalname: 'john-doe-resume.pdf',
      buffer: testFileBuffer,
      size: testFileBuffer.length,
      mimetype: 'application/pdf'
    };
    
    // 4. Test file text extraction with different possible method names
    console.log('\n📄 Testing text extraction...');
    let extractedText = '';
    
    try {
      // Try different possible method names
      if (typeof fileProcessor.extractTextFromFile === 'function') {
        extractedText = await fileProcessor.extractTextFromFile(mockFile);
      } else if (typeof fileProcessor.extractText === 'function') {
        extractedText = await fileProcessor.extractText(mockFile);
      } else if (typeof fileProcessor.processFile === 'function') {
        const result = await fileProcessor.processFile(mockFile);
        extractedText = result.text || result.extractedText || result;
      } else {
        // If no extraction method found, use mock text
        console.log('⚠️ No text extraction method found, using mock text');
        extractedText = testContent;
      }
      
      console.log('✅ Text extracted:', extractedText.length, 'characters');
      console.log('📝 Sample text:', extractedText.substring(0, 150) + '...');
      
      // 5. Test AI analysis
      console.log('\n🤖 Testing AI analysis...');
      const preferences = {
        roastLevel: 'professional',
        language: 'english',
        roastType: 'constructive'
      };
      
      try {
        // Check if geminiService methods exist
        console.log('🔍 Available geminiService methods:');
        console.log(Object.getOwnPropertyNames(geminiService).filter(name => typeof geminiService[name] === 'function'));
        
        let analysisResult;
        
        if (typeof geminiService.getComprehensiveAnalysis === 'function') {
          analysisResult = await geminiService.getComprehensiveAnalysis(
            extractedText,
            preferences,
            mockFile.originalname
          );
        } else if (typeof geminiService.analyzeResume === 'function') {
          analysisResult = await geminiService.analyzeResume(
            extractedText,
            preferences,
            mockFile.originalname
          );
        } else {
          console.log('⚠️ No AI analysis method found, creating mock analysis');
          analysisResult = {
            score: 85,
            roastFeedback: 'This is a solid resume with good structure and relevant experience.',
            strengths: ['Clear contact information', 'Relevant work experience', 'Good technical skills'],
            improvements: [
              {
                priority: 'medium',
                title: 'Add quantifiable achievements',
                description: 'Include specific numbers and metrics in your experience section',
                example: 'Instead of "improved performance", say "improved performance by 40%"'
              }
            ],
            extractedInfo: {
              personalInfo: {
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+1-555-0123',
                address: { full: null, city: null, state: null, country: null, zipCode: null },
                socialProfiles: {
                  linkedin: 'linkedin.com/in/johndoe',
                  github: null,
                  portfolio: null,
                  website: null,
                  twitter: null
                }
              },
              skills: {
                technical: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB', 'PostgreSQL'],
                soft: ['Leadership', 'Communication', 'Problem Solving'],
                languages: [],
                tools: [],
                frameworks: ['React', 'Express.js']
              },
              experience: [
                {
                  title: 'Senior Software Developer',
                  company: 'Tech Corp',
                  duration: '2022-Present',
                  description: 'Developed web applications using React and Node.js'
                }
              ],
              education: [
                {
                  degree: 'Bachelor of Science in Computer Science',
                  institution: 'University of Technology',
                  graduationYear: '2020'
                }
              ]
            },
            resumeAnalytics: {
              wordCount: extractedText.split(' ').length,
              pageCount: 1,
              bulletPointCount: 6,
              quantifiableAchievements: 2,
              readabilityScore: 75
            }
          };
        }
        
        console.log('✅ AI analysis completed');
        console.log('📊 Analysis structure:');
        console.log('- score:', analysisResult.score);
        console.log('- roastFeedback:', !!analysisResult.roastFeedback);
        console.log('- strengths:', Array.isArray(analysisResult.strengths) ? analysisResult.strengths.length : 'Not array');
        console.log('- improvements:', Array.isArray(analysisResult.improvements) ? analysisResult.improvements.length : 'Not array');
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
          // Check available storage methods
          console.log('🔍 Available resumeStorageEnhanced methods:');
          console.log(Object.getOwnPropertyNames(resumeStorageEnhanced).filter(name => typeof resumeStorageEnhanced[name] === 'function'));
          
          let storageResult;
          
          if (typeof resumeStorageEnhanced.saveResumeData === 'function') {
            storageResult = await resumeStorageEnhanced.saveResumeData(
              mockFile,
              extractedText,
              analysisResult,
              preferences,
              metadata
            );
          } else {
            console.log('❌ saveResumeData method not found');
            storageResult = { success: false, error: 'Method not found' };
          }
          
          console.log('💾 Storage result:', {
            success: storageResult.success,
            resumeId: storageResult.resumeId,
            error: storageResult.error
          });
          
          if (storageResult.success) {
            console.log('✅ Data saved successfully!');
            
            // Verify in database
            const savedDoc = await collection.findOne({ resumeId: storageResult.resumeId });
            if (savedDoc) {
              console.log('✅ Document verified in database');
              console.log('📋 Document structure check:');
              console.log('- resumeId:', !!savedDoc.resumeId);
              console.log('- fileInfo:', !!savedDoc.fileInfo);
              console.log('- extractedInfo.personalInfo:', !!savedDoc.extractedInfo?.personalInfo);
              console.log('- analysis.overallScore:', savedDoc.analysis?.overallScore);
            }
          } else {
            console.log('❌ Storage failed:', storageResult.error);
          }
          
        } catch (storageError) {
          console.log('❌ Storage error:', storageError.message);
        }
        
      } catch (aiError) {
        console.log('❌ AI analysis error:', aiError.message);
        console.log('🔧 Using mock analysis instead...');
        // Continue with mock data for storage testing
      }
      
    } catch (extractError) {
      console.log('❌ Text extraction error:', extractError.message);
    }
    
    // Final count check
    const afterCount = await collection.countDocuments();
    console.log('\n📊 Final summary:');
    console.log('- Resumes before:', beforeCount);
    console.log('- Resumes after:', afterCount);
    console.log('- New documents:', afterCount - beforeCount);
    
    await mongoose.disconnect();
    console.log('\n✅ Debug completed');
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    console.error('📚 Stack trace:', error.stack);
  }
}

debugResumeStorage();
