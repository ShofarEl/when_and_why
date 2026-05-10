#!/bin/bash

echo "========================================"
echo "  Data Export Script"
echo "========================================"
echo ""
echo "Exporting participant data to CSV..."
echo ""

cd server
node scripts/exportToCSV.js

echo ""
echo "========================================"
echo "Export complete!"
