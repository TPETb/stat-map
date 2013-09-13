/*
 * Statistics map name space
 */
if (!SM) {
    var SM = {};
}

/*
 * type: Controller class
 */
SM.AppController = function (options) {
    this._Model = null; // SM.AppModel instance
    this._View = null; // SM.AppView instance

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
appCtrlP.init = function (options) {
    this._Model = new SM.AppModel();
    this._View = new SM.AppView({
            model: this._Model
        });

    this._addEventListeners();

    this._Model.requestConfig();
};

appCtrlP._addEventListeners = function () {
    this._Model.ConfigRetrieved.add(this._onConfigRetrieved, this);
    this._Model.LayersListRetrieved.add(this._onLayersListRetrieved, this);
    this._Model.LayerItemsRetrieved.add(this._onLayerItemsRetrieved, this);
    
    this._Model.RegionsRetrieved.add(this._onRegionsRetrieved, this);
    this._Model.StatisticsListRetrieved.add(this._OnStatisticsListRetrieved, this);
    
    this._View.LayerHideDemanded.add(this._onLayerHideDemanded, this);
    this._View.LayerShowDemanded.add(this._onLayerShowDemanded, this);
    this._View.StatisticShowDemanded.add(this._OnStatisticShowDemanded, this);
};

appCtrlP._onConfigRetrieved = function (sender) {
    this._Model.requestLayersList();
    this._Model.requestRegions();
    this._Model.requestStatisticsList();
};

appCtrlP._onLayersListRetrieved = function (sender) {
    this._Model.requestLayersItems();
};

appCtrlP._onRegionsRetrieved = function (sender, regionsConfig) {
    // init Taxonomy and pass object from it to view
    this._Taxonomy.setRegions(regionsConfig);
    
    this._View.setTaxonomy(this._Taxonomy.getMapObjects());
};

appCtrlP._OnStatisticsListRetrieved = function() {
    this._View.setStatisticsList(this._Model.getStatisticsList());
};

appCtrlP._onLayerItemsRetrieved = function (sender, layerName) {

};

appCtrlP._onLayerHideDemanded = function (sender, layerName) {
    console.log(layerName + ' hide demanded');
};

appCtrlP._onLayerShowDemanded = function (sender, layerName) {
    console.log(layerName + ' show demanded');
};

appCtrlP.getModel = function () {
    return this._Model;
};

appCtrlP._OnStatisticShowDemanded = function (sender, settings) {
    // Load corresponding statistic data and pass it to view
    this._Model.StatisticRetrieved.add(this._OnStatisticRetrieved, this, settings.statistic);
    this._Model.requestStatistic(settings.statistic);
};

appCtrlP._OnStatisticRetrieved = function (sender, settings) {
    this._Statistic = this._Model.getStatisticData(settings.statistic);
    this._Taxonomy.setStatisticOptions(this._Statistic);
    
    // now we need to loop though available statistics in fact
    // but we will just fix first period for now
    // start loop
    var statisticToDisplay = this._Statistic.periods[0];
    this._Taxonomy.setStatisticValues(statisticToDisplay.values);
    
    this._View.setTaxonomy(this._Taxonomy.getMapObjects());
    // end loop
};

appCtrlP = null;