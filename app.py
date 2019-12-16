import pymongo
from flask import Flask, jsonify, render_template

app = Flask(__name__, template_folder="client/build", static_folder="client/build/static")


client = pymongo.MongoClient("mongodb+srv://Vlad123:Vlad123@devconnector-e46b3.mongodb.net/test?retryWrites=true&w=majority")
db_apartPlanner = client["apartPlanner"]
users_collection = db_apartPlanner["users"]

# for item in users_collection.find():
#     return item

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    """ This is a catch all that is required for react-router """
    return render_template('index.html')

@app.route('/api/users')
def index():
    result = []

    for field in users_collection.find():
        result.append({'_id': str(field['_id']), 'first_name': field['first_name'], 'last_name': field['last_name']})
    return jsonify(result)

if __name__ == "__main__":
    app.run()