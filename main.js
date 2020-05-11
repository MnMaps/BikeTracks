window.onload = init;

function init(){
    const map = new ol.Map({
        view: new ol.View({
            center: [0, 0],
            zoom: 3,
            extent: [1087636.417592572, 5367220.564730893, 1280130.3669939928, 5462903.277435869 ]
        }),
        target:'js-map',
    })


    //OpenStreetMap
    const openStreetMapStandard = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: true,
        title: 'OSMStandard',
        zindex: 0
    })

    const pisawwftirrenia = new ol.layer.VectorImage({
        source: new ol.source.Vector({
          url: './data/pisawwftirrenia.geojson',
          format: new ol.format.GeoJSON({
            dataProjection: 'EPSG:3857'
          })
        }),
        visible: true,
        title: 'pisawwftirrenia',
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [242, 25, 10, 0.8],
                width: 6,
                lineCap: 'round',
                lineJoint: 'round'
            })
        }),
        zindex: 1
    })

    const foto = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: './data/foto.geojson',
            format: new ol.format.GeoJSON({
                dataProjection: 'EPSG:3857'
            })
        }),
        visible: true,
        title: 'foto',
        zindex: 2,
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: './image/fotopoint.png',
                size: [512, 512],
                offset: [0, 0],
                opacity: 1,
                scale: 0.05
            })
        }),
        minZoom: 12
    })

    // Adding layers Group
    const layerGroup = new ol.layer.Group({
        layers:[
            openStreetMapStandard,
            pisawwftirrenia,
            foto
        ]
    })
    map.addLayer(layerGroup);
    
    const selectInteraction = new ol.interaction.Select({
    condition: ol.events.condition.pointerMove,
    layers: function(layer){
      return [layer.get('title') === 'foto']
    },
      style: new ol.style.Style({
        image: new ol.style.Icon({
            src: './image/fotopoint.png',
            size: [512, 512],
            offset: [0, 0],
            opacity: 1,
            scale: 0.09
        }),
        stroke: new ol.style.Stroke({
            color: [242, 25, 10, 0.8],
            width: 6,
            lineCap: 'round',
            lineJoint: 'round'
        })
    })
    })
  map.addInteraction(selectInteraction);


  //POPUP
  const popUpContainer = document.querySelector('.popup-foto');
  const popUpLayer = new ol.Overlay({
      element: popUpContainer
  })
  map.addOverlay(popUpLayer);
  const popUpFoto = document.getElementById('foto');

  map.on('click', function(e){
      console.log(e.coordinate);
  })


  map.on('click', function(e){
    popUpLayer.setPosition(undefined);
    map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
        let clickedCoordinate = e.coordinate;
        let fotoCod = feature.get('cod');
        if (fotoCod != undefined){
            popUpLayer.setPosition(clickedCoordinate);
            popUpFoto.innerHTML = '<img src="./images/' + fotoCod + '.jpg" alt=""><code>';
        }
    })
  })

    // Geolocation API
    const viewProjection = map.getView().getProjection();
    const geolocation = new ol.Geolocation({
      tracking: true,
      trackingOptions: {
        enableHighAccuracy: true
      },
      projection: viewProjection
    })
  
    geolocation.on('change:position', function(e){
      let geolocation = this.getPosition();
      map.getView().setCenter(geolocation);
    })

}