import json
from datetime import datetime
from pyhashxx import hashxx
from pymemcache.client.base import Client
from app import db
from models import *
from helpers import *
from celery import Celery

# Set up memcached
def json_serializer(key, value):
    if type(value) == str:
        return value, 1
    return json.dumps(value), 2

def json_deserializer(key, value, flags):
    if flags == 1:
        return value
    if flags == 2:
        return json.loads(value)
    raise Exception("Unknown serialization format")

# TODO this really should be inherited from the app import, not something config'd separately

# production memcached
# client = Client(('TODO set up prod memcached', 11211), serializer=json_serializer, deserializer=json_deserializer)

# local memcached
client = Client(('localhost', 11211), serializer=json_serializer, deserializer=json_deserializer)

# set up Celery to queue jobs in RabbitMQ on localhost
app = Celery('app', broker='pyamqp://guest@localhost//')

@app.task
def buildCache(cache_key,rules):
    start = datetime.now()
    summary = summarizeDatasets(Dataset.query,rules,sampleRate=.25)
    client.set(cache_key, summary)
    finish = datetime.now()
    print 'took this long to build'
    print str(round((finish - start).total_seconds(),1)) + 's'
    return summary
