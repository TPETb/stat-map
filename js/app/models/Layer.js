/*
 * Statistics map name space
 */
if (!SM) {
    var SM = {};
}

SM.Layer = function(options) {
    this._items = [];
    this._Name = options.name;

    this.init();
};

layerP = SM.Layer.prototype;

/**
 * Constructor
 * @returns {undefined}
 */
layerP.init = function() {

};

/**
 * Initializes list of layer items
 * @param {type} layerItems
 * @returns {undefined}
 */
layerP.addItems = function(itemsConfig) {
    $.each(itemsConfig, $.proxy(function(index, item) {
        this._items.push(new SM.Layer_Item(item));
    }, this));
};

/**
 * Returns Leaflet objects that can be added to map
 * @returns {undefined}
 */
layerP.getMapObjects = function () {
    var result = [];
    $.each(this._items, $.proxy(function(index, item){
        result.push(item.getMapObject());
    }, this));
    
    return result;
};

layerP.getName = function () {
    return this._Name;
};