import React from 'react';
import helpers from '../helpers'
/*
  Fish
  Description
*/

var Fish = React.createClass({

  onItemClick : function() {
    this.props.addOrder(this.props.index);
  },

  render : function() {
    var details = this.props.details,
        isAvailable = (details.status === 'available' ? true : false),
        buttonText = isAvailable ? 'Add To Order' : 'Sold Out!';

    return (
      <li className="menu-fish">
        <img src={details.image} alt={details.name}/>
        <h3 className="fish-name">{details.name}
          <span className="price">{helpers.formatPrice(details.price)}</span>
        </h3>
        <p>{details.desc}</p>
        <button disabled={!isAvailable} onClick={this.onItemClick}>{buttonText}</button>
      </li>
    )
  }
});

export default Fish;
