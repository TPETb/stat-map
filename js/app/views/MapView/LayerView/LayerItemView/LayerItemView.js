/**
 * Statistics map name space
 */
if (!SM) {
    var SM = {};
}

SM.LayerItemView = function(options) {
    this.init(options);
};

proto = SM.LayerItemView.prototype;

proto.init = function(options) {
};

/**
 * Return object that can be added to Leaflet object
 * @returns {some Leaflet Object}
 */
proto.getMapObject = function() {
    console.log("the object should implement getMapObject method");
};


proto.getLFLayer = function () {
    console.log("the object should implement getLFLayer method");
};