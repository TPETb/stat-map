/*
 * Statistics Map name space
 */
if (!SM) {
    var SM = {};
}

/*
 * type: View class
 */
SM.AppView = function(options) {
    this._service = null;
    this._mapView = null;
    this._uiView = null

    // Layers events
    this.layerHideDemanded = new TVL.Event();
    this.layerShowDemanded = new TVL.Event();

    // Statistics events
    this.StatisticShowDemanded = new TVL.Event();
    this.StatisticHideDemanded = new TVL.Event();

    this.init(options);
};

var appViewP = SM.AppView.prototype;

/**
 * Constructor
 * @param {type} options
 * @returns {appViewP}
 */
appViewP.init = function(options) {
    this._service = options.service;
    this._mapView = new SM.MapView();
    this._uiView = new SM.UIView();

    this._addEventListeners();

    return this;
};

/**
 * Passes the config to child Views
 * @param {type} config
 * @returns {undefined}
 */
appViewP.setConfig = function(config) {
    this._mapView.setConfig(config);
    this._uiView.setConfig(config);
};

/**
 * 
 * @param {type} layersConfig
 * @returns {undefined}
 */
appViewP.setLayers = function(layersConfig) {
    this._mapView.setLayers(layersConfig);
    this._uiView.setLayers(layersConfig);
};

/**
 * 
 * @param {type} regionsConfig
 * @returns {undefined}
 */
appViewP.setTaxonomy = function(taxonomyObjects) {
    this._mapView.setTaxonomy(taxonomyObjects);
};

/**
 * 
 * @param {type} statisticsList
 * @returns {undefined}
 */
appViewP.setStatisticsList = function (statisticsList) {
    this._uiView.setStatisticsList(statisticsList);
    this._mapView.setStatisticsList(statisticsList);
};

/**
 * List to view events
 * @returns {undefined}
 */
appViewP._addEventListeners = function() {
    this._uiView.layerHideDemanded.add(this._onLayerHideDemanded, this);
    this._uiView.layerShowDemanded.add(this._onLayerShowDemanded, this);
    this._uiView.StatisticShowDemanded.add(this._OnStatisticShowDemanded, this);
};

/**
 * React to child view events
 * @param {type} sender
 * @param {type} layerName
 * @returns {undefined}
 */
appViewP._onLayerHideDemanded = function(sender, layerName) {
    this.layerHideDemanded.fire(this, layerName);
};
appViewP._onLayerShowDemanded = function(sender, layerName) {
    this.layerShowDemanded.fire(this, layerName);
};
appViewP._OnStatisticShowDemanded = function(sender, settings) {
    this.StatisticShowDemanded.fire(this, settings);
};