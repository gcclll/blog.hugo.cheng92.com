#!/usr/bin/env bash

path=$(pwd)
src=$path/assets/sass/
target=$path/assets/css/
for file in $(ls $src); do
    sass $src/$file $target/${file%.*}.css
done

cd $path
gpush
