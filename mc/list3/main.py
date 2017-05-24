# -*- coding: utf-8 -*-
#!/usr/bin/env python

import urllib2
from BeautifulSoup import BeautifulSoup

print("Content-type: text/html")
print()

def printToFile(fname, arr):
    print >> open(fname, 'w'), len(arr), u' '.join(arr)

def getName(soup, cur_id):
	# web_page = urllib2.urlopen("http://acmp.ru/index.asp?main=user&id=" + cur_id).read()
	# soup = BeautifulSoup(web_page)
	return soup.html.body.table.tr.nextSibling.nextSibling.nextSibling.nextSibling.td.table.tr.td.nextSibling.nextSibling.table.tr.td.nextSibling.nextSibling.nextSibling.nextSibling.next

def getSolved(soup, cur_id):
	for e in soup.html.body.table.findAll('b'):
	    if (e.next.startswith(u'Решенные задачи')):
	        return [r.next for r in e.nextSibling.nextSibling.findAll('a')]
	return []

def check(soup, cur_id, problems):
    solved = getSolved(soup, cur_id)
    return ["+" if solved.count(p) > 0 else "-" for p in problems]

def readList(fname):
	i = open(fname, "r")
	return [x for x in i.read().split('\n')]

def html_table(lst):
        yield '<table>'
        for slst in lst:
            yield '<tr><td>'
            yield '</td><td>'.join(slst)
            yield '</td></tr>'
        yield '</table>'

def getProblemName(p):
    web_page = urllib2.urlopen("http://acmp.ru/index.asp?main=task&id_task=" + p).read()
    soup = BeautifulSoup(web_page)
    return str(soup.findAll('h1')[0].next)

def getProblemLink(p):
    return "<a href=\"http://acmp.ru/index.asp?main=task&id_task=" + p + "\">" + getProblemName(p) +"</a>" 

def getLink(link, name):
    return '<a href=\"%s\">%s</a>' % (link, str(name))

def getTag(tag, text):
    tag = str(tag)
    return '<%s>%s</%s>' % (tag, text, tag)

problems = readList("problems.txt")
ids = []
# ids = readList("ids.txt")

# problems.pop()
# ids.pop()

table = [[getProblemLink(p) for p in problems], [getLink("http://informatics.mccme.ru/mod/statements/view.php?id=4252", "Задачи на scanline")], 
        ["Interesting problem on coordinates zipping: ", getProblemLink("632")]]

print "<meta charset=\"utf-8\">"
print getTag('h1', 'Scanline')

# print "<style>\ntable, th, td {border: 1px solid black;border-collapse: collapse;}</style>"

# print table[1]

# for p in problems:
#    print "<a href=\"http://acmp.ru/index.asp?main=task&id_task= + p\">" + p + "</a>"

# print problems

for cur_id in ids:
    web_page = urllib2.urlopen("http://acmp.ru/index.asp?main=user&id=" + cur_id).read()
    soup = BeautifulSoup(web_page)
    lst = []
    lst.append(str(getName(soup, cur_id)))
    for x in check(soup, cur_id, problems):
        lst.append(x)
    # print lst
    
    table.append(lst)
   
table.append([getLink("http://informatics.mccme.ru/py-source/source/dir/240-430?cnt=100", "Mega Big Archive")])

print "\n".join(html_table(table))

# print check("93028", ["15", "56", "697"])

