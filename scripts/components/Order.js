import React from 'react';
import CSSTransitionGroup from'react-addons-css-transition-group';
import helpers from '../helpers.js';

/*
  Order
  Order column of the page
*/

var Order = React.createClass({
  renderOrder : function(orderId) {
    var fish = this.props.fishes[orderId],
        count = this.props.order[orderId];

    var removeButton = <button onClick={this.props.removeOrder.bind(null,orderId)}>&times;</button>

    if(!fish) {
      return (
        <li key={orderId}>Sorry, none left in inventory!{removeButton}</li>

      )
    }

    if(this.props.fishes[orderId].status === 'unavailable') {
      return (
        <li key={orderId}><span>{this.props.fishes[orderId].name} is no longer fresh today!</span>
          {removeButton}
        </li>

      )
    }

    return (
      <li key={orderId}>
        <span>
          <CSSTransitionGroup
            component="span"
            transitionName="count"
            transitionLeaveTimeout={250}
            transitionEnterTimeout={250}
            className="count">
            <span key={count}>{count}</span>
          </CSSTransitionGroup>
          lbs {fish.name} {removeButton}
        </span>
        <span className="price">{helpers.formatPrice(count * fish.price)}</span>

      </li>

    )
  },

  render : function() {
    var orderIds = Object.keys(this.props.order),
        total = orderIds.reduce((prevTotal, key) => {
          var fish = this.props.fishes[key],
              count = this.props.order[key],
              isAvailable = fish && fish.status === 'available';

          if (fish && isAvailable) {
            return prevTotal + (count * parseInt(fish.price) || 0);
          }
          return prevTotal;

        }, 0);

    return (
      <div className="order-wrap">
        <h2 className="order-title">Your Order</h2>
        <CSSTransitionGroup
          component="ul"
          className="order"
          transitionName="order"
          transitionEnterTimeout={600}
          transitionLeaveTimeout={600}
        >
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {helpers.formatPrice(total)}
          </li>
        </CSSTransitionGroup>
      </div>
    )
  },
  propTypes : {
      fishes : React.PropTypes.object.isRequired,
      order : React.PropTypes.object.isRequired,
      removeOrder : React.PropTypes.func.isRequired
  }
});

export default Order;
