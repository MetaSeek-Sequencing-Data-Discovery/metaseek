import React from 'react';
import AddFishForm from './AddFishForm';

// firebase
import Firebase from 'firebase';
var firebaseRoot = new Firebase('https://catch-of-the-day-nb.firebaseio.com/')

/*
  Inventory
  Inventory list on right side of page
*/

var Inventory = React.createClass({

  getInitialState : function() {
    return {
      uid : '',
      owner : ''
    }
  },

  componentWillMount : function() {
    var token = localStorage.getItem('token');

    if(token) {
      firebaseRoot.authWithCustomToken(token, this.authHandler);
    }
  },

  logout : function() {
    firebaseRoot.unauth();
    localStorage.removeItem('token');
    this.setState({
      uid : null
    })
  },

  authenticate : function(provider) {
    firebaseRoot.authWithOAuthPopup(provider, this.authHandler);
  },

  authHandler : function(err, authData) {
    if(err) {
      console.err(err);
      return;
    }

    localStorage.setItem('token',authData.token);

    var storeRef = firebaseRoot.child(this.props.storeName),
        component = this;
    storeRef.on('value', function(snapshot) {
      var data = snapshot.val() || {};

      if(!data.owner) {
        storeRef.set({
          owner : authData.uid
        })
      }

      component.setState({
        uid : authData.uid,
        owner : data.owner || authData.uid
      })

    });

  },

  renderLogin : function() {
    return(
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button onClick={this.authenticate.bind(this,'github')} className="github">Log In with Github</button>
        <button onClick={this.authenticate.bind(this,'facebook')} className="facebook">Log In with Facebook</button>
        <button onClick={this.authenticate.bind(this,'twitter')} className="twitter">Log In with Twitter</button>
      </nav>
    )

  },

  renderInventory : function(fishId) {
    var linkState = this.props.linkState;
    return (
      <div className="fish-edit" key={fishId}>
        <input type="text" valueLink={linkState('fishes.' + fishId + '.name')}/>
        <input type="text" valueLink={linkState('fishes.' + fishId + '.price')}/>
        <select valueLink={linkState('fishes.' + fishId + '.status')}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" valueLink={linkState('fishes.' + fishId + '.desc')}></textarea>
        <input type="text" valueLink={linkState('fishes.' + fishId + '.image')}/>
        <button onClick={this.props.removeFish.bind(null,fishId)}>Remove Fish</button>
      </div>
    )
  },

  render : function() {
    var logoutButton = <button onClick={this.logout}>Log Out!</button>;
    if(!this.state.uid) {
      return (
        <div>
          {this.renderLogin()}
        </div>
      )
    }

    if(this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you aren't the owner of this store</p>
          {logoutButton}
        </div>
      )
    }

    return (
      <div>
        <h2>Inventory</h2>
        {logoutButton}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm {...this.props}/>
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )
  },
  propTypes : {
    linkState : React.PropTypes.func.isRequired,
    fishes : React.PropTypes.object.isRequired,
    loadSamples : React.PropTypes.func.isRequired,
    addFish : React.PropTypes.func.isRequired,
    removeFish : React.PropTypes.func.isRequired
  }
});

export default Inventory;
