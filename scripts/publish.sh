#!/usr/bin/env bash

path=$(pwd)

echo "> generate sites index..."
npm run stats

# build scss -> css
echo
echo "> building scss to css..."
src=$path/assets/sass
target=$path/assets/css
for file in $(ls $src); do
    css="$target/${file%.*}.css"
    sass $src/$file "$css"
    content=$(cat $css)
    echo "/*请勿手动修改该文件，它是由 sass 编译生成的。*/" >$css
    echo "$content" >>$css
    # if [ -f "$css.map" ]; then
    # rm -f $css.map
    # fi
done

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
