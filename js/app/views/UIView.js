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
    this._LayersMenu = $('<ul id="LayersMenu">');
    this._LayersMenu.menu();
    this._ParentNode.append(this._LayersMenu);

    this._StatisticsBtn = $('<button id="StatisticsBtn">Статистика</button>');
    this._StatisticsBtn.button();
    this._ParentNode.append(this._StatisticsBtn);
    
    this._StatisticsHideBtn = $('<button id="StatisticsHideBtn">Убрать статистику</button>');
    this._StatisticsHideBtn.button();
    this._ParentNode.append(this._StatisticsHideBtn);

    this._StatisticsMenu = $('<ul id="StatisticsMenu">');
    this._StatisticsMenu.menu();
    this._ParentNode.append(this._StatisticsMenu);
    this._StatisticsMenu.hide();

    this._PeriodsBtn = $('<button id="PeriodsBtn">Периоды</button>');
    this._PeriodsBtn.button();
    this._ParentNode.append(this._PeriodsBtn);

    this._PeriodsMenu = $('<ul id="PeriodsMenu">');
    this._PeriodsMenu.menu();
    this._ParentNode.append(this._PeriodsMenu);

    this._TableBtn = $('<button id="TableBtn">Таблица</button>');
    this._TableBtn.button();
    this._ParentNode.append(this._TableBtn);

    this._TableMenu = $('<ul id="TableMenu">');
    this._TableMenu.menu();
    this._ParentNode.append(this._TableMenu);


};

uiViewP._addEventListeners = function () {
    this._Model.LayersListRetrieved.add(this._onLayersListRetrieved, this);
    this._Model.StatisticsListRetrieved.add(this._OnStatisticsListRetrieved, this);

    this._StatisticsBtn.on('click', $.proxy(this._onStatisticsBtnClick, this));
    this._StatisticsHideBtn.on('click', $.proxy(this._onStatisticHideButtonClick, this));
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
    this._StatisticsMenu.toggle();
};

uiViewP._onStatisticHideButtonClick = function (event) {
    this.StatisticHideDemanded.fire(this);
};

uiViewP = null;