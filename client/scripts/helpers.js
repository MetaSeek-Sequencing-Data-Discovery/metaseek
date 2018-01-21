let helpers =  {
  rando : function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },
  slugify : function(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  },

  getReadableFileSizeString : function(fileSizeInBytes) {
    var i = -1;
    var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
        fileSizeInBytes = fileSizeInBytes / 1024;
        i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
  },

  getLatCenter : function(filterparams) {
    var rules = JSON.parse(filterparams)['rules'];
    var latmax = 90
    var latmin = -90
    rules.map(function(rule) {
      if (rule['field']=='meta_latitude') {
        if (rule['type']==3) {
          latmax = rule['value']
        }
        if (rule['type']==4) {
          latmin = rule['value']
        }
      }
    })
    var latcenter = (latmax+latmin)/2
    console.log("lat",latmax,latmin,latcenter);
    return latcenter;
  },

  getLonCenter : function(filterparams) {
    var rules = JSON.parse(filterparams)['rules'];
    var lonmax = 180
    var lonmin = -180
    rules.map(function(rule) {
        if (rule['field']=='meta_longitude') {
          if (rule['type']==3) {
            lonmax = rule['value']
          }
          if (rule['type']==4) {
            lonmin = rule['value']
          }
        }
      })
    var loncenter = (lonmax+lonmin)/2
    console.log("lon",lonmax,lonmin,loncenter);
    return loncenter;
  },

  getMapBounds : function(filterparams) {
    var rules = JSON.parse(filterparams)['rules'];
    var latsouth = -85
    var latnorth = 85
    var lonwest = -175
    var loneast = 175
    rules.map(function(rule) {
        if (rule['field']=='meta_longitude') {
          if (rule['type']==3) {
            loneast = rule['value']
          }
          if (rule['type']==4) {
            lonwest = rule['value']
          }
        }
        if (rule['field']=='meta_latitude') {
          if (rule['type']==3) {
            latnorth = rule['value']
          }
          if (rule['type']==4) {
            latsouth = rule['value']
          }
        }
      })
    var bounds = [[lonwest,latsouth],[loneast,latnorth]]
    return bounds;
  },

}

export default helpers;
