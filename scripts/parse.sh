#!/usr/bin/env bash

home=$(pwd)

for html in $(ls $home/posts/*.html); do
    echo $html
done
