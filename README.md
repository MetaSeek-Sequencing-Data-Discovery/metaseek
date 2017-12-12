MetaSeek is a data discovery and analysis tool for biological sequencing data.

Providing a rich interactive front-end for exploration of sequencing metadata from the major sequencing data repositories, use MetaSeek to find the right integration of sequences for your analysis, and then access the raw sequencing data.

MetaSeek also provides an API for programmatic access. [See the API docs](https://github.com/ahoarfrost/metaseek/blob/master/APIdocs.md).

# How MetaSeek works

MetaSeek scrapes metadata from the sequencing data repositories, cleaning and filling in missing or erroneous metadata, and stores the cleaned and structured metadata in the MetaSeek database. A python flask app serves this metadata to a lightweight, interactive front-end in React.js. For programmatic access, MetaSeek offers a powerful, flexible API.

![How MetaSeek Works](https://github.com/ahoarfrost/metaseek/blob/master/client/images/HowMetaSeekWorks.png)

#### Frontend deploy notes

Merge master into deploy branch:

`git checkout deploy`

`git merge master`

Build a production javacript bundle:

`cd client`

`gulp build`

Deploy the bundle to Firebase (this will require you to log in with Firebase):

`cd build`

`firebase deploy`

#### Backend deploy notes

Merge master into deploy branch and push to Github:

`git checkout deploy`

`git merge master` and resolve any conflicts

`git push`

SSH in:

`ssh -i "metaseek_shared.pem" ubuntu@ec2-52-33-134-115.us-west-2.compute.amazonaws.com`

Open the Metaseek folder and pull the deploy branch:

`cd ~/metaseek`

`git checkout deploy`

`git pull`

Open the server folder and activate the virtualenv:

`cd server`

`source ./bin/activate`

Install any missing Python dependencies

`pip install -r requirements.txt`

Reset the DBs - run any pending database migrations and flush the cache:

`python manage.py db upgrade`

`echo 'flush_all' | nc localhost 11211`

Restart Apache:

`sudo apachectl restart`

Check the server is live:

`curl https://api.metaseek.cloud/users`

To debug:

`cat /var/log/apache2/error.log`

Make sure Celery is happy for background tasks:

`screen -r celery`

#### Automatically generated script for downloading datasets

You can download an automatically-generated script to download each run in your discovery in fasta format. After downloading the 'downloadData.py' file, run it on the command line:

```
python downloadData.py
```

You will need to have python and the ftplib library installed. If ftplib is not installed, you can install it with pip:

```
pip install ftplib
```
