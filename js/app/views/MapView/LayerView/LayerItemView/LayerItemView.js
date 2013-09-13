/*
 * Statistics map name space
 */
if (!SM) {
    var SM = {};
}

SM.Layer_ItemView = function (itemConfig) {
    this._entity = null;
    this.name = null;
    this.title = null;
    this.type = null;
    
    this.init(itemConfig);
};

layerIVP = SM.Layer_ItemView.prototype;

layerIVP.init = function (itemConfig) {
    this.name = itemConfig.name;
    this.title = itemConfig.title;
    this.type = itemConfig.type;
    
    switch (itemConfig.type) {
        case 'marker':
            this._entity = new SM.Layer_Item_MarkerView(itemConfig.options);
            break;
    }
};

/**
 * Return object that can be added to Leaflet object
 * @returns {some Leaflet Object}
 */
layerIVP.getMapObject = function () {
    return this._entity.getMapObject();
};