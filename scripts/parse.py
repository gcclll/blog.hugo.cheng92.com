#!/usr/bin/env python3

from bs4 import BeautifulSoup
import json

soup = BeautifulSoup(open("./posts/emacs_org_special_src_blocks.html"), 'html.parser')

list=[]
for link in soup.find_all('a'):
    item={}
    for k, v in link.attrs.items():
        item[k]=v

    item['text'] = link.get_text()
    item['tag'] = link.name
    list.append(item)

try:
   f = open("./assets/js/dist/stats.js", 'w', encoding = 'utf-8')
   f.write("window.stats="+json.dumps(list))
   # perform file operations
finally:
   f.close()
