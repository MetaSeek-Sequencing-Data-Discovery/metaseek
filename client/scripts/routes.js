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
import Explore from './components/Explore';
import MyAccount from './components/MyAccount';
import AddDataset from './components/AddDataset';
import DatasetDetail from './components/DatasetDetail';
import DiscoveryDetail from './components/DiscoveryDetail';

/*
  Routes
*/
var ReactGA = require('react-ga');
ReactGA.initialize('UA-96087468-1');

function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

var routes = (
  <Router history={browserHistory} onUpdate={logPageView}>
    <Route path="/" component={Welcome}/>
    <Route path="/explore" component={Explore}/>
    <Route path="/myaccount" component={MyAccount}/>
    <Route path="/dataset/new" component={AddDataset}/>
    <Route path="/dataset/:id" component={DatasetDetail}/>
    <Route path="/discovery/:id" component={DiscoveryDetail}/>
    <Route path="*" component={NotFound}/>
  </Router>
);

export default routes;
