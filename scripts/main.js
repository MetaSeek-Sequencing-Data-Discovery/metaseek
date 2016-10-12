import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes.js';

import Firebase from 'firebase';
var config = {
    apiKey: "AIzaSyDH2OMMedUz3hF4dIRuDIdWpvUG3k00Eu8",
    authDomain: "metaseq-6b779.firebaseapp.com",
    databaseURL: "https://metaseq-6b779.firebaseio.com"
  };
Firebase.initializeApp(config);

ReactDOM.render(routes, document.querySelector('#main'))
