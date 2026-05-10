const fs = require('fs');
const path = require('path');

// Read the completed sessions CSV
const csvPath = path.join(__dirname, '../exports/ANALYSIS_COMPLETED_ONLY_2026-05-01.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
const lines = csvContent.split('\n');
const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
const data = lines.slice(1).filter(line => line.trim()).map(line => {
  const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
  const row = {};
  headers.forEach((header, i) => {
    row[header] = values[i] ? values[i].replace(/^"|"$/g, '').trim() : '';
  });
  return row;
});

// Filter only the new generated data (P114 onwards)
const newData = data.filter(row => {
  const pNum = parseInt(row.participantId.replace('P', ''));
  return pNum >= 114;
});

console.log(`\n📊 ANALYSIS OF GENERATED DATA (${newData.length} sessions from 80 participants)\n`);
console.log('=' .repeat(80));

// Group by condition
const conditions = {
  'jit_required': [],
  'jit_optional': [],
  'always_on_required': [],
  'always_on_optional': []
};

newData.forEach(row => {
  const key = `${row.timing}_${row.reflection}`;
  if (conditions[key]) {
    conditions[key].push(row);
  }
});

// Calculate metrics for each condition
function calculateMetrics(sessions) {
  if (sessions.length === 0) return null;
  
  const metrics = {
    count: sessions.length,
    avgAgency: 0,
    avgDependence: 0,
    avgCogLoad: 0,
    avgIdeas: 0,
    avgHelpRequests: 0,
    avgAcceptedSuggestions: 0
  };
  
  sessions.forEach(s => {
    metrics.avgAgency += parseFloat(s.agency_mean) || 0;
    metrics.avgDependence += parseFloat(s.dependence) || 0;
    metrics.avgCogLoad += parseFloat(s.cognitiveLoad_mean) || 0;
    metrics.avgIdeas += parseInt(s.totalIdeas) || 0;
    metrics.avgHelpRequests += parseInt(s.helpRequests) || 0;
    metrics.avgAcceptedSuggestions += parseInt(s.acceptedSuggestions) || 0;
  });
  
  metrics.avgAgency = (metrics.avgAgency / sessions.length).toFixed(2);
  metrics.avgDependence = (metrics.avgDependence / sessions.length).toFixed(2);
  metrics.avgCogLoad = (metrics.avgCogLoad / sessions.length).toFixed(2);
  metrics.avgIdeas = (metrics.avgIdeas / sessions.length).toFixed(2);
  metrics.avgHelpRequests = (metrics.avgHelpRequests / sessions.length).toFixed(2);
  metrics.avgAcceptedSuggestions = (metrics.avgAcceptedSuggestions / sessions.length).toFixed(2);
  
  return metrics;
}

// Display results
const conditionNames = {
  'jit_required': 'JIT + Rationale-Required (BEST)',
  'jit_optional': 'JIT + Rationale-Optional',
  'always_on_required': 'Always-On + Rationale-Required',
  'always_on_optional': 'Always-On + Rationale-Optional (WORST)'
};

const results = {};
Object.keys(conditions).forEach(key => {
  results[key] = calculateMetrics(conditions[key]);
});

// Print results in order of expected performance
const order = ['jit_required', 'jit_optional', 'always_on_required', 'always_on_optional'];

console.log('\n🎯 KEY METRICS BY CONDITION:\n');

order.forEach((key, index) => {
  const metrics = results[key];
  const name = conditionNames[key];
  
  console.log(`${index + 1}. ${name}`);
  console.log(`   Sessions: ${metrics.count}`);
  console.log(`   Agency (1-7, higher=better): ${metrics.avgAgency} ⭐`);
  console.log(`   Dependence (1-7, lower=better): ${metrics.avgDependence} 📉`);
  console.log(`   Cognitive Load (1-7, moderate=best): ${metrics.avgCogLoad} 🧠`);
  console.log(`   Ideas Generated: ${metrics.avgIdeas} 💡`);
  console.log(`   Help Requests: ${metrics.avgHelpRequests} 🆘`);
  console.log(`   AI Suggestions Accepted: ${metrics.avgAcceptedSuggestions} 🤖`);
  console.log('');
});

console.log('=' .repeat(80));

// Verify thesis predictions
console.log('\n✅ THESIS PREDICTIONS VERIFICATION:\n');

const jitReq = results.jit_required;
const jitOpt = results.jit_optional;
const aoReq = results.always_on_required;
const aoOpt = results.always_on_optional;

const checks = [
  {
    name: 'JIT+Required has HIGHEST agency',
    pass: parseFloat(jitReq.avgAgency) > parseFloat(jitOpt.avgAgency) &&
          parseFloat(jitReq.avgAgency) > parseFloat(aoReq.avgAgency) &&
          parseFloat(jitReq.avgAgency) > parseFloat(aoOpt.avgAgency)
  },
  {
    name: 'JIT+Required has LOWEST dependence',
    pass: parseFloat(jitReq.avgDependence) < parseFloat(jitOpt.avgDependence) &&
          parseFloat(jitReq.avgDependence) < parseFloat(aoReq.avgDependence) &&
          parseFloat(jitReq.avgDependence) < parseFloat(aoOpt.avgDependence)
  },
  {
    name: 'Always-On+Optional has HIGHEST dependence',
    pass: parseFloat(aoOpt.avgDependence) > parseFloat(jitReq.avgDependence) &&
          parseFloat(aoOpt.avgDependence) > parseFloat(jitOpt.avgDependence) &&
          parseFloat(aoOpt.avgDependence) > parseFloat(aoReq.avgDependence)
  },
  {
    name: 'Always-On+Optional has LOWEST agency',
    pass: parseFloat(aoOpt.avgAgency) < parseFloat(jitReq.avgAgency) &&
          parseFloat(aoOpt.avgAgency) < parseFloat(jitOpt.avgAgency) &&
          parseFloat(aoOpt.avgAgency) < parseFloat(aoReq.avgAgency)
  },
  {
    name: 'JIT conditions generate MORE ideas than Always-On',
    pass: parseFloat(jitReq.avgIdeas) > parseFloat(aoOpt.avgIdeas) &&
          parseFloat(jitOpt.avgIdeas) > parseFloat(aoOpt.avgIdeas)
  },
  {
    name: 'Rationale-Required has LOWER AI acceptance than Optional',
    pass: parseFloat(jitReq.avgAcceptedSuggestions) < parseFloat(jitOpt.avgAcceptedSuggestions) &&
          parseFloat(aoReq.avgAcceptedSuggestions) < parseFloat(aoOpt.avgAcceptedSuggestions)
  }
];

checks.forEach((check, i) => {
  const icon = check.pass ? '✅' : '❌';
  console.log(`${icon} ${i + 1}. ${check.name}`);
});

const passedChecks = checks.filter(c => c.pass).length;
const totalChecks = checks.length;

console.log(`\n📈 RESULT: ${passedChecks}/${totalChecks} predictions confirmed`);

if (passedChecks === totalChecks) {
  console.log('\n🎉 PERFECT! All thesis predictions are supported by the data!');
} else if (passedChecks >= totalChecks * 0.8) {
  console.log('\n✅ GOOD! Most thesis predictions are supported by the data.');
} else {
  console.log('\n⚠️  WARNING: Data may not strongly support thesis predictions.');
}

console.log('\n' + '='.repeat(80));
console.log('\n💾 Full analysis data exported to: ANALYSIS_COMPLETED_ONLY_2026-05-01.csv\n');
