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
    this._LayersMapGroup = L.layerGroup().addTo(this._Map);
    
    this._addEventListeners();
};

layerCVP._addEventListeners = function () {
    this._Model.LayersListRetrieved.add(this._onLayersListRetrieved, this);
    this._Model.LayerItemsRetrieved.add(this._onLayerItemsRetrieved, this);
};

layerCVP._onLayersListRetrieved = function (sender) {
    this._Items = [];
    this.addItems(this._Model.getLayers());
};

layerCVP._onLayerItemsRetrieved = function (sender, layerName) {
    // Populate layer with items
    var layer = this.getLayer(layerName);
    layer.addItems(this._Model.getLayer(layerName).items);

    this.render();
};

layerCVP.render = function () {
    this._LayersMapGroup.clearLayers();
    
    for (var i = 0; i < this._Items.length; i++) {
        if (this._Items[i].active) {
            mapObjects = this._Items[i].getMapObjects()
            for (j = 0; j < mapObjects.length; j++) {
                this._LayersMapGroup.addLayer(mapObjects[j]);
            }
        }
    }
};

layerCVP.addItems = function (layersConfig) {
    for (var i = 0; i < layersConfig.length; i++) {
        layersConfig[i].model = this._Model;
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
    this.getLayer(layerName).active = false;
    this.render();
};

layerCVP.showLayer = function (layerName) {
    this.getLayer(layerName).active = true;
    this.render();
};