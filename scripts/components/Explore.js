import React from 'react';
import { Link } from 'react-router';

// Material Design imports
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// My component imports
import Header from './Header';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

var Explore = React.createClass({
  getInitialState : function() {
    return {}
  },
  render : function() {
    var styles = {
      container: {
        textAlign: 'center',
        paddingTop: 125,
        width: '70%',
        margin: '0 auto',
        maxWidth: '420px'
      },
      propContainer: {
        width: 200,
        overflow: 'hidden',
        margin: '20px auto 0',
      },
      propToggleHeader: {
        margin: '20px auto 10px',
      }
    };


    var tableData = [{
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
}];
    return (
      <div>
        <Header history={this.props.history}/>
          <h2>Explore Data</h2>
          <MuiThemeProvider>
            <div>
                <Table bodyStyle={{overflowX: undefined, width:'2000px' }} height='600px' fixedHeader={false} fixedFooter={false} selectable={false}>
                  <TableHeader adjustForCheckbox={false} displaySelectAll={false} enableSelectAll={false}>
                    <TableRow selectable={false}>
                      <TableHeaderColumn tooltip="id">id</TableHeaderColumn>
                      <TableHeaderColumn tooltip="database">database</TableHeaderColumn>
                      <TableHeaderColumn tooltip="sample_id">sample_id</TableHeaderColumn>
                      <TableHeaderColumn tooltip="investigation_type">investigation_type</TableHeaderColumn>
                      <TableHeaderColumn tooltip="project_name">project_name</TableHeaderColumn>
                      <TableHeaderColumn tooltip="lat_lon">lat_lon</TableHeaderColumn>
                      <TableHeaderColumn tooltip="depth">depth</TableHeaderColumn>
                      <TableHeaderColumn tooltip="alt_elev">alt_elev</TableHeaderColumn>
                      <TableHeaderColumn tooltip="geo_loc_name">geo_loc_name</TableHeaderColumn>
                      <TableHeaderColumn tooltip="collection_date">collection_date</TableHeaderColumn>
                      <TableHeaderColumn tooltip="env_biome">env_biome</TableHeaderColumn>
                      <TableHeaderColumn tooltip="env_feature">env_feature</TableHeaderColumn>
                      <TableHeaderColumn tooltip="env_material">env_material</TableHeaderColumn>
                      <TableHeaderColumn tooltip="env_package">env_package</TableHeaderColumn>
                      <TableHeaderColumn tooltip="seq_meth">seq_meth</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody stripedRows={true} displayRowCheckbox={false} preScanRows={false}>
                    {tableData.map( (row, index) => (
                      <TableRow selectable={false} key={index}>
                        <TableRowColumn>{row.id}</TableRowColumn>
                        <TableRowColumn>{row.database}</TableRowColumn>
                        <TableRowColumn>{row.sample_id}</TableRowColumn>
                        <TableRowColumn>{row.investigation_type}</TableRowColumn>
                        <TableRowColumn>{row.project_name}</TableRowColumn>
                        <TableRowColumn>{row.lat_lon}</TableRowColumn>
                        <TableRowColumn>{row.depth}</TableRowColumn>
                        <TableRowColumn>{row.alt_elev}</TableRowColumn>
                        <TableRowColumn>{row.geo_loc_name}</TableRowColumn>
                        <TableRowColumn>{row.collection_date}</TableRowColumn>
                        <TableRowColumn>{row.env_biome}</TableRowColumn>
                        <TableRowColumn>{row.env_feature}</TableRowColumn>
                        <TableRowColumn>{row.env_material}</TableRowColumn>
                        <TableRowColumn>{row.env_package}</TableRowColumn>
                        <TableRowColumn>{row.seq_meth}</TableRowColumn>
                      </TableRow>
                      ))}
                  </TableBody>
                </Table>
            </div>
          </MuiThemeProvider>
      </div>
    )
  }
});

export default Explore;
