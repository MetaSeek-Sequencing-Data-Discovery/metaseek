import React from 'react';
import { History } from 'react-router';
import helpers from '../helpers.js';
/*
  StorePicker
  Let's us make <StorePicker/> elements
*/

var StorePicker = React.createClass({
  mixins : [History],
  goToStore : function(e) {
    e.preventDefault();
    var storeId = this.refs.storeId.value;
    this.history.pushState(null, '/store/' + storeId);
  },

  render : function() {
    var name = "Nick";
    return (
      <form className="store-selector" onSubmit={this.goToStore}>
        <h2>Please Enter a Store {name}</h2>
        {/* comments */}
        <input type="text" ref="storeId" required defaultValue={helpers.getFunName()}/>
        <input type="Submit" />

      </form>
    )
  }

});

export default StorePicker;
