/**
 * Statistics map name space
 */
if (!SM) {
    var SM = {};
}

SM.PolygonView = function(options) {
    this.shape = [];

    this.style = {"fill": false,
        "fillColor": null,
        "fillOpacity": 0,
        "stroke": true,
        "color": "red",
        "dashArray": "3, 2",
        "weight": 2
    };

    this.contentType = null;
    this.content = null;

    this.init(options);
};

TVL.extend(SM.PolygonView, SM.LayerItemView);

proto = SM.PolygonView.prototype;

proto.init = function(options) {
    this.share = options.shape;
};

/**
 * Return object that can be added to Leaflet object
 * @returns {some Leaflet Object}
 */
proto.getMapObject = function() {
    var polygon = L.polygon(this.shape);
    polygon.setStyle(this.style);

    return polygon;
};


proto.setStyle = function (style) {
    this.style = style;
}