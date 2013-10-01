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

    this._Body = $('body');
    this._ToolbarTop = $('#ToolbarTop');
    this._ContentWrapper = $('#ContentWrapper');

    this._LayersMenu = null;
    this._StatisticsShowBtn = null;
    this._StatisticsHideBtn = null;
    this._StatisticsMenu = null;

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
    this._Body.append(this._LayersMenu);

    this._StatisticsShowBtn = $('<button type="button" class="btn btn-default" id="StatisticsShowBtn">Статистика</button>');
    this._ToolbarTop.append(this._StatisticsShowBtn);

    this._StatisticsHideBtn = $('<button type="button" class="btn btn-default" id="StatisticsHideBtn">Убрать статистику</button>');
    this._ToolbarTop.append(this._StatisticsHideBtn);

    this._StatisticsMenu = $('<ul id="StatisticsMenu" class="menu-std">');
    this._StatisticsMenu.menu();
    this._ContentWrapper.append(this._StatisticsMenu);
    this._StatisticsMenu.hide();

    this._PeriodsView = new SM.PeriodsView({ model: this._Model });
};

uiViewP._addEventListeners = function () {
    this._Model.LayersListRetrieved.add(this._onLayersListRetrieved, this);
    this._Model.StatisticsListRetrieved.add(this._onStatisticsListRetrieved, this);
    this._Model.StatisticRetrieved.add(this._onStatisticRetrieved, this);

    this._StatisticsShowBtn.on('click', $.proxy(this._onStatisticsShowBtnClick, this));
    this._StatisticsHideBtn.on('click', $.proxy(this._onStatisticHideBtnClick, this));

    this.StatisticHideDemanded.add(this._onStatisticHideDemanded, this);
    this._PeriodsView.PeriodsShowDemanded.add(this._onPeriodsShowDemanded, this);
};

uiViewP._onLayersListRetrieved = function () {
    this.addLayersMenuItems(this._Model.getLayers());
}

uiViewP._onStatisticsListRetrieved = function () {
    this.addStatisticsMenuItems(this._Model.getStatistics());
};

uiViewP._onStatisticsShowBtnClick = function () {
    this._PeriodsView.hide();
    this._StatisticsMenu.toggle();
};

uiViewP._onPeriodsShowDemanded = function () {
    this._StatisticsMenu.hide();
};

uiViewP.addLayersMenuItems = function (layersConfig) {
    this._LayersMenu.html('');
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
    this._StatisticsMenu.html('');

    this._addStatisticsMenuItems(this._StatisticsMenu, statisticsConfig);

    this._StatisticsMenu.menu('refresh');
};

uiViewP._addStatisticsMenuItems = function (jNode, statisticsConfig) {
    for (var i = 0; i < statisticsConfig.length; i++) {
        if (statisticsConfig[i].items) {
            var item = $('<li></li>');
            var itemTitle = $('<a href="#">' + statisticsConfig[i].title + '</a>');
            var subMenu = $('<ul></ul>');

            itemTitle.appendTo(item);
            subMenu.appendTo(item);
            item.appendTo(jNode);

            this._addStatisticsMenuItems(subMenu, statisticsConfig[i].items);
        }
        else {
            var item = $('<li><a href="#">' + statisticsConfig[i].title + '</a></li>');
            item.find('a').on('click', $.proxy(this._onStatisticMenuItemClick, this, statisticsConfig[i].name));
            item.appendTo(jNode);
        }
    }
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

uiViewP.hideStatistic = function () {

};

uiViewP._onStatisticRetrieved = function (sender, statisticName) {
    this._PeriodsView.showStatistic(statisticName);
};

uiViewP._onStatisticMenuItemClick = function (statisticName, event) {
    this._StatisticsMenu.find('li.ui-menu-item a').each(function () {
        $(this).removeClass('active');
    });
    $(event.target).addClass('active');
    this.StatisticShowDemanded.fire(this, statisticName);
    this._StatisticsMenu.hide();
};

uiViewP._onStatisticHideBtnClick = function () {
    this._StatisticsMenu.hide();
    this._PeriodsView.hide();
    this.StatisticHideDemanded.fire(this);
};

uiViewP._onStatisticHideDemanded = function () {
    this._PeriodsView.hide();
};

uiViewP.getPeriodsView = function () {
    return this._PeriodsView;
};

uiViewP = null;