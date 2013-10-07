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
    this._ActiveStatistic = null;

    this._Body = $('body');
    this._NavBar = $('#UINavBar .navbar-collapse');
    this._ContentWrapper = $('#ContentWrapper');

    this._PeriodsMenu = null;
    this._PeriodsBtn = null;
    this._TableBtn = null;
    this._Table = null;
    this._PausePlayBtn = null;
    this._PeriodsOkBtn = null;

    this.PeriodsBtnClick = new TVL.Event();

    this._render();
    this._addEventListeners();
};

var periodsVP = SM.PeriodsView.prototype;

periodsVP._render = function () {
    this._PeriodsMenuWrapper = $('<div id="PeriodsMenuWrapper">');
    this._ContentWrapper.append(this._PeriodsMenuWrapper);

    this._PeriodsMenu = $('<ul id="PeriodsMenu" class="menu-std">');
    this._PeriodsMenu.menu();
    this._PeriodsMenuWrapper.append(this._PeriodsMenu);
    this._PeriodsMenu.hide();

    this._PeriodsOkBtn = $('<button type="button" class="btn btn-success" id="PeriodsOkBtn">Ок</button>');
    this._PeriodsMenuWrapper.append(this._PeriodsOkBtn);
    this._PeriodsOkBtn.hide();

    this._PeriodsBtn = $('<button type="button" class="btn btn-default navbar-btn" id="PeriodsBtn"><span class="glyphicon glyphicon-time"></span> Периоды</button>');
    this._NavBar.append(this._PeriodsBtn);
    this._PeriodsBtn.hide();

    this._TableBtn = $('<button type="button" class="btn btn-default" id="TableBtn"><span class="glyphicon glyphicon-list-alt"></span> Таблица</button>');
    this._NavBar.append(this._TableBtn);
    this._TableBtn.hide();

    this._PausePlayBtn = new SM.PausePlayBtn();
    this._PausePlayBtn.hide();

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
    this._Table.css({'max-width': $(window).width()-224});
    this._Table.hide();
};

periodsVP._addEventListeners = function () {
    this._Model.ActiveStatisticSet.add(this._onActiveStatisticSet, this);
    this._PeriodsBtn.on('click', $.proxy(this._onPeriodsBtnClick, this));
    this._TableBtn.on('click', $.proxy(this._onTableBtnClick, this));
    this._PeriodsOkBtn.on('click', $.proxy(this._onOkBtnClick, this));
    this._PausePlayBtn.Click.add(this._onPausePlayClick, this);
};

periodsVP._onActiveStatisticSet = function () {
    this._ActiveStatistic = this._Model.getActiveStatistic();

    this._ActiveStatistic.CurrentPeriodSet.remove(this._onCurrentPeriodSet);
    this._ActiveStatistic.CurrentPeriodSet.add(this._onCurrentPeriodSet, this);
    this._ActiveStatistic.CycleCancelled.remove(this._onCycleCancelled);
    this._ActiveStatistic.CycleCancelled.add(this._onCycleCancelled, this);

    this.addPeriodsMenuItems(this._ActiveStatistic.getData().periods);
};

periodsVP._onPeriodsBtnClick = function () {
    this._PeriodsMenu.toggle();
    this._PeriodsOkBtn.toggle();
    this.PeriodsBtnClick.fire(this);
};

periodsVP._onTableBtnClick = function () {
    this._Table.toggle();
};

periodsVP._onOkBtnClick = function () {
    var checkedPeriodsNames = this.getCheckedPeriodsNames();
    if (checkedPeriodsNames.length === 1) {
        this._ActiveStatistic.setCurrentPeriod(checkedPeriodsNames[0]);
    }
    if (checkedPeriodsNames.length > 1) {
        this._ActiveStatistic.playCycle();
        this._PausePlayBtn.setState('active');
    }
    this.hideModals();
};

periodsVP._onPausePlayClick = function () {
    if (this._PausePlayBtn.getState() === 'active') {
        this._ActiveStatistic.playCycle();
    }
    else {
        this._ActiveStatistic.pauseCycle();
    }
};

periodsVP._onCurrentPeriodSet = function () {
    var currentPeriod  = this._ActiveStatistic.getCurrentPeriod();
    var ths = $('#Table tr th');
    ths.css({background: 'white'});
    $('#Table tr td').css({background: 'white'});

    for (var i=0; i < ths.length; i++) {
        if ($(ths[i]).attr('data') === currentPeriod.name) {
            $('#Table tr th:nth-child(' + (i+1) + ')').css({background: '#cccccc'});
            $('#Table tr td:nth-child(' + (i+1) + ')').css({background: '#cccccc'});
        }
    }
};

periodsVP._onCycleCancelled = function () {
    $('#Table tr th').css({background: 'white'});
    $('#Table tr td').css({background: 'white'});
    this._PausePlayBtn.setState('inActive');
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
    this._PausePlayBtn.setState('inActive');
    this._ActiveStatistic.cancelCycle();

    var checkedPeriodsNames = this.getCheckedPeriodsNames();
    this._ActiveStatistic.setActiveStatisticPeriods(checkedPeriodsNames);

    this._updateTable();

    if (checkedPeriodsNames.length > 0) {
        this._TableBtn.show();
    }
    else {
        this._TableBtn.hide();
        this._Table.hide();
    }
    if (checkedPeriodsNames.length > 1) {
        this._PausePlayBtn.show();
    }
    else {
        this._PausePlayBtn.hide();
    }
};

periodsVP._updateTable = function () {
    var thead = this._Table.find('thead tr');
    var tbody = this._Table.find('tbody');
    thead.html('');
    tbody.html('');
    thead.append('<th>Регион</th>')

    var activeStatData = this._ActiveStatistic.getData();

    var theadHtml = '';
    var tbodyHtml = [];

    for (var i = 0; i < activeStatData.periods[0].values.length; i++) {
        tbodyHtml.push('<td>' + activeStatData.periods[0].values[i].object + '</td>');
    }

    for (var i = 0; i < activeStatData.periods.length; i++) {
        if (activeStatData.periods[i].active) {
            theadHtml = theadHtml + '<th data="' + activeStatData.periods[i].name + '">'+ activeStatData.periods[i].title +'</th>';
            for (var k = 0; k < activeStatData.periods[i].values.length; k++) {
                tbodyHtml[k] = tbodyHtml[k] + '<td>' + activeStatData.periods[i].values[k].value + '</td>'
            }
        }
    }

    for (var i = 0; i < tbodyHtml.length; i++) {
        tbodyHtml[i] = '<tr>' + tbodyHtml[i] + '</tr>';
    }

    tbodyHtml = tbodyHtml.join();
    thead.append(theadHtml);
    tbody.append(tbodyHtml);
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

periodsVP.show = function () {
    this.hide();
    this._PeriodsBtn.show();
};

periodsVP.hide = function () {
    this._PeriodsBtn.hide();
    this._PeriodsMenu.hide();
    this._PeriodsOkBtn.hide();
    this._Table.hide();
    this._TableBtn.hide();
    this._PausePlayBtn.hide();
};

periodsVP.hideModals = function () {
    this._Table.hide();
    this._PeriodsMenu.hide();
    this._PeriodsOkBtn.hide();
};

periodsVP = null;
