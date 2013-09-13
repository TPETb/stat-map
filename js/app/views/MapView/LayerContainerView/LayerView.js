/*
 * Statistics map name space
 */
if (!SM) {
    var SM = {};
}

SM.LayerView = function (options) {
    this._Items = [];
    this._Name = options.name;
    this.title = null;
    this.type = null;
    
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
    for (var i = 0; i < itemsConfig; i++) {
        switch (itemsConfig[i].type) {
            case 'marker':
                this._Items.push(new SM.Layer_Item_MarkerView(itemsConfig[i].options));
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