import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes.js';
import firebaseConfig from './config/firebase.js';

import Firebase from 'firebase';

Firebase.initializeApp(firebaseConfig);

ReactDOM.render(routes, document.querySelector('#main'))
