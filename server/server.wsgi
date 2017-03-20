import sys
import os

os.environ['METASEEK_DB'] = "REDACTED"
print 'Replace me during deployment then comment this out!'
print os.environ['METASEEK_DB']

sys.path.insert(0, '/var/www/html/server')

activate_this = '/home/ubuntu/server/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

from app import app as application
