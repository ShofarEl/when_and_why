const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-study', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Participant = require('../models/Participant');

async function removeOnlyTestMajor() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connection;
    console.log('Connected successfully!\n');
    
    // Find ONLY participants where major is exactly "test" (case-insensitive)
    const testParticipants = await Participant.find({
      'demographics.major': /^test$/i
    });
    
    console.log(`🔍 Found ${testParticipants.length} participants with major = "test":\n`);
    
    if (testParticipants.length > 0) {
      testParticipants.forEach(p => {
        console.log(`  ${p.participantId}: major="${p.demographics.major}", level="${p.demographics.academicLevel}", age=${p.demographics.age}`);
      });
      
      console.log(`\n🗑️  Removing ONLY these ${testParticipants.length} participants...\n`);
      
      const result = await Participant.deleteMany({
        'demographics.major': /^test$/i
      });
      
      console.log(`✅ Removed ${result.deletedCount} participants with major="test"\n`);
    } else {
      console.log('✅ No participants with major="test" found\n');
    }
    
    // Show final count
    const finalCount = await Participant.countDocuments();
    console.log(`📊 Total participants remaining: ${finalCount}\n`);
    
    // Show sample of remaining participants
    console.log('📋 Sample of remaining participants:');
    const sample = await Participant.find({}).limit(10).sort({ participantId: 1 });
    sample.forEach(p => {
      console.log(`  ${p.participantId}: ${p.demographics.major || 'undefined'} (${p.demographics.academicLevel || 'undefined'})`);
    });
    
    console.log('\n✅ Done! Only participants with major="test" were removed.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

removeOnlyTestMajor();
