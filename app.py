#imports
import pymongo
import os
from flask import Flask, jsonify, send_from_directory, request, json
from flask_pymongo import PyMongo 
from bson.objectid import ObjectId 
from datetime import datetime 
from flask_bcrypt import Bcrypt 
from flask_cors import CORS
from flask_jwt_extended import JWTManager 
from flask_jwt_extended import create_access_token

# configuration app
app = Flask(__name__, template_folder="client/build", static_folder="client/build/static")

app.config['MONGO_DBNAME'] = "apartPlanner"
app.config['MONGO_URI'] = 'mongodb+srv://Vlad123:Vlad123@devconnector-e46b3.mongodb.net/apartPlanner?retryWrites=true&w=majority'
app.config['JWT_SECRET_KEY'] = 'secret'

mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

CORS(app)


# render page from react
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "client", "build")

@app.route('/<path:path>', methods=['GET'])
def static_proxy(path):
    return send_from_directory(root, 'index.html')

@app.route('/', methods=['GET'])
def redirect_to_index():
    return send_from_directory(root, 'index.html')


# api test
# client = pymongo.MongoClient("mongodb+srv://Vlad123:Vlad123@devconnector-e46b3.mongodb.net/test?retryWrites=true&w=majority")
# db_apartPlanner = client["apartPlanner"]
# users_collection = db_apartPlanner["users"]

# @app.route('/api/users')
# def index():
#     result = []

#     for field in users_collection.find():
#         result.append({'_id': str(field['_id']), 'first_name': field['first_name'], 'last_name': field['last_name']})
#     return jsonify(result)

@app.route('/api/test')
def index():
    return '1234'

# update project
@app.route('/update', methods=['PUT'])
def update_prj():
    projects = mongo.db.projects 
    project_name = request.get_json()['project_name']
    array_rects = request.get_json()['array_rects']

    projects.find_one_and_update({'project_name': project_name}, {"$set": {"array_rects": array_rects}}, upsert=False)

    new_prj = projects.find_one({'project_name': project_name})

    result = {'project_name' : new_prj['project_name']}

    return jsonify({"result": result})

# save project
@app.route('/save', methods=["POST"])
def save_prj():
    projects = mongo.db.projects

    project_author = request.get_json()['project_author']
    project_name = request.get_json()['project_name']
    array = request.get_json()['array_rects']

    query = { 'project_name': project_name }

    response = projects.find_one(query)

    result = {}

    if response == None:
        result = {'message' : 'Проект сохранён.'}
        projects.insert({
            'project_author': project_author,
            'project_name': project_name,
            'array_rects': array
        })
    else: 
        result = {'message' : 'Такое название уже существует.'}

    return jsonify({'result' : result})


# user projects
@app.route('/getprojects', methods=["POST"])
def get_prjs():
    projects = mongo.db.projects

    project_author = request.get_json()['project_author']

    result = []

    query = { 'project_author': project_author }

    for field in projects.find(query):
        result.append({ 'project_name': field['project_name'] })

    return jsonify(result)


# get project
@app.route('/getproject', methods=["POST"])
def get_prj():
    projects = mongo.db.projects

    project_name = request.get_json()['project_name']


    result = {}

    query = { 'project_name': project_name }

    for field in projects.find(query):
        result = { 'array_rects': field['array_rects'] }

    return jsonify(result)

# delete project
@app.route('/deleteproject/<id>', methods=['DELETE'])
def delete_task(id):
    projects = mongo.db.projects 

    response = projects.delete_one({'project_name': id})

    if response.deleted_count == 1:
        result = {'message' : 'record deleted'}
    else: 
        result = {'message' : 'no record found'}
    
    return jsonify({'result' : result})


# register
@app.route('/users/register', methods=["POST"])
def register():
    users = mongo.db.users

    # get email and check have same or not
    email = request.get_json()['email']
    finded_user = users.find_one({'email': email})

    # if not have same email then continue register
    if finded_user is None:
        first_name = request.get_json()['first_name']
        last_name = request.get_json()['last_name']
        password = bcrypt.generate_password_hash(request.get_json()['password']).decode('utf-8')
        created = datetime.utcnow()

        user_id = users.insert({
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'password': password,
            'created': created 
        })

        new_user = users.find_one({'_id': user_id})

        result = {'email': new_user['email'] + ' registered'}

        return jsonify({'result' : result})
    #else return error
    else:
        return jsonify({"error":"Такой email уже зарегистрирован."})

# login
@app.route('/users/login', methods=['POST'])
def login():
    users = mongo.db.users 
    email = request.get_json()['email']
    password = request.get_json()['password']
    result = ""

    response = users.find_one({'email': email})

    if response:
        if bcrypt.check_password_hash(response['password'], password):
            access_token = create_access_token(identity = {
                'first_name': response['first_name'],
                'last_name': response['last_name'],
                'email': response['email']
            })
            result = jsonify({'token':access_token})
        else:
            result = jsonify({"error":"Неверный пароль."})
    else:
        result = jsonify({"error":"Такого email не найдено."})
    return result 

# run
if __name__ == "__main__":
    app.run()