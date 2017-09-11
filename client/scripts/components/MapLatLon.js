import React from 'react';
import MapGL from 'react-map-gl';
import DeckGL, {PolygonLayer} from 'deck.gl';
import d3 from 'd3';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibWV0YXNlZWsiLCJhIjoiY2o3YjQ4anVrMG5vaDMycW14bWcwbTBnaSJ9.67xUW2hLL2laKI8XyY91dA';

const viewport = {
   width: 720,
   height: 360,
   longitude: 0,
   latitude: 0,
   zoom: 0
}

//the polygon is in x,y coordinates (lon, lat)
const data = [
  {elevation:45,
  polygon:[[0,0],[0,89.999],[10,89.999],[10,0]],
  fillColor: [255, 0, 0]
  },
  {elevation:16,
  polygon:[[0,0],[0,-89.999],[10,-89.999],[10,0]],
  fillColor: [128, 255, 0]
  },
  {elevation:80,
  polygon:[[-180,-80],[-180,-70],[-170,-70],[-170,-80]],
  fillColor: [0, 255, 255]
  },
  {elevation:25,
  polygon:[[-170,-80],[-170,-70],[-160,-70],[-160,-80]],
  fillColor: [128, 0, 255]
}];


var MapLatLon = React.createClass({

  render : function() {
    // pull the right summary data from activeSummaryData
    // var mapdata = this.props.mapdata;
    var mapdata = data;
    /*
    var colorScale = d3.scale.linear()
                             .domain([0, d3.max(mapdata, function(d) {return d.count; })])
  	                         .range(["#FFFFFF", "#151174"]);
    */
    console.log(mapdata);
    const layers = [
      new PolygonLayer({
        id: 'map',
        data: mapdata,
        filled:true,
        pickable:true,
      })
    ];
    console.log(layers);

    return(
      <MapGL {...viewport} mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}>
        <DeckGL {...viewport} layers={layers} />
      </MapGL>
    )}
  });

export default MapLatLon;
