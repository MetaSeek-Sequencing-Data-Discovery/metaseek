var React = require('react');

var Map = require('react-d3-map').Map;
var MarkerGroup = require('react-d3-map').MarkerGroup;

/*
  NotFound
  404 page
*/

var NotFound = React.createClass({

  render : function() {
    var width = 1000;
    var height = 800;
    var scale = 1200;
    var scaleExtent = [1 << 12, 1 << 13];
    var center = [0, 0];
    var popupContent = function(d) { return d.properties.name; }
    var onMarkerMouseOut= function(component, d, i) {
      console.log('out')
    }
    var onMarkerMouseOver= function(component, d, i) {
      console.log('over')
    }
    var onMarkerClick= function(component, d, i) {
      component.showPopup();
      console.log('click')
    }
    var onMarkerCloseClick= function(component, id) {
      component.hidePopup();
      console.log('close click')
    }


    return (
      <div>
      <h2>Sorry, Not Found</h2>
      <Map
         width= {width}
         height= {height}
         scale= {scale}
         scaleExtent= {scaleExtent}
         center= {center}
       >
       </Map>
   </div>
    )
  }
});

export default NotFound;
