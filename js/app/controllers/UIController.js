/*
 * Statistics map name space
 */
if (!SM) {
    var SM = {};
}

/*
 * type: Controller class
 */
SM.UIController = function (options) {
    this._Model = null; // SM.AppModel instance
    this._View = null; // SM.AppView instance
    
    this.init(options);
};

var uiCtrlP = SM.UIController.prototype;

/**
 *
 * @param {type} options
 * @returns {appCtrlP}
 */
uiCtrlP.init = function (options) {
    this._Model = options.model;
    this._View = options.view;

    this.LayerShowDemanded = new TVL.Event();
    this.LayerHideDemanded = new TVL.Event();

    this.StatisticCancelDemanded = new TVL.Event();
    this.StatisticCycleStartDemanded = new TVL.Event();
    this.StatisticCycleStopDemanded = new TVL.Event();

    this._addEventListeners();
};

uiCtrlP._addEventListeners = function () {
    this._View.LayerHideDemanded.add(this._onLayerHideDemanded, this);
    this._View.LayerShowDemanded.add(this._onLayerShowDemanded, this);

    this._View.StatisticShowDemanded.add(this._onStatisticShowDemanded, this);
    this._View.StatisticCancelDemanded.add(this._onStatisticCancelDemanded, this);

    this._View.StatisticCycleStartDemanded.add(this._onStatisticCycleStartDemanded, this);
    this._View.StatisticCycleStopDemanded.add(this._onStatisticCycleStopDemanded, this);
};

uiCtrlP._onLayerHideDemanded = function (sender, layerName) {
    this.LayerHideDemanded.fire(this, layerName);
};

uiCtrlP._onLayerShowDemanded = function (sender, layerName) {
    this.LayerShowDemanded.fire(this, layerName);
};

uiCtrlP._onStatisticShowDemanded = function (sender, statisticName) {
    this._Model.setActiveStatistic(this._Model.getStatistic(statisticName));

    if (!this._Model.getStatistic(statisticName).data) {
        this._Model.requestStatistic(statisticName);
    }
    else {
        this._View.getPeriodsView().addPeriodsMenuItems(this._Model.getActiveStatistic().data.periods);
    }
};

uiCtrlP._onStatisticCancelDemanded = function () {
    this.StatisticCancelDemanded.fire(this);
};

uiCtrlP._onStatisticCycleStartDemanded = function () {
    this.StatisticCycleStartDemanded.fire(this);
};

uiCtrlP._onStatisticCycleStopDemanded = function () {
    this.StatisticCycleStopDemanded.fire(this);
};

uiCtrlP = null;