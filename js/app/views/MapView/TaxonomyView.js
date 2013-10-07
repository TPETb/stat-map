/*
 * Statistics map name space
 */
if (!SM) {
    var SM = {};
}

/**
 * Handles the drawing of regions
 * @returns {undefined}
 */
SM.TaxonomyView = function(options) {
    this._Model = options.model;
    this._Map = options.map;
    this._StatisticValues = [];
    this._TaxonomyObjectGroup = null;

    this.init();
};

taxVP = SM.TaxonomyView.prototype;

/**
 * Constructor
 * @returns {undefined}
 */
taxVP.init = function() {
    this._TaxonomyObjectGroup = L.layerGroup();

    this._addEventListeners();
};

taxVP._addEventListeners = function () {
    this._Model.RegionsRetrieved.add(this._onRegionsRetrieved, this);
    this._Model.ActiveStatisticSet.add(this._onActiveStatisticSet, this);
};

taxVP._onRegionsRetrieved = function (sender) {
    this.setMapObjects(this._Model.getRegions());
};

taxVP._onActiveStatisticSet = function () {
    this._ActiveStatistic = this._Model.getActiveStatistic();

    this._ActiveStatistic.CurrentPeriodSet.remove(this._onCurrentPeriodSet);
    this._ActiveStatistic.CycleCancelled.remove(this._onCycleCancelled);
    this._ActiveStatistic.CurrentPeriodSet.add(this._onCurrentPeriodSet, this);
    this._ActiveStatistic.CycleCancelled.add(this._onCycleCancelled, this);
};

taxVP._onCurrentPeriodSet = function () {
    var currentPeriod  = this._ActiveStatistic.getCurrentPeriod();

    this.setStatisticValues(currentPeriod.values);

    this.setMapObjects(this._Model.getRegions());
};

taxVP._onCycleCancelled = function () {
    this.setStatisticValues(null);

    this.setMapObjects(this._Model.getRegions());
};

/**
 * Returns array of Leaflet objects ready to add to map
 * @returns {undefined}
 */
taxVP.setMapObjects = function(regionsConfig) {
    this._TaxonomyObjectGroup.clearLayers();

    for (var i = 0; i < regionsConfig.length; i++) {
        var rate;
        var taxonomyObject = L.multiPolygon(regionsConfig[i].shape);
        if (this._findStatisticByObjectName(regionsConfig[i].name)) {
            rate = this._getStatisticValueRate(this._findStatisticByObjectName(regionsConfig[i].name).value);
        }
        else {
            rate = 0;
        }
        taxonomyObject.setStyle(this._getObjectStyleByRate(rate));
        this._TaxonomyObjectGroup.addLayer(taxonomyObject);
    }

    this._TaxonomyObjectGroup.addTo(this._Map);
};

/**
 * Add statistic value to display to taxonomy objects
 * Pass null or empty array to display no statistic
 * @param {type} statistic (not period, but just a values to display)
 * @returns {undefined}
 */
taxVP.setStatisticValues = function(statisticValues) {
    this._StatisticValues = [];

    if (!statisticValues)
        return;

    $.each(statisticValues, $.proxy(function(index, statistic) {
        this._StatisticValues[statistic.object] = statistic;
    }, this));
};

taxVP._findStatisticByObjectName = function(objectName) {
    if (this._StatisticValues[objectName]) {
        return this._StatisticValues[objectName]
    } else {
        return false;
    }
};

taxVP._getStatisticValueRate = function(value) {
    var statisticData = this._ActiveStatistic.getData();
    for (var i = 0; i < statisticData.range.length; i++) {
        if (value >= statisticData.range[i].min && value <= statisticData.range[i].max) {
            return statisticData.range[i].rate;
        }
    }

    // if nothing found
    return 0;
};

taxVP._getObjectStyleByRate = function(rate) {
    var config = SM.App.getModel().getConfig()

    for (var i = 0; i < config.rates.length; i++) {
        if (rate === config.rates[i].value) {
            return config.rates[i].polyStyle;
        }
    }

    // if nothing found
    return {
        "fill": false,
        "fillColor": null,
        "fillOpacity": 0,
        "stroke": true,
        "color": "red",
        "dashArray": "3, 2",
        "weight": 2
    };
};

taxVP = null;
