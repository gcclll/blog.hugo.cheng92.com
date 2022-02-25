#!/usr/bin/env python3

from bs4 import BeautifulSoup
import json
import re
import os

list=[]



def find_h(file):
    for n in range(5):
        for h in soup.find_all('h'+str(n)):
            if h.has_attr('id'):
                id = h.attrs['id']
                list.append({
                    'text': h.get_text(),
                    'tag': h.name,
                    'id': id,
                    'href': '#' + id,
                    'file': file
                })

def find_span(file):
    for span in soup.find_all('span'):
        if span.has_attr('id'):
            id = span.attrs['id']
            list.append({
                'text': span.get_text(),
                'tag': span.name,
                'id': id,
                'href': '#' + id,
                'file': file
            })

def find_a(file):
    for a in soup.find_all('a'):
        if a.has_attr('href'):
            list.append({
                'text': a.get_text(),
                'tag': a.name,
                'href': a.attrs['href'],
                'file': file
            })


for file in os.listdir("./posts/"):
    if file.endswith('html'):
        soup = BeautifulSoup(open("./posts/" + file), 'html.parser')
        find_h(file)
        find_span(file)
        find_a(file)


for index in range( len( list ) ):
    item = list[index]
    text = item['text']
    text = re.sub(r'\n', '', text)
    text = re.sub(r'\s+', ' ', text)
    item['text'] = text.strip() or item['href']
    if item['text'] == '' and item['href'] != '':
        item['text'] = item['href']
    if len(item['text']) > 0:
        # item['text'] = '[' + item['file'] + ']' + item['text']
        item['value'] = item['text']
        if item['href'].startswith('#'):
            item['href'] = item['file'] + item['href']
        item['link'] = item['href']
        list[index] = item

try:
   f = open("./assets/js/dist/stats.js", 'w', encoding = 'utf-8')
   f.write("window.$stats="+json.dumps(list))
   # perform file operations
finally:
   f.close()
