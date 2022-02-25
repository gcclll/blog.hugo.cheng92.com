#!/usr/bin/env bash

path=$(pwd)
src=$path/assets/sass
target=$path/assets/css
for file in $(ls $src); do
    css="$target/${file%.*}.css"
    sass $src/$file "$css"
    content=$(cat $css)
    echo "/*请勿手动修改该文件，它是由 sass 编译生成的。*/" >$css
    echo "$content" >>$css
done

cd $path
gpush
