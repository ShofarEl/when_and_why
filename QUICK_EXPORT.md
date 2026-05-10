# Quick Export Instructions

## How to Export Your Data

### Step 1: Open Terminal/Command Prompt
- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac**: Press `Cmd + Space`, type `terminal`, press Enter

### Step 2: Navigate to Project Folder
```bash
cd path/to/your/project
```

### Step 3: Run Export Command
```bash
npm run export
```

### Step 4: Find Your Files
Your CSV files will be in:
```
server/exports/
```

## What You'll Get

7 CSV files with all your research data:
1. **participants** - Demographics and background
2. **sessions** - Task performance and questionnaires
3. **ideas** - All generated research questions
4. **interactions** - User behavior logs
5. **transfer_tasks** - Independent task performance
6. **post_study** - Final survey responses
7. **ai_suggestions** - AI assistance provided

## Troubleshooting

**"Cannot find module"**
```bash
cd server
npm install
cd ..
npm run export
```

**"Cannot connect to database"**
- Check `server/.env` file exists
- Verify MongoDB connection string is correct

**"No data to export"**
- Make sure participants have completed the study
- Check MongoDB has data

## Need Help?

See `DATA_EXPORT_GUIDE.md` for detailed instructions.
