/*
 * Statistics Map name space
 */
if (!SM) {
    var SM = {};
}

/**
 * Handles the retrieval of data
 */
SM.Service = function(driver, options) {
    this._driver = null;

    this.init(driver);
};

// Shortcut
var serviceP = SM.Service.prototype;

/**
 * Constructor
 */
serviceP.init = function(driver) {
    // Driver by default is Remote
    this.setDriver(driver);
};

/**
 * Pass the driver
 * @param {type} driver
 */
serviceP.setDriver = function(driver) {
    this._driver = driver;
};

/**
 * Returns application config
 * @returns {object}
 */
serviceP.configRetrieved = new TVL.Event();
serviceP.requestConfig = function () {
    this._driver.configRetrieved.add(this._onConfigRetrieved, this);
    this._driver.requestConfig();
};
serviceP._onConfigRetrieved = function(sender, data) {
    this.configRetrieved.fire(this, data);
};

/**
 * Get list of available layers
 * @returns {array} of objects
 */
serviceP.layersListRetrieved = new TVL.Event();
serviceP.requestLayersList = function() {
    this._driver.layersListRetrieved.add(this._onLayersListRetrieved, this);
    this._driver.requestLayersList();
};
serviceP._onLayersListRetrieved = function (sender, data) {
    this.layersListRetrieved.fire(this, data);
};

/**
 * Returns array of layer contents
 * @param {object} Layer config, one of retrieved from getLayersList
 * @returns {array}
 */
serviceP.layerItemsRetrieved = new TVL.Event();
serviceP.requestLayerItems = function(layerName) {
    this._driver.layerItemsRetrieved.add(this._onLayerItemsRetrieved, this);
    this._driver.requestLayerItems(layerName);
};
serviceP._onLayerItemsRetrieved = function (sender, settings) {
    this.layerItemsRetrieved.fire(this, settings);
};


/**
 * retrieve regions config
 * @returns {@pro;statisticsList@this._cache|array}
 */
serviceP.regionsRetrieved = new TVL.Event();
serviceP.requestRegions = function () {
    this._driver.regionsRetrieved.add(this._onRegionsRetrieved, this);
    this._driver.requestRegions();
};
serviceP._onRegionsRetrieved = function (sender, settings) {
    this.regionsRetrieved.fire(this, settings);
}

/**
 * Returns list of statistics available to this map
 * @returns {array}
 */
serviceP.getStatisticsList = function() {
    if (!this._cache.statisticsList) {
        this._cache.statisticsList = this._driver.getStatisticsList();
    }
    
    return this._cache.statisticsList;
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
serviceP.getStatisticData = function(statisticName, limits) {
    return this._driver.getStatisticData(statisticName, limits);
};