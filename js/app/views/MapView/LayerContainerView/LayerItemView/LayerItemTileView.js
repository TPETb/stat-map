/**
 * Statistics map name space
 */
if (!SM) {
    var SM = {};
}

SM.Layer_Item_TileView = function(options) {
    this.provider = null;
    this.contentType = null;
    this.content = null;

    this.init(options);
};

layerITVP = SM.Layer_Item_TileView.prototype;

layerITVP.init = function(options) {
    this.provider = options.provider;
    this.contentType = options.contentType;
    this.content = options.content;
};

/**
 * Return object that can be added to Leaflet object
 * @returns {some Leaflet Object}
 */
layerITVP.getMapObject = function() {
    var config = SM.App.getModel().getConfig();

    var tile = new L.TileLayer(this.provider);

    return tile;
};
