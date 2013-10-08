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
    this._NavBar = $('<nav id="UINavBar" class="navbar navbar-default" role="navigation">' +
        '<div class="collapse navbar-collapse navbar-ex1-collapse">' +
            '<div class="btn-group" data-toggle="buttons">' +
                '<label id="WelayatsBtn" class="btn btn-info active">' +
                    '<input type="radio"> Велаяты' +
                '</label>' +
                '<label id="EtrapsBtn" class="btn btn-info">' +
                    '<input type="radio"> Этрапы' +
                '</label>' +
            '</div>' +
            '<button type="button" class="btn btn-default navbar-btn" id="StatisticsBtn"><span class="glyphicon glyphicon-stats"></span> Статистика</button>' +
            '<button type="button" class="btn btn-danger navbar-btn" id="StatisticsCancelBtn"><span class="glyphicon glyphicon-ban-circle"></span> Убрать статистику</button>' +
        '</div>' +
    '</nav>');
    this._Body.append(this._NavBar);

    this._StatisticsBtn = $('#StatisticsBtn');
    this._StatisticsCancelBtn = $('#StatisticsCancelBtn');
    this._StatisticsCancelBtn.hide();

    this._WelayatsBtn = $('#WelayatsBtn');
    this._EtrapsBtn = $('#EtrapsBtn');

    this._LayersMenu = $('<ul id="LayersMenu">');
    this._LayersMenu.menu();
    this._Body.append(this._LayersMenu);

    this._StatisticsMenuView = new SM.StatisticsMenuView({ model: this._Model });

    this._PeriodsView = new SM.PeriodsView({ model: this._Model });
    this._NavBarTitle = $('<p class="navbar-text"></p>');
    $('#UINavBar .navbar-collapse').append(this._NavBarTitle);
    this._NavBarPeriod = $('<p class="navbar-text period"></p>');
    $('#UINavBar .navbar-collapse').append(this._NavBarPeriod);
};

uiViewP._addEventListeners = function () {
    this._Model.LayersListRetrieved.add(this._onLayersListRetrieved, this);
    this._Model.ActiveStatisticSet.add(this._onActiveStatisticSet, this);

    this._StatisticsBtn.on('click', $.proxy(this._onStatisticsBtnClick, this));
    this._StatisticsCancelBtn.on('click', $.proxy(this._onStatisticsCancelBtnClick, this));
    this._WelayatsBtn.on('click', $.proxy(this._onWelayatsBtnClick, this));
    this._EtrapsBtn.on('click', $.proxy(this._onEtrapsBtnClick, this));

    this._PeriodsView.PeriodsBtnClick.add(this._onPeriodsBtnClick, this);
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

uiViewP._onWelayatsBtnClick = function () {
    if (this._WelayatsBtn.hasClass('active')) {
        return;
    }
    this._Model.setActiveTaxonomy('welayats');
};

uiViewP._onEtrapsBtnClick = function () {
    if (this._EtrapsBtn.hasClass('active')) {
        return;
    }
    this._Model.setActiveTaxonomy('etraps');
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

