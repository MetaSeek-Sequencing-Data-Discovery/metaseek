import React from 'react';

// Routing
import {Router, Route} from 'react-router';
var createBrowserHistory = require('history/lib/createBrowserHistory');

// My Imported Components
import NotFound from './components/NotFound';
import BasicLogin from './components/BasicLogin';
import App from './components/App';

/*
  Routes
*/

var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={BasicLogin}/>
    <Route path="/store/:storeName" component={App}/>
    <Route path="*" component={NotFound}/>
  </Router>
);

export default routes;
