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
    this._StatisticsList = [];
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
appModelP.requestLayerItems = function (layerUrl) {
    this._Service.requestLayerItems(layerUrl);
};

appModelP.requestLayersItems = function () {
    for (var i = 0; i < this._Layers.length; i++) {
        this.requestLayerItems(this._Layers[i].source);
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

/**
 * retrieve regions config
 * @returns {@pro;statisticsList@this._cache|array}
 */
appModelP.requestRegions = function() {
    this._Service.RegionsRetrieved.add(this._onRegionsRetrieved, this);
    this._Service.requestRegions();
};
appModelP._onRegionsRetrieved = function(sender, settings) {
    this._Regions = settings.regions;
    this.RegionsRetrieved.fire(this);
}
appModelP.getRegions = function () {
    return this._Regions;
};

/**
 * retrieve statistics related data
 * @returns {undefined}
 */
appModelP.requestStatisticsList = function() {
    this._Service.StatisticsListRetrieved.add(this._OnStatisticsListRetrieved, this);
    this._Service.requestStatisticsList();
};
appModelP._OnStatisticsListRetrieved = function(sender, settings) {
    this._StatisticsList = settings.data;
    this.StatisticsListRetrieved.fire(this);
};
appModelP.getStatisticsList = function() {
    return this._StatisticsList;
};

/**
 * retrieve statistics related data
 * @returns {undefined}
 */
appModelP.requestStatistic = function(statisticConfig) {
    this._Service.StatisticRetrieved.add(this._OnStatisticRetrieved, this);
    this._Service.requestStatistic(statisticConfig);
};
appModelP._OnStatisticRetrieved = function(sender, settings) {
    this._Statistics[settings.statistic.name] = settings.data;
    this.StatisticRetrieved.fire(this, {"statistic": settings.statistic});
};
appModelP.getStatisticData = function(statistic) {
    return this._Statistics[statistic.name];
};


appModelP = null;