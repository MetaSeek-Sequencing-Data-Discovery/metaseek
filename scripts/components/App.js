var React = require('react');
var Catalyst = require('react-catalyst');

// firebase
var Rebase = require('re-base');
var base = Rebase.createClass('https://catch-of-the-day-nb.firebaseio.com/');

import Order from './Order';
import Inventory from './Inventory';
import Header from './Header';
import Fish from './Fish';

/*
  App
  Everything!
*/

var App = React.createClass({
  mixins : [Catalyst.LinkedStateMixin],

  getInitialState : function() {
    return {
      fishes : {},
      order : {}
    }
  },

  componentDidMount : function() {
    base.syncState(this.props.params.storeName + '/fishes', {
      context : this,
      state : 'fishes'
    });

    var localStorageRef = localStorage.getItem('order-' + this.props.params.storeName);

    if (localStorageRef) {
      this.setState({order : JSON.parse(localStorageRef)});
    }
  },

  componentWillUpdate : function(nextProps, nextState) {
    localStorage.setItem('order-' + this.props.params.storeName,JSON.stringify(nextState.order));
  },


  addFish : function(fish) {
    var timestamp = (new Date()).getTime();
    this.state.fishes['fish-' + timestamp] = fish;
    this.setState({ fishes : this.state.fishes});
  },

  addOrder : function(fishId) {
    this.state.order[fishId] = this.state.order[fishId] + 1 || 1;
    this.setState({ order : this.state.order});
  },

  removeFish : function(fishId) {
    if(confirm('Really?')){
      this.state.fishes[fishId] = null;
      this.setState({ fishes : this.state.fishes});
    }
  },

  removeOrder : function(fishId) {
    delete this.state.order[fishId];
    this.setState({ order : this.state.order});
  },

  loadSamples : function() {
    this.setState({fishes : require('../sample-fishes')});
  },

  renderFish : function(fishId) {
    return <Fish addOrder={this.addOrder} key={fishId} index={fishId} details={this.state.fishes[fishId]}/>
  },

  render : function() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Boom Shakalaka"/>
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order fishes={this.state.fishes} order={this.state.order} removeOrder={this.removeOrder}/>
        <Inventory storeName={this.props.params.storeName} linkState={this.linkState} fishes={this.state.fishes} loadSamples={this.loadSamples} addFish={this.addFish} removeFish={this.removeFish}/>
      </div>
    )
  }
});

export default App;
