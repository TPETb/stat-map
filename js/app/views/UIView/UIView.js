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

    // Toolbar controls
    this._StatisticsBtn = null;
    this._StatisticsCancelBtn = null;
    this._PeriodsBtn = null;

    // Complex controls
    this._LayersMenu = null;
    this._StatisticsMenuView = null;
    this._PeriodsView = null;

    // Layers events
    this.LayerHideDemanded = new TVL.Event();
    this.LayerShowDemanded = new TVL.Event();

    this.StatisticShowDemanded = new TVL.Event();
    this.StatisticCancelDemanded = new TVL.Event();

    this.StatisticCycleStartDemanded = new TVL.Event();
    this.StatisticCycleStopDemanded = new TVL.Event();
    this.StatisticCyclePauseDemanded = new TVL.Event();
    this.StatisticCycleCancelDemanded = new TVL.Event();

    this.init(options);
};

var uiViewP = SM.UIView.prototype;

uiViewP.init = function (options) {
    this._render();
    this._addEventListeners();
};

uiViewP._render = function () {
    this._StatisticsBtn = $('<button type="button" class="btn btn-default" id="StatisticsBtn">Статистика</button>');
    this._ToolbarTop.append(this._StatisticsBtn);

    this._StatisticsCancelBtn = $('<button type="button" class="btn btn-default" id="StatisticsCancelBtn">Убрать статистику</button>');
    this._ToolbarTop.append(this._StatisticsCancelBtn);
    this._StatisticsCancelBtn.hide();

    this._PeriodsBtn = $('<button type="button" class="btn btn-default" id="PeriodsBtn">Периоды</button>');
    this._ToolbarTop.append(this._PeriodsBtn);
    this._PeriodsBtn.hide();

    this._LayersMenu = $('<ul id="LayersMenu">');
    this._LayersMenu.menu();
    this._Body.append(this._LayersMenu);

    this._StatisticsMenuView = new SM.StatisticsMenuView({ model: this._Model });

    this._PeriodsView = new SM.PeriodsView({ model: this._Model });
};

uiViewP._addEventListeners = function () {
    this._Model.LayersListRetrieved.add(this._onLayersListRetrieved, this);
    this._Model.StatisticsListRetrieved.add(this._onStatisticsListRetrieved, this);
    this._Model.StatisticRetrieved.add(this._onStatisticRetrieved, this);

    this._StatisticsBtn.on('click', $.proxy(this._onStatisticsBtnClick, this));
    this._StatisticsCancelBtn.on('click', $.proxy(this._onStatisticsCancelBtnClick, this));
    this._PeriodsBtn.on('click', $.proxy(this._onPeriodsBtnClick, this));

    this._StatisticsMenuView.ItemChecked.add(this._onStatisticsMenuItemChecked, this);

    this._PeriodsView.StatisticCycleStartDemanded.add(this._onStatisticCycleStartDemanded, this);
    this._PeriodsView.StatisticCycleStopDemanded.add(this._onStatisticCycleStopDemanded, this);
};

uiViewP._onLayersListRetrieved = function () {
    this.addLayersMenuItems(this._Model.getLayers());
};

uiViewP._onStatisticsListRetrieved = function () {
    this._StatisticsMenuView.addStatisticsMenuItems(this._Model.getStatistics());
};

uiViewP._onStatisticRetrieved = function (sender, statisticName) {
    this._PeriodsView.addPeriodsMenuItems(this._Model.getActiveStatistic().data.periods);
};

uiViewP._onStatisticsBtnClick = function () {
    this._PeriodsView.hideModals();
    this._StatisticsMenuView.toggle();
};

uiViewP._onStatisticsCancelBtnClick = function () {
    this._StatisticsCancelBtn.hide();
    this._PeriodsBtn.hide();

    this._StatisticsMenuView.hide();
    this._PeriodsView.hide();

    this.StatisticCancelDemanded.fire(this);
};

uiViewP._onPeriodsBtnClick = function () {
    this._StatisticsMenuView.hide();
    this._PeriodsView.toggle();
};

uiViewP._onStatisticsMenuItemChecked = function (sender, statisticName) {
    this._StatisticsCancelBtn.show();
    this._PeriodsBtn.show();

    this.StatisticCycleStopDemanded.fire(this);
    this.StatisticShowDemanded.fire(this, statisticName);
};

uiViewP._onStatisticCycleStartDemanded = function () {
    this.StatisticCycleStartDemanded.fire(this);
};

uiViewP._onStatisticCycleStopDemanded = function () {
    this.StatisticCycleStopDemanded.fire(this);
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

uiViewP.getPeriodsView = function () {
    return this._PeriodsView;
};

uiViewP.getStatisticsMenuView = function () {
    return this._StatisticsMenuView;
};

uiViewP.getLayersView = function () {
    return this._LayersView;
};

uiViewP.cancelStatistic = function () {
    this._StatisticsMenuView.cancelChecked();
};

uiViewP.hideModals = function () {
    this._StatisticsMenuView.hide();
    this._PeriodsView.hideModals();
};

uiViewP = null;

