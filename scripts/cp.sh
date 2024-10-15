#! /bin/sh
echo "-- Starting"
cd ./scripts
echo "-- Current directory"
pwd
echo "-- This script will copy the files from the current directory to the specified directory"
cp ../dist/SVG3DTagCloud.umd.cjs ../dist/SVG3DTagCloud.global.js
echo "-- Copy done!"
echo "-- Back to parent directory"
cd ..
ls -lh ./dist

echo "-- Commit changes"
git add .
git commit -am "Update dist files"
echo "-- Push changes"
git push
echo "-- Done"