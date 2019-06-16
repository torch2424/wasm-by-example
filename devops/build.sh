#!/bin/bash

# Script to do frontend staging deployments

# redirect stdout/stderr to a file
exec &> wasm-by-example-build.log

cd ../

git stash

git checkout master

git pull origin master

rm package-lock.json

npm install

npm run build

# Copy the build output to public/ if successful build
if [ $? -eq 0 ]; then
   rm -rf public
   mkdir -p public
   cp -r dist/* public/
else
    echo "Failed Building wasm-by-example"
fi

echo "Done!"
