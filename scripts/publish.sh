#!/usr/bin/env bash

path=$(pwd)
src=$path/assets/sass/
target=$path/assets/css/
for file in $(ls $src); do
    sass $src/$file $target/${file%.*}.css
    sed -i "1i\/*请勿手动修改该文件，它是由 sass 编译生成的。*/"
done

cd $path
gpush
