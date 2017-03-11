# Webapp framework
from flask import Flask, url_for
from flask_cors import CORS, cross_origin

# Database setup and ORM
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

# Support for REST API in Flask
from flask_restful import Resource, Api, reqparse, fields, marshal_with

# Utilities
from datetime import datetime
from dateutil import parser as dateparser
import random
import json

# Config / initialize the app, database and api
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/metaseek'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
api = Api(app)

# Declare Models - Dataset, User, Discovery
# each class becomes a table
class Dataset(db.Model):
    # each attribute on a "Model" inherited class becomes a Column
    id = db.Column(db.Integer, primary_key=True)

    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    #collection_date = db.Column(db.DateTime)
    investigation_type = db.Column(db.Text)
    env_package = db.Column(db.Text)
    library_source = db.Column(db.Text)
    avg_read_length = db.Column(db.Float)
    #seq_method = db.Column(db.Text)
    total_num_reads = db.Column(db.Integer)
    total_num_bases = db.Column(db.Integer)
    download_size = db.Column(db.Integer)
    avg_percent_gc = db.Column(db.Float)
    biosample_link = db.Column(db.Text)
    sample_title = db.Column(db.Text)
    #etc = db.Column(db.PickleType)

    # Each class must have an init function
    def __init__(self, latitude=None, longitude=None, investigation_type=None, env_package=None, library_source=None, avg_read_length=None, total_num_reads=None, total_num_bases=None, download_size=None, avg_percent_gc=None, biosample_link=None, sample_title=None):
        self.latitude = latitude
        self.longitude = longitude
        self.investigation_type = investigation_type
        self.env_package = env_package
        self.library_source = library_source
        self.avg_read_length = avg_read_length
        self.total_num_reads = total_num_reads
        self.total_num_bases = total_num_bases
        self.download_size = download_size
        self.avg_percent_gc = avg_percent_gc
        self.biosample_link = biosample_link
        self.sample_title = sample_title

    # Friendly string representation
    def __repr__(self):
        return '<Dataset %r>' % self.biosample_link

# For a many to many database relationship, use a mapping table (no class definition directly)
# Eg. each discovery will have many datasets, and each dataset may belong to many discoveries
# Each row in this table is one "dataset in discovery" membership
dataset_to_discovery = db.Table('dataset_to_discovery',
    db.Column('dataset_id', db.Integer, db.ForeignKey('dataset.id')),
    db.Column('discovery_id', db.Integer, db.ForeignKey('discovery.id'))
)

class Discovery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filter_params = db.Column(db.Text)
    timestamp = db.Column(db.DateTime)
    datasets = db.relationship('Dataset', secondary=dataset_to_discovery, backref=db.backref('discoveries', lazy='dynamic'))
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    owner = db.relationship('User',backref=db.backref('myDiscoveries',lazy='dynamic'))

    def __init__(self, owner_id, filter_params, datasets, timestamp=None, ):
        self.owner_id = owner_id
        self.filter_params = filter_params
        self.datasets = datasets
        if timestamp is None:
            timestamp = datetime.utcnow()
        self.timestamp = timestamp

    def __repr__(self):
        return '<Discovery %r>' % self.filter_params

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firebase_id = db.Column(db.String(28), unique=True)
    admin = db.Column(db.Boolean)
    discoveries = db.relationship('Discovery', backref='user', lazy='dynamic')

    def __init__(self, firebase_id, admin=False):
        self.firebase_id = firebase_id
        self.admin = admin

    def __repr__(self):
        return '<User %r>' % self.firebase_id

# TODO take this out into a 'bootstrap.py' file for kickstarting a new DB
db.create_all()

# End Model definitions and create any new tables in the DB

# Utility functions
def filterQueryByRule(targetClass,queryObject,field,ruletype,value):
    fieldattr = getattr(targetClass,field)
    if ruletype == 0:
        queryObject = queryObject.filter(fieldattr == value)
    elif ruletype == 1:
        queryObject = queryObject.filter(fieldattr < value)
    elif ruletype == 2:
        queryObject = queryObject.filter(fieldattr > value)
    elif ruletype == 3:
        queryObject = queryObject.filter(fieldattr <= value)
    elif ruletype == 4:
        queryObject = queryObject.filter(fieldattr >= value)
    elif ruletype == 5:
        queryObject = queryObject.filter(fieldattr == value)
    elif ruletype == 6:
        queryObject = queryObject.filter(fieldattr != value)
    elif ruletype == 7:
        queryObject = queryObject.filter(fieldattr.like('%' + value + '%'))
    elif ruletype == 8:
        queryObject = queryObject.filter(fieldattr.in_(value))
    elif ruletype == 9:
        queryObject = queryObject.filter(~fieldattr.in_(value))
    elif ruletype == 10:
        queryObject = queryObject.filter(fieldattr != None)

    return queryObject

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
                return {'error':'User already exists!','uri':'http://127.0.0.1:5000/api/user/' + str(existingUser.id)}
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

# /dataset routes
class CreateDataset(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('latitude', type=float, help='Email address to create user')
            parser.add_argument('longitude', type=float)
            parser.add_argument('investigation_type',type=str)
            parser.add_argument('env_package',type=str)
            parser.add_argument('library_source',type=str)
            parser.add_argument('avg_read_length',type=float)
            parser.add_argument('total_num_reads',type=int)
            parser.add_argument('total_num_bases',type=int)
            parser.add_argument('download_size',type=int)
            parser.add_argument('avg_percent_gc',type=float)
            parser.add_argument('biosample_link',type=str)
            parser.add_argument('sample_title',type=str)

            args = parser.parse_args()
            #datetimeguess = dateparser.parse(args['date'])

            newDataset = Dataset(args['latitude'],args['longitude'],args['investigation_type'],args['env_package'], args['library_source'], args['avg_read_length'], args['total_num_reads'], args['total_num_bases'], args['download_size'], args['avg_percent_gc'], args['biosample_link'], args['sample_title'])
            db.session.add(newDataset)
            db.session.commit()
            return {"dataset":{"uri":url_for('getdataset',id=newDataset.id,_external=True)}}

        except Exception as e:
            return {'error': str(e)}

class GetDataset(Resource):
    @marshal_with({
        'latitude':fields.Float,
        'longitude':fields.Float,
        'investigation_type':fields.String,
        'env_package':fields.String,
        'library_source':fields.String,
        'avg_read_length':fields.Float,
        'total_num_reads':fields.Integer,
        'total_num_bases':fields.Integer,
        'download_size':fields.Integer,
        'avg_percent_gc':fields.Float,
        'biosample_link':fields.String,
        'sample_title':fields.String,
        #this should also return the etc field for e.g. dataset details
        'uri': fields.Url('getdataset', absolute=True)
    }, envelope='dataset')
    def get(self, id):
        return Dataset.query.get(id)

class GetAllDatasets(Resource):
    @marshal_with({
        'latitude':fields.Float,
        'longitude':fields.Float,
        'investigation_type':fields.String,
        'env_package':fields.String,
        'library_source':fields.String,
        'avg_read_length':fields.Float,
        'total_num_reads':fields.Integer,
        'total_num_bases':fields.Integer,
        'download_size':fields.Integer,
        'avg_percent_gc':fields.Float,
        'biosample_link':fields.String,
        'sample_title':fields.String,
        'uri': fields.Url('getdataset', absolute=True)
    }, envelope='datasets')
    def get(self):
        return Dataset.query.all()

class GetDatasetSummary(Resource):
    def get(self):
        total = Dataset.query.count()
        total_download_size = db.session.query(func.sum(Dataset.download_size)).first()[0]
        #averageLatitude = db.session.query(func.avg(Dataset.latitude)).first()[0]
        return {"summary":{"totalDatasets":int(total),"totalDownloadSize":int(total_download_size)}}

class SearchDatasets(Resource):
    @marshal_with({
        'latitude':fields.Float,
        'longitude':fields.Float,
        'investigation_type':fields.String,
        'env_package':fields.String,
        'library_source':fields.String,
        'avg_read_length':fields.Float,
        'total_num_reads':fields.Integer,
        'total_num_bases':fields.Integer,
        'download_size':fields.Integer,
        'avg_percent_gc':fields.Float,
        'biosample_link':fields.String,
        'sample_title':fields.String
        #'uri': fields.Url('getdataset', absolute=True)
    }, envelope='datasets')
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('filter_params', type=str)
            args = parser.parse_args()
            filter_params = json.loads(args['filter_params'])
            rules = filter_params['rules']

            queryObject = Dataset.query

            print rules
            for rule in rules:
                field = rule['field']
                ruletype = rule['type']
                value = rule['value']
                queryObject = filterQueryByRule(Dataset,queryObject,field,ruletype,value)

            matchingDatasets = queryObject.all()
            print matchingDatasets
            return matchingDatasets

        except Exception as e:
            return {'error': str(e)}

class SearchDatasetsSummary(Resource):
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

            matchCount = queryObject.count()
            return matchCount

        except Exception as e:
            return {'error': str(e)}

# /discovery routes
class GetDiscovery(Resource):
    @marshal_with({
        'filter_params':fields.String,
        'timestamp':fields.DateTime(dt_format='rfc822'),
        'uri': fields.Url('getdiscovery', absolute=True),
        'datasets':fields.Nested({
            'latitude':fields.Float,
            'longitude':fields.Float,
            'investigation_type':fields.String,
            'env_package':fields.String,
            'library_source':fields.String,
            'avg_read_length':fields.Float,
            'total_num_reads':fields.Integer,
            'total_num_bases':fields.Integer,
            'download_size':fields.Integer,
            'avg_percent_gc':fields.Float,
            'biosample_link':fields.String,
            'sample_title':fields.String,
            'uri': fields.Url('getdataset', absolute=True)
        }),
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
        'datasets':fields.Nested({
            'latitude':fields.Float,
            'longitude':fields.Float,
            'investigation_type':fields.String,
            'env_package':fields.String,
            'library_source':fields.String,
            'avg_read_length':fields.Float,
            'total_num_reads':fields.Integer,
            'total_num_bases':fields.Integer,
            'download_size':fields.Integer,
            'avg_percent_gc':fields.Float,
            'biosample_link':fields.String,
            'sample_title':fields.String,
            'uri': fields.Url('getdataset', absolute=True)
        }),
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
            parser.add_argument('owner_id', type=int)
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

            newDiscovery = Discovery(args['owner_id'],args['filter_params'],matchingDatasets)
            db.session.add(newDiscovery)
            db.session.commit()
            return {"discovery":{"uri":url_for('getdiscovery',id=newDiscovery.id,_external=True)}}

        except Exception as e:
            return {'error': str(e)}

# End route functions

# Declare routing
api.add_resource(CreateUser,            '/api/user/create')
api.add_resource(GetUser,               '/api/user/<int:id>')
api.add_resource(GetAllUsers,           '/api/users')
api.add_resource(GetUserDiscoveries,    '/api/user/<int:id>/discoveries')

api.add_resource(CreateDataset,         '/api/dataset/create')
api.add_resource(GetDataset,            '/api/dataset/<int:id>')
api.add_resource(GetAllDatasets,        '/api/datasets')
api.add_resource(GetDatasetSummary,     '/api/datasets/summary')
api.add_resource(SearchDatasets,        '/api/datasets/search')
api.add_resource(SearchDatasetsSummary, '/api/datasets/search/summary')

api.add_resource(CreateDiscovery,       '/api/discovery/create')
api.add_resource(GetDiscovery,          '/api/discovery/<int:id>')
api.add_resource(GetAllDiscoveries,     '/api/discoveries')

# Start the app!
if __name__ == '__main__':
    app.run(debug=True)
