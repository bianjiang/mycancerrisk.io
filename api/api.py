from flask import Blueprint
# from pymongo import MongoClient
from bson.objectid import ObjectId

import json

# client = MongoClient('localhost:27017')
# db = client.MachineData

api = Blueprint('api',__name__)

# @api.route('/test',methods=['POST'])
# def getTest():
#     try:
#         machines = db.Machines.find()
#         machineList = []
#         for machine in machines:
#             machineItem = {
#                     'device':machine['device'],
#                     'ip':machine['ip'],
#                     'username':machine['username'],
#                     'password':machine['password'],
#                     'port':machine['port'],
#                     'id': str(machine['_id'])
#                     }
#             machineList.append(machineItem)
#     except Exception as e:
#         return str(e)
#     return json.dumps(machineList)
