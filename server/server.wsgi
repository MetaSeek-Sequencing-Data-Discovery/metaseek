import sys
import os

sys.path.insert(0, '/var/www/html/server')
from secrets import *
os.environ['METASEEK_DB'] = METASEEK_DB

activate_this = '/home/ubuntu/server/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

from app import app as application
