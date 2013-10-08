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
SM.ServiceRemote = function() {

    this._configUrl = 'data/config.json';
    this._layersListUrl = 'data/layers/index.json';
    this._regionsUrl = 'data/regions3.json';
//    this._regionsUrl = 'generators/regions3.php';
    this._statisticsListUrl = 'data/statistics/index.json';

    this.init();
};

// Shortcut
var serviceRP = SM.ServiceRemote.prototype;

/**
 * Constructor
 * @todo add extraction of config from options
 */
serviceRP.init = function() {
    this.ConfigRetrieved = new TVL.Event();
    this.LayersListRetrieved = new TVL.Event();
    this.LayerItemsRetrieved = new TVL.Event();
    this.RegionsRetrieved = new TVL.Event();
    this.StatisticsListRetrieved = new TVL.Event();
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
    this.LayersListRetrieved.fire(this, data);
};

/**
 * Returns array of layer contents
 * @param {object} Layer config, one of retrieved from getLayersList
 * @returns {array}
 * @todo use single entru point for data instead of source attribute of layerConfig
 */
serviceRP.requestLayerItems = function(layerUrl) {
    $.getJSON(layerUrl).done($.proxy(this._onLayerItemsRetrieved, this));
};
serviceRP._onLayerItemsRetrieved = function(data) {
    this.LayerItemsRetrieved.fire(this, data);
};

/**
 * Retrieve regions
 * @returns {undefined}
 */

serviceRP.requestRegions = function() {
    $.getJSON(this._regionsUrl).done($.proxy(this._onRegionsRetrieved, this));
};
serviceRP._onRegionsRetrieved = function(data) {
    this.RegionsRetrieved.fire(this, data);
};

/**
 * Returns list of statistics available to this map
 * @returns {array}
 */
serviceRP.requestStatisticsList = function() {
    $.getJSON(this._statisticsListUrl).done($.proxy(this._onStatisticsListRetrieved, this));
};
serviceRP._onStatisticsListRetrieved = function(data) {
    this.StatisticsListRetrieved.fire(this, data);
};

serviceRP = null;