const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../exports/THESIS_READY_DATASET.csv');
const content = fs.readFileSync(csvPath, 'utf-8');
const lines = content.split('\n');

console.log('\n📊 VERIFYING RATIONALES AND TRANSFER TASKS\n');
console.log('='.repeat(80));

// Parse header
const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
const rationaleTextIndex = headers.indexOf('rationaleTexts');
const rationaleCountIndex = headers.indexOf('rationaleCount');
const taskTypeIndex = headers.indexOf('taskType');
const ideasListIndex = headers.indexOf('ideasList');

console.log(`\nColumn indices:`);
console.log(`  rationaleTexts: ${rationaleTextIndex}`);
console.log(`  rationaleCount: ${rationaleCountIndex}`);
console.log(`  taskType: ${taskTypeIndex}`);
console.log(`  ideasList: ${ideasListIndex}\n`);

// Check a few rows
let experimentalWithRationales = 0;
let transferWithIdeas = 0;

for (let i = 1; i < Math.min(50, lines.length); i++) {
  const line = lines[i];
  if (!line.trim()) continue;
  
  // Simple parse (won't handle all CSV edge cases but good enough for check)
  const match = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
  if (!match) continue;
  
  const taskType = match[taskTypeIndex]?.replace(/"/g, '');
  const rationaleCount = match[rationaleCountIndex]?.replace(/"/g, '');
  const rationaleText = match[rationaleTextIndex]?.replace(/"/g, '');
  const ideasList = match[ideasListIndex]?.replace(/"/g, '');
  
  if (taskType === 'experimental' && rationaleCount && parseInt(rationaleCount) > 0) {
    experimentalWithRationales++;
    if (experimentalWithRationales <= 3) {
      console.log(`Row ${i} (experimental with rationales):`);
      console.log(`  Count: ${rationaleCount}`);
      console.log(`  Text: "${rationaleText.substring(0, 80)}..."\n`);
    }
  }
  
  if (taskType === 'transfer_baseline' && ideasList && ideasList.length > 10) {
    transferWithIdeas++;
    if (transferWithIdeas <= 3) {
      console.log(`Row ${i} (transfer with ideas):`);
      console.log(`  Ideas: "${ideasList.substring(0, 80)}..."\n`);
    }
  }
}

console.log('='.repeat(80));
console.log(`\n✅ Summary (first 50 rows):`);
console.log(`   Experimental sessions with rationales: ${experimentalWithRationales}`);
console.log(`   Transfer tasks with ideas: ${transferWithIdeas}\n`);

// Count totals
const experimental = lines.filter(l => l.includes('experimental')).length;
const transfer = lines.filter(l => l.includes('transfer_baseline')).length;

console.log(`📊 Total counts:`);
console.log(`   Experimental sessions: ${experimental}`);
console.log(`   Transfer tasks: ${transfer}`);
console.log(`   Total rows: ${lines.length - 1}\n`);

if (experimentalWithRationales > 0 && transferWithIdeas > 0) {
  console.log('🎉 SUCCESS! Both rationales and transfer tasks are present!\n');
} else {
  console.log('⚠️  WARNING: Some data may be missing\n');
}
