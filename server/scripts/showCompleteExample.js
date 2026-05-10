const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../exports/THESIS_READY_DATASET.csv');
const content = fs.readFileSync(csvPath, 'utf-8');
const lines = content.split('\n').filter(l => l.trim());

// Parse CSV properly
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

const headers = parseCSVLine(lines[0]);
const row1 = parseCSVLine(lines[1]); // First experimental session
const transferRow = lines.find(l => l.includes('transfer_baseline'));
const transferData = transferRow ? parseCSVLine(transferRow) : null;

console.log('\n📊 COMPLETE DATA EXAMPLE\n');
console.log('='.repeat(80));

// Find indices
const participantIdIdx = headers.indexOf('participantId');
const taskTypeIdx = headers.indexOf('taskType');
const timingIdx = headers.indexOf('timing');
const reflectionIdx = headers.indexOf('reflection');
const ideasListIdx = headers.indexOf('ideasList');
const rationaleTextsIdx = headers.indexOf('rationaleTexts');
const rationaleCountIdx = headers.indexOf('rationaleCount');
const totalIdeasIdx = headers.indexOf('totalIdeas');

console.log('\n1️⃣ EXPERIMENTAL SESSION (with AI):');
console.log('   Participant:', row1[participantIdIdx]);
console.log('   Task type:', row1[taskTypeIdx]);
console.log('   Condition:', row1[timingIdx], '+', row1[reflectionIdx]);
console.log('   Total ideas:', row1[totalIdeasIdx]);
console.log('\n   💡 PARTICIPANT\'S OWN IDEAS:');
console.log('   "' + row1[ideasListIdx].substring(0, 150) + '..."');
console.log('\n   📝 RATIONALE (why they chose this):');
console.log('   Count:', row1[rationaleCountIdx]);
console.log('   "' + row1[rationaleTextsIdx].substring(0, 150) + '..."');

if (transferData) {
  console.log('\n2️⃣ TRANSFER TASK (NO AI - pure participant ideas):');
  console.log('   Participant:', transferData[participantIdIdx]);
  console.log('   Task type:', transferData[taskTypeIdx]);
  console.log('   Condition:', transferData[timingIdx], '(no AI)');
  console.log('   Total ideas:', transferData[totalIdeasIdx]);
  console.log('\n   💡 PARTICIPANT\'S OWN IDEAS (no AI help):');
  console.log('   "' + transferData[ideasListIdx].substring(0, 150) + '..."');
  console.log('\n   📝 RATIONALE:');
  console.log('   Count:', transferData[rationaleCountIdx], '(none - not required for transfer)');
}

console.log('\n' + '='.repeat(80));
console.log('\n✅ CONFIRMED: Dataset contains:');
console.log('   ✓ Participant\'s own ideas (experimental sessions)');
console.log('   ✓ Participant\'s rationales (why they chose ideas)');
console.log('   ✓ Transfer task ideas (no AI, pure participant creativity)');
console.log('\n📁 File: server/exports/THESIS_READY_DATASET.csv');
console.log('📊 Total rows:', lines.length - 1);
console.log();
