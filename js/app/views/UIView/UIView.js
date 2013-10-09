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
    this._FocusedObject = options.focusedObject;

    this._Body = $('body');
    this._Toolbar1 = $('#Toolbar1');
    this._Toolbar2 = $('#Toolbar2');
    this._Toolbar3 = $('#Toolbar3');
    this._Toolbar4 = $('#Toolbar4');
    this._Toolbar5 = $('#Toolbar5');
    this._ContentWrapper = $('#ContentWrapper');
    this._Footer = $('#Footer');

    // Toolbar controls
    this._StatisticsBtn = null;
    this._StatisticsCancelBtn = null;

    // Complex controls
    this._LayersMenu = null;
    this._StatisticsMenuView = null;
    this._PeriodsView = null;

    // Layers events
    this.LayerHideDemanded = new TVL.Event();
    this.LayerShowDemanded = new TVL.Event();

    this.init(options);
};

var uiViewP = SM.UIView.prototype;

uiViewP.init = function (options) {
    this._render();
    this._addEventListeners();
};

uiViewP._render = function () {
    this._MapTypeBtn = new SM.MapTypeBtn();
    this._MapTypeBtn.setState('welayats');

    this._StatisticsBtn = $('<button type="button" class="btn btn-default navbar-btn" id="StatisticsBtn"><span class="glyphicon glyphicon-stats"></span> Статистика</button>');
    this._StatisticsCancelBtn = $('<button type="button" class="btn btn-danger navbar-btn" id="StatisticsCancelBtn"><span class="glyphicon glyphicon-ban-circle"></span> Убрать статистику</button>');
    this._StatisticsCancelBtn.hide();

    this._Toolbar1.append(this._StatisticsBtn);
    this._Toolbar1.append(this._StatisticsCancelBtn);

    this._LayersMenu = $('<ul id="LayersMenu">');
    this._LayersMenu.menu();
    this._Body.append(this._LayersMenu);

    this._StatisticsMenuView = new SM.StatisticsMenuView({ model: this._Model });

    this._PeriodsView = new SM.PeriodsView({
        model: this._Model,
        focusedObject: this._FocusedObject
    });
    this._NavBarTitle = $('<p class="navbar-text"></p>');
    this._Footer.append(this._NavBarTitle);
    this._NavBarPeriod = $('<p class="navbar-text period"></p>');
    this._Footer.append(this._NavBarPeriod);
};

uiViewP._addEventListeners = function () {
    this._Model.LayersListRetrieved.add(this._onLayersListRetrieved, this);
    this._Model.ActiveStatisticSet.add(this._onActiveStatisticSet, this);

    this._StatisticsBtn.on('click', $.proxy(this._onStatisticsBtnClick, this));
    this._StatisticsCancelBtn.on('click', $.proxy(this._onStatisticsCancelBtnClick, this));
    this._MapTypeBtn.StateChanged.add(this._onMapTypeBtnStateChanged, this);

    this._PeriodsView.PeriodsBtnClick.add(this._onPeriodsBtnClick, this);
};

uiViewP.focusObject = function (objectName) {
    this._FocusedObject = objectName;
    this._PeriodsView.focusObject(objectName);
};

uiViewP._onLayersListRetrieved = function () {
    this.addLayersMenuItems(this._Model.getLayers());
};

uiViewP._onStatisticsBtnClick = function () {
    this._PeriodsView.hideModals();
    this._StatisticsMenuView.toggle();
};

uiViewP._onStatisticsCancelBtnClick = function () {
    this._StatisticsCancelBtn.hide();
    this._StatisticsMenuView.hide();
    this._StatisticsMenuView.setActive(false);
    this._PeriodsView.hide();

    this._NavBarTitle.html('');
    this._NavBarPeriod.html('');
    this._Model.setActiveStatistic(null);
};

uiViewP._onMapTypeBtnStateChanged = function () {
    this._Model.setActiveTaxonomy(this._MapTypeBtn.getState());
};



uiViewP._onPeriodsBtnClick = function () {
    this._StatisticsMenuView.hide();
};

uiViewP._onActiveStatisticSet = function (sender) {
    this._ActiveStatistic = this._Model.getActiveStatistic();

    this._ActiveStatistic.CurrentPeriodSet.remove(this._onCurrentPeriodSet);
    this._ActiveStatistic.CurrentPeriodSet.add(this._onCurrentPeriodSet, this);
    this._ActiveStatistic.CycleCancelled.remove(this._onCycleCancelled);
    this._ActiveStatistic.CycleCancelled.add(this._onCycleCancelled, this);

    this._StatisticsCancelBtn.show();
    this._PeriodsView.show();

    this._NavBarTitle.html(this._ActiveStatistic.getTitle());
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

uiViewP._onCurrentPeriodSet = function () {
    this._NavBarPeriod.html(this._ActiveStatistic.getCurrentPeriod().title);
};

uiViewP._onCycleCancelled = function () {
    this._NavBarPeriod.html('');
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

uiViewP.hideModals = function () {
    this._StatisticsMenuView.hide();
    this._PeriodsView.hideModals();
};

uiViewP = null;

