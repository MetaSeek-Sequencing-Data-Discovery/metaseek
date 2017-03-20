#### TL;DR

Getting this app up and running for the first time was a PITA. Here are my notes to avoid future headaches.

Parts and pieces stolen from a number of guides:

#### Flask on AWS Ubuntu

* http://www.datasciencebytes.com/bytes/2015/02/24/running-a-flask-app-on-aws-ec2/
* https://www.digitalocean.com/community/tutorials/how-to-serve-django-applications-with-apache-and-mod_wsgi-on-ubuntu-14-04

#### Installling MYSQL

* https://gist.github.com/jmervine/2079897
* https://stackoverflow.com/questions/1559955/host-xxx-xx-xxx-xxx-is-not-allowed-to-connect-to-this-mysql-server/1559992#1559992
* http://stackoverflow.com/questions/21221220/cant-connect-to-mysql-server-on-ip-or-domain-name

#### Apache nitty gritty

* http://blog.dscpl.com.au/2014/09/using-python-virtual-environments-with.html

#### Provisioning an instance, uploading files and installing dependencies

The Data Science Bytes guide has a great start to setting up an EC2 instance, setting up security groups right and installing the basics. Use that http://www.datasciencebytes.com/bytes/2015/02/24/running-a-flask-app-on-aws-ec2/.

To SSH in:

`
ssh -i "metaseek.pem" ubuntu@ec2-35-166-20-248.us-west-2.compute.amazonaws.com
`

Stop before they `pip install` anything!

Switch to https://www.digitalocean.com/community/tutorials/how-to-serve-django-applications-with-apache-and-mod_wsgi-on-ubuntu-14-04 and follow their instructions on how to set up a virtualenv.

Set up the virtualenv in the target directory for where we want to upload our app root directory (currently "~/server").

Make sure you have an up-to-date requirements.txt.

```
pip install pipreqs
pipreqs ./ --force
```

Copy up the app (obviously you have to have access to the metaseek.pem file).

`
scp -r -i "metaseek.pem" ./server ubuntu@ec2-35-166-20-248.us-west-2.compute.amazonaws.com:
`

Activate the virtualenv using `./bin/activate` and run `pip install -r requirements.txt` to install all python dependencies.

Note that the app requires a METASEEK_DB environment variable to access the database properly. On a local development mac, run `printenv` to print your environment variables and confirm it is there and correct. If not, add it to your bash profile with `nano ~/.bash_profile`.

#### Setting up the database

This is a great start: https://gist.github.com/jmervine/2079897

Note that you may want to set up additional users with master or restricted privileges - if so do that before getting to the portion on bind-address.

```
mysql> CREATE USER 'monty'@'localhost' IDENTIFIED BY 'some_pass';
mysql> GRANT ALL PRIVILEGES ON *.* TO 'monty'@'localhost'
    ->     WITH GRANT OPTION;
mysql> CREATE USER 'monty'@'%' IDENTIFIED BY 'some_pass';
mysql> GRANT ALL PRIVILEGES ON *.* TO 'monty'@'%'
    ->     WITH GRANT OPTION;
mysql> FLUSH PRIVELEGES;
```

In `/etc/mysql/mysql.conf.d/mysqld.cnf`, comment out this line - note that this isn't where most of the guides say it will be (in `/etc/mysql`).

```
# bind-address		= 127.0.0.1
```

Restart mysql with `sudo service mysql restart`.

At this point you should be able to connect to the database remotely.

`
mysql -h ec2-35-166-20-248.us-west-2.compute.amazonaws.com -unick -p
`

#### Setting up apache to serve your Flask app

Go back to the Data Science Bites article http://www.datasciencebytes.com/bytes/2015/02/24/running-a-flask-app-on-aws-ec2/

Install Apache as specified and link your project folder the the Apache folder:

`
sudo ln -sT ~/flaskapp /var/www/html/flaskapp
`

Create the .wsgi file as specified as well.

The virtual host must look like:

`
cat /etc/apache2/sites-available/000-default.conf
`

This steals a bit from http://blog.dscpl.com.au/2014/09/using-python-virtual-environments-with.html about properly pointing a .wsgi script at a Python virtualenv.

```
<VirtualHost *:80>
	# The ServerName directive sets the request scheme, hostname and port that
	# the server uses to identify itself. This is used when creating
	# redirection URLs. In the context of virtual hosts, the ServerName
	# specifies what hostname must appear in the request's Host: header to
	# match this virtual host. For the default virtual host (this file) this
	# value is not decisive as it is used as a last resort host regardless.
	# However, you must set it for any further virtual host explicitly.
	ServerName api.metaseek.cloud

	ServerAdmin nicholas.tyler.brown@gmail.com
	DocumentRoot /var/www/html

	WSGIDaemonProcess metaseek python-home=/home/ubuntu/server threads=5
	WSGIScriptAlias / /var/www/html/server/server.wsgi

	<Directory /var/www/html/server>
	    WSGIProcessGroup metaseek
	    WSGIApplicationGroup %{GLOBAL}
	    Order deny,allow
	    Allow from all
	</Directory>

	# Available loglevels: trace8, ..., trace1, debug, info, notice, warn,
	# error, crit, alert, emerg.
	# It is also possible to configure the loglevel for particular
	# modules, e.g.
	LogLevel debug ssl:warn

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined

	# For most configuration files from conf-available/, which are
	# enabled or disabled at a global level, it is possible to
	# include a line for only one particular virtual host. For example the
	# following line enables the CGI configuration for this host only
	# after it has been globally disabled with "a2disconf".
	#Include conf-available/serve-cgi-bin.conf
</VirtualHost>

# vim: syntax=apache ts=4 sw=4 sts=4 sr noet

```

#### Adding HTTPS with letsencrypt

Let's Encrypt is awesome! Kinda! https://letsencrypt.org/

They recommend certbot, which definitely almost works: https://certbot.eff.org/#ubuntuxenial-apache

Certbot has a bug with WSGIDaemonProcess, where it duplicates your VirtualHost with the same process name, which causes Apache to fail to restart. https://github.com/certbot/certbot/issues/1820

Hacky solution: comment out your WSGIDaemonProcess before running the tool, then uncomment it when you're done. Slightly less happy - author the new VirtualHost file yourself and give one of the two processes (http or https) a different name. This is our HTTPS VirtualHost:

```
<IfModule mod_ssl.c>
<VirtualHost *:443>
	# The ServerName directive sets the request scheme, hostname and port that
	# the server uses to identify itself. This is used when creating
	# redirection URLs. In the context of virtual hosts, the ServerName
	# specifies what hostname must appear in the request's Host: header to
	# match this virtual host. For the default virtual host (this file) this
	# value is not decisive as it is used as a last resort host regardless.
	# However, you must set it for any further virtual host explicitly.
	ServerName api.metaseek.cloud

	ServerAdmin nicholas.tyler.brown@gmail.com
	DocumentRoot /var/www/html

	WSGIDaemonProcess metaseekssl python-home=/home/ubuntu/server threads=5
	WSGIScriptAlias / /var/www/html/server/server.wsgi

	<Directory /var/www/html/server>
	    WSGIProcessGroup metaseekssl
	    WSGIApplicationGroup %{GLOBAL}
	    Order deny,allow
	    Allow from all
	</Directory>

	# Available loglevels: trace8, ..., trace1, debug, info, notice, warn,
	# error, crit, alert, emerg.
	# It is also possible to configure the loglevel for particular
	# modules, e.g.
	LogLevel debug ssl:warn

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined

	# For most configuration files from conf-available/, which are
	# enabled or disabled at a global level, it is possible to
	# include a line for only one particular virtual host. For example the
	# following line enables the CGI configuration for this host only
	# after it has been globally disabled with "a2disconf".
	#Include conf-available/serve-cgi-bin.conf

	SSLCertificateFile /etc/letsencrypt/live/api.metaseek.cloud/fullchain.pem
	SSLCertificateKeyFile /etc/letsencrypt/live/api.metaseek.cloud/privkey.pem
	Include /etc/letsencrypt/options-ssl-apache.conf

</VirtualHost>

# vim: syntax=apache ts=4 sw=4 sts=4 sr noet
</IfModule>
```

For some reason this seemed to break WSGI's ability to read the correct python, and to read from the OS environment variables so we had to add a change to the server.wsgi file:

```
import sys
import os

os.environ['METASEEK_DB'] = "REDACTED"
print 'Replace me during deployment then comment this out!'
print os.environ['METASEEK_DB']

sys.path.insert(0, '/var/www/html/server')

activate_this = '/home/ubuntu/server/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

from app import app as application
```

This adds an env variable in the right context (obviously replace REDACTED with the true var) and loads the python virtualenv on the fly.

#### Uh...whoops. Huh? Why'd it do that?

For posterity's sake, here is the full embarrassing command line history of me trying to set up this server:

```
1  ls
2  sudo apt-get install python-pip
3  git
4  sudo pip install flask
5  quit
6  ls
7  pip install requirements.txt
8  pip install -r requirements.txt
9  pip install Flask==0.12
10  pip install Flask_Cors==3.0.2
11  pip install Flask_RESTful==0.3.5
12  pip install Flask_SQLAlchemy==2.2
13  pip install numpy==1.11.1
14  pip install pandas==0.17.1
15  pip uninstall numpy
16  pip install pandas==0.17.1
17  pip install cython
18  pip install pandas==0.17.1
19  pip uninstall numpy
20  pip install pandas==0.17.1
21  pip uninstall pandas
22  pip uninstall numpy
23  pip install pandas
24  pip install -r requirements.txt
25  pip freeze | xargs pip uninstall -y
26  pip freeze | xargs sudo pip uninstall -y
27  ls
28  pip install -r requirements.txt
29  python
30  pip install pysql
31  ls
32  cd server
33  ls
34  cd ..
35  sudo yum install mysql-server
36  sudo apt-get install mysql-server mysql-client
37  sudo mysqladmin -u root -h localhost password 'REDACTED'
38  sudo mysqladmin -u root -h localhost -p
39  sudo mysqladmin -up root -h localhost
40  sudo mysqladmin -uroot -p -h localhost
41  sudo mysqladmin -uroot -p
42  mysql -u root -p
43  sudo nano /etc/mysql/my.cnf
44  sudo /sbin/iptables -A INPUT -i eth0 -p tcp --destination-port 3306 -j ACCEPT
45  sudo iptables-save
46  sudo iptables-apply
47  cat /etc/network/iptables.up.rules
48  sudo service mysql restart
49  sudo mysqladmin -u root -h localhost password 'password'
50  mysql
51  mysql -uroot -p
52  mysql.server restart
53  cat /etc/mysql/my.cnf
54  sudo nano /etc/mysql/my.cnf
55  mysql -uroot -p
56  sudo service mysql restart
57  mysql -uroot -p
58  netstat -tulpen
59  cat /etc/mysql/my.cnf
60  cat ~/my.cnf
61*
62  cat /etc/mysql/mysql.conf.d/
63  cat /etc/mysql/mysql.conf.d
64  cat /etc/mysql/mysql.conf.d/my.cnf
65  cd etc
66  cd /etc
67  cd mysql
68  cd mysql.conf.d
69  ls
70  cat mysqld.cnf
71  nano mysqld.cnf
72  sudo nano mysqld.cnf
73  ls
74  service mysql restart
75  sudo service mysql restart
76  netstat -tap | grep mysql
77  netstat -tap
78  sudo netstat -tap
79  mysql
80  mysql -uroot -p
81  sudo service mysql restart
82  service iptables stop
83  sudo service iptables stop
84  netstat -tulpen
85  cat /etc/network/iptables.up.rules
86  service iptables start
87  sudo service iptables start
88  sudo service ufw stop
89  sudo service ufw start
90  mysql -uroot -p
91  cd ~
92  ls
93  cd server
94  ls
95  python app.py
96  pip install pymysql
97  python app.py
98  mysql
99  mysql -uroot =p
100  mysql -uroot -p
101  sudo service mysql restart
102  ls
103  nano app.py
104  mysql -uroot -p
105  cd ..
106  ls
107  pip install -r requirements.txt
108  ls
109  cd server
110  ls
111  nano app.py
112  python app.py
113  nano app.py
114  python app.py
115  cd ..
116  ls
117  cd /var/www/html
118  cd ..
119  cd ~
120  sudo ln -sT ~/server /var/www/html/server
121  cd server
122  ls
123  echo "Hello World" > index.html
124  ls
125  cd /var/www/html/server
126  ls
127  cd ~/server
128  touch app.wsgi
129  nano app.wsgi
130  cat app.wsgi
131  ls
132  nano app.py
133  sudo nano /etc/apache2/sites-enabled/000-default.conf
134  mv app.wsgi server.wsgi
135  ls
136  sudo nano /etc/apache2/sites-enabled/000-default.conf
137  cat /etc/apache2/sites-enabled/000-default.conf
138  sudo apachectl restart
139  cat /var/log/apache2/error.log
140  pip install flask
141  cat /var/log/apache2/error.log
142  sudo apt-get remove libapache2-mod-wsgi-py3
143  sudo apt-get install libapache2-mod-python libapache2-mod-wsgi
144  sudo apachectl restart
145  cat /var/log/apache2/error.log
146  sudo apt-get remove libapache2-mod-python
147  sudo apachectl restart
148  cat /var/log/apache2/error.log
149  sudo nano /etc/apache2/sites-enabled/000-default.conf
150  sudo apt-get update
151  sudo apt-get install python-pip apache2 libapache2-mod-wsgi
152  sudo pip install virtualenv
153  ls
154  virtualenv metaseek
155  ls
156  rm -rf metaseek
157  ls
158  cd ..
159  virtualenv server
160  ls
161  cd server
162  ls
163  source ./bin/activate
164  pip install -r requirements.txt
165  ls
166  python app.py
167  ls
168  cat requirements.txt
169  pip install -r requirements.txt
170  python app.py
171  ls /var/www/html/server
172  ls
173  sudo nano /etc/apache2/sites-available/000-default.conf
174  sudo a2ensite /etc/apache2/sites-available/000-default.conf
175  sudo apachectl restart
176  cat /var/log/apache2/error.log
177  python
178  sudo nano /etc/apache2/sites-available/000-default.conf
179  python
180  sudo nano /etc/apache2/sites-available/000-default.conf
181  cat /etc/apache2/sites-available/000-default.conf
182  sudo apachectl restart
183  sudo nano /etc/apache2/sites-available/000-default.conf
184  sudo apachectl restart
185  cat /var/log/apache2/error.log
186  sudo nano /etc/apache2/sites-available/000-default.conf
187  sudo apachectl restart
188  cat /var/log/apache2/error.log
189  ls
190  nano server.wsgi
191  import sys
192  python
193  nano server.wsgi
194  ls
195  cd bin
196  ls
197  cd ..
198  ls
199  rm index.html
200  nano server.wsgi
201  cat /var/log/apache2/error.log
202  cat /etc/apache2/sites-available/000-default.conf
203  history > history.txt
```
