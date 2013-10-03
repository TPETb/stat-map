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

    this._PeriodsMenu = null;
    this._TableBtn = null;
    this._Table = null;
    this._StopPlayBtn = null;
    this._OkBtn = null;
    this._CurrentPeriod = -1;

    this.PeriodsChangeDemanded = new TVL.Event();
    this.StatisticCycleStopDemanded = new TVL.Event();
    this.StatisticCycleStartDemanded = new TVL.Event();

    this._render();
    this._addEventListeners();
};

var periodsVP = SM.PeriodsView.prototype;

periodsVP._render = function () {
    this._PeriodsMenu = $('<ul id="PeriodsMenu" class="menu-std">');
    this._PeriodsMenu.menu();
    this._ContentWrapper.append(this._PeriodsMenu);
    this._PeriodsMenu.hide();

    this._TableBtn = $('<button type="button" class="btn btn-default" id="TableBtn">Таблица</button>');
    this._ToolbarTop.append(this._TableBtn);
    this._TableBtn.hide();

    this._StopPlayBtn = new SM.StopPlayBtn();
    this._StopPlayBtn.hide();

    this._OkBtn = $('<button type="button" class="btn btn-success" id="PeriodsOkBtn">Ок</button>');
    this._ContentWrapper.append(this._OkBtn);
    this._OkBtn.hide();

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
    this._TableBtn.on('click', $.proxy(this._onTableBtnClick, this));
    this._OkBtn.on('click', $.proxy(this._onOkBtnClick, this));
    this._StopPlayBtn.Click.add(this._onStopPlayClick, this);
};

periodsVP._onTableBtnClick = function () {
    this._Table.toggle();
};

periodsVP._onOkBtnClick = function () {

};

periodsVP._onStopPlayClick = function () {
    if (this._StopPlayBtn.getState() === 'active') {
        this.StatisticCycleStartDemanded.fire(this);
    }
    else {
        this.StatisticCycleStopDemanded.fire(this);
    }
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
    this._StopPlayBtn.setState('inActive');
    this.StatisticCycleStopDemanded.fire(this);

    var checkedPeriodsNames = this.getCheckedPeriodsNames();

    if (checkedPeriodsNames.length > 0) {
        this._updateTable(checkedPeriodsNames);
        this._TableBtn.show();
        this._StopPlayBtn.show();
    }
    else {
        this._TableBtn.hide();
        this._StopPlayBtn.hide();
    }
    this._Model.setActiveStatisticPeriods(checkedPeriodsNames);
    this.PeriodsChangeDemanded.fire(this);
};

periodsVP._updateTable = function (periodsNames) {
    var thead = this._Table.find('thead tr');
    var tbody = this._Table.find('tbody');
    thead.html('');
    tbody.html('');
    thead.append('<th>Регион</th>')

    var activeStat = this._Model.getActiveStatistic();
    // todo rewrite
    for (var i=0; i < periodsNames.length; i++) {
        for (var k=0; k < activeStat.data.periods.length; k++) {
            if (periodsNames[i] === activeStat.data.periods[k].name) {
                thead.append('<th>'+ activeStat.data.periods[k].title +'</th>');
                if (tbody.html().length === 0) {
                    for (var l=0; l < activeStat.data.periods[k].values.length; l++) {
                        tbody.append('<tr><td>' + activeStat.data.periods[k].values[l].object + '</td></tr>');
                    }
                }
            }
        }
    }

    for (var i=0; i < periodsNames.length; i++) {
        for (var k=0; k < activeStat.data.periods.length; k++) {
            if (periodsNames[i] === activeStat.data.periods[k].name) {
                for (var l=0; l < activeStat.data.periods[k].values.length; l++) {
                    $(this._Table.find('tbody tr')[l]).append('<td>' + activeStat.data.periods[k].values[l].value + '</td>');
                }
            }
        }
    }
};

periodsVP._showNextStatisticPeriod = function () {
    this._CurrentPeriod ++;

    if (this._CurrentPeriod >= $('#Table tr th').length-1) {
        this._CurrentPeriod = 0;
    }

    $('#Table tr th').css({background: 'white'});
    $('#Table tr td').css({background: 'white'});


    $('#Table tr th:nth-child(' + (this._CurrentPeriod + 2) + ')').css({background: '#cccccc'});
    $('#Table tr td:nth-child(' + (this._CurrentPeriod + 2) + ')').css({background: '#cccccc'});
};

periodsVP.startStatisticCycle = function () {
    this.stopStatisticCycle();
    this._showNextStatisticPeriod();
    this._TimedExecutioner = setInterval($.proxy(this._showNextStatisticPeriod, this), 1000);
};

periodsVP.stopStatisticCycle = function () {
    this._CurrentPeriod = -1;
    clearInterval(this._TimedExecutioner);
    $('#Table tr th').css({background: 'white'});
    $('#Table tr td').css({background: 'white'});
};

periodsVP.hide = function () {
    this._PeriodsMenu.hide();
    this._OkBtn.hide();
    this._Table.hide();
    this._TableBtn.hide();
    this._StopPlayBtn.hide();
};

periodsVP.hideModals = function () {
    this._Table.hide();
    this._PeriodsMenu.hide();
    this._OkBtn.hide();
};

periodsVP.toggle = function () {
    this._PeriodsMenu.toggle();
    this._OkBtn.toggle();
    if (this._Table.is(":visible")) {
        this._Table.hide();
    }
    else {
        if (this.getCheckedPeriodsNames().length > 0) {
            this._StopPlayBtn.show();
        }
    }
};

periodsVP.getCheckedPeriodsNames = function () {
    var checkedPeriodsNames = [];

    this._PeriodsMenu.find('input[type="checkbox"]').each(function () {
        if (this.checked) {
            checkedPeriodsNames.push($(this).attr('name'));
        }
    });

    return checkedPeriodsNames;
};

periodsVP = null;
