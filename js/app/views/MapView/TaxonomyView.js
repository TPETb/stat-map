/*
 * Statistics map name space
 */
if (!SM) {
    var SM = {};
}

/**
 * Handles the drawing of regions
 * @returns {undefined}
 */
SM.TaxonomyView = function(options) {
    this._Model = options.model;
    this._Map = options.map;
    this._StatisticValues = [];
    this._TaxonomyObjectGroup = null;

    this.init();
};

taxVP = SM.TaxonomyView.prototype;

/**
 * Constructor
 * @returns {undefined}
 */
taxVP.init = function() {
    this._TaxonomyObjectGroup = L.layerGroup();
    this._Taxonomy_Options_Modal = new SM.Taxonomy_Options_Modal_View({title: ''});

    this._addEventListeners();
};

taxVP._addEventListeners = function () {
    this._Model.RegionsRetrieved.add(this._onRegionsRetrieved, this);
    this._Model.ActiveTaxonomySet.add(this._onActiveTaxonomySet, this);
    this._Model.ActiveStatisticSet.add(this._onActiveStatisticSet, this);
    this._Model.FocusedObjectSet.add(this._onFocusedObjectSet, this);

    this._Taxonomy_Options_Modal.ZoomIn.add(this._on_Taxonomy_Options_Modal_ZoomIn, this);
    this._Taxonomy_Options_Modal.Info.add(this._on_Taxonomy_Options_Modal_Info, this);
};

taxVP._on_Taxonomy_Options_Modal_ZoomIn = function () {
    this._Model.setFocusedObjectName(this._Taxonomy_Options_Modal.get_Object_Name());
};

taxVP._on_Taxonomy_Options_Modal_Info = function () {

};

taxVP._onRegionsRetrieved = function (sender) {
    this.setMapObjects(this._Model.getRegions());
};

taxVP._onActiveTaxonomySet = function (sender) {
    this.setMapObjects(this._Model.getActiveTaxonomy());
};

taxVP._onActiveStatisticSet = function () {
    this._ActiveStatistic = this._Model.getActiveStatistic();

    this._ActiveStatistic.CurrentPeriodSet.remove(this._onCurrentPeriodSet);
    this._ActiveStatistic.CycleCancelled.remove(this._onCycleCancelled);
    this._ActiveStatistic.CurrentPeriodSet.add(this._onCurrentPeriodSet, this);
    this._ActiveStatistic.CycleCancelled.add(this._onCycleCancelled, this);
};

taxVP._onFocusedObjectSet = function () {
    this.setMapObjects(this._Model.getActiveTaxonomy());
    // center map on new object
    var fObject = this._Model.getFocusedObject();
    if (fObject) {
        this._Map.setView(fObject.center, 7);
    } else {
        this._Map.setView([this._Model.getConfig().view.lat, this._Model.getConfig().view.lng], 6);
    }
};

taxVP._onCurrentPeriodSet = function () {
    var currentPeriod  = this._ActiveStatistic.getCurrentPeriod();

    this.setStatisticValues(currentPeriod.values);

    this.setMapObjects(this._Model.getActiveTaxonomy());
};

taxVP._onCycleCancelled = function () {
    this.setStatisticValues(null);

    this.setMapObjects(this._Model.getActiveTaxonomy());
};

taxVP._onTaxonomyObjectClick = function (objectName) {
    this._Taxonomy_Options_Modal.set_Object_Name(objectName);
    this._Taxonomy_Options_Modal.show();
};

/**
 * Returns array of Leaflet objects ready to add to map
 * @returns {undefined}
 */
taxVP.setMapObjects = function(regionsConfig) {
    this._TaxonomyObjectGroup.clearLayers();

    for (var i = 0; i < regionsConfig.length; i++) {
        var taxonomyObject = L.multiPolygon(regionsConfig[i].shape);

        // define styles
        var rate;
        if (this._Model.getFocusedObjectName() !== regionsConfig[i].name && $.inArray(this._Model.getFocusedObjectName(), regionsConfig[i].parents) === -1) {
            // focused object is not current and is not in list of parents - should be grayed out
            rate = "overlay";
            // I've reconsidered. It should not be added to map at all
            continue;
        }
        else if (this._findStatisticByObjectName(regionsConfig[i].name)) {
            rate = this._getStatisticValueRate(this._findStatisticByObjectName(regionsConfig[i].name).value);
        }
        else {
            rate = 0;
        }
        taxonomyObject.setStyle(this._getObjectStyleByRate(rate));

        // add events
        if (regionsConfig[i].focusable) {
            taxonomyObject.on('click', $.proxy(this._onTaxonomyObjectClick, this, regionsConfig[i].name));
        }

        this._TaxonomyObjectGroup.addLayer(taxonomyObject);
    }

    this._TaxonomyObjectGroup.addTo(this._Map);
};

/**
 * Add statistic value to display to taxonomy objects
 * Pass null or empty array to display no statistic
 * @param {type} statistic (not period, but just a values to display)
 * @returns {undefined}
 */
taxVP.setStatisticValues = function(statisticValues) {
    this._StatisticValues = [];

    if (!statisticValues)
        return;

    $.each(statisticValues, $.proxy(function(index, statistic) {
        this._StatisticValues[statistic.object] = statistic;
    }, this));
};

taxVP._findStatisticByObjectName = function(objectName) {
    if (this._StatisticValues[objectName]) {
        return this._StatisticValues[objectName]
    } else {
        return false;
    }
};

taxVP._getStatisticValueRate = function(value) {
    var statisticData = this._ActiveStatistic.getData();
    for (var i = 0; i < statisticData.range.length; i++) {
        if (value >= statisticData.range[i].min && value <= statisticData.range[i].max) {
            return statisticData.range[i].rate;
        }
    }

    // if nothing found
    return 0;
};

taxVP._getObjectStyleByRate = function(rate) {
    var config = SM.App.getModel().getConfig()

    for (var i = 0; i < config.rates.length; i++) {
        if (rate === config.rates[i].value) {
            return config.rates[i].polyStyle;
        }
    }

    // if nothing found
    return {
        "fill": false,
        "fillColor": null,
        "fillOpacity": 0,
        "stroke": true,
        "color": "red",
        "dashArray": "3, 2",
        "weight": 2
    };
};

taxVP = null;
