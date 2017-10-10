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

        <div id="mergeTable" >
            <div id="mergeRow-0">
                <label htmlFor="MERGE0">Email Address <span >*</span></label>
                <div >
                    <input type="email" autoCapitalize="off" autoCorrect="off" name="MERGE0" id="MERGE0" />
                </div>
            </div>
            <div id="mergeRow-1">
                <label htmlFor="MERGE1">Username</label>
                <div >
                    <input type="text" name="MERGE1" id="MERGE1" />
                </div>
            </div>
        </div>
        <div >
            <input type="submit" name="submit" value="Subscribe to list" />
        </div>
        <input type="hidden" name="ht" value="4c76c6b5b81b1f6c1a0e5f7676b9460b874c1731:MTUwNzY0NTEwMy4wMTM0" />
        <input type="hidden" name="mc_signupsource" value="hosted" />
      </form>
    )
  }
});

export default MailChimpSignup;
