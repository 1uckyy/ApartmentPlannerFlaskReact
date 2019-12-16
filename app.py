import pymongo
import os
from flask import Flask, jsonify, render_template, send_from_directory

app = Flask(__name__, template_folder="client/build", static_folder="client/build/static")


client = pymongo.MongoClient("mongodb+srv://Vlad123:Vlad123@devconnector-e46b3.mongodb.net/test?retryWrites=true&w=majority")
db_apartPlanner = client["apartPlanner"]
users_collection = db_apartPlanner["users"]

# for item in users_collection.find():
#     return item

root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "client", "build")

@app.route('/<path:path>', methods=['GET'])
def static_proxy(path):
    return send_from_directory(root, path)

@app.route('/', methods=['GET'])
def redirect_to_index():
    return send_from_directory(root, 'index.html')

@app.route('/api/users')
def index():
    result = []

    for field in users_collection.find():
        result.append({'_id': str(field['_id']), 'first_name': field['first_name'], 'last_name': field['last_name']})
    return jsonify(result)

if __name__ == "__main__":
    app.run()