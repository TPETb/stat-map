/*
 * Statistics Map name space
 */
if (!SM) {
    var SM = {};
}

/**
 * Handles the retrieval of data
 * @todo extract all url apart from configUrl from config
 */
SM.Service_Remote = function() {

    this._configUrl = 'data/config.json';
    this._layersListUrl = 'data/layersList.json';
    this._layerItemsUrl = 'data/layerTransport.json';
    this._statisticsListUrl = 'data/layersList.json';

    this.init();
};

// Shortcut
var serviceRP = SM.Service_Remote.prototype;

/**
 * Constructor
 * @todo add extraction of config from options
 */
serviceRP.init = function() {
    this.ConfigRetrieved = new TVL.Event();
    this.LayersListRetrieved = new TVL.Event();
    this.LayerItemsRetrieved = new TVL.Event();
};

/**
 * Returns application config from server
 * @returns {object}
 */
serviceRP.requestConfig = function() {
    $.getJSON(this._configUrl).done($.proxy(this._onConfigRetrieved, this));
};
serviceRP._onConfigRetrieved = function(data) {
    this.ConfigRetrieved.fire(this, data);
};

/**
 * Get list of available layers
 * @returns {array} of objects
 */
serviceRP.requestLayersList = function() {
    $.getJSON(this._layersListUrl).done($.proxy(this._onLayersListRetrieved, this));
};
serviceRP._onLayersListRetrieved = function(data) {
    this.LayersListRetrieved.fire(this, data.items);
};

/**
 * Returns array of layer contents
 * @param {object} Layer config, one of retrieved from getLayersList
 * @returns {array}
 * @todo use single entru point for data instead of source attribute of layerConfig
 */
serviceRP.requestLayerItems = function(layerName) {
    $.getJSON(this._layerItemsUrl).done($.proxy(this._onLayerItemsRetrieved, this, layerName));
};
serviceRP._onLayerItemsRetrieved = function(layerName, data) {
    this.LayerItemsRetrieved.fire(this, data);
};

serviceRP = null;