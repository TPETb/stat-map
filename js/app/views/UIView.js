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

    this._ToolbarBottom = null;

    this._LayersMenu = null;
    this._StatisticsShowBtn = null;
    this._StatisticsMenu = null;
    this._PeriodsBtn = null;
    this._PeriodsMenu = null;
    this._TableBtn = null;
    this._TableMenu = null;

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
    this._ToolbarBottom = $('<div id="ToolbarBottom">');
    this._ParentNode.append(this._ToolbarBottom);

    this._LayersMenu = $('<ul id="LayersMenu">');
    this._LayersMenu.menu();
    this._ParentNode.append(this._LayersMenu);

    this._StatisticsShowBtn = $('<button id="StatisticsShowBtn">Статистика</button>');
    this._StatisticsShowBtn.button();
    this._ToolbarBottom.append(this._StatisticsShowBtn);
    
    this._StatisticsHideBtn = $('<button id="StatisticsHideBtn">Убрать статистику</button>');
    this._StatisticsHideBtn.button();
    this._ToolbarBottom.append(this._StatisticsHideBtn);

    this._StatisticsMenu = $('<ul id="StatisticsMenu">');
    this._StatisticsMenu.menu();
    this._ParentNode.append(this._StatisticsMenu);
    this._StatisticsMenu.hide();

    this._PeriodsBtn = $('<button id="PeriodsBtn">Периоды</button>');
    this._PeriodsBtn.button();
    this._ToolbarBottom.append(this._PeriodsBtn);
    this._PeriodsBtn.hide();

    this._PeriodsMenu = $('<ul id="PeriodsMenu">');
    this._PeriodsMenu.menu();
    this._ParentNode.append(this._PeriodsMenu);
    this._PeriodsMenu.hide();

    this._TableBtn = $('<button id="TableBtn">Таблица</button>');
    this._TableBtn.button();
    this._ToolbarBottom.append(this._TableBtn);
    this._TableBtn.hide();

    this._TableMenu = $('<ul id="TableMenu">');
    this._TableMenu.menu();
    this._ParentNode.append(this._TableMenu);
    this._TableMenu.hide();

};

uiViewP._addEventListeners = function () {
    this._Model.LayersListRetrieved.add(this._onLayersListRetrieved, this);
    this._Model.StatisticsListRetrieved.add(this._onStatisticsListRetrieved, this);

    this._StatisticsShowBtn.on('click', $.proxy(this._onStatisticsShowBtnClick, this));
    this._StatisticsHideBtn.on('click', $.proxy(this._onStatisticHideBtnClick, this));
    this._PeriodsBtn.on('click', $.proxy(this._onPeriodsBtnClick, this));
    this._TableBtn.on('click', $.proxy(this._onTableBtnClick, this));

    this.StatisticShowDemanded.add(this._onStatisticShowDemanded, this);
    this.StatisticHideDemanded.add(this._onStatisticHideDemanded, this);
};

uiViewP._onLayersListRetrieved = function () {
    this.addLayersMenuItems(this._Model.getLayers());
}

uiViewP._onStatisticsListRetrieved = function () {
    this.addStatisticsMenuItems(this._Model.getStatistics());
};

uiViewP._onStatisticsShowBtnClick = function () {
    this._StatisticsMenu.toggle();
};

uiViewP._onPeriodsBtnClick = function () {

};

uiViewP._onTableBtnClick = function () {

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
        item.find('a').attr({ })
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
        this.LayerShowDemanded.fire(this, $(event.target).attr('name'));
    } else {
        this.LayerHideDemanded.fire(this, $(event.target).attr('name'));
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

uiViewP.hideStatistic = function () {
    
};

uiViewP._onStatisticMenuItemClick = function (statistic, event) {
    $(event.target).addClass('active');
    this.StatisticShowDemanded.fire(this, {"statistic": statistic});
    this._StatisticsMenu.hide();
};

uiViewP._onStatisticShowDemanded = function () {
    this._PeriodsBtn.show();
};

uiViewP._onStatisticHideBtnClick = function (event) {
    this.StatisticHideDemanded.fire(this);
};

uiViewP._onStatisticHideDemanded = function () {
    this._PeriodsBtn.hide();
};

uiViewP = null;