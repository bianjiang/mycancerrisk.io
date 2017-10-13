from flask import Flask, render_template, url_for, Blueprint, jsonify
from auth import fb_auth
from riskcalculator import riskcalculator
from userinfo import userinfo
from apscheduler.schedulers.background import BackgroundScheduler
import atexit
# import notification
import logging
from dbmongo import db
import config, requests
# import scheduald_email


CRCRiskApp = Flask(__name__)
CRCRiskApp.config.from_object('config')
CRCRiskApp.register_blueprint(fb_auth);
CRCRiskApp.register_blueprint(riskcalculator);
# CRCRiskApp.register_blueprint(sch_email);
CRCRiskApp.register_blueprint(userinfo);
gunicorn_error_logger = logging.getLogger('gunicorn.error')
CRCRiskApp.logger.handlers.extend(gunicorn_error_logger.handlers)
CRCRiskApp.logger.setLevel(logging.DEBUG)

def notify():
    for user in db.testUser.find():
 # use app access token to send notifications
        CRCRiskApp.logger.debug('notifications')
        url = "https://graph.facebook.com/v2.10/" + user['id'] + "/notifications?access_token=" +config.FACEBOOK_APP_ACCESS_TOKEN + "&template='Please check your recent CRC cancer risk test result: http://mycancerrisk.io'"
        # notification = notfi.put_object(parent_object=user['id'], connection_name='notifications',template='Please check your recent CRC cancer risk test result: http://mycancerrisk.io')
        proxyDict = {"https" : "https://proxe.shands.ufl.edu:3128"}
        r = requests.post(url)

@CRCRiskApp.route('/', methods=['GET', 'POST'])
def homepage():
    return render_template('index.aspx')


if __name__ == '__main__':
    sched = BackgroundScheduler()
    sched.add_job(notify, 'interval', seconds = 10)
    sched.start()
    CRCRiskApp.logger.debug('start')
    CRCRiskApp.run(debug = True)
