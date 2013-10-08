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

    this._UICtrl = new SM.UIController({
        model: this._Model,
        view: this._View.getUIView()
    })

    this._addEventListeners();

    this._Model.requestConfig();
};

appCtrlP._addEventListeners = function () {
    this._Model.ConfigRetrieved.add(this._onConfigRetrieved, this);
    this._Model.LayersListRetrieved.add(this._onLayersListRetrieved, this);

    this._UICtrl.LayerHideDemanded.add(this._onLayerHideDemanded, this);
    this._UICtrl.LayerShowDemanded.add(this._onLayerShowDemanded, this);
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

appCtrlP = null;