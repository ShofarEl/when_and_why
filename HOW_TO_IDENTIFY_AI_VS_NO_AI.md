# How to Identify AI vs No-AI Rows in Your Dataset

## File: `THESIS_READY_DATASET.csv`

---

## 🔍 Quick Identification Guide

### Look at the `taskType` column (Column 8):

1. **`taskType = "experimental"`** → WITH AI available
   - These are the 4 experimental conditions
   - AI suggestions were available (but participant could ignore them)
   - 264 rows

2. **`taskType = "transfer_baseline"`** → NO AI (pure participant)
   - These are the 2 transfer tasks at the end
   - NO AI assistance at all
   - Pure participant creativity
   - 132 rows

---

## 📊 In Excel/SPSS:

### Method 1: Filter by taskType
1. Open the CSV file
2. Click on column H header (`taskType`)
3. Apply filter
4. Select:
   - `experimental` = WITH AI
   - `transfer_baseline` = NO AI

### Method 2: Look at timing column
- **Column L (`timing`)**:
  - `jit` or `always_on` = WITH AI
  - `none` = NO AI (transfer tasks)

---

## 📋 Example Rows:

### WITH AI (experimental):
```
Row 1:
- taskType: experimental
- timing: always_on
- reflection: required
- totalAISuggestions: 3
- ideas: "Explore the relationship between patient demographics..."
```

### WITHOUT AI (transfer):
```
Row 5:
- taskType: transfer_baseline
- timing: none
- reflection: none
- totalAISuggestions: 0
- ideas: "Study the relationship between user demographics..."
```

---

## 🎯 For Your Analysis:

### To analyze WITH AI conditions:
```r
# In R
experimental <- subset(data, taskType == "experimental")
```

```python
# In Python
experimental = data[data['taskType'] == 'experimental']
```

```spss
* In SPSS
SELECT IF (taskType = "experimental").
```

### To analyze WITHOUT AI (baseline):
```r
# In R
transfer <- subset(data, taskType == "transfer_baseline")
```

```python
# In Python
transfer = data[data['taskType'] == 'transfer_baseline']
```

```spss
* In SPSS
SELECT IF (taskType = "transfer_baseline").
```

---

## 📊 Summary Table:

| taskType | timing | AI Available? | Count | Purpose |
|----------|--------|---------------|-------|---------|
| experimental | jit | ✅ YES (on demand) | 132 | RQ1-5: JIT condition |
| experimental | always_on | ✅ YES (continuous) | 132 | RQ1-5: Always-On condition |
| transfer_baseline | none | ❌ NO | 132 | RQ6: Baseline/Transfer |

---

## 🔢 Column Numbers (for reference):

- Column 8: `taskType` ← **USE THIS**
- Column 12: `timing` ← Also useful
- Column 13: `reflection`
- Column 17: `totalIdeas`
- Column 18: `ideasList` ← Participant's ideas
- Column 24: `rationaleCount`
- Column 25: `rationaleTexts` ← Why they chose ideas
- Column 27: `totalAISuggestions` ← 0 for transfer tasks

---

## ✅ Quick Check:

Open the file and look at column H (`taskType`):
- First ~264 rows: `experimental` (WITH AI)
- Last ~132 rows: `transfer_baseline` (NO AI)

That's it! Simple as that. 🎉
