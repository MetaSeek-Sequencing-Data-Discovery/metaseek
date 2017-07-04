from __future__ import division
from flask import Flask, url_for
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource, reqparse, fields, marshal_with
from dateutil import parser as dateparser
from datetime import datetime
import json
from pyhashxx import hashxx
from pymemcache.client.base import Client
import os

dbPass = os.environ['METASEEK_DB']

# Config / initialize the app, database and api
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# production DB
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://metaseek:' + dbPass + '@ec2-35-166-20-248.us-west-2.compute.amazonaws.com/metaseek'

# local DB - uncomment for local testing
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/metaseek'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
api = Api(app)

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

# production memcached
# client = Client(('TODO set up prod memcached', 11211), serializer=json_serializer, deserializer=json_deserializer)

# local memcached
client = Client(('localhost', 11211), serializer=json_serializer, deserializer=json_deserializer)


from helpers import *
from models import *

# Declare route functions
# /user routes
class CreateUser(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('firebase_id', type=str, help='Email address to create user')
            parser.add_argument('admin', type=int)
            args = parser.parse_args()

            existingUser = User.query.filter_by(firebase_id=args['firebase_id']).first()

            if (existingUser):
                return {'error':'User already exists!','uri':url_for('getuser',id=existingUser.id,_external=True)}
            else:
                newUser = User(args['firebase_id'],args['admin'])
                db.session.add(newUser)
                db.session.commit()
                return {"user":{"uri":url_for('getuser',id=newUser.id,_external=True)}}

        except Exception as e:
            return {'error': str(e)}
    def get(self):
        return "hi!"

class GetUser(Resource):
    @marshal_with({
        'firebase_id':fields.String,
        'admin':fields.Integer,
        'uri':fields.Url('getuser', absolute=True)
    }, envelope='user')
    def get(self, id):
        return User.query.get(id)

class GetAllUsers(Resource):
    @marshal_with({
        'firebase_id':fields.String,
        'admin':fields.Integer,
        'uri':fields.Url('getuser', absolute=True)
    }, envelope='users')
    def get(self):
        return User.query.all()

class GetUserDiscoveries(Resource):
    @marshal_with({
        'filter_params':fields.String,
        'timestamp':fields.DateTime(dt_format='rfc822'),
        'uri': fields.Url('getdiscovery', absolute=True)
    }, envelope='discoveries')

    def get(self, id):
        return Discovery.query.filter_by(owner_id=id).all()

## /dataset routes
#class CreateDataset(Resource):
#    def post(self):
#        try:
#            parser = reqparse.RequestParser()
#            # Note that any arguments added here MUST be present in the POST request or the request will fail with
#            # 400 - Bad Request as the response
#            parser.add_argument('latitude', type=str)
#            parser.add_argument('longitude', type=str)
#            parser.add_argument('investigation_type',type=str)
#            parser.add_argument('env_package',type=str)
#            parser.add_argument('library_source',type=str)
#            parser.add_argument('avg_read_length_maxrun',type=float)
#            parser.add_argument('total_num_reads',type=int)
#            parser.add_argument('total_num_bases',type=int)
#            parser.add_argument('download_size_maxrun',type=int)
#            parser.add_argument('gc_percent_maxrun',type=float)
#            parser.add_argument('biosample_link',type=str)
#            parser.add_argument('sample_title',type=str)
#            parser.add_argument('collection_date',type=str)
#
#            args = parser.parse_args()
#            try:
#                datetimeguess = dateparser.parse(args['collection_date'])
#            except ValueError:
#                datetimeguess = None
#
#            newDataset = Dataset(args['biosample_link'],args['sample_title'],args['investigation_type'],args['library_source'], args['env_package'],datetimeguess, args['latitude'], args['longitude'], args['avg_read_length_maxrun'], args['total_num_reads'], args['total_num_bases_maxrun'], args['download_size_maxrun'],args['gc_percent_maxrun'])
#            db.session.add(newDataset)
#            db.session.commit()
#            return {"dataset":{"id":newDataset.id,"uri":url_for('getdataset',id=newDataset.id,_external=True)}}
#
#        except Exception as e:
#            return {'error': str(e)}

marshalledDatasetFields = {
    'latitude':fields.String,
    'longitude':fields.String,
    'investigation_type':fields.String,
    'env_package':fields.String,
    'library_source':fields.String,
    'avg_read_length_maxrun':fields.Float,
    'total_num_reads':fields.Integer,
    'total_num_bases_maxrun':fields.Integer,
    'download_size_maxrun':fields.Integer,
    'gc_percent_maxrun':fields.Float,
    'biosample_link':fields.String,
    'collection_date':fields.String,
    'sample_title':fields.String,
    'id':fields.Integer,
    #this should also return the etc field for e.g. dataset details
    'uri': fields.Url('getdataset', absolute=True)
}

class GetDataset(Resource):
    @marshal_with(marshalledDatasetFields, envelope='dataset')
    def get(self, id):
        return Dataset.query.get(id)

class GetAllDatasets(Resource):
    @marshal_with(marshalledDatasetFields, envelope='datasets')
    def get(self):
        return Dataset.query.all()

class SearchDatasets(Resource):
    @marshal_with(marshalledDatasetFields, envelope='datasets')
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('filter_params', type=str)
            args = parser.parse_args()
            filter_params = json.loads(args['filter_params'])
            rules = filter_params['rules']

            queryObject = Dataset.query

            for rule in rules:
                field = rule['field']
                ruletype = rule['type']
                value = rule['value']
                queryObject = filterQueryByRule(Dataset,queryObject,field,ruletype,value)

            matchingDatasets = queryObject.all()
            return matchingDatasets

        except Exception as e:
            return {'error': str(e)}

class GetDatasetSummary(Resource):
    def get(self):
        # This is the result of:
        # str(hashxx(json.dumps(json.loads('{"rules":[]}')['rules'])))
        # Allows this cached value to be reused by SearchDatasetsSummary when no rules are set
        cache_key = '2027185612'

        from_cache = client.get(cache_key)

        if from_cache is None:
            queryObject = Dataset.query
            summary = summarizeDatasets(queryObject)
            client.set(cache_key, summary)
            return summary
        else:
            return from_cache

class SearchDatasetsSummary(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('filter_params', type=str)
            args = parser.parse_args()
            filter_params = json.loads(args['filter_params'])
            rules = filter_params['rules']

            cache_key = str(hashxx(json.dumps(rules)))
            from_cache = client.get(cache_key)

            if from_cache is None:
                queryObject = Dataset.query

                for rule in rules:
                    field = rule['field']
                    ruletype = rule['type']
                    value = rule['value']
                    queryObject = filterQueryByRule(Dataset,queryObject,field,ruletype,value)

                summary = summarizeDatasets(queryObject)
                client.set(cache_key, summary)
                return summary
            else:
                return from_cache

        except Exception as e:
            return {'error': str(e)}

# /discovery routes
class GetDiscovery(Resource):
    @marshal_with({
        'filter_params':fields.String,
        'timestamp':fields.DateTime(dt_format='rfc822'),
        'uri': fields.Url('getdiscovery', absolute=True),
        'datasets':fields.Nested(marshalledDatasetFields),
        'owner':fields.Nested({
            'firebase_id':fields.String,
            'uri':fields.Url('getuser', absolute=True)
        })
    }, envelope='discovery')
    def get(self, id):
        return Discovery.query.get(id)

class GetAllDiscoveries(Resource):
    @marshal_with({
        'filter_params':fields.String,
        'timestamp':fields.DateTime(dt_format='rfc822'),
        'uri': fields.Url('getdiscovery', absolute=True),
        'datasets':fields.Nested(marshalledDatasetFields),
        'owner':fields.Nested({
            'firebase_id':fields.String,
            'uri':fields.Url('getuser', absolute=True)
        })
    }, envelope='discoveries')
    def get(self):
        return Discovery.query.all()

class CreateDiscovery(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('owner_id', type=str)
            parser.add_argument('filter_params', type=str)
            args = parser.parse_args()

            filter_params = json.loads(args['filter_params'])
            rules = filter_params['rules']

            queryObject = Dataset.query

            for rule in rules:
                field = rule['field']
                ruletype = rule['type']
                value = rule['value']
                queryObject = filterQueryByRule(Dataset,queryObject,field,ruletype,value)

            matchingDatasets = queryObject.all()

            owner = User.query.filter_by(firebase_id=args['owner_id']).first()

            newDiscovery = Discovery(owner.id,args['filter_params'],matchingDatasets)
            db.session.add(newDiscovery)
            db.session.commit()
            return {"discovery":{"id":newDiscovery.id,"uri":url_for('getdiscovery',id=newDiscovery.id,_external=True)}}

        except Exception as e:
            return {'error': str(e)}

class PurgeCache(Resource):
    def get(self):
        client.flush_all()
        return client.stats()

class CacheStats(Resource):
    def get(self):
        return client.stats()

class BuildCaches(Resource):
    def get(self):
        # TODO actually define which ones we want here or create this list dynamically
        priorityFilterSets = [
            '{"rules":[]}',
            '{"rules":[{"field":"library_source","type":5,"value":"genomic"}]}',
            '{"rules":[{"field":"library_source","type":5,"value":"metagenomic"}]}',
            '{"rules":[{"field":"library_source","type":5,"value":"metatranscriptomic"}]}',
            '{"rules":[{"field":"library_source","type":5,"value":"transcriptomic"}]}'
        ]

        results = {}

        for filterSet in priorityFilterSets:
            filter_params = json.loads(filterSet)
            rules = filter_params['rules']

            cache_key = str(hashxx(json.dumps(rules)))
            from_cache = client.get(cache_key)

            results[cache_key] = {}
            results[cache_key]['rules'] = rules

            if from_cache is None:
                start = datetime.now()
                results[cache_key]['existing-cache'] = False

                queryObject = Dataset.query

                for rule in rules:
                    field = rule['field']
                    ruletype = rule['type']
                    value = rule['value']
                    queryObject = filterQueryByRule(Dataset,queryObject,field,ruletype,value)

                summary = summarizeDatasets(queryObject)
                client.set(cache_key, summary)
                finish = datetime.now()
                results[cache_key]['success'] = True
                results[cache_key]['cache-load-time'] = str(round((finish - start).total_seconds(),1)) + 's'
            else:
                results[cache_key]['existing-cache'] = True

        return results

# End route functions

# Declare routing
api.add_resource(CreateUser,            '/api/user/create')
api.add_resource(GetUser,               '/api/user/<int:id>')
api.add_resource(GetAllUsers,           '/api/users')
api.add_resource(GetUserDiscoveries,    '/api/user/<int:id>/discoveries')

# Temporarily removed - the only way to add a dataset is through scrapers/SRA/SRA_scrape.py
# api.add_resource(CreateDataset,         '/api/dataset/create')
api.add_resource(GetDataset,            '/api/dataset/<int:id>')
api.add_resource(GetAllDatasets,        '/api/datasets')
api.add_resource(GetDatasetSummary,     '/api/datasets/summary')
api.add_resource(SearchDatasets,        '/api/datasets/search')
api.add_resource(SearchDatasetsSummary, '/api/datasets/search/summary')

api.add_resource(CreateDiscovery,       '/api/discovery/create')
api.add_resource(GetDiscovery,          '/api/discovery/<int:id>')
api.add_resource(GetAllDiscoveries,     '/api/discoveries')

api.add_resource(PurgeCache,            '/api/cache/purge')
api.add_resource(CacheStats,            '/api/cache/stats')
api.add_resource(BuildCaches,           '/api/cache/build')

# Start the app!
if __name__ == '__main__':
    app.run(debug=True)
