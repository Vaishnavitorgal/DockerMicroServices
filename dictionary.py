
from flask import Flask, jsonify, request
import requests
from pymongo import MongoClient
import db


# Global Variables
global stories
stories = dict()
global recos
recos = dict()
global categories
categories = set()
global app
app = Flask(__name__)
# BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

def get_db():
    '''
    Method returns the instance of MongoDB
    '''
    return db.get_db()


@app.route('/get-meaning/<word>')
def get_word_meaning(word):
    """
    Returns the titles of stories with selected category.
    """
    result = requests.get('https://api.dictionaryapi.dev/api/v2/entries/en/'+word, timeout=2)
    # meaning = result.json()
    meaning = result.json()[0]['meanings'][0]['definitions'][0]['definition']
    return jsonify({"meaning": meaning})




@app.route('/get-story', methods=['POST'])
def get_story():
    """ 
    This method fetches all the stories and returns.
    """
    _db = MongoClient()
    _db = get_db()
    data = request.json
    
    # try:
    bookno = data['bookno']
    story = {"story": stories[bookno]['content'], "bookno":bookno}
    username = data['username']
    _users = _db['users'].find()
    users = [{"id": user["_id"], "username": user["username"], "password": user["password"], "history": user['history']} for user in _users]
    user = None
    for _user in users:
        if _user['username'] == username:
            user = _user
    print('------------HERE---------------')
    print(user)
    history = user['history']
    print(type(history))
    history.append(bookno)
    _db['users'].update_one({"username":username}, {'$set':{"history": history}})
    return jsonify(story)
    # except KeyError:
    #     return jsonify({"msg":"Error"})



def main():
    '''
    Main method which runs the Flask app.
    '''
    app.run(host='0.0.0.0', port=3002)
    # get_categories()


if __name__ == '__main__':
    main()