import React from 'react';

// Routing
import {Router, Route} from 'react-router';
var createBrowserHistory = require('history/lib/createBrowserHistory');

import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// My Imported Components
import NotFound from './components/NotFound';
import Welcome from './components/Welcome';
import Browse from './components/Browse';
import Explore from './components/Explore';
import MyAccount from './components/MyAccount';
import AddDataset from './components/AddDataset';
//import DiscoveryDetail from './components/DiscoveryDetail';
//import DatasetDetail from './components/DatasetDetail';

/*
  Routes
*/

/*
<Route path="/dataset/:id" component={DatasetDetail}/>
<Route path="/discovery/:id" component={DiscoveryDetail}/>
*/

var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={Welcome}/>
    <Route path="/browse" component={Browse}/>
    <Route path="/explore" component={Explore}/>
    <Route path="/myaccount" component={MyAccount}/>
    <Route path="/dataset/new" component={AddDataset}/>
    <Route path="*" component={NotFound}/>
  </Router>
);

export default routes;
