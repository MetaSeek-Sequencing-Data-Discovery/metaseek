var React = require('react');
import { Link } from 'react-router';

// Material Design imports
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ColorPalette from './ColorPalette';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// My component imports
import Header from './Header';

/*
  NotFound
  404 page
*/

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
