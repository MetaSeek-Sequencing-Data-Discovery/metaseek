import React from 'react';
import { Link } from 'react-router';

// Material Design imports
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// My component imports
import Header from './Header';

var Browse = React.createClass({
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
      }
    };
    return (
      <div>
        <Header/>
        <div style={styles.container}>
          <h2>Browse Existing Discoveries!</h2>
          <MuiThemeProvider>
            <div>
              <Link to='/'>
                <RaisedButton label="Welcome" primary={true}/>
              </Link>
              <Link to='/explore'>
                <RaisedButton label="Explore Data" primary={true}/>
              </Link>
              <Link to='/dataset/new'>
                <RaisedButton label="Contribute Dataset" primary={true}/>
              </Link>
            </div>
          </MuiThemeProvider>
        </div>
      </div>
    )
  }
});

export default Browse;
