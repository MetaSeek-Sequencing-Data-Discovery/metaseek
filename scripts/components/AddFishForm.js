import React from 'react';

/*
  AddFishForm
  Add a single fish
*/

var AddFishForm = React.createClass({
    createFish : function(e) {
      e.preventDefault();

      var fish = {
        name:this.refs.name.value,
        price:this.refs.price.value,
        status:this.refs.status.value,
        description:this.refs.desc.value,
        image:this.refs.image.value
      };

      this.props.addFish(fish);

      this.refs.fishForm.reset();

    },

  render : function() {
    return (
      <form ref="fishForm" className="fish-edit" onSubmit={this.createFish}>
        <input type="text" ref="name" placeholder="Fish Name"/>
        <input type="text" ref="price" placeholder="Fish Price" />
        <select ref="status">
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" ref="desc" placeholder="Desc"></textarea>
        <input type="text" ref="image" placeholder="URL to Image" />
        <button type="submit">+ Add Item</button>
      </form>
    )
  }
});

export default AddFishForm;
