const mongoose = require('mongoose');
require('dotenv').config();

// Set up temp API key for testing
if (!process.env.GEMINI_API_KEY) {
  process.env.GEMINI_API_KEY = 'test-key-for-debugging';
}

async function debugAIResponse() {
  try {
    console.log('🔍 Debugging AI Response Structure...');
    
    // Import gemini service
    const geminiService = require('./services/geminiService');
    console.log('✅ GeminiService imported');
    
    // Check available methods
    console.log('📋 Available methods:', Object.getOwnPropertyNames(geminiService));
    
    // Test data
    const testText = `
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

    const testPreferences = {
      gender: 'male',
      roastLevel: 'professional',
      roastType: 'constructive',
      language: 'english'
    };
    
    console.log('\n🤖 Testing AI analysis...');
    
    // Test the method
    if (typeof geminiService.analyzeResume === 'function') {
      try {
        // Call with different parameter combinations
        console.log('📝 Calling analyzeResume with 2 parameters...');
        let result1 = await geminiService.analyzeResume(testText, testPreferences);
        console.log('Result 1:', {
          success: result1?.success,
          hasData: !!result1?.data,
          keys: result1 ? Object.keys(result1) : []
        });
        
        console.log('📝 Calling analyzeResume with 3 parameters...');
        let result2 = await geminiService.analyzeResume(testText, testPreferences, 'test-resume.txt');
        console.log('Result 2:', {
          success: result2?.success,
          hasData: !!result2?.data,
          keys: result2 ? Object.keys(result2) : []
        });
        
        // Check the actual structure
        const result = result2 || result1;
        if (result) {
          console.log('\n📊 Full result structure:');
          console.log('- success:', result.success);
          console.log('- error:', result.error);
          console.log('- data:', !!result.data);
          
          if (result.data) {
            console.log('- data keys:', Object.keys(result.data));
            console.log('- score:', result.data.score);
            console.log('- roastFeedback:', typeof result.data.roastFeedback, result.data.roastFeedback?.length || 0);
            console.log('- strengths:', Array.isArray(result.data.strengths), result.data.strengths?.length || 0);
            console.log('- improvements:', Array.isArray(result.data.improvements), result.data.improvements?.length || 0);
          }
        }
        
      } catch (aiError) {
        console.log('❌ AI call failed:', {
          message: aiError.message,
          name: aiError.name,
          stack: aiError.stack?.split('\n').slice(0, 3)
        });
        
        // Create mock response for testing storage
        console.log('\n🛠️ Creating mock response...');
        const mockResponse = {
          success: true,
          data: {
            score: 78,
            roastFeedback: "Your resume shows good technical skills, but could benefit from more quantifiable achievements. Consider adding specific metrics to demonstrate your impact.",
            strengths: [
              "Clear contact information",
              "Relevant technical skills listed",
              "Good work experience progression",
              "Education details included"
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
              skills: {
                technical: ["JavaScript", "React", "Node.js", "Python", "Django", "MongoDB", "PostgreSQL"],
                soft: ["Leadership", "Mentoring"],
                languages: [],
                tools: [],
                frameworks: ["React", "Django"]
              },
              experience: [
                {
                  title: "Senior Developer",
                  company: "Tech Corp",
                  duration: "2022-Present",
                  achievements: [
                    "Led development of web applications",
                    "Improved performance by 40%",
                    "Mentored junior developers"
                  ]
                }
              ],
              education: [
                {
                  degree: "BS Computer Science",
                  institution: "State University",
                  graduationYear: "2019"
                }
              ]
            },
            resumeAnalytics: {
              wordCount: testText.split(/\s+/).length,
              pageCount: 1,
              sectionCount: 5,
              bulletPointCount: 6,
              quantifiableAchievements: 2,
              readabilityScore: 75,
              atsCompatibility: "High"
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
          }
        };
        
        console.log('✅ Mock response created');
        return mockResponse;
      }
    } else {
      console.log('❌ analyzeResume method not found');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugAIResponse();