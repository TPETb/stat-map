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
SM.Service_Remote = function(options) {
    this._options = {};
    this._options.configUrl = 'data/config.json';
    this._options.regionsUrl = 'data/regions.php';
    this._options.layersListUrl = 'data/layersList.json';
    this._options.layerItemsUrl = 'data/layerTransport.json';
    this._options.statisticsListUrl = 'data/layersList.json';

    this.init(options);
};

// Shortcut
var serviceRP = SM.Service_Remote.prototype;

/**
 * Constructor
 * @todo add extraction of config from options
 */
serviceRP.init = function(options) {

};

/**
 * Returns application config from server
 * @returns {object}
 */
serviceRP.configRetrieved = new TVL.Event();
serviceRP.requestConfig = function() {
    $.getJSON(this._options.configUrl).done($.proxy(this._onConfigRetrieved, this));
};
serviceRP._onConfigRetrieved = function(data) {
    this.configRetrieved.fire(this, data);
};

/**
 * Get list of available layers
 * @returns {array} of objects
 */
serviceRP.layersListRetrieved = new TVL.Event();
serviceRP.requestLayersList = function() {
    $.getJSON(this._options.layersListUrl).done($.proxy(this._onLayersListRetrieved, this));
};
serviceRP._onLayersListRetrieved = function(data) {
    this.layersListRetrieved.fire(this, data.items);
};

/**
 * Returns array of layer contents
 * @param {object} Layer config, one of retrieved from getLayersList
 * @returns {array}
 * @todo use single entru point for data instead of source attribute of layerConfig
 */
serviceRP.layerItemsRetrieved = new TVL.Event();
serviceRP.requestLayerItems = function(layerName) {
    $.getJSON(this._options.layerItemsUrl).done($.proxy(this._onLayerItemsRetrieved, this, layerName));
};
serviceRP._onLayerItemsRetrieved = function(layerName, data) {
    var settings = {
        "layerName": layerName,
        "items": data.items
    };
    this.layerItemsRetrieved.fire(this, settings);
};


serviceRP.regionsRetrieved = new TVL.Event();
serviceRP.requestRegions = function () {
    $.getJSON(this._options.regionsUrl).done($.proxy(this._onRegionsRetrieved, this));
};
serviceRP._onRegionsRetrieved = function (data) {
    this.regionsRetrieved.fire(this, data.items);
}

/**
 * Returns list of statistics available to this map
 * @returns {array}
 */
serviceRP.getStatisticsList = function() {
    return $.getJSON(this._options.statisticsListUrl);
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
serviceRP.getStatisticData = function(statisticName, limits) {
    return this._driver.getStatisticData(statisticName, limits);
};

/**
 * Purges the cache
 */
serviceRP.clearCache = function() {
    this._cache = {
        layerItems: {}
    };
};