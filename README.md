# CRC Risk Assessment Web Application

This is a facebook web application for assessing colorectal cancer risk. And the basic framework is set up with Flask, AngularJS abd MongoDB. It has been set up on server, and here, we will give an example using nginx and gunicorn.

## Getting Started

In this section, I will get you a copy of the project up and running on your local machine for development and testing purposes.

1  Copy the whole repository on your local machine
```
$ Git clone + HTTPS
```
2  Copy the whole repository on your local machine
```
$ pip install -r requirements.txt
```
3   Install python flask, pymongo and Flask-OAuthlib
```
$ cd static
```
4 Go into 'static' folder
```
$ npm install -g bower
```
5   Install all nodejs packges
```
$ bower install
```
## Installing and Deployment

#### Install Software(on Linux):
##### Python3  (pip is default installed in python3)

```
    $ sudo apt-get update
    $ sudo apt-get install python3.6
```
    
##### Nodejs + npm (Node.js is included in Ubuntu (13.04 and higher))

```
    $ sudo apt-get update
    $ sudo apt-get install nodejs
    $ sudo apt-get install npm
```
    
##### MongoDB

```
    $ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
    $ echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.0 multiverse"| sudo tee   /etc/apt/sources.list.d/mongodb-org-3.0.list
    $ sudo apt-get update
    $ sudo apt-get install -y mongodb-org
```
##### Run MongoDB:
* Start MongoDB
```
    $ sudo service mongod start
```
* Stop MongoDB
```
    $ sudo service mongod stop
```
    
##### Niginx

```
    $ sudo apt-get update
    $ sudo apt-get install nginx
```
    
##### Gunicorn
```
    $ sudo apt-get update
    $ sudo apt-get install gunicorn
```


#### Deployment

##### Create a Self-Signed SSL Certificate for Nginx

* Step 1:Create the SSL Certificate
```
    $ sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt
    $ sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
```
* Step 2: Configure Nginx to Use SSL
    1) Create a Configuration Snippet Pointing to the SSL Key and Certificate
    * First, let's create a new Nginx configuration snippet in the /etc/nginx/snippets directory.
         
            $ sudo nano /etc/nginx/snippets/self-signed.conf

    * Within this file, we just need to set the ssl_certificate directive to our certificate file and the ssl_certificate_key to the associated key. In our case, this will look like this

            ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
            ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;

    2) Create a Configuration Snippet with Strong Encryption Settings
    * Create another snippet that will define some SSL settings
    
            $ sudo nano /etc/nginx/snippets/ssl-params.conf

    * Modify the ssl-params.conf:
              
                # from https://cipherli.st/
                # and https://raymii.org/s/tutorials/Strong_SSL_Security_On_nginx.html

                ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
                ssl_prefer_server_ciphers on;
                ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
                ssl_ecdh_curve secp384r1;
                ssl_session_cache shared:SSL:10m;
                ssl_session_tickets off;
                ssl_stapling on;
                ssl_stapling_verify on;
                resolver 8.8.8.8 8.8.4.4 valid=300s;
                resolver_timeout 5s;
                # Disable preloading HSTS for now.  You can use the commented out header line that includes
                # the "preload" directive if you understand the implications.
                #add_header Strict-Transport-Security "max-age=63072000; includeSubdomains; preload";
                add_header Strict-Transport-Security "max-age=63072000; includeSubdomains";
                #add_header X-Frame-Options "ALLOW-FROM https://www.facebook.com/login/";
                add_header Content-Security-Policy "frame-ancestors https://apps.facebook.com/";
                add_header X-Content-Type-Options nosniff;
             
    3) Adjust the Nginx Configuration to Use SSL
    * Back up our current server block file
    
            $ sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.bak
              
    * Open the server block file to make adjustments
    
             $ sudo nano /etc/nginx/sites-available/default
             
    * Inside, modify server block
    
                #
                # You should look at the following URL's in order to grasp a solid understanding
                # of Nginx configuration files in order to fully unleash the power of Nginx.
                # http://wiki.nginx.org/Pitfalls
                # http://wiki.nginx.org/QuickStart
                # http://wiki.nginx.org/Configuration
                #
                # Generally, you will want to move this file somewhere, and start with a clean
                # file but keep this around for reference. Or just disable in sites-enabled.
                #
                # Please see /usr/share/doc/nginx-doc/examples/ for more detailed examples.
                ##
                # Default server configuration
                #
                server {
                        listen 80 default_server;
                        listen [::]:80 default_server;
                        server_name server_domain_or_IP;
                        return 301 https://$server_name$request_uri;
                }
                server {
                        listen 443 ssl http2 default_server;
                        listen [::]:443 ssl http2 default_server;
                        include snippets/self-signed.conf;
                        include snippets/ssl-params.conf;
                        # Note: You should disable gzip for SSL traffic.
                        # See: https://bugs.debian.org/773332
                        #
                        # Read up on ssl_ciphers to ensure a secure configuration.
                        # See: https://bugs.debian.org/765782
                        #
                        # Self signed certs generated by the ssl-cert package
                        # Don't use them in a production server!
                        #
                        # include snippets/snakeoil.conf;

                        #root /var/www/html;

                        # Add index.php to the list if you are using PHP
                        #index index.html index.htm index.nginx-debian.html;

                        server_name server_domain_or_IP;

                        location / {
                                # First attempt to serve request as file, then
                                # as directory, then fall back to displaying a 404.
                                #try_files $uri $uri/ =404;
                                proxy_pass http://127.0.0.1:8000;
                                proxy_set_header Host $host;
                                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                        }
                # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
                #
                #location ~ \.php$ {
                #       include snippets/fastcgi-php.conf;
                #
                #       # With php7.0-cgi alone:
                #       fastcgi_pass 127.0.0.1:9000;
                #       # With php7.0-fpm:
                #       fastcgi_pass unix:/run/php/php7.0-fpm.sock;
                #}
                # deny access to .htaccess files, if Apache's document root
                # concurs with nginx's one
                #
                #location ~ /\.ht {
                #       deny all;
                #}
                # Virtual Host configuration for example.com
                #
                # You can move that to a different file under sites-available/ and symlink that
                # to sites-enabled/ to enable it.
                #
                #server {
                #       listen 80;
                #       listen [::]:80;
                #
                #       server_name example.com;
                #
                #       root /var/www/example.com;
                #       index index.html;
                #
                #       location / {
                #               try_files $uri $uri/ =404;
                #       }
                #}

* Step 3: Adjust the Firewall

            $ sudo ufw allow 'Nginx Full'
            $ sudo ufw delete allow 'Nginx HTTP'

* Step 4: Enable the Changes in Nginx

            $ sudo service nginx start
            $ sudo service nginx stop

##### Set up keys for Secret.py and config.py
1. Create Secret.py file and put the aws_access_key_id and aws_secret_access_key
2. Create config.py file and it looks like this:
    ```
    DEBUG = True
    FACEBOOK_APP_ID = xxxxxxxxxx
    FACEBOOK_APP_SECRET = xxxxxxxxxx
    SECRET_KEY = 'development'
    FACEBOOK_APP_ACCESS_TOKEN = xxxxxxxxxx
    ```


## Running the tests

1. Start MongoDB

        $ sudo service mongod start

2. Start Nginx

        $ sudo service nginx start

3. Run Gunicron

        $ gunicorn run:CRCRiskApp -w 4 --daemon
        
4. test on server_domain_or_IP