from flask import Blueprint, request, jsonify, session
from pymongo import MongoClient
from flask import current_app

client = MongoClient('localhost:27017')
db = client.test_database
