MetaSeek is a data discovery and analysis tool for biological sequencing data.

Providing a rich interactive front-end for exploration of sequencing metadata from the major sequencing data repositories, use MetaSeek to find the right integration of sequences for your analysis, and then access the raw sequencing data.

MetaSeek also provides an API for programmatic access. [See the API docs](https://github.com/ahoarfrost/metaseek/blob/master/APIdocs.md).

# How MetaSeek works

MetaSeek scrapes metadata from the sequencing data repositories, cleaning and filling in missing or erroneous metadata, and stores the cleaned and structured metadata in the MetaSeek database. A python flask app serves this metadata to a lightweight, interactive front-end in React.js. For programmatic access, MetaSeek offers a powerful, flexible API.

![How MetaSeek Works](https://github.com/ahoarfrost/metaseek/blob/master/client/images/HowMetaSeekWorks.png)


### spin up your own local build of metaseek

#### clone the repo
`git clone https://github.com/ahoarfrost/metaseek.git`

#### add some sample data to the DB
```
cd server/
unzip bootstrapData.zip
python bootstrap.py
```

#### start the back end
`python app.py`

#### install front-end dependencies
```
cd ../client/
npm install
```

#### launch the app
`gulp`
