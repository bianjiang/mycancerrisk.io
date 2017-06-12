from flask import Flask, session
import config
import facebook as fb
from dbmongo import db

def notify():
    notfi = fb.GraphAPI(config.FACEBOOK_APP_ACCESS_TOKEN)
    for user in db.testUser.find():
 # use app access token to send notificaitons
        notification = notfi.put_object(parent_object=user['id'], connection_name='notifications',template='Please check your recent CRC cancer risk test result: http://mycancerrisk.io')