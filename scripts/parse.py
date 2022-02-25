#!/usr/bin/env python3

from bs4 import BeautifulSoup
import json
import re

soup = BeautifulSoup(open("./posts/emacs_org_special_src_blocks.html"), 'html.parser')

list=[]

for n in range(5):
    for h in soup.find_all('h'+str(n)):
        if h.has_attr('id'):
            item={}
            item['text'] = h.get_text()
            item['tag'] = h.name
            item['href'] = '#' + h.attrs['id']
            list.append(item)

for a in soup.find_all('a'):
    if a.has_attr('href'):
        item={}
        item['text'] = a.get_text()
        item['tag'] = a.name
        item['href'] = a.attrs['href']
        list.append(item)

for index in range( len( list ) ):
    item = list[index]
    text = item['text']
    text = re.sub(r'\n', '', text)
    text = re.sub(r'\s+', ' ', text)
    item['text'] = text.strip() or item['href']
    if item['text'] == '' and item['href'] != '':
        item['text'] = item['href']
    if len(item['text']) > 0:
        item['value'] = item['text']
        item['link'] = item['href']
        list[index] = item

try:
   f = open("./assets/js/dist/stats.js", 'w', encoding = 'utf-8')
   f.write("window.$stats="+json.dumps(list))
   # perform file operations
finally:
   f.close()
