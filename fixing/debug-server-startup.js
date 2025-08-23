const fs = require('fs');
const path = require('path');

console.log('🔍 Debugging Server Startup...');

// Check .env file
const envPath = path.join(__dirname, '.env');
console.log('📄 .env file exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('📋 .env file length:', envContent.length);
  console.log('📋 Has GEMINI_API_KEY:', envContent.includes('GEMINI_API_KEY'));
  console.log('📋 Has MONGODB_URI:', envContent.includes('MONGODB_URI'));
}

// Load environment variables
require('dotenv').config();

console.log('\n🔧 Environment Variables:');
console.log('- GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'SET' : 'MISSING');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'MISSING');
console.log('- PORT:', process.env.PORT || 'NOT SET');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'NOT SET');

// Test individual service imports
console.log('\n🧪 Testing Service Imports...');

try {
  console.log('📦 Testing mongoose...');
  const mongoose = require('mongoose');
  console.log('✅ mongoose imported');
} catch (error) {
  console.log('❌ mongoose failed:', error.message);
}

try {
  console.log('📦 Testing database config...');
  const { connectDB } = require('../config/database');
  console.log('✅ database config imported');
} catch (error) {
  console.log('❌ database config failed:', error.message);
}

try {
  console.log('📦 Testing geminiService...');
  const geminiService = require('../services/geminiService');
  console.log('✅ geminiService imported');
} catch (error) {
  console.log('❌ geminiService failed:', error.message);
}

try {
  console.log('📦 Testing fileProcessor...');
  const fileProcessor = require('../services/fileProcessor');
  console.log('✅ fileProcessor imported');
} catch (error) {
  console.log('❌ fileProcessor failed:', error.message);
}

try {
  console.log('📦 Testing resumeStorage...');
  const resumeStorage = require('../services/resumeStorageEnhanced');
  console.log('✅ resumeStorage imported');
} catch (error) {
  console.log('❌ resumeStorage failed:', error.message);
}

try {
  console.log('📦 Testing resume routes...');
  const resumeRoutes = require('../routes/resume');
  console.log('✅ resume routes imported');
} catch (error) {
  console.log('❌ resume routes failed:', error.message);
}

try {
  console.log('📦 Testing admin routes...');
  const adminRoutes = require('../routes/admin');
  console.log('✅ admin routes imported');
} catch (error) {
  console.log('❌ admin routes failed:', error.message);
}

console.log('\n🎯 Testing Complete!');