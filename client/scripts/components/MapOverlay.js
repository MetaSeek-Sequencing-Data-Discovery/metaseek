import React from 'react';
import DeckGL, {PolygonLayer} from 'deck.gl';


var MapOverlay = React.createClass({
  getInitialState : function() {
    return {
      hoverInfo : null
    }
  },

  render : function() {
    const {viewport, data} = this.props;

    if (!data) {
      return null;
    }

    const layer = new PolygonLayer({
      id: 'square',
      data,
      filled: true,
      extruded: false,
      pickable: true,
    });

    return (
        <DeckGL {...viewport} layers={ [layer] } />
    );
  }
});

export default MapOverlay;
