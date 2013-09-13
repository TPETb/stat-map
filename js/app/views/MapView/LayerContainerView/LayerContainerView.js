/*
 * Statistics map name space
 */
if (!SM) {
    var SM = {};
}

SM.LayerContainerView = function(options) {
    this._Model = options.model;
    this._Map = options.map;
    this._Items = [];

    this.init();
};

layerCVP = SM.LayerContainerView.prototype;

/**
 * Constructor
 * @returns {undefined}
 */
layerCVP.init = function() {
    this._addEventListeners();
};

layerCVP._addEventListeners = function () {
    this._Model.LayersListRetrieved.add(this._onLayersListRetrieved, this);
    this._Model.LayerItemsRetrieved.add(this._onLayerItemsRetrieved, this);
};

layerCVP._onLayersListRetrieved = function (sender) {
    this.addItems(this._Model.getLayers());
};

layerCVP._onLayerItemsRetrieved = function (sender, layerName) {
    // Populate layer with items
    var layer = this.getLayer(layerName);
    layer.addItems(this._Model.getLayer(layerName).items);

    var mapObjects = layer.getMapObjects();
    for (var i = 0; i < mapObjects.length; i++) {
        mapObjects[i].addTo(this._Map);
    }
};

layerCVP.addItems = function (layersConfig) {
    for (var i = 0; i < layersConfig.length; i++) {
        this._Items.push(new SM.LayerView(layersConfig[i]));
    }
};

layerCVP.getLayer = function (layerName) {
    for (var i = 0; i < this._Items.length; i++) {
        if (this._Items[i].getName() === layerName) {
            return this._Items[i];
        }
    }
    return false;
};

layerCVP.hideLayer = function (layerName) {

};

layerCVP.showLayer = function (layerName) {

};