from flask import Flask, request, jsonify, render_template, url_for, session, redirect, Blueprint
import config
from flask_oauthlib.client import OAuth, OAuthException
from flask import current_app
import facebook as fb
import json
# from facepy import GraphAPI
# from apscheduler.schedulers.background import BackgroundScheduler
# import atexit

fb_auth = Blueprint('fb_auth',__name__)
fb_auth.secret_key = config.SECRET_KEY
oauth = OAuth(fb_auth)

facebook = oauth.remote_app(
    'facebook',
    consumer_key=config.FACEBOOK_APP_ID,
    consumer_secret=config.FACEBOOK_APP_SECRET,
    request_token_params={'scope': 'email'},
    base_url='https://graph.facebook.com',
    request_token_url=None,
    access_token_url='https://graph.facebook.com/oauth/access_token',
    access_token_method='GET',
    authorize_url='https://www.facebook.com/dialog/oauth'
)


@facebook.tokengetter
def get_facebook_oauth_token():
    return session.get('oauth_token')

def pop_login_session():
    session.clear()


@fb_auth.route('/login')
def login():
    callback = url_for(
        'fb_auth.facebook_authorized',
        next=request.args.get('next') or request.referrer or None,
        _external=True,
        _scheme= 'https'
        )
    current_app.logger.info(callback)
    return facebook.authorize(callback=callback)


@fb_auth.route('/login/authorized')
def facebook_authorized():
    current_app.logger.info(request)
    current_app.logger.info('authorizing process start:')
    resp = facebook.authorized_response()
    current_app.logger.info(resp)
    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            request.args['error_reason'],
            request.args['error_description']
        )
    if isinstance(resp, OAuthException):
        return 'Access denied: %s' % resp.message

    session['oauth_token'] = (resp['access_token'], '')
    # current_app.logger.info(session['oauth_token'])
    session['logged_in'] = True
    # me = facebook.get('/me') # get user info (id, uname)
    # graph = fb.GraphAPI(resp['access_token'])
    args = {'fields' : 'id,name,email', }
    r, profile = facebook.http_request('https://graph.facebook.com/me?fields=id%2Cname&access_token=' + session['oauth_token'][0], method="GET")
    # profile = graph.get_object('me', **args)
    profile = json.loads(profile.decode("utf-8"))
    current_app.logger.info(profile)
    session['user_name'] = profile['name']
    session['id'] = profile['id']
    if (len(profile) == 3) :
        session['email'] = profile['email']
    else:
        session['email'] = 'none'
    # session['email'] = profile['email']
    return redirect(url_for('homepage'))

@fb_auth.route("/logout")
def logout():
    pop_login_session()
    return redirect(url_for('homepage'))
