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
    this._Toolbar6 = $('#Toolbar6');
    this._Toolbar7 = $('#Toolbar7');

    this._ContentWrapper = $('#ContentWrapper');
    this._Footer = $('#Footer > .inner');

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

    this._StatisticsBtn = $('<button type="button" class="btn btn-warning btn-lg" id="StatisticsBtn"><span class="glyphicon icon-bar-chart"></span> Статистика</button>');
    this._StatisticsCancelBtn = $('<button type="button" class="btn btn-warning btn-lg" id="StatisticsCancelBtn"><span class="glyphicon icon-map-marker"></span> Геокарта</button>');
    this._TransportBtn = $('<button type="button" class="btn btn-warning btn-lg" id="TransportBtn"><span class="glyphicon icon-random"></span> Транспорт и коммуникации</button>');
    this._TourismBtn = $('<button type="button" class="btn btn-warning btn-lg" id="TourismBtn"><span class="glyphicon icon-plane"></span> Туризм</button>');
    this._TradeBtn = $('<button type="button" class="btn btn-warning btn-lg" id="TradeBtn"><span class="glyphicon icon-refresh"></span> Внешняя торговля</button>');
    this._LayersBtn = $('<button type="button" class="btn btn-warning" id="LayersBtn"><span class="glyphicon icon-check"></span> Слои</button>');

    this._StatisticsCancelBtn.hide();

    this._Toolbar1.append(this._StatisticsBtn);
    this._Toolbar1.append(this._StatisticsCancelBtn);
    this._Toolbar1.append(this._TransportBtn);
    this._Toolbar1.append(this._TourismBtn);
    this._Toolbar1.append(this._TradeBtn);
    this._Toolbar7.append(this._LayersBtn);

    this._LayersMenu = $('<ul id="LayersMenu" class="menu-std">');
    this._Toolbar6.append(this._LayersMenu);

    this._PeriodsView = new SM.PeriodsView({ model: this._Model });

    this._FooterTitle = this._Footer.find('p.title');
    this._FooterTitle1 = $('<span class="title1">Интерактивная карта Туркменистана</span>');
    this._FooterTitle2 = $('<span class="title2"></p>');
    this._FooterTerritory = $('<p class="territory"></p>');
    this._FooterPeriod = $('<p class="period"></p>');
    this._FooterValue = $('<p class="value"></p>');
    this._FooterTitle.append(this._FooterTitle1);
    this._FooterTitle.append(this._FooterTitle2);
    this._Footer.append(this._FooterTerritory);
    this._Footer.append(this._FooterPeriod);
    this._Footer.append(this._FooterValue);
    this._FooterTitle2.hide();
    this._FooterTerritory.hide();
    this._FooterPeriod.hide();
    this._FooterValue.hide();
};

uiViewP._addEventListeners = function () {
    this._Model.StatisticsListRetrieved.add(this._onStatisticsListRetrieved, this);
    this._Model.LayersListRetrieved.add(this._onLayersListRetrieved, this);
    this._Model.ActiveStatisticSet.add(this._onActiveStatisticSet, this);

    this._StatisticsBtn.on('click', $.proxy(this._onStatisticsBtnClick, this));
    this._StatisticsCancelBtn.on('click', $.proxy(this._onStatisticsCancelBtnClick, this));
    this._MapTypeBtn.StateChanged.add(this._onMapTypeBtnStateChanged, this);
    this._LayersBtn.on('click', $.proxy(this._onLayersBtnClick, this));

    this._PeriodsView.PeriodsBtnClick.add(this._onPeriodsBtnClick, this);
};


uiViewP.focusObject = function (objectName) {
    this._FocusedObject = objectName;
    this._PeriodsView.focusObject(objectName);
    }
uiViewP._onStatisticsListRetrieved = function () {
    this._StatisticsMenuView = new SM.StatisticsMenuView({ model: this._Model.getStatistics() });

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

    this._FooterTitle1.html('Интерактивная карта Туркменистана');
    this._FooterTitle2.hide();
    this._FooterTerritory.hide();
    this._FooterPeriod.hide();
    this._FooterValue.hide();
    this._Model.setActiveStatistic(null);
};

uiViewP._onMapTypeBtnStateChanged = function () {
    this._Model.setActiveTaxonomy(this._MapTypeBtn.getState());
};

uiViewP._onLayersBtnClick = function () {
    this._LayersMenu.toggle();
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
    this._StatisticsMenuView.hide();

    var modelLastParent = this._ActiveStatistic.getLastParent();
    var modelParent = this._ActiveStatistic.getParent();
    if (modelLastParent.getName() === modelParent.getName()) {
        this._FooterTitle1.html(this._ActiveStatistic.getTitle());
        this._FooterTitle2.hide();
    }
    else {
        if (modelLastParent.getName() === 'indicator-8') {
            // цены
            this._FooterTitle1.html(modelLastParent.getTitle());
        }
        else {
            // сэр
            this._FooterTitle1.html(modelParent.getTitle());
        }
        this._FooterTitle2.html('&nbsp;/&nbsp;' + this._ActiveStatistic.getTitle());
        this._FooterTitle2.show();
    }

    this._FooterTerritory.hide();
    this._FooterPeriod.hide();
    this._FooterValue.hide();
};

uiViewP.addLayersMenuItems = function (layersConfig) {
    this._LayersMenu.html('');
    for (var i = 0; i < layersConfig.length; i++) {
        var item = $('<li><input type="checkbox"/><span></span></li>');
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
};

uiViewP._onCurrentPeriodSet = function () {
    var currentPeriod = this._ActiveStatistic.getCurrentPeriod();
    this._FooterPeriod.html(currentPeriod.title);
    this._FooterPeriod.show();
    if (this._Model.getFocusedObject() === 'welayat') {

    }
    else {
        this._FooterTerritory.html('Туркменистан');
        this._FooterTerritory.show();
        for (var i = 0; i < currentPeriod.values.length; i++) {
            if (currentPeriod.values[i].object === 'turkmenistan') {
                this._FooterValue.html(currentPeriod.values[i].value);
                this._FooterValue.show();
                break;
            }
        }
    }
};

uiViewP._onCycleCancelled = function () {
    this._FooterTerritory.hide();
    this._FooterPeriod.hide();
    this._FooterValue.hide();
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

