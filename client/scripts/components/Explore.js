import React from 'react';

// Firebase imports / setup
import Rebase from 're-base';

// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

// My component imports
import Header from './Header';
import ExploreFilters from './ExploreFilters';
import ExploreTable from './ExploreTable';

// Firebase setup
var firebaseEndpoint = 'https://metaseq-6b779.firebaseio.com/';
var base = Rebase.createClass(firebaseEndpoint);

var Explore = React.createClass({
  getInitialState : function() {
    return {
      'fullData':[{
        	"id": 1,
        	"database": "GenBank",
        	"sample_id": "SAMN05660194",
        	"investigation_type": "metagenome",
        	"project_name": "PRJNA311141",
        	"lat_lon": "32.887 N 117.289 W",
        	"depth": "30cm",
        	"alt_elev": "-384m",
        	"geo_loc_name": "USA: La Jolla Canyon",
        	"collection_date": "Nov-12",
        	"env_biome": "marine sediment",
        	"env_feature": "submarine canyon",
        	"env_material": "sediment",
        	"env_package": "sediment",
        	"seq_meth": "not provided"
        }, {
        	"id": 2,
        	"database": "GenBank",
        	"sample_id": "SAMN05660187",
        	"investigation_type": "metagenome",
        	"project_name": "PRJNA288387",
        	"lat_lon": "44.97 N 93.32 W",
        	"depth": "80.0cm",
        	"alt_elev": "260m",
        	"geo_loc_name": "USA: Hennepin County, Minnesota",
        	"collection_date": "Jul-12",
        	"env_biome": "lake sediment",
        	"env_feature": "lake",
        	"env_material": "sediment",
        	"env_package": "sediment",
        	"seq_meth": "not provided"
        }, {
        	"id": 3,
        	"database": "GenBank",
        	"sample_id": "SAMN05660186",
        	"investigation_type": "metagenome",
        	"project_name": "PRJNA288387",
        	"lat_lon": "44.97 N 93.32 W",
        	"depth": "62.0cm",
        	"alt_elev": "260m",
        	"geo_loc_name": "USA: Hennepin County, Minnesota",
        	"collection_date": "Jul-12",
        	"env_biome": "lake sediment",
        	"env_feature": "lake",
        	"env_material": "sediment",
        	"env_package": "sediment",
        	"seq_meth": "not provided"
        }, {
        	"id": 4,
        	"database": "GenBank",
        	"sample_id": "SAMN05710710",
        	"investigation_type": "metagenome",
        	"project_name": "PRJNA340165",
        	"lat_lon": "16.641750 S 172.200017 W",
        	"depth": "0-2 mbsf",
        	"alt_elev": "-9161",
        	"geo_loc_name": "Pacific Ocean",
        	"collection_date": "2-Sep-12",
        	"env_biome": "marine",
        	"env_feature": "ocean trench",
        	"env_material": "sediment",
        	"env_package": "sediment",
        	"seq_meth": "not provided"
        }, {
        	"id": 5,
        	"database": "GenBank",
        	"sample_id": "SAMN03002195",
        	"investigation_type": "metagenome",
        	"project_name": "PRJNA259156",
        	"lat_lon": "73.763167 N 8.464000 E",
        	"depth": "0.75 mbsf",
        	"alt_elev": "-3283 m",
        	"geo_loc_name": "Arctic Ocean: Gakkel Ridge",
        	"collection_date": "2010",
        	"env_biome": "sea floor",
        	"env_feature": "Hydrothermal impacted sediments",
        	"env_material": "marine sediment",
        	"env_package": "sediment",
        	"seq_meth": "not provided"
        }, {
        	"id": 6,
        	"database": "GenBank",
        	"sample_id": "SAMN03457173",
        	"investigation_type": "metagenome",
        	"project_name": "PRJNA280149",
        	"lat_lon": "43.30 N 124.48 E",
        	"depth": "20",
        	"alt_elev": "unknown",
        	"geo_loc_name": "not collected",
        	"collection_date": "2013-05",
        	"env_biome": "Mollisol",
        	"env_feature": "Mollisol",
        	"env_material": "soil",
        	"env_package": "soil",
        	"seq_meth": "not provided"
        }, {
        	"id": 7,
        	"database": "GenBank",
        	"sample_id": "SAMN02990631",
        	"investigation_type": "metagenome",
        	"project_name": "PRJNA258222",
        	"lat_lon": "44.34007 N 71.21779 W",
        	"depth": "1-12",
        	"alt_elev": "not collected",
        	"geo_loc_name": "not collected",
        	"collection_date": "21-Oct-12",
        	"env_biome": "Forest",
        	"env_feature": "not collected",
        	"env_material": "not collected",
        	"env_package": "soil",
        	"seq_meth": "not provided"
        }, {
        	"id": 8,
        	"database": "GenBank",
        	"sample_id": "SAMN05609574",
        	"investigation_type": "metagenome",
        	"project_name": "not provided",
        	"lat_lon": "26.7430555555555 S 27.0977777777777 E",
        	"depth": "10 cm",
        	"alt_elev": "not collected",
        	"geo_loc_name": "South Africa: Potchefstroom",
        	"collection_date": "2013-05-14",
        	"env_biome": "Savannah",
        	"env_feature": "Soil",
        	"env_material": "Soil",
        	"env_package": "soil",
        	"seq_meth": "not provided"
        }, {
        	"id": 9,
        	"database": "GenBank",
        	"sample_id": "SAMN05609571",
        	"investigation_type": "metagenome",
        	"project_name": "not provided",
        	"lat_lon": "47.58763 N 19.0298 E",
        	"depth": "10 cm",
        	"alt_elev": "not collected",
        	"geo_loc_name": "Hungary: Budapest",
        	"collection_date": "2013-11-14",
        	"env_biome": "Temperate Forest",
        	"env_feature": "Soil",
        	"env_material": "Soil",
        	"env_package": "soil",
        	"seq_meth": "not provided"
        }, {
        	"id": 10,
        	"database": "GenBank",
        	"sample_id": "SAMN05609568",
        	"investigation_type": "metagenome",
        	"project_name": "not provided",
        	"lat_lon": "61.0153361111111 N 25.6653666666666 E",
        	"depth": "10 cm",
        	"alt_elev": "not collected",
        	"geo_loc_name": "Finland: Lahti",
        	"collection_date": "2013-11-14",
        	"env_biome": "Boreal Forest",
        	"env_feature": "Soil",
        	"env_material": "Soil",
        	"env_package": "soil",
        	"seq_meth": "not provided"
        }, {
        	"id": 11,
        	"database": "EBI",
        	"sample_id": "ERS226995",
        	"investigation_type": "metagenome",
        	"project_name": "GuyaSol",
        	"lat_lon": "2.2570 N 52.8733 W",
        	"depth": ".1 m",
        	"alt_elev": "127 m",
        	"geo_loc_name": "not provided",
        	"collection_date": "2010-10",
        	"env_biome": "not provided",
        	"env_feature": "not provided",
        	"env_material": "not provided",
        	"env_package": "soil",
        	"seq_meth": "Roche 454 GS FLX Titanium"
        }, {
        	"id": 12,
        	"database": "EBI",
        	"sample_id": "SRS604119",
        	"investigation_type": "metagenome",
        	"project_name": "Arable soil bacteria Metagenome (SRP041800)",
        	"lat_lon": "23.15 N 113.36 W",
        	"depth": "0.2 m",
        	"alt_elev": "Not collected",
        	"geo_loc_name": "Farm lands in South China Agriculture University, Guangzhou,China",
        	"collection_date": "3/16/13",
        	"env_biome": "not provided",
        	"env_feature": "Arable soil in farm lands",
        	"env_material": "Soil",
        	"env_package": "soil",
        	"seq_meth": "not provided"
        }, {
        	"id": 13,
        	"database": "EBI",
        	"sample_id": "ERS580786",
        	"investigation_type": "metagenome",
        	"project_name": "BASE",
        	"lat_lon": "25.3504 S 131.0516 E",
        	"depth": "0.10 m",
        	"alt_elev": "513 m",
        	"geo_loc_name": "Australia",
        	"collection_date": "2012-10-17",
        	"env_biome": "Arid",
        	"env_feature": "Grassland",
        	"env_material": "soil",
        	"env_package": "Soil",
        	"seq_meth": "Illumina"
        }, {
        	"id": 14,
        	"database": "EBI",
        	"sample_id": "SRS666267",
        	"investigation_type": "metagenome",
        	"project_name": "Soil bacterial community in temperate grassland (SRP044829)",
        	"lat_lon": "42.03 N 116.28 E",
        	"depth": "0.01 m",
        	"alt_elev": "1324",
        	"geo_loc_name": "China",
        	"collection_date": "19-Aug-13",
        	"env_biome": "Temperate grassland",
        	"env_feature": "Natural steppe",
        	"env_material": "",
        	"env_package": "soil",
        	"seq_meth": "not provided"
        }, {
        	"id": 15,
        	"database": "EBI",
        	"sample_id": "SRS652545",
        	"investigation_type": "metagenome",
        	"project_name": "ECOFINDER LTO soil samples Metagenome (SRP044011)",
        	"lat_lon": "not provided",
        	"depth": "not provided",
        	"alt_elev": "not provided",
        	"geo_loc_name": "not provided",
        	"collection_date": "not provided",
        	"env_biome": "not provided",
        	"env_feature": "not provided",
        	"env_material": "not provided",
        	"env_package": "soil",
        	"seq_meth": "not provided"
        }, {
        	"id": 16,
        	"database": "EBI",
        	"sample_id": "SRS004796",
        	"investigation_type": "metagenome",
        	"project_name": "IODP Expedition 308",
        	"lat_lon": "27.3013 N 94.3876 W",
        	"depth": "1470 m",
        	"alt_elev": "0",
        	"geo_loc_name": "USA:Gulf of Mexico",
        	"collection_date": "2005-06-09 T10:00",
        	"env_biome": "ocean",
        	"env_feature": "ocean floor",
        	"env_material": "marine sediment",
        	"env_package": "sediment",
        	"seq_meth": "454 FLX Titanium"
        }, {
        	"id": 17,
        	"database": "EBI",
        	"sample_id": "ERS240715",
        	"investigation_type": "metagenome",
        	"project_name": "A metagenomics transect into the deepest point of the Baltic Sea reveals clear stratification of microbial functional capacities (ERP002477)",
        	"lat_lon": "58.6000 , 18.2000",
        	"depth": "466 m",
        	"alt_elev": "not provided",
        	"geo_loc_name": "Baltic Sea",
        	"collection_date": "not provided",
        	"env_biome": "marine",
        	"env_feature": "brackish water habitat ",
        	"env_material": "sediment",
        	"env_package": "sediment",
        	"seq_meth": "not provided"
        }, {
        	"id": 18,
        	"database": "EBI",
        	"sample_id": "SRS519937",
        	"investigation_type": "metagenome",
        	"project_name": "Analysis of prokaryotic sequences from metagenome of Lonar lake sediment",
        	"lat_lon": "19.9767 , 76.5083",
        	"depth": "3 m",
        	"alt_elev": "350 m",
        	"geo_loc_name": "India: Lonar, Buldana district, Maharashtra",
        	"collection_date": "not provided",
        	"env_biome": "aquatic",
        	"env_feature": "saline water habitat",
        	"env_material": "sediment",
        	"env_package": "sediment",
        	"seq_meth": "not provided"
        }, {
        	"id": 19,
        	"database": "EBI",
        	"sample_id": "ERS799762",
        	"investigation_type": "metagenome",
        	"project_name": "Poyang_Lake_Sediment survay",
        	"lat_lon": "29.0000 , 115.0000",
        	"depth": "0.1 m",
        	"alt_elev": "16.5 m",
        	"geo_loc_name": "China",
        	"collection_date": "2014",
        	"env_biome": "freshwater sediment",
        	"env_feature": "freshwater sediment",
        	"env_material": "freshwater sediment",
        	"env_package": "sediment",
        	"seq_meth": "Illumina hiseq 2500"
        }, {
        	"id": 20,
        	"database": "EBI",
        	"sample_id": "ERS244591",
        	"investigation_type": "metagenome",
        	"project_name": "Making and breaking DMS by salt marsh microbes (Illumina MiSeq 250bp) (ERP002607)",
        	"lat_lon": "52.9653 , 0.9258",
        	"depth": "0.01 m",
        	"alt_elev": "0.001 m",
        	"geo_loc_name": "United Kingdom",
        	"collection_date": "not provided",
        	"env_biome": "marine salt marsh biome ENVO:01000022",
        	"env_feature": "saline water habitat ENVO:00002227",
        	"env_material": "sediment ENVO:01000119",
        	"env_package": "sediment",
        	"seq_meth": "not provided"
        }],
      'rules':[],
      'discoveryId':null
    }
  },

  componentWillMount : function() {
    this.state.activeData = this.state.fullData;
    this.setState({ 'activeData' : this.state.activeData});
  },
  componentWillUnmount : function() {
    base.removeBinding(this.ref);
  },

  applyRules : function(rules) {
    if (rules) {
      var tableData = this.state.fullData;
      for (var i = 0;i < rules.length;i++) {
        // don't love this because it loops through every row once per rule (and we may have a lot!)
        tableData = tableData.filter(function(row) {
          if (row[rules[i].field] == rules[i].value) {
            return true;
          } else {
            return false;
          }
        });
      }
      this.state.activeData = tableData;
      this.state.rules = rules;
      this.setState(this.state);
    }
    else {
      this.setState({ 'activeData' : this.state.fullData});
    }
  },

  submitDiscovery : function() {
    var discoveryId = (new Date()).getTime();
    this.state.discoveryId = discoveryId;
    this.ref = base.syncState('/discovery/' + this.state.discoveryId, {
        context: this,
        state: 'rules'
    });
    this.setState(this.state);
  },

  openDiscovery : function() {
    this.props.history.push('/discovery/' + this.state.discoveryId);
  },

  render : function() {
    return (
      <div>
        <Header history={this.props.history}/>
          <h2>Explore Data</h2>
          <MuiThemeProvider>
            <div>
              <Paper style={{'width':'80%','margin':'25px auto','padding':25}}>
                <ExploreFilters applyRules={this.applyRules}/>
                <RaisedButton
                  style={{'margin':'12px 12px 0 12px'}}
                  onClick={this.submitDiscovery}
                  primary={true}
                  label="Save Discovery"
                />
                <RaisedButton
                  style={{'margin':'12px 12px 0 12px'}}
                  onClick={this.openDiscovery}
                  primary={true}
                  disabled={this.state.discoveryId ? false : true}
                  label="Open Discovery"
                />
              </Paper>
              <Paper style={{'width':'80%','margin':'25px auto','padding':0}}>
                <ExploreTable activeData={this.state.activeData}/>
              </Paper>
            </div>
          </MuiThemeProvider>
      </div>
    )
  }
});

export default Explore;
