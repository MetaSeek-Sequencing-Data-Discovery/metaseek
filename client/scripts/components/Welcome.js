import React from 'react';
import { Link } from 'react-router';

// Material Design imports
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';

// My component imports
import Header from './Header';

var Welcome = React.createClass({
  getInitialState : function() {
    return {}
  },
  render : function() {
    var styles = {
      container: {
        textAlign: 'center',
        paddingTop: 45,
        width: '80%',
        margin: '0 auto',
        maxWidth: '800px',
        minWidth: '500px'
      },
      paper: {
        'backgroundColor':'#92CBC5',
        'width':200,
        'height':200,
        'padding':15,
        'textAlign':'left',
        'margin':'0 auto'
      }
    };
    return (
      <div>
        <Header history={this.props.history}/>
        <MuiThemeProvider>
          <div style={styles.container}>
            <h1 style={{'fontSize':'2.6em'}}>Welcome to MetaSeek</h1>
            <p style={{'marginTop':'50px','marginBottom':40}}>Discover, curate, and get access to thousands of sequencing samples from all over the web.</p>
              <div style={{'display':'flex','maxWidth':500,'margin':'0 auto'}}>
                <Paper style={styles.paper} zDepth={3}>
                  <p style={{'margin':0}}>Explore publicly available samples by filtering, sorting, and saving your discoveries. Once you've curated a set of samples, easily download metadata and instructions for raw data download.</p>
                  <Link style={{'display':'block','marginTop':15,'textAlign':'center'}} to='/explore'>
                    <FlatButton label="DISCOVER"></FlatButton>
                  </Link>
                </Paper>
                <Paper style={styles.paper} zDepth={3}>
                  <p style={{'margin':0}}>Explore publicly available samples by filtering, sorting, and saving your discoveries. Once you've curated a set of samples, easily download metadata and instructions for raw data download.</p>
                  <Link style={{'display':'block','marginTop':15,'textAlign':'center'}} to='/dataset/new'>
                    <FlatButton label="CONTRIBUTE"></FlatButton>
                  </Link>
                </Paper>
              </div>
              <h1 style={{'fontSize':'1.8em','marginTop':60}}>What is MetaSeek?</h1>
              <p style={{'marginTop':'50px'}}>MetaSEQ is a data discovery and analysis tool for sequencing data. Providing a rich front-end for exploration of metadata across a wide set of data repositories, use MetaSeek to find the right aggregation of sequences for your analysis, and then access the raw sequencing data.</p>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
});

export default Welcome;
