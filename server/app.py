from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import random

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/metaseek'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# each class becomes a table
class Dataset(db.Model):
    # each attribute on a "Model" inherited class becomes a Column
    id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    URL = db.Column(db.Text)
    date = db.Column(db.DateTime)
    # full = db.Column(db.PickleType)

    def __init__(self, latitude, longitude, URL, date):
        self.latitude = latitude
        self.longitude = longitude
        self.date = date
        self.URL = URL

    def __repr__(self):
        return '<Dataset %r>' % self.URL

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firebase_id = db.Column(db.String(28), primary_key=True)
    admin = db.Column(db.Boolean)
    discoveries = db.relationship('Discovery', backref='user', lazy='dynamic')

    def __init__(self, firebase_id, admin=False):
        self.firebase_id = firebase_id
        self.admin = admin

    def __repr__(self):
        return '<User %r>' % self.firebase_id

dataset_to_discovery = db.Table('dataset_to_discovery',
    db.Column('dataset_id', db.Integer, db.ForeignKey('dataset.id')),
    db.Column('discovery_id', db.Integer, db.ForeignKey('discovery.id'))
)

class Discovery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    filter_params = db.Column(db.String(40))
    timestamp = db.Column(db.DateTime)
    datasets = db.relationship('Dataset', secondary=dataset_to_discovery, backref=db.backref('discoveries', lazy='dynamic'))

    def __init__(self, owner_id, filter_params, datasets, timestamp=None, ):
        self.owner_id = owner_id
        self.filter_params = filter_params
        self.datasets = datasets
        if timestamp is None:
            timestamp = datetime.utcnow()
        self.timestamp = timestamp

    def __repr__(self):
        return '<Discovery %r>' % self.filter_params

# TODO take this out into a 'bootstrap.py' file for kickstarting a new DB
db.create_all()

# some sample stuff you can do

newuser = User('random' + str(random.random()),False)
db.session.add(newuser)

newDataset = Dataset(random.random() * 100,random.random() * 100,'http://google.com', datetime.utcnow())
db.session.add(newDataset)

newDiscovery = Discovery(1,'{"some":value","another":"filter"}',[newDataset,Dataset(random.random() * 100,random.random() * 100,'http://google.com', datetime.utcnow())])
db.session.add(newDiscovery)

db.session.commit()

User.query.filter_by(admin=True).first()
Discovery.query.filter_by(owner_id=1).all()
Dataset.query.filter(Dataset.latitude > 40).all()
