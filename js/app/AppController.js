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
    
    this._View.LayerHideDemanded.add(this._onLayerHideDemanded, this);
    this._View.LayerShowDemanded.add(this._onLayerShowDemanded, this);
    this._View.StatisticShowDemanded.add(this._onStatisticShowDemanded, this);
};

appCtrlP._onConfigRetrieved = function (sender) {
    this._Model.requestLayersList();
    this._Model.requestRegions();
    this._Model.requestStatisticsList();
};

appCtrlP._onLayersListRetrieved = function (sender) {
    this._Model.requestLayersItems();
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

appCtrlP._onStatisticShowDemanded = function (sender, settings) {
    this._Model.requestStatistic(settings.statistic);
};

appCtrlP = null;