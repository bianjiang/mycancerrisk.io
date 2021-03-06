from flask import Flask, session
import config
# import facebook as fb
from dbmongo import db
import requests
from datetime import datetime

def notify():
    for user in db.testUser.find():
 # use app access token to send notificaitons
        url = "https://graph.facebook.com/v2.10/" + user['id'] + "/notifications?access_token=" +config.FACEBOOK_APP_ACCESS_TOKEN + "&template='Please check your recent CRC cancer risk test result: http://mycancerrisk.io'"
        # notification = notfi.put_object(parent_object=user['id'], connection_name='notifications',template='Please check your recent CRC cancer risk test result: http://mycancerrisk.io')
        proxyDict = {"https" : "https://proxe.shands.ufl.edu:3128"}
        r = requests.post(url, proxies=proxyDict)
        db.logging.insert_one({
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'user_id': user['id'],
            'event_type': 'send notification to user'
            })
        # r = requests.post(url)