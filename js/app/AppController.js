/*
 * Statistics map name space
 */
if (!SM) {
    var SM = {};
}

/*
 * type: Controller class
 */
SM.AppController = function(options) {
    this._View = null; // SM.AppView instance

    this._service = new SM.Service(new SM.Service_Remote());
    this._config = null;
    this._Taxonomy = new SM.Taxonomy();
    this._Statistic = null;

    this.init(options);
};

var appCtrlP = SM.AppController.prototype;

/**
 * 
 * @param {type} options
 * @returns {appCtrlP}
 */
appCtrlP.init = function(options) {
    this._service.configRetrieved.add(this._onConfigRetrieved, this);
    this._service.requestConfig();
};

appCtrlP._onConfigRetrieved = function(sender, config) {
    this._config = config;

    // Dirty trick. Register globals. We can always refactor later!
    SM.config = config;
    SM.service = this._service;

    this._View = new SM.AppView({
        service: this._service
    });
    this._View.setConfig(this._config);
    this._addEventListeners();
    // good time to load layers
    this._service.layersListRetrieved.add(this._onLayersListRetrieved, this);
    this._service.requestLayersList();
    // good time to load regions
    this._service.regionsRetrieved.add(this._onRegionsRetrieved, this);
    this._service.requestRegions();
    // good time to load statistics
    this._service.StatisticsListRetrieved.add(this._OnStatisticsListRetrieved, this);
    this._service.requestStatisticsList();
};

appCtrlP._onLayersListRetrieved = function(sender, layersList) {
    this._View.setLayers(layersList);
};

appCtrlP._onRegionsRetrieved = function (sender, regionsConfig) {
    // init Taxonomy and pass object from it to view
    this._Taxonomy.setRegions(regionsConfig);
    
    this._View.setTaxonomy(this._Taxonomy.getMapObjects());
};

appCtrlP._OnStatisticsListRetrieved = function() {
    this._View.setStatisticsList(this._service.getStatisticsList());
};

appCtrlP._addEventListeners = function() {
    this._View.layerHideDemanded.add(this._onLayerHideDemanded, this);
    this._View.layerShowDemanded.add(this._onLayerShowDemanded, this);
    this._View.StatisticShowDemanded.add(this._OnStatisticShowDemanded, this);
};

appCtrlP._onLayerHideDemanded = function(sender, layerName) {
    console.log(layerName + ' hide demanded');
};

appCtrlP._onLayerShowDemanded = function(sender, layerName) {
    console.log(layerName + ' show demanded');
};

appCtrlP._OnStatisticShowDemanded = function (sender, settings) {
    // Load corresponding statistic data and pass it to view
    this._service.StatisticRetrieved.add(this._OnStatisticRetrieved, this, settings.statistic);
    this._service.requestStatistic(settings.statistic);
};

appCtrlP._OnStatisticRetrieved = function (sender, settings) {
    this._Statistic = this._service.getStatisticData(settings.statistic);
    this._Taxonomy.setStatisticOptions(this._Statistic);
    
    // now we need to loop though available statistics in fact
    // but we will just fix first period for now
    // start loop
    var statisticToDisplay = this._Statistic.periods[3];
    this._Taxonomy.setStatisticValues(statisticToDisplay.values);
    
    this._View.setTaxonomy(this._Taxonomy.getMapObjects());
    // end loop
};
//appCtrlP = null;