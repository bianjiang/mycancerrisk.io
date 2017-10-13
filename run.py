from flask import Flask, render_template, url_for, Blueprint, jsonify, current_app
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

def test():
     print('test')

@CRCRiskApp.route('/', methods=['GET', 'POST'])
def homepage():
    return render_template('index.aspx')


if __name__ == '__main__':
    sched = BackgroundScheduler()
    # sched.add_job(notification.notify, 'interval', seconds = 10)
    sched.add_job(test, 'interval', seconds = 10)
    sched.start()
    CRCRiskApp.run(debug = True)