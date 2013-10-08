/**
 * Statistics map name space
 */
if (!SM) {
    var SM = {};
}

SM.Layer_Item_RasterView = function(options) {
    this.url = null;
    this.bounds = null;
    this.contentType = null;
    this.content = null;

    this.init(options);
};

layerIRVP = SM.Layer_Item_RasterView.prototype;

layerIRVP.init = function(options) {
    this.url = options.url;
    this.bounds = options.bounds;
    this.contentType = options.contentType;
    this.content = options.content;
};

/**
 * Return object that can be added to Leaflet object
 * @returns {some Leaflet Object}
 */
layerIRVP.getMapObject = function() {
    var config = SM.App.getModel().getConfig();

    var image = new L.ImageOverlay(this.url, this.bounds);

    return image;
};
