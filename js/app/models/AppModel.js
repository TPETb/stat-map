/*
 * Statistics Map name space
 */
if (!SM) {
    var SM = {};
}

/**
 * Handles the retrieval of data
 */
SM.AppModel = function () {
    this._Config = null;
    this._Layers = [];
    this._Service = new SM.Service_Remote();

    this.ConfigRetrieved = new TVL.Event();
    this.LayersListRetrieved = new TVL.Event();
    this.LayerItemsRetrieved = new TVL.Event();

    this.init();
};

// Shortcut
var appModelP = SM.AppModel.prototype;

/**
 * Constructor
 */
appModelP.init = function () {
    this._addEventListeners();
};

appModelP._addEventListeners = function () {
    this._Service.ConfigRetrieved.add(this._onConfigRetrieved, this);
    this._Service.LayersListRetrieved.add(this._onLayersListRetrieved, this);
    this._Service.LayerItemsRetrieved.add(this._onLayerItemsRetrieved, this);
};

/**
 * Returns application config
 * @returns {object}
 */
appModelP.requestConfig = function () {
    this._Service.requestConfig();
};

appModelP._onConfigRetrieved = function (sender, data) {
    this._Config = data;
    this.ConfigRetrieved.fire(this);
};

/**
 * Get list of available layers
 * @returns {array} of objects
 */
appModelP.requestLayersList = function () {
    this._Service.requestLayersList();
};

appModelP._onLayersListRetrieved = function (sender, data) {
    if (this._Layers.length === 0) {
        this._Layers = data;
    }
    else {
        for (var i = 0; i < data.length; i++) {
            if (!this.getLayer(data[i].name)) {
                this._Layers.push(data[i]);
            }
        }
    }

    this.LayersListRetrieved.fire(this);
};

/**
 * Returns array of layer contents
 * @param {object} Layer config, one of retrieved from getLayersList
 * @returns {array}
 */
appModelP.requestLayerItems = function (layerName) {
    this._Service.requestLayerItems(layerName);
};

appModelP.requestLayersItems = function () {
    for (var i = 0; i < this._Layers.length; i++) {
        this.requestLayerItems(this._Layers[i].name);
    }
};

appModelP._onLayerItemsRetrieved = function (sender, data) {
    var layer = this.getLayer(data.name);
    if (layer) {
        layer.items = data.items;
        this.LayerItemsRetrieved.fire(this, data.name);
    }
};

appModelP.getLayer = function (layerName) {
    if (this._Layers.length < 0) return false;

    for (var i = 0; i < this._Layers.length; i++) {
        if (this._Layers[i].name === layerName) {
            return this._Layers[i];
        }
    }

    return false;
};

appModelP.getLayers = function () {
    return this._Layers;
};

appModelP.getConfig = function () {
    return this._Config;
};

/**
 * Example limits object
 *  {
 *    period: {
 *        start: "some date presentation to be decided",
 *        finish: "some date presentation to be decided"
 *    },
 *    items: [1, 2, 3, 4]
 * }
 **/
appModelP.getStatisticData = function (statisticName, limits) {
    return this._Service.getStatisticData(statisticName, limits);
};

appModelP = null;