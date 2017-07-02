MetaSeek is a data discovery and analysis tool for genome sequencing data. Providing a rich front-end for exploration of metadata across a wide set of data repositories, use MetaSeek to find the right aggregation of sequences for your analysis, and then access the raw sequencing data.

To add sample data to the DB, unzip bootstrapData.zip into a folder named bootstrapData in the project root, and then run:

`python bootstrap.py`

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

`git merge master`

`git push`

SSH in:

`ssh -i "metaseek.pem" ubuntu@ec2-35-166-20-248.us-west-2.compute.amazonaws.com`

Open the Metaseek folder and pull the deploy branch:

`cd ~/metaseek`

`git checkout deploy`

`git pull`

Open the server folder and activate the virtualenv:

`cd server`

`source ./bin/activate`

Reset the DBs - run any pending database migrations and flush the cache:

`python manage.py db upgrade`

`echo 'flush_all' | nc localhost 11211`

Restart Apache:

`sudo apachectl restart`

Check the server is live:

`curl https://api.metaseek.cloud/api/users`

To debug:

`cat /var/log/apache2/error.log`
