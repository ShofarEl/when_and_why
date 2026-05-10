const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-study', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Participant = require('../models/Participant');

async function previewTestData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connection;
    console.log('Connected successfully!\n');
    
    // Find all participants
    const allParticipants = await Participant.find({}).sort({ participantId: 1 });
    console.log(`📊 Total participants in database: ${allParticipants.length}\n`);
    
    // Identify test participants
    const testCriteria = {
      $or: [
        { 'demographics.major': /test/i },
        { 'demographics.academicLevel': /test/i },
        { 'demographics.major': /^t$/i },
        { participantId: /test/i }
      ]
    };
    
    const testParticipants = await Participant.find(testCriteria).sort({ participantId: 1 });
    
    console.log('🔍 TEST PARTICIPANTS TO BE REMOVED:\n');
    console.log('=' .repeat(80));
    
    if (testParticipants.length > 0) {
      testParticipants.forEach(p => {
        console.log(`${p.participantId}: ${p.demographics.major || 'N/A'} | ${p.demographics.academicLevel || 'N/A'} | Age: ${p.demographics.age || 'N/A'}`);
      });
      console.log('=' .repeat(80));
      console.log(`\n⚠️  ${testParticipants.length} test participants will be removed\n`);
    } else {
      console.log('✅ No test participants found!\n');
    }
    
    // Show clean participants
    const cleanParticipants = allParticipants.filter(p => {
      const major = (p.demographics.major || '').toLowerCase();
      const level = (p.demographics.academicLevel || '').toLowerCase();
      return !major.includes('test') && !level.includes('test') && 
             major.length >= 3 && level.length >= 3;
    });
    
    console.log('✅ CLEAN PARTICIPANTS (will be kept):\n');
    console.log('=' .repeat(80));
    
    // Show first 20 and last 20
    const showCount = Math.min(20, cleanParticipants.length);
    console.log(`\nFirst ${showCount}:`);
    cleanParticipants.slice(0, showCount).forEach(p => {
      console.log(`${p.participantId}: ${p.demographics.major} | ${p.demographics.academicLevel} | Age: ${p.demographics.age}`);
    });
    
    if (cleanParticipants.length > 40) {
      console.log('\n...');
      console.log(`\nLast ${showCount}:`);
      cleanParticipants.slice(-showCount).forEach(p => {
        console.log(`${p.participantId}: ${p.demographics.major} | ${p.demographics.academicLevel} | Age: ${p.demographics.age}`);
      });
    }
    
    console.log('=' .repeat(80));
    console.log(`\n📊 Summary:`);
    console.log(`   Total: ${allParticipants.length}`);
    console.log(`   Test (to remove): ${testParticipants.length}`);
    console.log(`   Clean (to keep): ${cleanParticipants.length}`);
    
    // Show unique majors in clean data
    const uniqueMajors = [...new Set(cleanParticipants.map(p => p.demographics.major))].sort();
    console.log(`\n📚 Unique majors in clean data (${uniqueMajors.length}):`);
    uniqueMajors.forEach(major => {
      const count = cleanParticipants.filter(p => p.demographics.major === major).length;
      console.log(`   - ${major}: ${count} participants`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('\n💡 To remove test data, run: node cleanTestData.js\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

previewTestData();
