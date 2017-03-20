import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes.js';

import Firebase from 'firebase';
var config = {
    apiKey: "AIzaSyBD-VhWJEf-wOC_WDWGTM_moQqw0SzAY34",
    authDomain: "metaseek-ba761.firebaseapp.com",
    databaseURL: "https://metaseek-ba761.firebaseio.com"
  };
Firebase.initializeApp(config);

ReactDOM.render(routes, document.querySelector('#main'))
