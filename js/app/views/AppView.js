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
    this._UIView = null;

    this._Loader = $('#Loader');
    this._Loader.find('.inner').height($(window).height());
    this._Loader.find('.inner').width($(window).width());

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
    $(window).on('click', $.proxy(this._onWindowClick, this));

    this._Model.StartUpDataLoaded.add(this._onStartUpDataLoaded, this);

    this._UIView.LayerHideDemanded.add(this._onLayerHideDemanded, this);
    this._UIView.LayerShowDemanded.add(this._onLayerShowDemanded, this);

    $('.menu-std').on('click', 'li', function () {
        console.log('ggg');
    });
};

appViewP._onWindowClick = function (event) {
    if ($('#Map').find($(event.target)).length > 0) {
        this.hideModals();
    }
};

appViewP._onStartUpDataLoaded = function () {
    this._Loader.fadeOut();
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

appViewP.hideLayer = function (layerName) {
    this._MapView.hideLayer(layerName);
};

appViewP.showLayer = function (layerName) {
    this._MapView.showLayer(layerName);
};

appViewP.hideStatistic = function () {
    this._UIView.hideStatistic();
    this._MapView.hideStatistic();
};

appViewP.cancelStatistic = function () {
    this._UIView.cancelStatistic();
};

appViewP.startStatisticCycle = function () {
    this._MapView.getTaxonomyView().startStatisticCycle();
    this._UIView.getPeriodsView().startStatisticCycle();
};

appViewP.stopStatisticCycle = function () {
    this._MapView.getTaxonomyView().stopStatisticCycle();
    this._UIView.getPeriodsView().stopStatisticCycle();
};

appViewP.getUIView = function () {
    return this._UIView;
};

appViewP.getMapView = function () {
    return this._MapView;
};

appViewP.hideModals = function () {
    this._UIView.hideModals();
};

appViewP = null;