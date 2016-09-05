import React from 'react';

// Routing
import {Router, Route, browserHistory} from 'react-router';

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
import DatasetDetail from './components/DatasetDetail';
import DiscoveryDetail from './components/DiscoveryDetail';

/*
  Routes
*/

/*
*/

var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={Welcome}/>
    <Route path="/browse" component={Browse}/>
    <Route path="/explore" component={Explore}/>
    <Route path="/myaccount" component={MyAccount}/>
    <Route path="/dataset/new" component={AddDataset}/>
    <Route path="/dataset/:id" component={DatasetDetail}/>
    <Route path="/discovery/new" component={Explore}/>
    <Route path="/discovery/:id" component={DiscoveryDetail}/>
    <Route path="*" component={NotFound}/>
  </Router>
);

export default routes;
