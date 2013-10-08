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

    this._addEventListeners();
};

uiCtrlP._addEventListeners = function () {
    this._View.LayerHideDemanded.add(this._onLayerHideDemanded, this);
    this._View.LayerShowDemanded.add(this._onLayerShowDemanded, this);
};

uiCtrlP._onLayerHideDemanded = function (sender, layerName) {
    this.LayerHideDemanded.fire(this, layerName);
};

uiCtrlP._onLayerShowDemanded = function (sender, layerName) {
    this.LayerShowDemanded.fire(this, layerName);
};

uiCtrlP = null;