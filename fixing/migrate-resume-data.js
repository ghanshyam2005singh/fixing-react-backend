const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

async function migrateResumeData() {
  try {
    console.log('🔄 Starting resume data migration...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('resumes');
    
    // Find all documents with old structure
    const oldDocs = await collection.find({
      $or: [
        { resumeId: { $exists: false } },
        { fileInfo: { $exists: false } },
        { 'extractedInfo.personalInfo': { $exists: false } },
        { 'analysis.overallScore': { $exists: false } }
      ]
    }).toArray();
    
    console.log(`📊 Found ${oldDocs.length} documents to migrate`);
    
    if (oldDocs.length === 0) {
      console.log('✅ No migration needed - all documents are up to date');
      await mongoose.disconnect();
      return;
    }
    
    const migrationResults = [];
    
    for (let i = 0; i < oldDocs.length; i++) {
      const oldDoc = oldDocs[i];
      console.log(`🔄 Migrating document ${i + 1}/${oldDocs.length}: ${oldDoc._id}`);
      
      try {
        // Create new document structure
        const newDoc = {
          resumeId: oldDoc.resumeId || uuidv4(),
          
          // Map fileInfo from metadata
          fileInfo: {
            fileName: oldDoc.metadata?.originalFileName || oldDoc.fileName || 'unknown.pdf',
            originalFileName: oldDoc.metadata?.originalFileName || oldDoc.originalFileName || 'unknown.pdf',
            fileSize: oldDoc.metadata?.fileSize || oldDoc.fileSize || 0,
            mimeType: oldDoc.metadata?.fileType || oldDoc.mimeType || 'application/pdf',
            fileHash: oldDoc.fileHash || 'unknown'
          },
          
          // Map extractedInfo to new nested structure
          extractedInfo: {
            personalInfo: {
              name: oldDoc.extractedInfo?.name || oldDoc.name || null,
              email: oldDoc.extractedInfo?.email || oldDoc.email || null,
              phone: oldDoc.extractedInfo?.phone || oldDoc.phone || null,
              address: {
                full: oldDoc.extractedInfo?.address || oldDoc.address || null,
                city: oldDoc.extractedInfo?.city || null,
                state: oldDoc.extractedInfo?.state || null,
                country: oldDoc.extractedInfo?.country || null,
                zipCode: oldDoc.extractedInfo?.zipCode || null
              },
              socialProfiles: {
                linkedin: oldDoc.extractedInfo?.linkedIn || oldDoc.linkedIn || null,
                github: oldDoc.extractedInfo?.github || oldDoc.github || null,
                portfolio: oldDoc.extractedInfo?.portfolio || oldDoc.portfolio || null,
                website: oldDoc.extractedInfo?.website || null,
                twitter: oldDoc.extractedInfo?.twitter || null
              }
            },
            
            professionalSummary: oldDoc.extractedInfo?.professionalSummary || oldDoc.professionalSummary || null,
            
            skills: {
              technical: oldDoc.extractedInfo?.skills?.technical || oldDoc.skills?.technical || oldDoc.technicalSkills || [],
              soft: oldDoc.extractedInfo?.skills?.soft || oldDoc.skills?.soft || oldDoc.softSkills || [],
              languages: oldDoc.extractedInfo?.skills?.languages || oldDoc.languages || [],
              tools: oldDoc.extractedInfo?.skills?.tools || oldDoc.tools || [],
              frameworks: oldDoc.extractedInfo?.skills?.frameworks || oldDoc.frameworks || []
            },
            
            experience: oldDoc.extractedInfo?.experience || oldDoc.experience || [],
            education: oldDoc.extractedInfo?.education || oldDoc.education || [],
            certifications: oldDoc.extractedInfo?.certifications || oldDoc.certifications || [],
            projects: oldDoc.extractedInfo?.projects || oldDoc.projects || [],
            awards: oldDoc.extractedInfo?.awards || oldDoc.awards || [],
            volunteerWork: oldDoc.extractedInfo?.volunteerWork || oldDoc.volunteerWork || [],
            interests: oldDoc.extractedInfo?.interests || oldDoc.interests || [],
            references: oldDoc.extractedInfo?.references || oldDoc.references || null
          },
          
          // Map analysis data
          analysis: {
            overallScore: oldDoc.score || oldDoc.analysis?.overallScore || 0,
            scoringBreakdown: oldDoc.scoringBreakdown || oldDoc.analysis?.scoringBreakdown || {
              contactInfo: 50,
              workExperience: 50,
              education: 50,
              skills: 50,
              formatting: 50,
              atsCompatibility: 50
            },
            feedback: {
              roastFeedback: oldDoc.roastFeedback || oldDoc.analysis?.feedback?.roastFeedback || '',
              strengths: oldDoc.strengths || oldDoc.analysis?.feedback?.strengths || [],
              improvements: oldDoc.improvements || oldDoc.analysis?.feedback?.improvements || [],
              roastLevel: oldDoc.preferences?.roastLevel || 'professional',
              language: oldDoc.preferences?.language || 'english'
            },
            atsAnalysis: {
              keywordDensity: oldDoc.resumeAnalytics?.keywordDensity || 50,
              formattingScore: oldDoc.resumeAnalytics?.formattingScore || 75,
              readabilityScore: oldDoc.resumeAnalytics?.readabilityScore || 70,
              sectionStructure: oldDoc.resumeAnalytics?.sectionStructure || 80,
              fileFormatCompatibility: true
            }
          },
          
          // Map preferences
          preferences: {
            roastSettings: {
              level: oldDoc.preferences?.roastLevel || oldDoc.roastLevel || 'professional',
              language: oldDoc.preferences?.language || oldDoc.language || 'english',
              type: oldDoc.preferences?.roastType || oldDoc.roastType || 'professional',
              gender: oldDoc.preferences?.gender || oldDoc.gender || 'neutral',
              includeGaali: (oldDoc.preferences?.roastLevel || oldDoc.roastLevel) === 'dhang',
              targetIndustry: 'general'
            }
          },
          
          // Map document statistics
          documentStats: {
            wordCount: oldDoc.resumeAnalytics?.wordCount || oldDoc.wordCount || 0,
            pageCount: oldDoc.resumeAnalytics?.pageCount || oldDoc.pageCount || 1,
            paragraphCount: oldDoc.resumeAnalytics?.paragraphCount || 0,
            bulletPointCount: oldDoc.resumeAnalytics?.bulletPointCount || oldDoc.bulletPointCount || 0,
            linkCount: oldDoc.resumeAnalytics?.linkCount || 0,
            imageCount: oldDoc.resumeAnalytics?.imageCount || 0,
            tableCount: oldDoc.resumeAnalytics?.tableCount || 0
          },
          
          // Contact validation
          contactValidation: oldDoc.contactValidation || {
            hasEmail: !!(oldDoc.extractedInfo?.email || oldDoc.email),
            hasPhone: !!(oldDoc.extractedInfo?.phone || oldDoc.phone),
            hasLinkedIn: !!(oldDoc.extractedInfo?.linkedIn || oldDoc.linkedIn),
            hasAddress: !!(oldDoc.extractedInfo?.address || oldDoc.address),
            emailValid: true,
            phoneValid: true,
            linkedInValid: true
          },
          
          // Security info
          securityInfo: oldDoc.securityInfo || {
            clientIPHash: 'migrated',
            userAgentHash: 'migrated',
            countryCode: 'US',
            sessionId: uuidv4()
          },
          
          // Data governance
          dataGovernance: oldDoc.dataGovernance || {
            retentionDays: 90,
            autoDelete: true,
            gdprConsent: false,
            dataProcessingPurpose: 'resume_analysis',
            anonymized: true
          },
          
          // Processing status
          processingStatus: oldDoc.processingStatus || {
            current: 'completed',
            progress: 100,
            aiModel: 'gemini-1.5-flash',
            processingTime: 5000
          },
          
          // Timestamps
          timestamps: {
            uploadedAt: oldDoc.metadata?.uploadDate ? new Date(oldDoc.metadata.uploadDate) : 
                       oldDoc.uploadedAt ? new Date(oldDoc.uploadedAt) :
                       oldDoc.timestamps?.uploadedAt ? new Date(oldDoc.timestamps.uploadedAt) :
                       new Date(),
            processingStartedAt: oldDoc.timestamps?.processingStartedAt || new Date(),
            processingCompletedAt: oldDoc.timestamps?.processingCompletedAt || new Date(),
            lastAccessedAt: oldDoc.timestamps?.lastAccessedAt || new Date(),
            expiresAt: new Date(Date.now() + (90 * 24 * 60 * 60 * 1000))
          }
        };
        
        // Replace the old document with new structure
        await collection.replaceOne(
          { _id: oldDoc._id },
          newDoc
        );
        
        migrationResults.push({
          _id: oldDoc._id,
          resumeId: newDoc.resumeId,
          status: 'success'
        });
        
        console.log(`✅ Migrated: ${oldDoc._id} → ${newDoc.resumeId}`);
        
      } catch (error) {
        console.error(`❌ Failed to migrate ${oldDoc._id}:`, error.message);
        migrationResults.push({
          _id: oldDoc._id,
          status: 'failed',
          error: error.message
        });
      }
    }
    
    // Summary
    const successful = migrationResults.filter(r => r.status === 'success').length;
    const failed = migrationResults.filter(r => r.status === 'failed').length;
    
    console.log('\n📊 Migration Summary:');
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📝 Total: ${migrationResults.length}`);
    
    // Verify migration
    console.log('\n🔍 Verifying migration...');
    const verificationDocs = await collection.find({}).limit(3).toArray();
    
    if (verificationDocs.length > 0) {
      const doc = verificationDocs[0];
      console.log('✅ Sample migrated document structure:');
      console.log('- resumeId:', !!doc.resumeId);
      console.log('- fileInfo:', !!doc.fileInfo);
      console.log('- extractedInfo.personalInfo:', !!doc.extractedInfo?.personalInfo);
      console.log('- analysis.overallScore:', !!doc.analysis?.overallScore);
      console.log('- timestamps.uploadedAt:', !!doc.timestamps?.uploadedAt);
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', {
      message: error.message,
      stack: error.stack
    });
  }
}

migrateResumeData();