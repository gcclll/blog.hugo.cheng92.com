#!/usr/bin/env bash

path=$(pwd)

echo "> generate sites index..."
npm run stats

# babel es6+ -> es5
echo
echo "> building es6+ to es5 js..."
jsrc=$path/assets/js/src
dist=$path/assets/js/dist
for file in $(ls $jsrc); do
    ./node_modules/.bin/babel $jsrc/$file -d $dist
done

rollup -c

git status

cd $path
gpush
