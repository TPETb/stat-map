/*
 * Statistics map name space
 */
if (!SM) {
    var SM = {};
}

SM.LayerView = function (options) {
    this._Items = [];
    this._Name = options.name;
    this._Model = options.model;
    this.title = null;
    this.type = null;
    this.active = true; // @todo retrieve value from config
    
    this.init();
};

layerLVP = SM.LayerView.prototype;

layerLVP.init = function () {

};

/**
 * Initializes list of layer items
 * @param {type} layerItems
 * @returns {undefined}
 */
layerLVP.addItems = function(itemsConfig) {
    for (var i = 0; i < itemsConfig.length; i++) {
        if (itemsConfig[i].parents && $.inArray(this._Model.getFocusedObjectName(), itemsConfig[i].parents) === -1) {
            continue;
        }
        switch (itemsConfig[i].type) {
            case 'tile':
                this._Items.push(new SM.Layer_Item_TileView(itemsConfig[i].options));
                break;
            case 'marker':
                this._Items.push(new SM.Layer_Item_MarkerView(itemsConfig[i].options));
                break;
            case 'raster':
                this._Items.push(new SM.Layer_Item_RasterView(itemsConfig[i].options));
                break;
        }
    }
};

/**
 * Returns Leaflet objects that can be added to map
 * @returns {undefined}
 */
layerLVP.getMapObjects = function () {
    var result = [];
    $.each(this._Items, $.proxy(function(index, item){
        result.push(item.getMapObject());
    }, this));

    return result;
};

layerLVP.getName = function () {
    return this._Name;
};