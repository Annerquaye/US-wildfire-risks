



mapboxgl.accessToken =
  "pk.eyJ1IjoiYW5uZXJxdWF5ZSIsImEiOiJjbDN1OHN1NG4wZzZvM2ZuMHkyYzRybWY0In0.rfM8ZifOkxDoNJ3y39Q5HQ";
  var map = new mapboxgl.Map({
  container: "map",
  style:  "mapbox://styles/annerquaye/cl4uhbfrd001s15mm11k1mvul",
  zoom: 3.1,
    maxZoom: 4,
    minZoom: 3,
    center: [-109.513, 39.438],
    projection: "albers",
});



map.on('load', function () {
  // This is the function that finds the first symbol layer
  let layers = map.getStyle().layers;
  let firstSymbolId;
  for (var i = 0; i < layers.length; i++) {
      if (layers[i].type === 'symbol') {
          firstSymbolId = layers[i].id;
          break;
      }
  }
  map.addLayer(
      {
        id: "fire-outline",
        type: "line",
        source: {
          type: "geojson",
          data: "data/fireGEO.geojson",
        },
        paint: {
          "line-color": "gray",
          "line-width": 0.9,
        },
      },
      "waterway-label" // Here's where we tell Mapbox where to slot this new layer
    );

  map.addLayer(
    {
      id: "fire-access",
      type: "fill",
      source: {
        type: "geojson",
        data: "data/fireGEO.geojson",
      },
      minzoom: .5,
      paint: {
        "fill-color": [
            'interpolate',
            ['linear'],
            ['get', 'percent_exposed'],
            29,
            '#FAFAFA',
            46,
            '#EDBFC6',
            63,
            '#AF8D86',
            76,
            '#5F4842',
            88,
            '#432E36',
            97,
            '#260C1A',
          ],
        "fill-opacity": 0.6
      }
    }, 
    "fire-outline"
    );
  
});

// //Create the popup

map.on('click', 'fire-access', function (e) {
  console.log("clicked...");
  var State = e.features[0].properties.STATE;
  var totHousing = e.features[0].properties['Total number of Housing Units (HUs)'];
  var unitsExposed = e.features[0].properties.percent_exposed;
      unitsExposed = unitsExposed.toFixed(1);
      totHousing = totHousing.toLocaleString();



  new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML('<h2>' + State + '</h2>'
          + '<hr>'
          + '<h4>'
          + 'No. of housing units: ' + totHousing + '.' + '</h4>' 
          + '<h4>'
          + unitsExposed + '% of housing units in this state are exposed to wildfire.' + '</h4>')
      .addTo(map);
});
map.on('mouseenter', 'fire-access', function () {
  map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'fire-access', function () {
  map.getCanvas().style.cursor = '';
});


