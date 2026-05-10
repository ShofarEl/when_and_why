const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-study', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Participant = require('../models/Participant');

async function removeTestData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connection;
    console.log('Connected successfully!');
    
    // Find participants with "test" in major field (case-insensitive)
    const testParticipants = await Participant.find({
      'demographics.major': /test/i
    });
    
    console.log(`\nFound ${testParticipants.length} participants with "test" in major field:`);
    testParticipants.forEach(p => {
      console.log(`  - ${p.participantId}: ${p.demographics.major}`);
    });
    
    if (testParticipants.length > 0) {
      console.log('\nRemoving test participants...');
      const result = await Participant.deleteMany({
        'demographics.major': /test/i
      });
      
      console.log(`✅ Removed ${result.deletedCount} test participants`);
    } else {
      console.log('\n✅ No test participants found');
    }
    
    // Also check for other test-related fields
    const otherTests = await Participant.find({
      $or: [
        { 'demographics.academicLevel': /test/i },
        { participantId: /test/i }
      ]
    });
    
    if (otherTests.length > 0) {
      console.log(`\nFound ${otherTests.length} other test entries:`);
      otherTests.forEach(p => {
        console.log(`  - ${p.participantId}: ${p.demographics.academicLevel || 'N/A'}`);
      });
      
      const result2 = await Participant.deleteMany({
        $or: [
          { 'demographics.academicLevel': /test/i },
          { participantId: /test/i }
        ]
      });
      
      console.log(`✅ Removed ${result2.deletedCount} additional test entries`);
    }
    
    // Show final count
    const finalCount = await Participant.countDocuments();
    console.log(`\n📊 Final participant count: ${finalCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error removing test data:', error);
    process.exit(1);
  }
}

removeTestData();
