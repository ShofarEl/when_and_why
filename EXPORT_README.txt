================================================================================
                    DATA EXPORT - QUICK START GUIDE
================================================================================

EASIEST WAY TO EXPORT DATA:
---------------------------

1. Open Command Prompt (Windows) or Terminal (Mac/Linux)

2. Navigate to your project folder:
   cd C:\path\to\your\project

3. Run the export command:
   npm run export

4. Find your CSV files in:
   server/exports/

ALTERNATIVE METHODS:
-------------------

Windows Users:
  - Double-click: export-data.bat

Mac/Linux Users:
  - Run in terminal: ./export-data.sh

WHAT GETS EXPORTED:
------------------

✓ participants_YYYY-MM-DD.csv     - Demographics & background
✓ sessions_YYYY-MM-DD.csv         - Task performance & questionnaires  
✓ ideas_YYYY-MM-DD.csv            - All research questions generated
✓ interactions_YYYY-MM-DD.csv     - User behavior & clicks
✓ transfer_tasks_YYYY-MM-DD.csv   - Independent task results
✓ post_study_YYYY-MM-DD.csv       - Final survey responses
✓ ai_suggestions_YYYY-MM-DD.csv   - AI assistance provided

FILES ARE READY FOR:
-------------------
✓ Excel
✓ SPSS
✓ R
✓ Python
✓ Any statistical software

REQUIREMENTS:
------------
✓ Node.js installed
✓ MongoDB connection configured
✓ Internet connection (for MongoDB Atlas)

TROUBLESHOOTING:
---------------

Problem: "Cannot find module"
Solution: Run "npm install" in the server folder

Problem: "Cannot connect to database"  
Solution: Check server/.env file has correct MONGODB_URI

Problem: "No data to export"
Solution: Verify participants have completed the study

DETAILED HELP:
-------------
See DATA_EXPORT_GUIDE.md for complete documentation

================================================================================
