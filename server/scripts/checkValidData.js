const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-study');

const Participant = require('../models/Participant');

async function checkValidData() {
  try {
    await mongoose.connection;
    
    const all = await Participant.find({}).sort({ participantId: 1 });
    const valid = all.filter(p => p.demographics.major && p.demographics.major !== 'undefined');
    const invalid = all.filter(p => !p.demographics.major || p.demographics.major === 'undefined');
    
    console.log(`\n📊 Data Status:`);
    console.log(`   Total: ${all.length}`);
    console.log(`   Valid (with proper major): ${valid.length}`);
    console.log(`   Invalid (undefined major): ${invalid.length}\n`);
    
    console.log('✅ Valid participants (first 30):');
    valid.slice(0, 30).forEach(p => {
      console.log(`  ${p.participantId}: ${p.demographics.major} (${p.demographics.academicLevel})`);
    });
    
    if (valid.length > 30) {
      console.log(`  ... and ${valid.length - 30} more`);
    }
    
    console.log(`\n❌ Invalid participants (undefined major) - first 20:`);
    invalid.slice(0, 20).forEach(p => {
      console.log(`  ${p.participantId}: undefined (${p.demographics.academicLevel || 'undefined'})`);
    });
    
    if (invalid.length > 20) {
      console.log(`  ... and ${invalid.length - 20} more`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkValidData();
