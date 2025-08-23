const fs = require('fs');
const path = require('path');

const geminiServicePath = path.join(__dirname, 'services', 'geminiService.js');

try {
  // Read the geminiService file
  const fileContent = fs.readFileSync(geminiServicePath, 'utf8');
  
  console.log('🔍 Checking geminiService methods...');
  
  // Check for the method
  const hasGetComprehensiveAnalysis = fileContent.includes('getComprehensiveAnalysis');
  const hasGetAnalysis = fileContent.includes('getAnalysis');
  const hasAnalyzeResume = fileContent.includes('analyzeResume');
  
  console.log('📋 Available methods:');
  console.log('- getComprehensiveAnalysis:', hasGetComprehensiveAnalysis);
  console.log('- getAnalysis:', hasGetAnalysis);
  console.log('- analyzeResume:', hasAnalyzeResume);
  
  // Extract all method names
  const methodPattern = /^\s*(?:async\s+)?(\w+)\s*\(/gm;
  const methods = [];
  let match;
  
  while ((match = methodPattern.exec(fileContent)) !== null) {
    if (!['if', 'while', 'for', 'switch', 'catch'].includes(match[1])) {
      methods.push(match[1]);
    }
  }
  
  console.log('\n📝 Found methods:', methods);
  
  // Check exports
  const exportPattern = /module\.exports\s*=\s*{([^}]+)}/;
  const exportMatch = fileContent.match(exportPattern);
  
  if (exportMatch) {
    console.log('\n📤 Exported methods:', exportMatch[1].split(',').map(m => m.trim()));
  }
  
  // Try to import and check actual exported methods
  try {
    const geminiService = require(geminiServicePath);
    console.log('\n🔧 Actually exported methods:', Object.keys(geminiService));
  } catch (importError) {
    console.log('\n❌ Import failed:', importError.message);
  }
  
} catch (error) {
  console.error('❌ Failed to check geminiService:', error.message);
}