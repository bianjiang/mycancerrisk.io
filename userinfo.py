from flask import Blueprint, request, jsonify, session
from pymongo import MongoClient
from bson.objectid import ObjectId
import json
import config
import secret
from flask import current_app
from time import gmtime, strftime, strptime
from apscheduler.schedulers.background import BackgroundScheduler
import atexit
import boto3
from botocore.config import Config
from dbmongo import db
from datetime import datetime

userinfo = Blueprint('userinfo',__name__)

# client = MongoClient('localhost:27017')
# db = client.test_database

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


# this is for userinfo page, user's submit the basic information page
@userinfo.route('/update',methods=['POST'])
def updateuser():
    try:
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        user_data = request.json['info']
        if request.json['consentform'] == True:
            session['confirm_consent'] = request.json['consentform']
        # current_app.logger.info(session['id'])
        age = user_data['age']
        email = user_data['email']
        fname = user_data['fname']
        lname = user_data['lname']
        userId = session['id']
        test_info = {}
        if db.testUser.find_one({'id' : userId}) != None:
            db.testUser.update_one({'id': userId},{'$set':{'fname':fname,'lname':lname,'email':email,'age':age}})
            # db.logging.update_one({'id': userId},{'$push': {'access_event.' + str(session['access_times']) + '.update_event' : current_time}})
            return jsonify(status='OK',message='successfully update your informaiton')
        else:
            if (session['confirm_consent'] == True):
                db.testUser.insert_one(
                    {
                        'id': userId,
                        'fname': fname,
                        'lname':lname,
                        'email':email,
                        'age':age,
                        'test_info': test_info,
                        'confirm_consent' : session['confirm_consent']
                    })
                return jsonify(status='OK',message='successfully update your informaiton')
            else:
                return jsonify(status='ERROR',message='not_confirmed')
    except Exception as e:
        return jsonify(status='ERROR',message=str(e))
        # return jsonify(status='ERROR',message='fail to update your information')

@userinfo.route('/getuserinfo',methods=['GET'])
def senduserinfo():
    try:
        if db.testUser.find_one({'id' : session['id']}) != None:
            data = db.testUser.find_one({'id': session['id']})
            # current_app.logger.info(data)
            #return jsonify(status='OK',message=JSONEncoder().encode(data))
            return JSONEncoder().encode(data)
        else:
            return jsonify(status='ERROR',message='update failed')
        # db.testUser.drop()
    except Exception as e:
        return str(e)

# this is for the request that asking for all test resutls for a user
@userinfo.route('/getresult',methods=['POST'])
def sendresult():
    result = {}
    try:
        date = request.json['info']
        # current_app.logger.info(date)
        if db.testUser.find_one({'id' : session['id']}) != None:
            data = db.testUser.find_one({'id': session['id']})
            result['test_result'] = data['test_info'][date]['test_result']
            result['user_info'] = data['test_info'][date]['test_data']['demographics']
            return JSONEncoder().encode(result)
        else:
            return jsonify(status='ERROR',message='update failed')
        # db.testUser.drop()
    except Exception as e:
        return str(e)

# check if a user registered before
@userinfo.route('/checkuser',methods=['GET'])
def checkuser():
    try:
        # current_app.logger.info(session.get('confirm_consent'))
        if session.get('logged_in') == True and session.get('confirm_consent') == True:
            return jsonify(message={'status' : 'olduser', 'logged_in': session['logged_in'], 'confirm_consent': session['confirm_consent']})
        elif session.get('logged_in') == True and session.get('confirm_consent') == False:
            return jsonify(message={'status' : 'newuser', 'email' : session['email'], 'logged_in': session['logged_in'], 'confirm_consent': session['confirm_consent']})
        else:
            return jsonify(message={'logged_in': False})
        # db.testUser.drop()
    except Exception as e:
        return str(e)



# check if a user email is valid and send email to verify
# @userinfo.route('/checkemail',methods=['POST'])
# def checkemail():
#     # Create an SNS client
#     try:
#         verify_email = request.json['info']
#         # current_app.logger.info(verify_email)
#         client = boto3.client(
#             "ses",
#             aws_access_key_id=secret.aws_access_key_id,
#             aws_secret_access_key=secret.aws_secret_access_key,
#             region_name="us-west-2"
#         )
#         # current_app.logger.info("list emails")
#         verified_email = client.list_verified_email_addresses()
#         # current_app.logger.info(verified_email)
#         if request.json['info'] in verified_email['VerifiedEmailAddresses']:
#             return jsonify(status='OK',message='verified')
#         else:
#             response = client.verify_email_identity(
#                 EmailAddress=request.json['info'],
#             )
#             return jsonify(status='OK',message='not verified')
#     except Exception as e:
#         return str(e)


