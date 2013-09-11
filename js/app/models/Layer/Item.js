/*
 * Statistics map name space
 */
if (!SM) {
    var SM = {};
}

SM.Layer_Item = function (itemConfig) {
    this._entity = null;
    this.name = null;
    this.title = null;
    this.type = null;
    
    this.init(itemConfig);
};

layerIP = SM.Layer_Item.prototype;

layerIP.init = function (itemConfig) {
    this.name = itemConfig.name;
    this.title = itemConfig.title;
    this.type = itemConfig.type;
    
    switch (itemConfig.type) {
        case 'marker':
            this._entity = new SM.Layer_Item_Marker(itemConfig.options);
            break;
    }
};

/**
 * Return object that can be added to Leaflet object
 * @returns {some Leaflet Object}
 */
layerIP.getMapObject = function () {
    return this._entity.getMapObject();
};