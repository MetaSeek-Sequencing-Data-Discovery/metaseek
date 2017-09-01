import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ColorPalette from './ColorPalette';
import Paper from 'material-ui/Paper';

var Glossary = React.createClass ({
  getInitialState : function() {
    return {}
  },

  render : function() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(ColorPalette)}>
        <Paper>
          <div>
            <h1>Glossary</h1>
            <h3>Environmental Package</h3>
            <section id="env_package">
              
            </section>
            <h3>Investigation Type</h3>
            <section id="investigation_type">
              Nucleic Acid Sequence Report is the root element of all MIGS/MIMS compliant reports as standardized by Genomic Standards Consortium. This is a controlled vocabulary. The possible terms are: eukaryote (for eukaryotic genomes or transcriptomes),bacteria_archaea (for bacterial or archaeal genomes/transcriptomes), virus (for viral DNA or RNA), plasmid, organelle, metagenome (for whole-community metagenomes or metatranscriptomes), mimarks-survey (for marker genes from a community or environmental sample), or mimarks-specimen (for marker genes from a single organism)
            </section>
          </div>
        </Paper>
    </MuiThemeProvider>
    )
  }
});

export default Glossary;
