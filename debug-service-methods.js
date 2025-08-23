const path = require('path');

// Function to safely check service methods
function checkServiceMethods() {
  console.log('🔍 Checking all service methods...\n');
  
  // Check fileProcessor
  try {
    const fileProcessor = require('../services/fileProcessor');
    console.log('📄 FileProcessor methods:', Object.getOwnPropertyNames(fileProcessor).filter(name => typeof fileProcessor[name] === 'function'));
    console.log('- Has extractTextFromFile:', typeof fileProcessor.extractTextFromFile === 'function');
  } catch (error) {
    console.log('❌ FileProcessor error:', error.message);
  }
  
  // Check geminiService
  try {
    const geminiService = require('../services/geminiService');
    console.log('\n🤖 GeminiService methods:', Object.getOwnPropertyNames(geminiService).filter(name => typeof geminiService[name] === 'function'));
    console.log('- Has getComprehensiveAnalysis:', typeof geminiService.getComprehensiveAnalysis === 'function');
    console.log('- Has getAnalysis:', typeof geminiService.getAnalysis === 'function');
    console.log('- Has analyzeResume:', typeof geminiService.analyzeResume === 'function');
  } catch (error) {
    console.log('❌ GeminiService error:', error.message);
  }
  
  // Check resumeStorageEnhanced
  try {
    const resumeStorage = require('../services/resumeStorageEnhanced');
    console.log('\n💾 ResumeStorage methods:', Object.getOwnPropertyNames(resumeStorage).filter(name => typeof resumeStorage[name] === 'function'));
    console.log('- Has saveResumeData:', typeof resumeStorage.saveResumeData === 'function');
  } catch (error) {
    console.log('❌ ResumeStorage error:', error.message);
  }
}

checkServiceMethods();