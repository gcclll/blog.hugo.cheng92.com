#!/usr/bin/env python3

from bs4 import BeautifulSoup
import json
import re
import os
import time

soup = BeautifulSoup(open("./posts/home.html"), 'html.parser')
tags_obj = {}
print(soup.find_all('div[id^="outline-container-"]'), soup)
for outline in soup.find_all('div[id^="outline-container-"]'):
    title = ''
    tags = []
    print(outline)
    try:
        title = outline.find('a').get_text()
        todo = outline.find('span.todo')['class']
        done = outline.find('span.done')['class']
        tagEles = outline.find_all('span.tag > span')
        for tag in tagEles:
            tags.append(tag.get_text())
    except Exception:
        title = ''

    if title:
        tags_obj[title] = {
            'todo': todo,
            'done': done,
            'tags': tags
        }


print(tags_obj)
