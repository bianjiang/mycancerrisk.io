from flask import Flask, session
import config
import facebook as fb
from dbmongo import db
import requests

def notify():
    for user in db.testUser.find():
 # use app access token to send notificaitons
        print('1')
        url = "https://graph.facebook.com/v2.10/" + user['id'] + "/notifications?access_token=" +config.FACEBOOK_APP_ACCESS_TOKEN + "&template='Please check your recent CRC cancer risk test result: http://mycancerrisk.io'"
        # notification = notfi.put_object(parent_object=user['id'], connection_name='notifications',template='Please check your recent CRC cancer risk test result: http://mycancerrisk.io')
        proxyDict = {"https" : "https://proxe.shands.ufl.edu:3128"}
        r = requests.post(url, proxies=proxyDict)