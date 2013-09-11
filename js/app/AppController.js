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
};

appCtrlP._onLayersListRetrieved = function(sender, layersList) {
    this._View.setLayers(layersList);
};

appCtrlP._addEventListeners = function() {
    this._View.layerHideDemanded.add(this._onLayerHideDemanded, this);
    this._View.layerShowDemanded.add(this._onLayerShowDemanded, this);
};

appCtrlP._onLayerHideDemanded = function(sender, layerName) {
    console.log(layerName + ' hide demanded');
};

appCtrlP._onLayerShowDemanded = function(sender, layerName) {
    console.log(layerName + ' show demanded');
};
//appCtrlP = null;