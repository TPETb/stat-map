/*
 * Statistics Map name space
 */
if (!SM) {
    var SM = {};
}

/*
 * type: View class
 */
SM.PeriodsView = function (options) {
    this._Model = options.model;

    this._Body = $('body');
    this._ToolbarTop = $('#ToolbarTop');
    this._ContentWrapper = $('#ContentWrapper');

    this._PeriodsBtn = null;
    this._PeriodsMenu = null;
    this._TableBtn = null;
    this._Table = null;
    this._StopPlayBtn = null;

    this._ActiveStatistic = null;

    this.PeriodsShowDemanded = new TVL.Event();
    this.PeriodsChangeDemanded = new TVL.Event();
    this.StatisticCicleStopDemanded = new TVL.Event();
    this.StatisticCicleStartDemanded = new TVL.Event();

    this._render();
    this._addEventListeners();
};

var periodsVP = SM.PeriodsView.prototype;

periodsVP._render = function () {
    this._PeriodsBtn = $('<button type="button" class="btn btn-default" id="PeriodsBtn">Периоды</button>');
    this._ToolbarTop.append(this._PeriodsBtn);
    this._PeriodsBtn.hide();

    this._PeriodsMenu = $('<ul id="PeriodsMenu" class="menu-std">');
    this._PeriodsMenu.menu();
    this._ContentWrapper.append(this._PeriodsMenu);
    this._PeriodsMenu.hide();

    this._TableBtn = $('<button type="button" class="btn btn-default" id="TableBtn">Таблица</button>');
    this._ToolbarTop.append(this._TableBtn);
    this._TableBtn.hide();

    this._StopPlayBtn = new SM.StopPlayBtn();
    this._StopPlayBtn.hide();

    this._Table = $('<div id="Table">' +
        '<table class="table">' +
        '<thead>' +
        '<tr>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '</tbody>' +
        '</table>' +
        '</div>');
    this._ContentWrapper.append(this._Table);
    this._Table.hide();
};

periodsVP._addEventListeners = function () {
    this._PeriodsBtn.on('click', $.proxy(this._onPeriodsBtnClick, this));
    this._TableBtn.on('click', $.proxy(this._onTableBtnClick, this));
    this._StopPlayBtn.Click.add(this._onStopPlayClick, this);
};

periodsVP._onStopPlayClick = function () {
    if (this._StopPlayBtn.getState() === 'active') {
        this.StatisticCicleStartDemanded.fire(this);
        console.log('StatisticCicleStartDemanded');
    }
    else {
        this.StatisticCicleStopDemanded.fire(this);
        console.log('StatisticCicleStopDemanded');
    }
};

periodsVP._onPeriodsBtnClick = function () {
    this.PeriodsShowDemanded.fire(this);
    this._PeriodsMenu.toggle();
    if (this._Table.is(":visible")) {
        this._Table.hide();
    }
    if (this._StopPlayBtn._DomNode.is(":visible")) {
        this._StopPlayBtn.hide();
    }
};

periodsVP._onTableBtnClick = function () {
    this._Table.show()
};

periodsVP.addPeriodsMenuItems = function (periodsConfig) {
    this._PeriodsMenu.html('');
    for (var i = 0; i < periodsConfig.length; i++) {
        var item = $('<li><a href="#"><input type="checkbox"/><span></span></a></li>');
        item.find('input').attr({
            name: periodsConfig[i].name,
            checked: periodsConfig[i].active,
            disabled: periodsConfig[i].forced
        })
            // add event listener right here as it is just DOM event
            .on('change', $.proxy(this._onPeriodsChange, this));
        item.find('span').text(periodsConfig[i].title);
        item.appendTo(this._PeriodsMenu);
    }
    this._PeriodsMenu.menu('refresh');
};

periodsVP._onPeriodsChange = function (event) {
    this.StatisticCicleStopDemanded.fire(this);
    var checkedPeriodsNames = [];
    this._PeriodsMenu.find('input[type="checkbox"]').each(function () {
        if (this.checked) {
            checkedPeriodsNames.push($(this).attr('name'));
        }
    });
    if (checkedPeriodsNames.length > 0) {
        this._updateTable(checkedPeriodsNames);
        this._Table.show();
        this._StopPlayBtn.show();
    }
    else {
        this._Table.hide();
        this._StopPlayBtn.hide();
    }
    this.PeriodsChangeDemanded.fire(this, checkedPeriodsNames);
};

periodsVP.hide = function () {
    this._PeriodsMenu.hide();
    this._PeriodsBtn.hide();
    this._Table.hide();
    this._StopPlayBtn.hide();
};

periodsVP.showStatistic = function (statisticName) {
    this._ActiveStatistic = this._Model.getStatistic(statisticName);
    this.addPeriodsMenuItems(this._ActiveStatistic.data.periods);
    this._PeriodsBtn.show();
};

periodsVP._updateTable = function (periodsNames) {
    var thead = this._Table.find('thead tr');
    var tbody = this._Table.find('tbody');
    thead.html('');
    tbody.html('');
    thead.append('<th>Регион</th>')

    // todo rewrite
    for (var i=0; i < periodsNames.length; i++) {
        for (var k=0; k < this._ActiveStatistic.data.periods.length; k++) {
            if (periodsNames[i] === this._ActiveStatistic.data.periods[k].name) {
                thead.append('<th>'+ this._ActiveStatistic.data.periods[k].title +'</th>');
                if (tbody.html().length === 0) {
                    for (var l=0; l < this._ActiveStatistic.data.periods[k].values.length; l++) {
                        tbody.append('<tr><td>' + this._ActiveStatistic.data.periods[k].values[l].object + '</td></tr>');
                    }
                }
            }
        }
    }

    for (var i=0; i < periodsNames.length; i++) {
        for (var k=0; k < this._ActiveStatistic.data.periods.length; k++) {
            if (periodsNames[i] === this._ActiveStatistic.data.periods[k].name) {
                for (var l=0; l < this._ActiveStatistic.data.periods[k].values.length; l++) {
                    $(this._Table.find('tbody tr')[l]).append('<td>' + this._ActiveStatistic.data.periods[k].values[l].value + '</td>');
                }
            }
        }
    }
};

periodsVP = null;
