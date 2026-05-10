const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-study', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Participant = require('../models/Participant');

async function resetAndRegenerate() {
  try {
    console.log('⚠️  WARNING: This will remove ALL participants and regenerate clean data\n');
    console.log('Connecting to MongoDB...');
    await mongoose.connection;
    console.log('Connected successfully!\n');
    
    // Count current participants
    const currentCount = await Participant.countDocuments();
    console.log(`Current participants in database: ${currentCount}\n`);
    
    // Remove all participants
    console.log('🗑️  Removing all participants...');
    const result = await Participant.deleteMany({});
    console.log(`✅ Removed ${result.deletedCount} participants\n`);
    
    // Verify empty
    const afterCount = await Participant.countDocuments();
    console.log(`Participants remaining: ${afterCount}\n`);
    
    if (afterCount === 0) {
      console.log('✅ Database is clean and ready for fresh data generation\n');
      console.log('📝 Next step: Run the generation script');
      console.log('   cd server/scripts');
      console.log('   node generateRealisticData.js\n');
    } else {
      console.log('⚠️  Warning: Some participants still remain\n');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetAndRegenerate();
