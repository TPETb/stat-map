/*
 * Statistics Map name space
 */
if (!SM) {
    var SM = {};
}

/*
 * type: View class
 */
SM.UIView = function (options) {
    this._Model = options.model;

    this._ParentNode = $('body');
    this._LayersMenu = null;
    this._StatisticsBtn = null;
    this._StatisticsMenu = null;

    this._layers = {};

    // Layers events
    this.LayerHideDemanded = new TVL.Event();
    this.LayerShowDemanded = new TVL.Event();

    // Statistics events
    this.StatisticShowDemanded = new TVL.Event();
    this.StatisticHideDemanded = new TVL.Event();

    this.init(options);
};

var uiViewP = SM.UIView.prototype;

/**
 * Initializes everything that doesn't need additional data
 * @param {type} config
 * @returns {uiViewP}
 */
uiViewP.init = function (options) {
    this._render();
    this._addEventListeners();
};

uiViewP._render = function () {
    this._LayersMenu = $('<ul id="LayersMenu">');
    this._LayersMenu.menu();
    this._ParentNode.append(this._LayersMenu);

    this._StatisticsBtn = $('<button id="StatisticsBtn">Статистика</button>');
    this._StatisticsBtn.button();
    this._ParentNode.append(this._StatisticsBtn);

    this._StatisticsMenu = $('<ul id="StatisticsMenu">');
    this._StatisticsMenu.menu();
    this._ParentNode.append(this._StatisticsMenu);
    this._StatisticsMenu.hide();
};

uiViewP._addEventListeners = function () {
    this._Model.LayersListRetrieved.add(this._onLayersListRetrieved, this);
    this._Model.StatisticsListRetrieved.add(this._OnStatisticsListRetrieved, this);

    this._StatisticsBtn.on('click', $.proxy(this._onStatisticsBtnClick, this));
};

uiViewP._onLayersListRetrieved = function () {
    this.addLayersMenuItems(this._Model.getLayers());
}

uiViewP._OnStatisticsListRetrieved = function () {
    this.addStatisticsMenuItems(this._Model.getStatisticsList());
};

uiViewP._onStatisticsBtnClick = function () {
    this._StatisticsMenu.toggle();
};

uiViewP.addLayersMenuItems = function (layersConfig) {
    for (var i = 0; i < layersConfig.length; i++) {
        var item = $('<li><a href="#"><input type="checkbox"/><span></span></a></li>');
        item.find('input').attr({
            name: layersConfig[i].name,
            checked: layersConfig[i].active,
            disabled: layersConfig[i].forced
        })
            // add event listener right here as it is just DOM event
            .on('change', $.proxy(this._onLayerChange, this));
        item.find('span').text(layersConfig[i].title);
        item.appendTo(this._LayersMenu);
    }
    this._LayersMenu.menu('refresh');
};

uiViewP.addStatisticsMenuItems = function (statisticsConfig) {
    for (var i = 0; i < statisticsConfig.length; i++) {
        var item = $('<li><a href="#"></a></li>');
        item.find('a').attr({
        })
            .text(statisticsConfig[i].title)
            // add event listener right here as it is just DOM event
            .on('click', $.proxy(this._onStatisticMenuItemClick, this, statisticsConfig[i]));
        item.appendTo(this._StatisticsMenu);
    }
    this._StatisticsMenu.menu('refresh');
};

/**
 * Escalate demand for layer state change
 * @param {type} input
 * @returns {undefined}
 */
uiViewP._onLayerChange = function (event) {
    if ($(event.target).is(':checked')) {
        this.LayerShowDemanded.fire(this, $(this).attr('name'));
    } else {
        this.LayerHideDemanded.fire(this, $(this).attr('name'));
    }
};

uiViewP.hideLayer = function (layerName) {

};

uiViewP.showLayer = function (layerName) {

};

uiViewP.removeLayers = function () {

};

uiViewP.forceLayer = function (layerName) {

};

uiViewP.unforceLayer = function (layerName) {

};

uiViewP._onStatisticMenuItemClick = function (statistic, event) {
    $(event.target).addClass('active');
    this.StatisticShowDemanded.fire(this, {"statistic": statistic});
};

uiViewP = null;