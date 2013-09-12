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

    this._addEventListeners();

    this._Model.requestConfig();
};

appCtrlP._addEventListeners = function () {
    this._Model.ConfigRetrieved.add(this._onConfigRetrieved, this);
    this._Model.LayersListRetrieved.add(this._onLayersListRetrieved, this);
    this._Model.LayerItemsRetrieved.add(this._onLayerItemsRetrieved, this);
    this._View.LayerHideDemanded.add(this._onLayerHideDemanded, this);
    this._View.LayerShowDemanded.add(this._onLayerShowDemanded, this);
};

appCtrlP._onConfigRetrieved = function (sender) {
    this._Model.requestLayersList();
};

appCtrlP._onLayersListRetrieved = function (sender) {
    this._Model.requestLayersItems();
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

appCtrlP = null;