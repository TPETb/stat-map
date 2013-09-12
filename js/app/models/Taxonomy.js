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
SM.Taxonomy = function(regionsConfig) {
    this._Regions = null;
    this._StatisticOptions = {};
    this._StatisticValues = [];

    this.init(regionsConfig);
};

taxP = SM.Taxonomy.prototype;

/**
 * Constructor
 * @returns {undefined}
 */
taxP.init = function(regionsConfig) {
    if (!regionsConfig)
        return;

    this.setRegions(regionsConfig);
};

/**
 * 
 * @param {type} regionsConfig
 * @returns {undefined}
 */
taxP.setRegions = function(regionsConfig) {
    this._Regions = [];

    if (!regionsConfig)
        return;

    $.each(regionsConfig, $.proxy(function(index, regionConfig) {
        this._Regions.push(regionConfig);
    }, this));
};

/**
 * Returns array of Leaflet objects ready to add to map
 * @returns {undefined}
 */
taxP.getMapObjects = function() {
    var result = [];

    $.each(this._Regions, $.proxy(function(index, regionConfig) {
        result[index] = L.polygon(regionConfig.shape);
        if (this._findStatisticByObjectName(regionConfig.name)) {
            rate = this._getStatisticValueRate(this._findStatisticByObjectName(regionConfig.name).value);
        } else {
            rate = 0;
        }
        result[index].setStyle(this._getObjectStyleByRate(rate));
    }, this))

    return result;
};

/**
 * Set statistic options
 * @param {type} statisticOptions
 * @returns {undefined}
 */
taxP.setStatisticOptions = function(statisticOptions) {
    this._StatisticOptions = statisticOptions;
};

/**
 * Add statistic varlue to display to taxonomy objects
 * Pass null or empty array to display no statistic
 * @param {type} statistic (not period, but just a values to display)
 * @returns {undefined}
 */
taxP.setStatisticValues = function(statisticValues) {
    this._StatisticValues = [];

    if (!statisticValues)
        return;

    $.each(statisticValues, $.proxy(function(index, statistic) {
        this._StatisticValues[statistic.object] = statistic;
    }, this));
};

taxP._findStatisticByObjectName = function(objectName) {
    if (this._StatisticValues[objectName]) {
        return this._StatisticValues[objectName]
    } else {
        return false;
    }
};

taxP._getStatisticValueRate = function(value) {
    for (var i = 0; i < this._StatisticOptions.range.length; i++) {
        if (value >= this._StatisticOptions.range[i].min && value <= this._StatisticOptions.range[i].max) {
            return this._StatisticOptions.range[i].rate;
        }
    }

    // if nothing found
    return 0;
};

taxP._getObjectStyleByRate = function(rate) {
    for (var i = 0; i < SM.config.rates.length; i++) {
        if (rate === SM.config.rates[i].value) {
            return SM.config.rates[i].polyStyle;
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