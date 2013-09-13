/*
 * Statistics map name space
 */
if (!SM) {
    var SM = {};
}

SM.LayerView = function(options) {
    this._items = [];
    this._Name = options.name;

    this.init();
};

layerVP = SM.LayerView.prototype;

/**
 * Constructor
 * @returns {undefined}
 */
layerVP.init = function() {

};

/**
 * Initializes list of layer items
 * @param {type} layerItems
 * @returns {undefined}
 */
layerVP.addItems = function(itemsConfig) {
    $.each(itemsConfig, $.proxy(function(index, item) {
        this._items.push(new SM.Layer_ItemView(item));
    }, this));
};

/**
 * Returns Leaflet objects that can be added to map
 * @returns {undefined}
 */
layerVP.getMapObjects = function () {
    var result = [];
    $.each(this._items, $.proxy(function(index, item){
        result.push(item.getMapObject());
    }, this));
    
    return result;
};

layerVP.getName = function () {
    return this._Name;
};