/*
 * Statistics map name space
 */
if (!SM) {
    var SM = {};
}

/**
 * In fact is just a warpper of L.LayerGroup
 * @param options
 * @constructor
 */
SM.LayerView = function (options) {
    this._Items = [];
    this._Name = null;
    this._LFLayerGroup = null;
    this.title = null;
    this.type = null;
    this.active = true; // @todo retrieve value from config

    this.init(options);
};

proto = SM.LayerView.prototype;

/**
 * Constructor
 * @param options
 */
proto.init = function (options) {
    this._Name = options.name;
    this._Map = options.map;

    this._LFLayerGroup = L.LayerGroup();
    this._LFLayerGroup.addTo(this._Map);

    this.addItems(options.items);

    // Now render everything to LFLayerGroup
    this.render();
};

/**
 * Add items to layer (doesn't render!!!)
 * @param itemConfigsArray
 */
proto.addItems = function (itemConfigsArray) {
    for (var i = 0; i < itemConfigsArray.length; i++) {
        switch (itemConfigsArray[i].type) {
            case 'marker':
                this._Items.push(new SM.MarkerView(itemConfigsArray[i]));
                break;
            case 'image':
                this._Items.push(new SM.ImageView(itemConfigsArray[i]));
                break;
            case 'polygon':
                this._Items.push(new SM.PolygonView(itemConfigsArray[i]));
                break;
            case 'region':
                this._Items.push(new SM.RegionView(itemConfigsArray[i]));
                break;
            case 'tiles':
                this._Items.push(new SM.TilesView(itemConfigsArray[i]));
                break;
        }
    }
};

/**
 * Produces
 */
proto.render = function () {
    this._LFLayerGroup.clearLayers();
    for (i = 0; i < this._Items.length; i++) {
        this._LFLayerGroup.addLayer(this._Items[i].getLFLayer());
    }
};

proto.hide = function () {
    this._LFLayerGroup.clearLayers()
};

proto.show = function () {
    this.render();
};

proto.getName = function () {
    return this._Name;
};

proto = null;