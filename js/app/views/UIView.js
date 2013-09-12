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

    this._DomNode = $('#ui');
    this._LayersControlContainer = null;
    this._StatisticsControlContainer = null;

    this._layers = {};

    // Layers events
    this.LayerHideDemanded = new TVL.Event();
    this.LayerShowDemanded = new TVL.Event();

    // Statistics events
    this.StatisticShowDemanded = new TVL.Event();
    this.StatisticHideDemanded = new TVL.Event();

    this.init(options);
};

var uiViewP = SM.UIView.prototype;

/**
 * Initializes everything that doesn't need additional data
 * @param {type} config
 * @returns {uiViewP}
 */
uiViewP.init = function(options) {
    this._LayersControlContainer = $('<ul class="layers">');
    this._DomNode.append(this._LayersControlContainer);
    this._StatisticsControlContainer = $('<ul class="statistics-control">');
    this._DomNode.append(this._StatisticsControlContainer);

    this._addEventListeners();
};

uiViewP._addEventListeners = function() {
    this._Model.LayersListRetrieved.add(this._onLayersListRetrieved, this);
};

uiViewP._onLayersListRetrieved = function() {
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
    })
            // add event listener right here as it is just DOM event
            .on('change', $.proxy(this._onLayerChange, this));
    item.find('span').text(layerConfig.title);
    item.appendTo(this._LayersControlContainer);
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

/**
 * Add statistics control according to the statistics list passed
 * @param {type} statisticsConfig
 * @returns {undefined}
 */
uiViewP.setStatisticsList = function(statisticsConfig) {
    $.each(statisticsConfig, $.proxy(function(index, statistic) {
        item = $('<li><a href="#"></a></li>');
        item.find('a').attr({
        })
                .text(statistic.title)
                // add event listener right here as it is just DOM event
                .on('click', $.proxy(this.OnStatisticControlItemClick, this, statistic));
        item.appendTo(this._LayersControlContainer);
    }, this));
};

uiViewP.OnStatisticControlItemClick = function(statistic, event) {
    $(event.target).addClass('active');
    this.StatisticShowDemanded.fire(this, {"statistic": statistic});
};

uiViewP = null;