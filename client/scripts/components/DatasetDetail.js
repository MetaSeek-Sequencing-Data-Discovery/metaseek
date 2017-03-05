import React from 'react';

// Firebase imports / setup
import Rebase from 're-base';

// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';

// My component imports
import Header from './Header';

// Firebase setup
var firebaseEndpoint = 'https://metaseq-6b779.firebaseio.com/';
var base = Rebase.createClass(firebaseEndpoint);

var DatasetDetail = React.createClass({
  getInitialState: function() {
      return {
        'dataset':{
          'owner': 'nb',
          'fields': {}
        },
        'datasetId':0
      }
  },
  componentWillMount: function() {
    this.ref = base.syncState('/dataset/' + this.props.params.id, {
          context: this,
          state: 'dataset'
      });
  },
  componentWillUnmount: function() {
    base.removeBinding(this.ref);
  },
  renderField : function(field) {
    return (
      <ListItem>{field} - {this.state.dataset.fields[field]}</ListItem>
    )
  },
  render: function() {
    var styles = {
      paperStyle: {
        width: '75%',
        maxWidth: 800,
        margin: '15px auto',
        padding: 30,
      },
      submitStyle: {
        marginTop: 32,
      },
    };

    return (
        <MuiThemeProvider>
          <div>
            <Header history={this.props.history}/>
            <Paper style={styles.paperStyle} zDepth={2}>
              <h2>Dataset Detail</h2>
                <List>
                  {Object.keys(this.state.dataset.fields).map(this.renderField)}
                </List>
            </Paper>
            <div style={{
              width: '75%',
              maxWidth: 800,
              height: 300,
              margin: '15px auto',
              display: 'flex'
            }}>
              <Paper style={{
                padding: 30,
                width: '48%',
                height: 300,
                margin: 'auto'
              }} zDepth={2}>
                <h2>Rollup Info</h2>
                <p>Maybe a chart goes here or something?</p>
              </Paper>
              <Paper style={{
                padding: 30,
                width: '48%',
                height: 300,
                margin: 'auto'
              }} zDepth={2}>
                <h2>More Rollup Info</h2>
                <p>Maybe a chart goes here or something?</p>
              </Paper>
            </div>
          </div>
        </MuiThemeProvider>
    )
  }
});

export default DatasetDetail;
