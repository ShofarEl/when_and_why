const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-study', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Participant = require('../models/Participant');

async function cleanTestData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connection;
    console.log('Connected successfully!\n');
    
    // Find all participants with test-related data or gibberish
    const testCriteria = {
      $or: [
        { 'demographics.major': /test/i },
        { 'demographics.academicLevel': /test/i },
        { 'demographics.major': /^t$/i }, // Single letter "t"
        { participantId: /test/i },
        { 'demographics.academicLevel': /other/i }, // "other" is not valid
        { 'demographics.major': /^[a-z]{8,}$/i }, // Random gibberish like "xhfdcjhkj"
        { 'demographics.major': /^[xyzq]{3,}/i } // Starts with uncommon letters
      ]
    };
    
    const testParticipants = await Participant.find(testCriteria);
    
    console.log(`🔍 Found ${testParticipants.length} test participants:\n`);
    
    if (testParticipants.length > 0) {
      testParticipants.forEach(p => {
        console.log(`  ${p.participantId}: ${p.demographics.major || 'N/A'} (${p.demographics.academicLevel || 'N/A'})`);
      });
      
      console.log('\n🗑️  Removing test participants...');
      const result = await Participant.deleteMany(testCriteria);
      console.log(`✅ Removed ${result.deletedCount} test participants\n`);
    } else {
      console.log('✅ No test participants found\n');
    }
    
    // Verify remaining data
    const remaining = await Participant.find({});
    console.log(`📊 Total remaining participants: ${remaining.length}\n`);
    
    // Check for any suspicious entries
    console.log('🔍 Checking for suspicious entries...\n');
    
    const suspicious = remaining.filter(p => {
      const major = (p.demographics.major || '').toLowerCase();
      const level = (p.demographics.academicLevel || '').toLowerCase();
      return major.length < 3 || level.length < 3 || 
             major.includes('test') || level.includes('test');
    });
    
    if (suspicious.length > 0) {
      console.log(`⚠️  Found ${suspicious.length} suspicious entries:`);
      suspicious.forEach(p => {
        console.log(`  ${p.participantId}: ${p.demographics.major} (${p.demographics.academicLevel})`);
      });
    } else {
      console.log('✅ All remaining data looks clean!');
    }
    
    // Show sample of clean data
    console.log('\n📋 Sample of clean participants:');
    const sample = remaining.slice(0, 10);
    sample.forEach(p => {
      console.log(`  ${p.participantId}: ${p.demographics.major} (${p.demographics.academicLevel}, age ${p.demographics.age})`);
    });
    
    console.log(`\n✅ Cleanup complete! ${remaining.length} participants remaining.\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanTestData();
