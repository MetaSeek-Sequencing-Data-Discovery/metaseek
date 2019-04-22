MetaSeek is a data discovery and analysis tool for biological sequencing data.

Providing a rich interactive front-end for exploration of sequencing metadata from the major sequencing data repositories, use MetaSeek to find the right integration of sequences for your analysis, and then access the raw sequencing data.

MetaSeek also provides an API for programmatic access. [See the API docs](https://github.com/MetaSeek-Sequencing-Data-Discovery/metaseek/blob/master/APIdocs.md).

# How MetaSeek works

MetaSeek scrapes metadata from the sequencing data repositories, cleaning and filling in missing or erroneous metadata, and stores the cleaned and structured metadata in the MetaSeek database. A python flask app serves this metadata to a lightweight, interactive front-end in React.js. For programmatic access, MetaSeek offers a powerful, flexible API.

![How MetaSeek Works](https://github.com/MetaSeek-Sequencing-Data-Discovery/metaseek/blob/master/client/images/HowMetaSeekWorks.png)


## A Demo: Using MetaSeek to find marine metagenomes in the SRA

[![MetaSeek demo](https://github.com/MetaSeek-Sequencing-Data-Discovery/metaseek/blob/master/MetaSeekDemoScreenshot.png)](https://youtu.be/hN2EDmE-jLQ "Click to see a demo of the MetaSeek online interface")


## spin up your own local build of metaseek

#### clone the repo
`git clone https://github.com/MetaSeek-Sequencing-Data-Discovery/metaseek.git`

#### we recommend creating a virtualenv with python 2 in the server folder
```
cd server/
virtualenv env_metaseek
source env_metaseek/bin/activate
```
#### install backend dependencies
`pip install -r requirements.txt`

#### install backend dependencies
`pip install -r requirements.txt`

#### start the back end
`python app.py`

#### install front-end dependencies
You also need a global as well as local installation of gulp, so install that globally.
```
cd ../client/
npm install
npm install --global gulp-cli
```

#### launch the app
`gulp`
