/*
 * Statistics Map name space
 */
if (!SM) {
    var SM = {};
}

/**
 *
 * @todo User toggleable layers should be indexed in MapView instead of checking LayerView.getName()
 * @param options
 * @constructor
 */
SM.MapView = function (options) {
    this._DomNode = $('#Map');
    this._UserToggleableLayers = [];
    this._RegionsLayer = null;
    this._SystemLayers = [];
    this._Config = {};

    this.init(options);
}

proto = SM.MapView.prototype;

proto.init = function (options) {
    this.resize($(window).width(), $(window).height());

    this._Map = L.map(this._DomNode.attr('id'), {
        maxZoom: 16,
        maxBounds: [
            [20, 37],
            [57, 81]
        ]
    });
    this._LayerContainerView = new SM.LayerContainerView({
        model: this._Model,
        map: this._Map
    });
    this._TaxonomyView = new SM.TaxonomyView({
        model: this._Model,
        map: this._Map
    });

    this._RegionsLayer = new SM.LayerView({
        map: this._Map
    });

    this._addEventListeners();
};

/**
 * Start listening to events
 * @private
 */
proto._addEventListeners = function () {
    $(window).on('resize', $.proxy(this._onViewportResize, this));
};

/**
 * Called if viewport is being resized
 * @private
 */
this._onViewportResize = function () {
    this.resize($(window).width(), $(window).height());
};

/**
 * Generally sets visual config
 * @param {object} config
 */
proto.setConfig = function (config) {
    this._Config = config;
};

/**
 * Remove previously added regions and add new
 * @param {array} regionConfigsArray
 */
proto.setRegions = function (regionConfigsArray) {
    this._RegionsLayer.clear();
    this.addRegions(regionConfigsArray);
};

/**
 * Add a region to map
 * @param {object} regionConfig
 */
proto.addRegion = function (regionConfig) {
    this._RegionsLayer.addItem(regionConfig);
};

/**
 * Add multiple regions to map
 * @param {array} regionConfig
 */
proto.addRegions = function (regionConfigsArray) {
    for (i = 0; i < regionConfigsArray.length; i++) {
        this.addRegion(regionConfigsArray[i]);
    }
};

/**
 * Set list of regions that can be toggled by user
 * @param {array} layerConfigsArray
 */
proto.setUserToggleableLayers = function (layerConfigsArray) {
    for (i = 0; i < this._UserToggleableLayers.length; i++) {
        this._UserToggleableLayers[i].delete();
    }
    this._UserToggleableLayers = [];
    this.addUserToggleableLayers(layerConfigsArray);
};

/**
 * Add single user toggleable layer to map
 * @param {object} layerConfig
 */
proto.addUserToggleableLayer = function (layerConfig) {
    this._UserToggleableLayers.push(new SM.LayerView({
        name: layerConfig.name,
        items: layerConfig.items,
        map: this._Map
    }));
};

/**
 * Add multiple user toggleable layer to map
 * @param {array} layerConfigsArray
 */
proto.addUserToggleableLayers = function (layerConfigsArray) {
    for (i = 0; i < layerConfigsArray.length; i++) {
        this.addUserToggleableLayer(layerConfigsArray[i]);
    }
};

/**
 * Hide toggleable layer
 * @param {string} layerName
 */
proto.hideUserToggleableLayer = function (layerName) {
    this._findUserToggleableLayer(layerName).hide();
};

/**
 * Show toggleable layer
 * @param {string} layerName
 */
proto.showUserToggleableLayer = function (layerName) {
    this._findUserToggleableLayer(layerName).show();
};

proto._findUserToggleableLayer = function (layerName) {
    for (i = 0; i < this._UserToggleableLayers.length; i++) {
        if (this._UserToggleableLayers[i].getName() == layerName) {
            return this._UserToggleableLayers[i];
        }
    }

    return null;
};

/**
 * Indicate something on the map
 * example = {
    "name": "ind1",
    "title": "Розничный товарооборот с учетом оборота предприятий питания",
    "range": [...],
    "periods": [...],
    "highlights" [
        {
            "periods": ["period-name-1", "period-name-2"],
            "objects": ["object-name-1", "object-name-2"]
            // Highlight given objects in given periods
        },
        {
            "periods": ["period-name-1", "period-name-2"],
            "objects": "*"
            // Highlight all objects in given periods
        },
        {
            "periods": "*",
            "objects": ["object-name-1", "object-name-2"]
            // Highlight given objects in all periods
        },
        {
            "periods": "*",
            "objects": "*"
            // Highlight everything (well, if you need it, you can)
        }
    ]
 }
 * @param {object} indicatorConfig see example in description
 */
proto.setIndicator = function (indicatorConfig) {
};

/**
 * Resize canvas to given dimensions
 * @param width
 * @param height
 */
proto.resize = function (width, height) {
    this._DomNode.width(width).height(height);
};

proto = null;