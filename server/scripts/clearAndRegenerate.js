const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-study', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Participant = require('../models/Participant');

async function clearAndRegenerate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connection;
    console.log('Connected successfully!');
    
    // Delete all existing participants
    const deleteResult = await Participant.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing participants`);
    
    console.log('\nNow run: node generateRealisticData.js');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

clearAndRegenerate();
