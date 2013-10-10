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
    this._Service = new SM.ServiceRemote();

    this._Config = null;
    this._Layers = [];
    this._Regions = [];
    this._Statistics = [];
    this._StatisticsList = [];
    this._Taxonomy = null;
    this._ActiveTaxonomy = null;
    this._FocusedObjectName = "turkmenistan";
    //this._FocusedObjectName = null;

    this._StartUpDataFiredEvents = [];
    this._LayerItemsRetrievedCounter = 0;

    this._ActiveStatistic = null;

    this.ConfigRetrieved = new TVL.Event();
    this.LayersListRetrieved = new TVL.Event();
    this.LayersItemsRetrieved = new TVL.Event();
    this.LayerItemsRetrieved = new TVL.Event();
    this.RegionsRetrieved = new TVL.Event();
    this.TaxonomyRetrieved = new TVL.Event();
    this.StatisticsListRetrieved = new TVL.Event();
    this.StartUpDataLoaded = new TVL.Event();

    this.ActiveTaxonomySet = new TVL.Event();
    this.ActiveStatisticSet = new TVL.Event();
    this.FocusedObjectSet = new TVL.Event();

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
    this._Service.RegionsRetrieved.add(this._onRegionsRetrieved, this);
    this._Service.TaxonomyRetrieved.add(this._onTaxonomyRetrieved, this);
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
    this._addStartUpDataFiredEvent(this.ConfigRetrieved);
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
    this._addStartUpDataFiredEvent(this.LayersListRetrieved);
};

appModelP.setFocusedObjectName = function (objectName) {
    this._FocusedObjectName = objectName;
    if (objectName == "turkmenistan") {
        this.setActiveTaxonomy('welayats');
    } else {
        this.setActiveTaxonomy('etraps');
    }
    this.FocusedObjectSet.fire(this);
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
        this._LayerItemsRetrievedCounter++;
        if (this._LayerItemsRetrievedCounter === this._Layers.length) {
            this.LayersItemsRetrieved.fire(this);
            this._addStartUpDataFiredEvent(this.LayersItemsRetrieved);
        }
    }
};

/**
 * retrieve regions config
 * @returns {@pro;statisticsList@this._cache|array}
 */
appModelP.requestRegions = function () {
    this._Service.requestRegions();
};

appModelP._onRegionsRetrieved = function (sender, settings) {
    this._Regions = settings.items;
    this.RegionsRetrieved.fire(this);
    this._addStartUpDataFiredEvent(this.RegionsRetrieved);
};

appModelP.requestTaxonomy = function () {
    this._Service.requestTaxonomy();
};

appModelP._onTaxonomyRetrieved = function (sender, settings) {
    this._Taxonomy = settings;
    this.TaxonomyRetrieved.fire(this);
    this._addStartUpDataFiredEvent(this.TaxonomyRetrieved);
};

/**
 * retrieve statistics related data
 * @returns {undefined}
 */
appModelP.requestStatisticsList = function () {
    this._Service.requestStatisticsList();
};

appModelP._onStatisticsListRetrieved = function (sender, settings) {
    this._StatisticsList = settings;

    this._Statistics = new SM.StatisticModel(this._StatisticsList);
    this._Statistics.SetActive.add(this._onStatisticSetActive, this);

    this.StatisticsListRetrieved.fire(this);
    this._addStartUpDataFiredEvent(this.StatisticsListRetrieved);
};

appModelP._onStatisticSetActive = function (sender) {
    this._Statistics.setActive(false, sender);
    this.setActiveStatistic(sender);
    this.ActiveStatisticSet.fire(this);
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

    var statistic = this._getStatistic(this._Statistics, statisticName);

    return statistic;
};

appModelP._getStatistic = function (statisticArray, statisticName) {
    for (var i = 0; i < statisticArray.length; i++) {
        if (statisticArray[i].name === statisticName) {
            return statisticArray[i];
        } else {
            if (statisticArray[i].items) {
                tmp = this._getStatistic(statisticArray[i].items, statisticName);
                if (tmp) return tmp;
            }
        }
    }

    return false;
};

appModelP.getStatistics = function () {
    return this._Statistics;
};

appModelP.getRegions = function () {
    return this._Regions;
};

appModelP.setActiveStatistic = function (statistic) {
    if (this._ActiveStatistic) {
        this._ActiveStatistic.cancelCycle();
        this._ActiveStatistic = null;
    }
    if (statistic) {
        this._ActiveStatistic = statistic;
    }
};

appModelP.getActiveStatistic = function () {
    return this._ActiveStatistic;
};

appModelP.setActiveStatisticPeriods = function (periodsNamesArray) {
    this._ActiveStatisticPeriods = periodsNamesArray;
};

appModelP.getActiveStatisticPeriods = function () {
    return this._ActiveStatisticPeriods;
};

appModelP.getTaxonomy = function () {
    return this._Taxonomy;
};

appModelP.setActiveTaxonomy = function (taxonomyName) {
    this._ActiveTaxonomy = this._Taxonomy[taxonomyName];
    this._ActiveTaxonomyType = taxonomyName;
    this.ActiveTaxonomySet.fire(this);
};

appModelP.getActiveTaxonomy = function () {
    return this._ActiveTaxonomy;
};

appModelP.getActiveTaxonomyType = function () {
    return this._ActiveTaxonomyType;
};

appModelP._addStartUpDataFiredEvent = function (event) {
    this._StartUpDataFiredEvents.push(event);
    if (this._StartUpDataFiredEvents.length === 5) {
        this.StartUpDataLoaded.fire(this);
    }
};

appModelP.getFocusedObjectName = function () {
    return this._FocusedObjectName;
};

appModelP = null;