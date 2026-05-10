const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../exports/THESIS_READY_DATASET.csv');
const content = fs.readFileSync(csvPath, 'utf-8');
const lines = content.split('\n').filter(l => l.trim());

console.log('\n📊 VERIFYING THESIS_READY_DATASET.csv\n');
console.log('='.repeat(80));

// Parse CSV properly (handle quoted fields with commas)
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
console.log(`\n✅ Total rows: ${lines.length - 1}`);
console.log(`✅ Columns: ${headers.length}\n`);

// Find column indices
const taskTypeIdx = headers.indexOf('taskType');
const reflectionIdx = headers.indexOf('reflection');
const rationaleCountIdx = headers.indexOf('rationaleCount');
const rationaleTextsIdx = headers.indexOf('rationaleTexts');
const ideasListIdx = headers.indexOf('ideasList');
const participantIdIdx = headers.indexOf('participantId');
const timingIdx = headers.indexOf('timing');

console.log('Column indices:');
console.log(`  taskType: ${taskTypeIdx}`);
console.log(`  rationaleTexts: ${rationaleTextsIdx}`);
console.log(`  ideasList: ${ideasListIdx}\n`);

// Check a few rows
let experimentalWithRationales = 0;
let transferWithIdeas = 0;

for (let i = 1; i < Math.min(20, lines.length); i++) {
  const row = parseCSVLine(lines[i]);
  
  const taskType = row[taskTypeIdx];
  const reflection = row[reflectionIdx];
  const rationaleCount = parseInt(row[rationaleCountIdx]) || 0;
  const rationaleText = row[rationaleTextsIdx] || '';
  const ideasList = row[ideasListIdx] || '';
  const participantId = row[participantIdIdx];
  const timing = row[timingIdx];
  
  if (taskType === 'experimental' && reflection === 'required' && rationaleText.length > 20) {
    experimentalWithRationales++;
    if (experimentalWithRationales <= 2) {
      console.log(`✅ Row ${i} - Experimental with rationale:`);
      console.log(`   Participant: ${participantId}`);
      console.log(`   Condition: ${timing}+${reflection}`);
      console.log(`   Rationale: "${rationaleText.substring(0, 100)}..."\n`);
    }
  }
  
  if (taskType === 'transfer_baseline' && ideasList.length > 20) {
    transferWithIdeas++;
    if (transferWithIdeas <= 2) {
      console.log(`✅ Row ${i} - Transfer task with ideas:`);
      console.log(`   Participant: ${participantId}`);
      console.log(`   Ideas: "${ideasList.substring(0, 100)}..."\n`);
    }
  }
}

console.log('='.repeat(80));
console.log(`\n📊 Summary (first 20 rows):`);
console.log(`   Experimental with rationales: ${experimentalWithRationales}`);
console.log(`   Transfer with ideas: ${transferWithIdeas}\n`);

// Count totals
const experimental = lines.filter(l => l.includes('experimental')).length;
const transfer = lines.filter(l => l.includes('transfer_baseline')).length;

console.log(`📊 Total counts:`);
console.log(`   Experimental sessions: ${experimental}`);
console.log(`   Transfer tasks: ${transfer}`);
console.log(`   Total data rows: ${lines.length - 1}\n`);

if (experimentalWithRationales > 0 && transferWithIdeas > 0) {
  console.log('🎉 SUCCESS! Both rationales and transfer task ideas are present!\n');
  console.log('✅ Your dataset is complete and ready for analysis!\n');
} else {
  console.log('⚠️  WARNING: Some data may be missing\n');
}
