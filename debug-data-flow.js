const mongoose = require('mongoose');
require('dotenv').config();

async function debugDataFlow() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('resumes');
    
    // Check collection stats using countDocuments instead of stats()
    console.log('📊 Collection Analysis:');
    
    // Get document count
    const documentCount = await collection.countDocuments();
    console.log('- Total Documents:', documentCount);
    
    // Get collection info
    const collections = await db.listCollections({ name: 'resumes' }).toArray();
    console.log('- Collection exists:', collections.length > 0);
    
    // Check if collection has any indexes
    const indexes = await collection.indexes();
    console.log('- Indexes count:', indexes.length);
    
    // Find sample documents
    console.log('\n📄 Sample Documents Analysis:');
    const allDocs = await collection.find({}).limit(3).toArray();
    console.log('- Sample count:', allDocs.length);
    
    if (allDocs.length > 0) {
      allDocs.forEach((doc, index) => {
        console.log(`\n🔍 Document ${index + 1} Structure:`);
        console.log('- _id:', !!doc._id);
        console.log('- resumeId:', !!doc.resumeId);
        console.log('- fileInfo:', !!doc.fileInfo);
        console.log('- extractedInfo:', !!doc.extractedInfo);
        console.log('- analysis:', !!doc.analysis);
        console.log('- timestamps:', !!doc.timestamps);
        console.log('- preferences:', !!doc.preferences);
        console.log('- documentStats:', !!doc.documentStats);
        
        // Check nested structures
        if (doc.fileInfo) {
          console.log('  - fileInfo.originalFileName:', !!doc.fileInfo.originalFileName);
          console.log('  - fileInfo.fileSize:', !!doc.fileInfo.fileSize);
        }
        
        if (doc.extractedInfo) {
          console.log('  - extractedInfo.personalInfo:', !!doc.extractedInfo.personalInfo);
          console.log('  - extractedInfo.skills:', !!doc.extractedInfo.skills);
          console.log('  - extractedInfo.experience:', !!doc.extractedInfo.experience);
          
          if (doc.extractedInfo.personalInfo) {
            console.log('    - personalInfo.name:', doc.extractedInfo.personalInfo.name || 'NULL');
            console.log('    - personalInfo.email:', doc.extractedInfo.personalInfo.email || 'NULL');
          }
        }
        
        if (doc.analysis) {
          console.log('  - analysis.overallScore:', doc.analysis.overallScore || 'NULL');
          console.log('  - analysis.feedback:', !!doc.analysis.feedback);
        }
        
        if (doc.timestamps) {
          console.log('  - timestamps.uploadedAt:', doc.timestamps.uploadedAt || 'NULL');
        }
      });
    }
    
    // Test specific queries that admin panel uses
    console.log('\n🔧 Admin Panel Query Tests:');
    
    // Test dashboard query
    const dashboardQuery = await collection.find(
      {},
      {
        projection: {
          resumeId: 1,
          'fileInfo.originalFileName': 1,
          'analysis.overallScore': 1,
          'timestamps.uploadedAt': 1,
          'extractedInfo.personalInfo.name': 1
        }
      }
    ).limit(5).toArray();
    
    console.log('- Dashboard query results:', dashboardQuery.length);
    dashboardQuery.forEach((doc, index) => {
      console.log(`  Document ${index + 1}:`, {
        resumeId: doc.resumeId || 'MISSING',
        fileName: doc.fileInfo?.originalFileName || 'MISSING',
        score: doc.analysis?.overallScore || 'MISSING',
        name: doc.extractedInfo?.personalInfo?.name || 'MISSING',
        uploadedAt: doc.timestamps?.uploadedAt || 'MISSING'
      });
    });
    
    // Test aggregation for average score
    console.log('\n📈 Score Analysis:');
    const scoreAggregation = await collection.aggregate([
      { 
        $match: { 
          'analysis.overallScore': { $exists: true, $ne: null }
        }
      },
      { 
        $group: { 
          _id: null, 
          avgScore: { $avg: '$analysis.overallScore' },
          maxScore: { $max: '$analysis.overallScore' },
          minScore: { $min: '$analysis.overallScore' },
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    
    if (scoreAggregation.length > 0) {
      const stats = scoreAggregation[0];
      console.log('- Documents with scores:', stats.count);
      console.log('- Average score:', Math.round(stats.avgScore * 10) / 10);
      console.log('- Score range:', `${stats.minScore} - ${stats.maxScore}`);
    } else {
      console.log('- No documents with valid scores found');
    }
    
    // Test today's uploads
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCount = await collection.countDocuments({
      'timestamps.uploadedAt': { $gte: today }
    });
    console.log('- Today\'s uploads:', todayCount);
    
    // Check for common data issues
    console.log('\n🔍 Data Quality Check:');
    
    const issues = {
      missingResumeId: await collection.countDocuments({ resumeId: { $exists: false } }),
      missingExtractedInfo: await collection.countDocuments({ extractedInfo: { $exists: false } }),
      missingAnalysis: await collection.countDocuments({ analysis: { $exists: false } }),
      missingScore: await collection.countDocuments({ 'analysis.overallScore': { $exists: false } }),
      missingTimestamp: await collection.countDocuments({ 'timestamps.uploadedAt': { $exists: false } })
    };
    
    console.log('- Data quality issues:', issues);
    
    // Sample raw document structure
    if (allDocs.length > 0) {
      console.log('\n📋 Sample Raw Document:');
      const sample = JSON.stringify(allDocs[0], null, 2);
      console.log(sample.substring(0, 1000) + (sample.length > 1000 ? '...' : ''));
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Debug completed successfully');
    
  } catch (error) {
    console.error('\n❌ Debug failed:', {
      message: error.message,
      name: error.name,
      code: error.code
    });
    
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

debugDataFlow();