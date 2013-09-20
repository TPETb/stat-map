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
    this._View.StatisticHideDemanded.add(this._onStatisticHideDemanded, this);
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
    this._View.hideLayer(layerName);
};

appCtrlP._onLayerShowDemanded = function (sender, layerName) {
    this._View.showLayer(layerName);
};

appCtrlP.getModel = function () {
    return this._Model;
};

appCtrlP._onStatisticShowDemanded = function (sender, statisticName) {
    if (!this._Model.getStatistic(statisticName).data) {
        this._Model.requestStatistic(statisticName);
    }
    else {
        this._View.getUIView().showStatistic(statisticName);
    }
};

appCtrlP._onStatisticHideDemanded = function (sender) {
    this._View.hideStatistic();
};

appCtrlP = null;