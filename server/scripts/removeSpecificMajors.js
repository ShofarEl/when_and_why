const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-study', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Participant = require('../models/Participant');

async function removeSpecificMajors() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connection;
    console.log('Connected successfully!\n');
    
    // Find participants with CS, VC, VS, or test as major (exact match, case-insensitive)
    const criteria = {
      'demographics.major': { 
        $in: [/^CS$/i, /^VC$/i, /^VS$/i, /^test$/i, /^Cs$/i] 
      }
    };
    
    const toRemove = await Participant.find(criteria).sort({ participantId: 1 });
    
    console.log(`🔍 Found ${toRemove.length} participants with major = CS, VC, VS, or test:\n`);
    
    if (toRemove.length > 0) {
      toRemove.forEach(p => {
        console.log(`  ${p.participantId}: major="${p.demographics.major}", level="${p.demographics.academicLevel}", age=${p.demographics.age}`);
      });
      
      console.log(`\n🗑️  Removing these ${toRemove.length} participants from database...\n`);
      
      const result = await Participant.deleteMany(criteria);
      
      console.log(`✅ Removed ${result.deletedCount} participants\n`);
    } else {
      console.log('✅ No participants with major = CS, VC, VS, or test found\n');
    }
    
    // Show final count
    const finalCount = await Participant.countDocuments();
    console.log(`📊 Total participants remaining: ${finalCount}\n`);
    
    // Show sample of remaining participants
    console.log('📋 Sample of remaining participants (first 15):');
    const sample = await Participant.find({}).limit(15).sort({ participantId: 1 });
    sample.forEach(p => {
      console.log(`  ${p.participantId}: ${p.demographics.major || 'undefined'} (${p.demographics.academicLevel || 'undefined'})`);
    });
    
    console.log('\n✅ Done! Participants with major = CS, VC, VS, or test have been removed from database.\n');
    console.log('💡 Next step: Re-export data with: node exportToCSV.js\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

removeSpecificMajors();
