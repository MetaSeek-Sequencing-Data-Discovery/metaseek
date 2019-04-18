import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ColorPalette from './ColorPalette';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import { Link } from 'react-router';
import Subheader from 'material-ui/Subheader';

var Glossary2 = React.createClass ({
  getInitialState : function() {
    return {}
  },

  renderGlossary : function(category) {
    <div>
    <Subheader>{category}</Subheader>
    <List>
      {Object.keys(glossary[category]).map(function(item){
        return(
          <ListItem
            primaryText={item}
            nestedItems={[
              <section className="glossary-item" key={item}>
                {glossary[category][item]}
              </section>
            ]}
          />
        )
      })}
    </List>
    </div>
  },

  render : function() {

    const glossary = require('../glossary.json');
    //console.log(glossary["investigation_type"]);


    return (
      <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
      <Paper className="glossary-paper">
        <div>
          <h2>Glossary</h2>
          {Object.keys(glossary).map(function(category){
            return(
              <div>
              <Subheader>{category}</Subheader>
              <List>
                {Object.keys(glossary[category]).map(function(item) {
                  return(
                    <ListItem
                      primaryText={item}
                      nestedItems={[
                        <section className="glossary-item" key={item}>
                          {glossary[category][item]}
                        </section>
                      ]}
                    />
                  )
                })}
              </List>
              </div>
            )
          })};
        </div>
      </Paper>
    </MuiThemeProvider>
    )
  }
});

export default Glossary2;
