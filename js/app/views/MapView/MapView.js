/*
 * Statistics Map name space
 */
if (!SM) {
    var SM = {};
}

/*
 * type: View class
 */
SM.MapView = function (options) {
    this._DomNode = $('#Map');
    this._Model = options.model;
    this._Map = {}; // Map container
    this._LayerContainerView = null;
    this._TaxonomyView = null;
    this._FocusedObject = options.focusedObject;

    this.init();
};

var mapViewP = SM.MapView.prototype;

/**
 * Initializes everything that doesn't need additional data
 * @param {type} config
 * @returns {mapViewP}
 */
mapViewP.init = function () {
    this.resize($(window).width(), $(window).height());

    this._Map = L.map(this._DomNode.attr('id'), {
        maxZoom: 12,
        maxBounds: [
            [20, 37],
            [57, 81]
        ],
        zoomControl: false
    });
    this._Map.addControl( L.control.zoom({position: 'topright'}) );
    this._LayerContainerView = new SM.LayerContainerView({
        model: this._Model,
        map: this._Map,
        focusedObject: this._FocusedObject
    });
    this._TaxonomyView = new SM.TaxonomyView({
        model: this._Model,
        map: this._Map,
        focusedObject: this._FocusedObject
    });

    this._addEventListeners();
};

mapViewP._addEventListeners = function () {
    this._Model.ConfigRetrieved.add(this._onConfigRetrieved, this);

    $(window).on('resize', $.proxy(this._onViewportResize, this));
};

mapViewP.showLayer = function (layerName) {
    this._LayerContainerView.showLayer(layerName);
};

mapViewP.hideLayer = function (layerName) {
    this._LayerContainerView.hideLayer(layerName);
};

mapViewP.focusObject = function (objectName) {
    this._FocusedObject = objectName;
    this._TaxonomyView.focusObject(objectName);
    // @todo: center camera on chosen object
};

/**
 * Loops though provided config and applies known values
 * @param {type} config
 * @returns {undefined}
 * @todo rework zoom value
 */
mapViewP._onConfigRetrieved = function () {
    var config = this._Model.getConfig();

    if (config.view) {
        this._Map.setView([config.view.lat, config.view.lng], 7);
    }

    if (config.tileProvider) {
        L.tileLayer(config.tileProvider, {
            attribution: ''
        }).addTo(this._Map);
    }
};

mapViewP._calculateZoomRange = function () {

};

mapViewP._onViewportResize = function () {
    //this.resizeMap($(window).width(), $(window).height());
};

mapViewP.resize = function (width, height) {
    this._DomNode.width(width).height(height);
};

mapViewP._onResize = function () {
    this._calculateZoomRange();
};

mapViewP.getTaxonomyView = function () {
    return this._TaxonomyView;
};

mapViewP = null;
