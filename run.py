from flask import Flask, render_template, url_for, Blueprint, jsonify
from auth import fb_auth
from riskcalculator import riskcalculator
from userinfo import userinfo
from apscheduler.schedulers.background import BackgroundScheduler
import atexit
import notification
# import scheduald_email


CRCRiskApp = Flask(__name__)
CRCRiskApp.config.from_object('config')
CRCRiskApp.register_blueprint(fb_auth);
CRCRiskApp.register_blueprint(riskcalculator);
# CRCRiskApp.register_blueprint(sch_email);
CRCRiskApp.register_blueprint(userinfo);

@CRCRiskApp.route('/', methods=['GET', 'POST'])
def homepage():
    return render_template('index.aspx')

sched = BackgroundScheduler()
sched.add_job(notification.notify, 'interval', seconds = 604800)
sched.start()

if __name__ == '__main__':
    CRCRiskApp.run(debug = True)
