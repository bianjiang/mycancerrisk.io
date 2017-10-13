from flask import Flask, session
import config
import facebook as fb
from dbmongo import db
import requests

def notify():
    # notfi = fb.GraphAPI(config.FACEBOOK_APP_ACCESS_TOKEN)
    # authinfo = http.HTTPBasicAuthHandler()
    # proxy_support = http.ProxyHandler({"https" : "https://proxe.shands.ufl.edu:3128"})
    # opener = http.build_opener(proxy_support, authinfo)
    # http.install_opener(opener)
    # proxyDict = {"https" : "https://proxe.shands.ufl.edu:3128"}
    for user in db.testUser.find():
 # use app access token to send notificaitons
        url = "https://graph.facebook.com/v2.10/" + user['id'] + "/notifications?access_token=" +config.FACEBOOK_APP_ACCESS_TOKEN + "&template='Please check your recent CRC cancer risk test result: http://mycancerrisk.io'"
        # notification = notfi.put_object(parent_object=user['id'], connection_name='notifications',template='Please check your recent CRC cancer risk test result: http://mycancerrisk.io')
        # r = requests.post(url, proxies=proxyDict)
        r = requests.post(url)
        print(r.text)