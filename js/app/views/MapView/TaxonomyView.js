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
    this._StatisticOptions = {};
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
    this._Model.StatisticRetrieved.add(this._onStatisticRetrieved, this);
};

taxVP._onRegionsRetrieved = function (sender) {
    this.addMapObjects(this._Model.getRegions());
};

taxVP._onStatisticRetrieved = function (sender, settings) {
    this._Statistic = this._Model.getStatisticData(settings.statistic);
    this.setStatisticOptions(this._Statistic);

    // now we need to loop though available statistics in fact
    // but we will just fix first period for now
    // start loop
    var statisticToDisplay = this._Statistic.periods[0];
    this.setStatisticValues(statisticToDisplay.values);

    this.addMapObjects(this._Model.getRegions());
    // end loop
};

/**
 * Returns array of Leaflet objects ready to add to map
 * @returns {undefined}
 */
taxVP.addMapObjects = function(regionsConfig) {
    this._TaxonomyObjectGroup.clearLayers();

    for (var i = 0; i < regionsConfig.length; i++) {
        var rate;
        var taxonomyObject = L.polygon(regionsConfig[i].shape);
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
 * Set statistic options
 * @param {type} statisticOptions
 * @returns {undefined}
 */
taxVP.setStatisticOptions = function(statisticOptions) {
    this._StatisticOptions = statisticOptions;
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
    for (var i = 0; i < this._StatisticOptions.range.length; i++) {
        if (value >= this._StatisticOptions.range[i].min && value <= this._StatisticOptions.range[i].max) {
            return this._StatisticOptions.range[i].rate;
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