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

    // Focused object - generally a turkmenistan/welayat/ashhabad but might change in future
    this._FocusedObject = "turkmenistan";

    this._Loader = $('#Loader');
    this._Loader.find('.inner').height($(window).height());
    this._Loader.find('.inner').width($(window).width());

    // Layers events
    this.LayerHideDemanded = new TVL.Event();
    this.LayerShowDemanded = new TVL.Event();

    // Statistics events
    this.StatisticShowDemanded = new TVL.Event();
    this.StatisticHideDemanded = new TVL.Event();

    // Focus events
    this.ObjectFocusDemanaded = new TVL.Event();

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
        model: this._Model,
        focusedObject: this._FocusedObject
    });
    this._UIView = new SM.UIView({
        model: this._Model,
        focusedObject: this._FocusedObject
    });

    this._addEventListeners();
};

appViewP._addEventListeners = function() {
    $(window).on('click', $.proxy(this._onWindowClick, this));

    this._Model.StartUpDataLoaded.add(this._onStartUpDataLoaded, this);
    this._Model.FocusObjectDemanded.add(this._onFocusObjectDemanded, this);

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

appViewP._onFocusObjectDemanded = function (sender, settings) {
    this.focusObject(settings.objectName);
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

appViewP._onObjectFocusDemanded = function(sender, objectName) {
    this.ObjectFocusDemanaded.fire(this, objectName);
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

appViewP.focusObject = function (objectName) {
    this._MapView.focusObject(objectName);
    this._UIView.focusObject(objectName);
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