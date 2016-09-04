import React from 'react';

// Material Design imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Tabs, Tab} from 'material-ui/Tabs';
import Formsy from 'formsy-react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup,
    FormsySelect, FormsyText, FormsyTime, FormsyToggle } from 'formsy-material-ui/lib';

var AddDatasetForm = React.createClass({
  getInitialState() {
    return {
      canSubmit: false,
    };
  },

  enableButton: function() {
    this.setState({
      canSubmit: true,
    });
  },

  disableButton : function() {
    this.setState({
      canSubmit: false,
    });
  },

  submitDataset : function(data) {
    // stringify removes undefined attributes (for optional metadata params)
    this.props.addDataset(JSON.parse(JSON.stringify(data)));
    this.props.history.push('/dataset/' + this.props.datasetId);
  },

  render : function() {
    var errorMessages = {
      wordsError: "Please only use letters",
      numericError: "Please provide a number",
      urlError: "Please provide a valid URL",
    };

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
      <div>
        <MuiThemeProvider>
          <Paper style={styles.paperStyle}>
            <Formsy.Form
             onValid={this.enableButton}
             onInvalid={this.disableButton}
             onValidSubmit={this.submitDataset}
             onInvalidSubmit={this.notifyFormError}
            >
            <Tabs>
              <Tab label="Required" >
                 <FormsyText
                   name="lat"
                   validations="isNumeric"
                   validationError={errorMessages.numericError}
                   required
                   hintText="Latitude of sample?"
                   floatingLabelText="Latitude"
                 />
                 <FormsyText
                   name="long"
                   validations="isNumeric"
                   validationError={errorMessages.numericError}
                   required
                   hintText="Longitude of sample?"
                   floatingLabelText="Longitude"
                 />
                 <FormsyText
                 name="url"
                 validations="isUrl"
                 validationError={errorMessages.urlError}
                 required
                 hintText="http://www.example.com"
                 floatingLabelText="URL"
                 />

                 <FormsyDate
                   name="date"
                   floatingLabelText="Date"
                 />
                 <FormsySelect
                   name="database"
                   required
                   floatingLabelText="Database?"
                   hintText="Database of sample?"
                   menuItems={this.selectFieldItems}
                 >
                   <MenuItem value={'genbank'} primaryText="Genbank" />
                   <MenuItem value={'edi'} primaryText="EDI" />
                   <MenuItem value={'other'} primaryText="Other" />
                 </FormsySelect>
                 <FormsyText
                   style={{'display':'block'}}
                   name="description"
                   validations="isWords"
                   validationError={errorMessages.wordsError}
                   hintText="Anything to add?"
                   floatingLabelText="Description"
                   multiLine={true}
                   rows={4}
                 />
                 {/*<FormsyRadioGroup name="shipSpeed" defaultSelected="not_light">
                   <FormsyRadio
                     value="light"
                     label="prepare for light speed"
                     style={styles.switchStyle}
                   />
                   <FormsyRadio
                     value="not_light"
                     label="light speed too slow"
                     style={styles.switchStyle}
                   />
                   <FormsyRadio
                     value="ludicrous"
                     label="go to ludicrous speed"
                     style={styles.switchStyle}
                     disabled={true}
                   />
                 </FormsyRadioGroup>*/}
                </Tab>
                <Tab label="Optional" >
                  <div>
                    <h2>Optional Metadata</h2>
                    <p>
                      This is another example tab.
                    </p>
                  </div>
                </Tab>
                <Tab label="Super Optional">
                  <div>
                    <h2>Extremely Optional Metadata</h2>
                    <p>
                      Who would ever even come here?
                    </p>
                  </div>
                </Tab>
              </Tabs>
              <RaisedButton
                style={styles.submitStyle}
                type="submit"
                label="Submit Dataset"
                disabled={!this.state.canSubmit}
              />
            </Formsy.Form>
          </Paper>
        </MuiThemeProvider>
      </div>
    )
  }
});

export default AddDatasetForm;
