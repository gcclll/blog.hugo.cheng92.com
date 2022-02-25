#!/usr/bin/env bash

path=$(pwd)
src=$path/assets/sass
target=$path/assets/css
for file in $(ls $src); do
    css="$target/${file%.*}.css"
    echo "$css"
    sass $src/$file "$css"
    sed -i -e '1i\/*请勿手动修改该文件，它是由 sass 编译生成的。*/' "$css" >"$css"
done

cd $path
gpush
