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
    this._config = {}; // Configuration

    this._LayersControlWrapper = $('#ui .layers');
    this._LayersControlContainer = null;
    this._StatisticsControlWrapper = $('#ui .statistics-control');
    this._StatisticsControlContainer = null;

    this._layers = {};

    // Layers events
    this.layerHideDemanded = new TVL.Event();
    this.layerShowDemanded = new TVL.Event();

    // Statistics events
    this.StatisticShowDemanded = new TVL.Event();
    this.hideStatisticDemanded = new TVL.Event();

    this.init(options);
};

var uiViewP = SM.UIView.prototype;

/**
 * Initializes everything that doesn't need additional data
 * @param {type} config
 * @returns {uiViewP}
 */
uiViewP.init = function(options) {
    this._LayersControlContainer = $('<ul>');
    this._LayersControlContainer.appendTo(this._LayersControlWrapper);
    this._StatisticsControlContainer = $('<ul>');
    this._StatisticsControlContainer.appendTo(this._LayersControlWrapper);

    return this;
};

/**
 * Loops though provided config and applies known values
 * @param {type} config
 * @returns {undefined}
 * @todo rework zoom value
 */
uiViewP.setConfig = function(config) {
};

/**
 * Somewhat alias to setConfig
 * @param {type} name
 * @param {type} value
 * @returns {undefined}
 */
uiViewP.setConfigValue = function(name, value) {
    this.setConfig({name: value});
};

/**
 * This method removes all Layers already present. Use it if you want to have whole new Layers list
 * 
 * @param {object} layers changed
 * @returns {undefined}
 */
uiViewP.setLayers = function(layers) {
    // remove layers if there are any
    $.each(this._layers, $.proxy(function(index) {
        this.removeLayer(index);
    }, this));

    // add layers
    $.each(layers, $.proxy(function(index, layerConfig) {
        this.addLayer(layerConfig);
    }, this));
};

/**
 * Adds layer to list of available layers
 * @param {type} layerConfig
 * @returns {undefined}
 */
uiViewP.addLayer = function(layerConfig) {
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

    this._layers[layerConfig.name] = item;
};

/**
 * Escalate demand for layer state change
 * @param {type} input
 * @returns {undefined}
 */
uiViewP._onLayerChange = function(event) {
    if ($(event.target).is(':checked')) {
        this.layerShowDemanded.fire(this, $(this).attr('name'));
    } else {
        this.layerHideDemanded.fire(this, $(this).attr('name'));
    }
};

uiViewP.hideLayer = function(layerName) {

};

uiViewP.showLayer = function(layerName) {

};

uiViewP.removeLayer = function(layerName) {

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

uiViewP.OnStatisticControlItemClick = function (statistic, event) {
    $(event.target).addClass('active');
    this.StatisticShowDemanded.fire(this, {"statistic": statistic});
};

uiViewP = null;