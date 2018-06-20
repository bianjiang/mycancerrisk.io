from flask import Flask, render_template, url_for, Blueprint, jsonify
from auth import fb_auth
from riskcalculator import riskcalculator
from userinfo import userinfo
from apscheduler.schedulers.background import BackgroundScheduler
import atexit
import notification
from flask_compress import Compress
# import scheduald_email

compress = Compress()
def start_app():
	app = Flask(__name__)
	compress.init_app(app)
	return app

CRCRiskApp = start_app()

# CRCRiskApp = Flask(__name__)
CRCRiskApp.config.from_object('config')
CRCRiskApp.register_blueprint(fb_auth);
CRCRiskApp.register_blueprint(riskcalculator);
# CRCRiskApp.register_blueprint(sch_email);
CRCRiskApp.register_blueprint(userinfo);

@CRCRiskApp.route('/', methods=['GET', 'POST'])
def homepage():
    return render_template('index.aspx')

@CRCRiskApp.route('/.well-known/pki-validation/1497FEBB82D9DFA0D87B92F8BA5376D4.txt', methods=['GET'])
def ssl():
    return render_template('1497FEBB82D9DFA0D87B92F8BA5376D4.txt')


sched = BackgroundScheduler()
sched.add_job(notification.notify, 'interval', seconds = 604800)
# sched.add_job(notification.notify, 'interval', seconds = 10)
sched.start()

if __name__ == '__main__':
    CRCRiskApp.run(debug = True)
