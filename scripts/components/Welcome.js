import React from 'react';
import { Link } from 'react-router';

// Material Design imports
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

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
        paddingTop: 125,
        width: '70%',
        margin: '0 auto',
        maxWidth: '420px'
      }
    };
    return (
      <div>
        <Header history={this.props.history}/>
        <MuiThemeProvider>
          <div style={styles.container}>
            <h1>Material-UI</h1>
            <Link to='/browse'>
              <RaisedButton label="Browse Discoveries" fullWidth={true}/>
            </Link>
            <Link to='/explore'>
              <RaisedButton label="Explore Datasets" fullWidth={true}/>
            </Link>
            <Link to='/dataset/new'>
              <RaisedButton label="Contribute Data" fullWidth={true}/>
            </Link>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
});

export default Welcome;
