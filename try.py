import requests
from bs4 import BeautifulSoup

data = {
    "lang_left": 1,
    "lang_right": 0,
    "translate_submit": "Translate",
    "from": "girls",
}

req = requests.post("http://dilmanc.az",data=data,headers={
    "Content-Type":"application/x-www-form-urlencoded",
    "Host": "dilmanc.az",
    "Origin": "http://dilmanc.az",
    "Referer": "http://dilmanc.az/?desktop=1"
})
req.encoding="utf-8"
a = req.text


parsed_html = BeautifulSoup(a,"html.parser")

translation = parsed_html.find("textarea",attrs={"id":"id_to"}).text
print(a)
print(translation)
print(req.encoding)