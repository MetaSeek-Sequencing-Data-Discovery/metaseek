var React = require('react');
import { Link } from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import ColorPalette from './ColorPalette';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// My component imports
import Header from './Header';

var NotFound = React.createClass({

  render : function() {

    return (
      <div>
        <Header history={this.props.history}/>
        <div>
          <h2>Sorry, Page Not Found</h2>
        </div>
      </div>
    )
  }
});

export default NotFound;
