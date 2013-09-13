/**
 * Statistics map name space
 */
if (!SM) {
    var SM = {};
}

SM.Layer_Item_MarkerView = function(options) {
    this.lat = null;
    this.lng = null;
    this.icon = null;
    this.contentType = null;
    this.content = null;

    this.init(options);
};

layerIMVP = SM.Layer_Item_MarkerView.prototype;

layerIMVP.init = function(options) {
    this.lat = options.lat;
    this.lng = options.lng;
    this.icon = options.icon;
    this.contentType = options.contentType;
    this.content = options.content;
};

/**
 * Return object that can be added to Leaflet object
 * @returns {some Leaflet Object}
 */
layerIMVP.getMapObject = function() {
    var config = SM.App.getModel().getConfig();
    // Generate icon
    var icon = L.icon({
        iconUrl: config.markers[this.icon].iconUrl,
        iconRetinaUrl: config.markers[this.icon].iconRetinaUrl,
        iconSize: config.markers[this.icon].iconSize,
        iconAnchor: config.markers[this.icon].iconAnchor,
        shadowUrl: config.markers[this.icon].shadowUrl,
        shadowRetinaUrl: config.markers[this.icon].shadowRetinaUrl,
        shadowSize: config.markers[this.icon].shadowSize,
        shadowAnchor: config.markers[this.icon].shadowAnchor,
        popupAnchor: config.markers[this.icon].popupAnchor
    });
    var marker = L.marker([this.lat, this.lng], {icon: icon});
    
    return marker;
};