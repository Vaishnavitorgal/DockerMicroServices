import requests

x = requests.get('https://api.dictionaryapi.dev/api/v2/entries/en/words')
print(x.json()[0]['meanings'][0]['definitions'][0]['definition'])