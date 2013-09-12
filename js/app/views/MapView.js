/*
 * Statistics Map name space
 */
if (!SM) {
    var SM = {};
}

/*
 * type: View class
 */
SM.MapView = function(config) {
    this._map = {}; // Map container
    this._config = {}; // Configuration

    this._container = $('#map');

    this._layers = {};

    this.init();
};

var mapViewP = SM.MapView.prototype;

/**
 * Initializes everything that doesn't need additional data
 * @param {type} config
 * @returns {mapViewP}
 */
mapViewP.init = function() {
    this.resizeMapContainer($(window).width(), $(window).height());
    this._map = L.map(this._container.attr('id'));

    return this;
};

/**
 * Loops though provided config and applies known values
 * @param {type} config
 * @returns {undefined}
 * @todo rework zoom value
 */
mapViewP.setConfig = function(config) {
    if (config.view) {
        this._map.setView([39, 58.5], 6);
    }

    if (config.tileProvider) {
        L.tileLayer('http://{s}.tile.cloudmade.com/d4fc77ea4a63471cab2423e66626cbb6/997/256/{z}/{x}/{y}.png', {
            attribution: '',
            maxZoom: 18
        }).addTo(this._map);
    }
};

/**
 * Somewhat alias to setConfig
 * @param {type} name
 * @param {type} value
 * @returns {undefined}
 */
mapViewP.setConfigValue = function(name, value) {
    this.setConfig({name: value});
};

/**
 * Add regions to map
 * @param {type} regionsConfig
 * @returns {undefined}
 */
mapViewP.setRegions = function(regionsConfig) {
    $.each(regionsConfig, $.proxy(function(index, regionConfig) {
        poly = L.polygon(regionConfig.shape, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
//            stroke: false
        });
        poly.addTo(this._map);
    }, this));
};

/**
 * Warning!
 * "Layer" in next methods is not Leaflet Layer - it is informational layer!
 * 
 * Warning!
 * This method removes all Layers already present. Use it if you want to have whole new Layers list
 * 
 * @param {object} layers changed
 * @returns {undefined}
 */
mapViewP.setLayers = function(layers) {
    // remove layers if there are any
    $.each(this._layers, $.proxy(function(index) {
        this.removeLayer(index);
    }, this));

    // add layers
    $.each(layers, $.proxy(function(index, layerConfig) {
        this.addLayer(layerConfig);
    }, this));
};

mapViewP.addLayer = function(layerConfig) {
    var layer = new SM.Layer();

    this._layers[layerConfig.name] = layer;
    SM.service.layerItemsRetrieved.add(this._onLayerItemsLoaded, this);
    SM.service.requestLayerItems(layerConfig.name);
};
mapViewP._onLayerItemsLoaded = function(sender, settings) {
    // Populate layer with items
    this._layers[settings.layerName].initItems(settings.items);
    var mapObjects = this._layers[settings.layerName].getMapObjects();
    console.log(mapObjects);
    for (var i = 0; i < mapObjects.length; i++) {
        mapObjects[i].addTo(this._map);
    }
};

mapViewP.hideLayer = function(layerName) {

};

mapViewP.showLayer = function(layerName) {

};

mapViewP.removeLayer = function(layerName) {

};

mapViewP.setStatistics = function() {

};

mapViewP._addEventListeners = function() {
    $(window).on('resize', $.proxy(this._onViewportResize, this));

    SM.service.layerItemsRetrieved.add(this._onLayerItemsLoaded, this);
};

mapViewP._calculateZoomRange = function() {

};

mapViewP._onViewportResize = function() {
    this.resizeMap($(window).width(), $(window).height());
};

mapViewP.resizeMapContainer = function(width, height) {
    this._container.width(width).height(height);
};

mapViewP._onResize = function() {
    this._calculateZoomRange();
};

mapViewP = null;