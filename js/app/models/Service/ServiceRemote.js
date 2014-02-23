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

    this._configUrl = 'data/config.js';
    this._layersListUrl = 'data/layers/index.js';
    this._regionsUrl = 'data/regions3.js';
//    this._regionsUrl = 'generators/regions3.php';
    this._statisticsListUrl = 'data/statistics/index.js';
    this._TaxonomyUrl = 'data/taxonomy.js';

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
    this.TaxonomyRetrieved = new TVL.Event();
};

/**
 * Returns application config from server
 * @returns {object}
 */
serviceRP.requestConfig = function() {
    $.ajax({
        type: 'GET',
        url: this._configUrl,
        async: false,
        jsonpCallback: 'dataconfig',
        contentType: "application/javascript",
        dataType: 'jsonp',
        crossDomain: true,
        success: $.proxy(this._onConfigRetrieved, this)
    });
};
serviceRP._onConfigRetrieved = function(data) {
    this.ConfigRetrieved.fire(this, data);
};

/**
 * Get list of available layers
 * @returns {array} of objects
 */
serviceRP.requestLayersList = function() {
    $.ajax({
        type: 'GET',
        url: this._layersListUrl,
        async: false,
        jsonpCallback: 'datalayersindex',
        contentType: "application/javascript",
        dataType: 'jsonp',
        crossDomain: true,
        success: $.proxy(this._onLayersListRetrieved, this)
    });
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
    // todo
    $.ajax({
        type: 'GET',
        url: layerUrl,
        async: false,
        jsonpCallback: layerUrl.replace('.js', '').replace('.', '').replace('/', ''),
        contentType: "application/javascript",
        dataType: 'jsonp',
        crossDomain: true,
        success: $.proxy(this._onLayerItemsRetrieved, this)
    });
};
serviceRP._onLayerItemsRetrieved = function(data) {
    this.LayerItemsRetrieved.fire(this, data);
};

/**
 * Retrieve regions
 * @returns {undefined}
 */

serviceRP.requestRegions = function() {
    $.ajax({
        type: 'GET',
        url: this._regionsUrl,
        async: false,
        jsonpCallback: 'dataregions3',
        contentType: "application/javascript",
        dataType: 'jsonp',
        crossDomain: true,
        success: $.proxy(this._onRegionsRetrieved, this)
    });
};
serviceRP._onRegionsRetrieved = function(data) {
    this.RegionsRetrieved.fire(this, data);
};

/**
 * Returns list of statistics available to this map
 * @returns {array}
 */
serviceRP.requestStatisticsList = function() {
    $.ajax({
        type: 'GET',
        url: this._statisticsListUrl,
        async: false,
        jsonpCallback: 'datastatisticsindex',
        contentType: "application/javascript",
        dataType: 'jsonp',
        crossDomain: true,
        success: $.proxy(this._onStatisticsListRetrieved, this)
    });
};
serviceRP._onStatisticsListRetrieved = function(data) {
    this.StatisticsListRetrieved.fire(this, data);
};

serviceRP.requestTaxonomy = function() {
    $.ajax({
        type: 'GET',
        url: this._TaxonomyUrl,
        async: false,
        jsonpCallback: 'datataxonomy',
        contentType: "application/javascript",
        dataType: 'jsonp',
        crossDomain: true,
        success: $.proxy(this._onTaxonomyRetrieved, this)
    });
};
serviceRP._onTaxonomyRetrieved = function(data) {
    this.TaxonomyRetrieved.fire(this, data);
};

serviceRP = null;