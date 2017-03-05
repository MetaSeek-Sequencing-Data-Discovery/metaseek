# Webapp framework
from flask import Flask, url_for

# Database setup and ORM
from flask_sqlalchemy import SQLAlchemy

# Support for REST API in Flask
from flask_restful import Resource, Api, reqparse, fields, marshal_with

# Utilities
from datetime import datetime
from dateutil import parser as dateparser
import random
import json

# Config / initialize the app, database and api
app = Flask(__name__)
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
    URL = db.Column(db.Text)
    date = db.Column(db.DateTime)
    # full = db.Column(db.PickleType)

    # Each class must have an init function
    def __init__(self, latitude, longitude, URL, date):
        self.latitude = latitude
        self.longitude = longitude
        self.date = date
        self.URL = URL

    # Friendly string representation
    def __repr__(self):
        return '<Dataset %r>' % self.URL

# For a many to many database relationship, use a mapping table (no class definition directly)
# Eg. each discovery will have many datasets, and each dataset may belong to many discoveries
# Each row in this table is one "dataset in discovery" membership
dataset_to_discovery = db.Table('dataset_to_discovery',
    db.Column('dataset_id', db.Integer, db.ForeignKey('dataset.id')),
    db.Column('discovery_id', db.Integer, db.ForeignKey('discovery.id'))
)

class Discovery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filter_params = db.Column(db.String(40))
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

# Declare route functions
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
                return {'firebase_id': args['firebase_id'], 'admin': args['admin'], 'id': newUser.id}

        except Exception as e:
            return {'error': str(e)}

class CreateDataset(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('latitude', type=float, help='Email address to create user')
            parser.add_argument('longitude', type=float)
            parser.add_argument('URL')
            parser.add_argument('date', type=str)
            args = parser.parse_args()
            datetimeguess = dateparser.parse(args['date'])

            newDataset = Dataset(args['latitude'],args['longitude'],args['URL'],datetimeguess)
            db.session.add(newDataset)
            db.session.commit()
            return url_for('getdataset',id=newDataset.id,_external=True)

        except Exception as e:
            return {'error': str(e)}

class GetUser(Resource):
    @marshal_with({
        'firebase_id':fields.String,
        'admin':fields.Integer,
        'id':fields.Integer
    }, envelope='user')
    def get(self, id):
        return User.query.get(id)

class GetDataset(Resource):
    @marshal_with({
        'latitude':fields.Float,
        'longitude':fields.Float,
        'id':fields.Integer
    }, envelope='dataset')
    def get(self, id):
        return Dataset.query.get(id)

class GetAllDatasets(Resource):
    @marshal_with({
        'latitude':fields.Float,
        'longitude':fields.Float,
        'id':fields.Integer
    }, envelope='datasets')
    def get(self):
        return Dataset.query.all()

class GetAllDiscoveries(Resource):
    @marshal_with({
        'filter_params':fields.String,
        'timestamp':fields.DateTime(dt_format='rfc822'),
        'uri': fields.Url('getdiscovery', absolute=True),
        'owner_id':fields.Integer
    }, envelope='discoveries')
    def get(self):
        return Discovery.query.all()

class GetUserDiscoveries(Resource):
    @marshal_with({
        'filter_params':fields.String,
        'timestamp':fields.DateTime(dt_format='rfc822'),
        'uri': fields.Url('getdiscovery', absolute=True)
    }, envelope='discoveries')

    def get(self, id):
        return Discovery.query.filter_by(owner_id=id).all()

class GetDiscovery(Resource):
    @marshal_with({
        'filter_params':fields.String,
        'timestamp':fields.DateTime(dt_format='rfc822'),
        'datasets':fields.Nested({
            'latitude':fields.Float,
            'longitude':fields.Float,
            'id':fields.Integer
        }),
        'owner':fields.Url('getuser',absolute=True)
    })
    def get(self, id):
        return Discovery.query.get(id)

# End route functions

# Declare routing
api.add_resource(CreateUser,        '/api/user/create')
api.add_resource(GetUser,           '/api/user/<int:id>')
api.add_resource(GetUserDiscoveries,'/api/user/<int:id>/discoveries')

api.add_resource(CreateDataset,     '/api/dataset/create')
api.add_resource(GetDataset,        '/api/dataset/<int:id>')
api.add_resource(GetAllDatasets,    '/api/datasets')
#api.add_resource(GetDatasetSummary, '/api/datasets/summary')
#api.add_resource(SearchDatasets,    '/api/datasets/search')

api.add_resource(GetDiscovery,      '/api/discovery/<int:id>')
api.add_resource(GetAllDiscoveries, '/api/discoveries')
#api.add_resource(CreateDiscovery,   '/api/dataset/create')

# Start the app!
if __name__ == '__main__':
    app.run(debug=True)
