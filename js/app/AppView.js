/*
 * Statistics Map name space
 */
if (!SM) {
    var SM = {};
}

/*
 * type: View class
 */
SM.AppView = function(options) {
    this._Model = options.model;
    this._MapView = null;
    this._UIView = null

    // Layers events
    this.LayerHideDemanded = new TVL.Event();
    this.LayerShowDemanded = new TVL.Event();

    // Statistics events
    this.StatisticShowDemanded = new TVL.Event();
    this.StatisticHideDemanded = new TVL.Event();

    this.init();
};

var appViewP = SM.AppView.prototype;

/**
 * Constructor
 * @param {type} options
 * @returns {appViewP}
 */
appViewP.init = function() {
    this._MapView = new SM.MapView({
        model: this._Model
    });
    this._UIView = new SM.UIView({
        model: this._Model
    });

    this._addEventListeners();
};

appViewP._addEventListeners = function() {
    this._UIView.LayerHideDemanded.add(this._onLayerHideDemanded, this);
    this._UIView.LayerShowDemanded.add(this._onLayerShowDemanded, this);
};

/**
 * React to child view events
 * @param {type} sender
 * @param {type} layerName
 * @returns {undefined}
 */
appViewP._onLayerHideDemanded = function(sender, layerName) {
    this.LayerHideDemanded.fire(this, layerName);
};

appViewP._onLayerShowDemanded = function(sender, layerName) {
    this.LayerShowDemanded.fire(this, layerName);
};