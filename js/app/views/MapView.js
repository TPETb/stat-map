/*
 * Statistics Map name space
 */
if (!SM) {
    var SM = {};
}

/*
 * type: View class
 */
SM.MapView = function (options) {
    this._Model = options.model;
    this._map = {}; // Map container

    this._container = $('#map');

    this._Layers = [];

    this.init();
};

var mapViewP = SM.MapView.prototype;

/**
 * Initializes everything that doesn't need additional data
 * @param {type} config
 * @returns {mapViewP}
 */
mapViewP.init = function () {
    this.resizeMapContainer($(window).width(), $(window).height());
    this._map = L.map(this._container.attr('id'));

    this._addEventListeners();
};

mapViewP._addEventListeners = function () {
    this._Model.ConfigRetrieved.add(this._onConfigRetrieved, this);
    this._Model.LayersListRetrieved.add(this._onLayersListRetrieved, this);
    this._Model.LayerItemsRetrieved.add(this._onLayerItemsRetrieved, this);

    $(window).on('resize', $.proxy(this._onViewportResize, this));
};

/**
 * Loops though provided config and applies known values
 * @param {type} config
 * @returns {undefined}
 * @todo rework zoom value
 */
mapViewP._onConfigRetrieved = function () {
    var config = this._Model.getConfig();

    if (config.view) {
        this._map.setView([config.view.lat, config.view.lng], 6);
    }

    if (config.tileProvider) {
        L.tileLayer(config.tileProvider, {
            attribution: '',
            maxZoom: 18
        }).addTo(this._map);
    }
};

mapViewP._onLayersListRetrieved = function (sender) {
    this.addLayers(this._Model.getLayers());
};

mapViewP._onLayerItemsRetrieved = function (sender, layerName) {
    // Populate layer with items
    var layer = this.getLayer(layerName);
    layer.addItems(this._Model.getLayer(layerName).items);

    var mapObjects = layer.getMapObjects();
    for (var i = 0; i < mapObjects.length; i++) {
        mapObjects[i].addTo(this._map);
    }
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
mapViewP.addLayers = function (layersConfig) {
    this.removeLayers();

    for (var i = 0; i < layersConfig.length; i++) {
        this.addLayer(layersConfig[i]);
    }
};

mapViewP.addLayer = function (layerConfig) {
    this._Layers.push(new SM.Layer(layerConfig));
};

mapViewP.getLayer = function (layerName) {
    for (var i = 0; i < this._Layers.length; i++) {
        if (this._Layers[i].getName() === layerName) {
            return this._Layers[i];
        }
    }
    return false;
};

mapViewP.hideLayer = function (layerName) {

};

mapViewP.showLayer = function (layerName) {

};

mapViewP.removeLayers = function () {

};

mapViewP.setStatistics = function () {

};

mapViewP._calculateZoomRange = function () {

};

mapViewP._onViewportResize = function () {
    //this.resizeMap($(window).width(), $(window).height());
};

mapViewP.resizeMapContainer = function (width, height) {
    this._container.width(width).height(height);
};

mapViewP._onResize = function () {
    this._calculateZoomRange();
};

mapViewP = null;