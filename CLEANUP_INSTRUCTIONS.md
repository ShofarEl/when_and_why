# Data Cleanup Instructions

## Issue Found
Some participants in the database have "test" in their major or academic level fields (e.g., P079, P080, P081).

## Solution

Run the cleanup script to remove all test data:

```bash
cd server/scripts
node cleanTestData.js
```

## What the Script Does

1. **Identifies test participants** with:
   - "test" in major field (case-insensitive)
   - "test" in academic level field
   - Single letter majors (like "t")
   - "test" in participant ID

2. **Removes them** from the database

3. **Verifies** remaining data is clean

4. **Shows summary** of:
   - How many were removed
   - Total remaining participants
   - Sample of clean data

## Expected Result

After running the script:
- All test participants removed
- Only realistic data remains (Computer Science, Data Science, etc.)
- Total participants should be around 189-190 (depending on how many test entries exist)

## Verification

After cleanup, you can re-export the data:

```bash
node exportToCSV.js
```

Then check the new CSV files to confirm all majors are realistic:
- Computer Science
- Data Science
- Information Systems
- Software Engineering
- Mathematics
- Statistics
- etc.

## Generated Data is Clean

The 80 newly generated participants (P114-P193) already have clean, realistic data:
- Proper majors from the predefined list
- Realistic ages (19-34)
- Appropriate academic levels (bachelor/master)
- Valid course combinations

Only the older test entries need to be removed.
