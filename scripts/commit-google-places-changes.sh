#!/bin/bash

# This script commits and pushes the Google Places API integration changes

echo "Committing Google Places API integration changes..."

# Add all changes
git add .

# Commit with a descriptive message
git commit -m "Replace OpenCage with Google Places API for location search"

# Push to main branch
git push origin main

echo "Done! Changes pushed to GitHub."
