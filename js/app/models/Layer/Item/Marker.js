/**
 * Statistics map name space
 */
if (!SM) {
    var SM = {};
}

SM.Layer_Item_Marker = function(options) {
    this.lat = null;
    this.lng = null;
    this.icon = null;
    this.contentType = null;
    this.content = null;

    this.init(options);
};

layerIMP = SM.Layer_Item_Marker.prototype;

layerIMP.init = function(options) {
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
layerIMP.getMapObject = function() {
    // Generate icon
    var icon = L.icon({
        iconUrl: SM.config.markers[this.icon].iconUrl,
        iconRetinaUrl: SM.config.markers[this.icon].iconRetinaUrl,
        iconSize: SM.config.markers[this.icon].iconSize,
        iconAnchor: SM.config.markers[this.icon].iconAnchor,
        shadowUrl: SM.config.markers[this.icon].shadowUrl,
        shadowRetinaUrl: SM.config.markers[this.icon].shadowRetinaUrl,
        shadowSize: SM.config.markers[this.icon].shadowSize,
        shadowAnchor: SM.config.markers[this.icon].shadowAnchor,
        popupAnchor: SM.config.markers[this.icon].popupAnchor
    });
    var marker = L.marker([this.lat, this.lng], {icon: icon});
    
    return marker;
};