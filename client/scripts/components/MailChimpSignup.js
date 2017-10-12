import React from 'react';
import axios from 'axios';

import Formsy from 'formsy-react';
import {FormsyText} from 'formsy-material-ui/lib';
import RaisedButton from 'material-ui/RaisedButton';

var apiRequest = axios.create({
  baseURL: "https://cloud.us16.list-manage.com/"
});

var MailChimpSignup = React.createClass({
  render : function() {
    return (
      <form action="https://cloud.us16.list-manage.com/subscribe/post" method="POST">
        <input type="hidden" name="u" value="cf5bea2cc22645d3e92a973df" />
        <input type="hidden" name="id" value="dc5deb63f1" />
        <div id="mergeTable" className="subscribe-table">
            <div id="mergeRow-0">
                <label htmlFor="MERGE0" className="subscribe-form-label">Email Address <span className="subscribe-reqd">*</span></label>
                <div >
                    <input type="email" autoCapitalize="off" autoCorrect="off" name="MERGE0" id="MERGE0" className="subscribe-input"/>
                </div>
            </div>
            <div id="mergeRow-1">
                <label htmlFor="MERGE1" className="subscribe-form-label">Username</label>
                <div >
                    <input type="text" name="MERGE1" id="MERGE1" className="subscribe-input"/>
                </div>
            </div>
            <div >
                <input className="subscribe-button" type="submit" name="submit" value="Subscribe to list" />
            </div>
        </div>
      </form>
    )
  }
});

export default MailChimpSignup;
