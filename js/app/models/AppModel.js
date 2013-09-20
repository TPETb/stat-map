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
    this._Service = new SM.Service_Remote();
    
    this._Config = null;
    this._Layers = [];
    this._Regions = [];
    this._Statistics = [];

    this.ConfigRetrieved = new TVL.Event();
    this.LayersListRetrieved = new TVL.Event();
    this.LayerItemsRetrieved = new TVL.Event();
    this.RegionsRetrieved = new TVL.Event();
    this.StatisticsListRetrieved = new TVL.Event();
    this.StatisticRetrieved = new TVL.Event();

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
    this._Service.StatisticsListRetrieved.add(this._onStatisticsListRetrieved, this);
    this._Service.StatisticRetrieved.add(this._onStatisticRetrieved, this);
    this._Service.RegionsRetrieved.add(this._onRegionsRetrieved, this);
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
        this._Layers = data.items;
    }
    else {
        for (var i = 0; i < data.items.length; i++) {
            if (!this.getLayer(data.items[i].name)) {
                this._Layers.push(data.items[i]);
            }
        }
    }

    this.LayersListRetrieved.fire(this);
};

appModelP.requestLayersItems = function () {
    for (var i = 0; i < this._Layers.length; i++) {
        this.requestLayerItems(this._Layers[i].source);
    }
};

appModelP.requestLayerItems = function (layerUrl) {
    this._Service.requestLayerItems(layerUrl);
};

appModelP._onLayerItemsRetrieved = function (sender, data) {
    var layer = this.getLayer(data.name);
    if (layer) {
        layer.items = data.items;
        this.LayerItemsRetrieved.fire(this, data.name);
    }
};

/**
 * retrieve regions config
 * @returns {@pro;statisticsList@this._cache|array}
 */
appModelP.requestRegions = function() {
    this._Service.requestRegions();
};

appModelP._onRegionsRetrieved = function(sender, settings) {
    this._Regions = settings.items;
    this.RegionsRetrieved.fire(this);
};

/**
 * retrieve statistics related data
 * @returns {undefined}
 */
appModelP.requestStatisticsList = function() {
    this._Service.requestStatisticsList();
};

appModelP._onStatisticsListRetrieved = function(sender, settings) {
    this._Statistics = settings.items;
    this.StatisticsListRetrieved.fire(this);
};

/**
 * retrieve statistics related data
 * @returns {undefined}
 */
appModelP.requestStatistic = function(statisticName) {
    this._Service.requestStatistic(this.getStatistic(statisticName));
};

appModelP._onStatisticRetrieved = function(sender, data) {
    var statistic = this.getStatistic(data.name);
    if (statistic) {
        statistic.data = data;
        this.StatisticRetrieved.fire(this, data.name);
    }
};

appModelP.getLayer = function (layerName) {
    if (this._Layers.length === 0) return false;

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

appModelP.getStatistic = function (statisticName) {
    if (this._Statistics.length === 0) return false;

    for (var i = 0; i < this._Statistics.length; i++) {
        if (this._Statistics[i].name === statisticName) {
            return this._Statistics[i];
        }
    }

    return false;
};

appModelP.getStatistics = function() {
    return this._Statistics;
};

appModelP.getRegions = function () {
    return this._Regions;
};

appModelP = null;