/*
 * Statistics Map name space
 */
if (!SM) {
    var SM = {};
}

/*
 * type: View class
 */
SM.UIView = function(options) {
    this._Model = options.model;

    this._DomNode = $('#ui .layers');
    this._LayersContainer = null;

    // Layers events
    this.LayerHideDemanded = new TVL.Event();
    this.LayerShowDemanded = new TVL.Event();

    // Statistics events
    this.ShowStatisticDemanded = new TVL.Event();
    this.HideStatisticDemanded = new TVL.Event();

    this.init(options);
};

var uiViewP = SM.UIView.prototype;

/**
 * Initializes everything that doesn't need additional data
 * @param {type} config
 * @returns {uiViewP}
 */
uiViewP.init = function(options) {
    this._LayersContainer = $('<ul>');
    this._LayersContainer.appendTo(this._DomNode);

    this._addEventListeners();
};

uiViewP._addEventListeners = function () {
    this._Model.LayersListRetrieved.add(this._onLayersListRetrieved, this);
};
uiViewP._onLayersListRetrieved = function () {
    this.addLayersList(this._Model.getLayers());
}

/**
 *
 * @param {object} layers changed
 * @returns {undefined}
 */
uiViewP.addLayersList = function(layersConfig) {
    for (var i = 0; i < layersConfig.length; i++) {
        this.addLayersListItem(layersConfig[i]);
    }
};

/**
 * Adds layer to list of available layers
 * @param {type} layerConfig
 * @returns {undefined}
 */
uiViewP.addLayersListItem = function(layerConfig) {
    var item = $('<li><label><input type="checkbox"/><span></span></label></li>');
    item.find('input').attr({
        name: layerConfig.name,
        checked: layerConfig.active,
        disabled: layerConfig.forced
    }).on('change', $.proxy(this._onLayerChange, this));

    item.find('span').text(layerConfig.title);
    item.appendTo(this._LayersContainer);
};

/**
 * Escalate demand for layer state change
 * @param {type} input
 * @returns {undefined}
 */
uiViewP._onLayerChange = function(event) {
    if ($(event.target).is(':checked')) {
        this.LayerShowDemanded.fire(this, $(this).attr('name'));
    } else {
        this.LayerHideDemanded.fire(this, $(this).attr('name'));
    }
};

uiViewP.hideLayer = function(layerName) {

};

uiViewP.showLayer = function(layerName) {

};

uiViewP.removeLayers = function() {

};

uiViewP.forceLayer = function(layerName) {

};

uiViewP.unforceLayer = function(layerName) {

};

uiViewP.setStatistics = function(statisticsConfig) {

};

uiViewP = null;