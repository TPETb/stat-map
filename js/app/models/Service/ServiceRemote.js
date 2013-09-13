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
    this._regionsUrl = 'data/regions.json';
    this._statisticsListUrl = 'data/statistics.json';
    this._statisticUrl = 'data/statisticMonthlySalary.json';

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
    this.RegionsRetrieved = new TVL.Event();
    this.StatisticsListRetrieved = new TVL.Event();
    this.StatisticRetrieved = new TVL.Event();
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
    this.RegionsRetrieved.fire(this, {"regions": data.items});
};

/**
 * Returns list of statistics available to this map
 * @returns {array}
 */
serviceRP.requestStatisticsList = function() {
    $.getJSON(this._statisticsListUrl).done($.proxy(this._OnStatisticsListRetrieved, this));
};
serviceRP._OnStatisticsListRetrieved = function(data) {
    this.StatisticsListRetrieved.fire(this, {"data": data.items});
};

/**
 * Returns statistic
 * @returns {array}
 */
serviceRP.requestStatistic = function(statisticName) {
    $.getJSON(this._statisticUrl)
            .done($.proxy(this._OnStatisticRetrieved, this, statisticName))
            .fail($.proxy(function(jqXHR) {
        console.log("failed request:");
        console.log(jqXHR);
    }, this));
};
serviceRP._OnStatisticRetrieved = function(statistic, data) {
    this.StatisticRetrieved.fire(this, {"data": data, "statistic": statistic});
};

serviceRP = null;