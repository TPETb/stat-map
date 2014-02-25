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
    this._Toolbar2 = $('#Toolbar2');
    this._Toolbar3 = $('#Toolbar3');

    this._PeriodsMenu = null;
    this._PeriodsBtn = null;
    this._TableBtn = null;
    this._Table = null;
    this._PausePlayBtn = null;
    this._OkBtn = null;

    this.PeriodsBtnClick = new TVL.Event();

    this._render();
    this._addEventListeners();
};

var periodsVP = SM.PeriodsView.prototype;

periodsVP._render = function () {
    this._PausePlayBtn = new SM.PausePlayBtn();
    this._PausePlayBtn.hide();

    this._PeriodsMenuWrapper = $('<div id="PeriodsMenuWrapper">');
    this._Toolbar3.append(this._PeriodsMenuWrapper);

    this._PeriodsMenu = $('<ul id="PeriodsMenu" class="menu-std">');
    this._PeriodsMenuWrapper.append(this._PeriodsMenu);
    this._PeriodsMenuWrapper.hide();

    this._CheckAllBtn = $('<button type="button" class="btn btn-warning btn-sm" id="PeriodsCheckAllBtn">Отметить все</button>');
    this._PeriodsMenuWrapper.append(this._CheckAllBtn);

    this._UnCheckAllBtn = $('<button type="button" class="btn btn-warning btn-sm" id="PeriodsUnCheckAllBtn">Очистить</button>');
    this._PeriodsMenuWrapper.append(this._UnCheckAllBtn);

    this._OkBtn = $('<button type="button" class="btn btn-warning btn-sm" id="PeriodsOkBtn">Ок</button>');
    this._PeriodsMenuWrapper.append(this._OkBtn);

    this._PeriodsBtn = $('<button type="button" class="btn btn-warning" id="PeriodsBtn"><span class="glyphicon glyphicon-time"></span> Периоды</button>');
    this._Toolbar2.append(this._PeriodsBtn);
    this._PeriodsBtn.hide();

    this._TableBtn = $('<button type="button" class="btn btn-warning" id="TableBtn"><span class="glyphicon glyphicon-list-alt"></span> Таблица</button>');
    this._Toolbar2.append(this._TableBtn);
    this._TableBtn.hide();

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
    this._Toolbar3.append(this._Table);
    this._Table.css({'max-width': $(window).width()-224});
    this._Table.hide();
};

periodsVP._addEventListeners = function () {
    this._Model.ActiveStatisticSet.add(this._onActiveStatisticSet, this);
    this._Model.ActiveTaxonomySet.add(this._onActiveTaxonomySet, this);
    this._PeriodsBtn.on('click', $.proxy(this._onPeriodsBtnClick, this));
    this._TableBtn.on('click', $.proxy(this._onTableBtnClick, this));
    this._OkBtn.on('click', $.proxy(this._onOkBtnClick, this));
    this._CheckAllBtn.on('click', $.proxy(this._onCheckAllBtnClick, this));
    this._UnCheckAllBtn.on('click', $.proxy(this._onUnCheckAllBtnClick, this));
    this._PausePlayBtn.StateChanged.add(this._onPausePlayClick, this);
};

periodsVP._onActiveStatisticSet = function () {
    this._Sort_Prop = null;
    this._ActiveStatistic = this._Model.getActiveStatistic();

    this._ActiveStatistic.CurrentPeriodSet.remove(this._onCurrentPeriodSet);
    this._ActiveStatistic.CurrentPeriodSet.add(this._onCurrentPeriodSet, this);
    this._ActiveStatistic.CycleCancelled.remove(this._onCycleCancelled);
    this._ActiveStatistic.CycleCancelled.add(this._onCycleCancelled, this);

    this.addPeriodsMenuItems(this._ActiveStatistic.getData().periods);
};

periodsVP._onActiveTaxonomySet = function () {
    if (!this._ActiveStatistic) return;

    this._updateTable();
    this._onCurrentPeriodSet();
};

periodsVP._onPeriodsBtnClick = function () {
    this._PeriodsMenuWrapper.toggle();
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

periodsVP._onCheckAllBtnClick = function () {
    $('#PeriodsMenu li input').each(function () {
        this.checked = true;
    });
    this._onPeriodsChange();
};

periodsVP._onUnCheckAllBtnClick = function () {
    $('#PeriodsMenu li input').each(function () {
        this.checked = false;
    });
    this._onPeriodsChange();
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
    ths.css({background: 'none'});
    $('#Table tr td').css({background: 'none'});

    if (!currentPeriod) return;

    for (var i=0; i < ths.length; i++) {
        if ($(ths[i]).attr('data') === currentPeriod.name) {
            $('#Table tr th:nth-child(' + (i+1) + ')').css({background: '#b44600'});
            $('#Table tr td:nth-child(' + (i+1) + ')').css({background: '#b44600'});
        }
    }
};

periodsVP._onCycleCancelled = function () {
    $('#Table tr th').css({background: 'none'});
    $('#Table tr td').css({background: 'none'});
    this._PausePlayBtn.setState('inActive');
};

periodsVP.addPeriodsMenuItems = function (periodsConfig) {
    this._PeriodsMenu.html('');
    for (var i = 0; i < periodsConfig.length; i++) {
        var item = $('<li><input type="checkbox"/><span></span></li>');
        item.find('input').attr({
            name: periodsConfig[i].name,
            checked: periodsConfig[i].active,
            disabled: periodsConfig[i].forced
        }).on('change', $.proxy(this._onPeriodsChange, this));
        item.find('span').text(periodsConfig[i].title);
        item.appendTo(this._PeriodsMenu);
        item.on('click', $.proxy(this._onMenuItemClick, this));
    }
};

periodsVP._onPeriodsChange = function () {
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

periodsVP._onMenuItemClick = function (event) {
    var input = $(event.currentTarget).find('input')[0];
    if (input !== event.target) {
        input.checked = !input.checked;
        this._onPeriodsChange();
    }
};

periodsVP._updateTable = function () {
    var thead = this._Table.find('thead tr');
    var tbody = this._Table.find('tbody');
    thead.html('');
    tbody.html('');
    if (this._Sort_Prop && this._Sort_Prop.replace('_desc','') === 'title') {

        if (this._Sort_Prop.search('_desc') > -1) {
            thead.append('<th><span data="' + this._Sort_Prop + '" class="desc">Регион</span></th>');
        }
        else {
            thead.append('<th><span data="' + this._Sort_Prop + '" class="asc">Регион</span></th>');
        }


    }
    else {
        thead.append('<th><span data="title">Регион</span></th>');
    }

    var activeStatData = this._ActiveStatistic.getData();
    var activeTaxonomy = this._Model.getActiveTaxonomy();

    var theadHtml = '';
    var tbodyHtml = '';
    var visibleValues = [];
    var periodsOrder = [];

    for (var i = 0; i < activeStatData.periods.length; i++) {
        if (activeStatData.periods[i].active) {
            if (this._Sort_Prop && this._Sort_Prop.replace('_desc','') === activeStatData.periods[i].name) {
                if (this._Sort_Prop.search('_desc') > -1) {
                    theadHtml = theadHtml + '<th><span data="' + this._Sort_Prop + '" class="desc">'+ activeStatData.periods[i].title +'</span></th>';
                }
                else {
                    theadHtml = theadHtml + '<th><span data="' + this._Sort_Prop + '" class="asc">'+ activeStatData.periods[i].title +'</span></th>';
                }
            }
            else {
                theadHtml = theadHtml + '<th><span data="' + activeStatData.periods[i].name + '">'+ activeStatData.periods[i].title +'</span></th>';
            }

            periodsOrder.push(activeStatData.periods[i].name);
        }
    }

    for (var i = 0; i < activeTaxonomy.length; i++) {
        if (this._Model.getFocusedObjectName() !== activeTaxonomy[i].name && $.inArray(this._Model.getFocusedObjectName(), activeTaxonomy[i].parents) === -1) {
            continue;
        }
        var visibleValue = {
            title: activeTaxonomy[i].title
        };
        visibleValues.push(visibleValue);
        for (var k = 0; k < activeStatData.periods.length; k++) {
            if (activeStatData.periods[k].active) {
                for (var l = 0; l < activeStatData.periods[k].values.length; l++) {
                    if (activeStatData.periods[k].values[l].object === activeTaxonomy[i].name) {
                        visibleValue[activeStatData.periods[k].name] = activeStatData.periods[k].values[l].value;
                        break;
                    }
                }
            }
        }
    }

    if (this._Sort_Prop) {
        var sortProp = this._Sort_Prop.replace('_desc','');

        visibleValues = _.sortBy(visibleValues, function(el){
            return el[sortProp];
        });

        if (this._Sort_Prop.search('_desc') > -1) {
            visibleValues = visibleValues.reverse();
        }
    }

    for (var i = 0; i < visibleValues.length; i++) {
        tbodyHtml = tbodyHtml + '<tr><td>' + visibleValues[i].title + '</td>';
        for (var k = 0; k < periodsOrder.length; k++) {
            tbodyHtml = tbodyHtml + '<td>' + visibleValues[i][periodsOrder[k]] + '</td>';
        }
        tbodyHtml = tbodyHtml + '</tr>';
    }

    thead.append(theadHtml);
    tbody.append(tbodyHtml);

    thead.find('th span').bind('click', _.bind(this._on_Sort_Click, this));
};

periodsVP._on_Sort_Click = function (event) {
    this._Sort_Prop = $(event.currentTarget).attr('data');

    if (!this._Sort_Prop) return;

    if (this._Sort_Prop.search('_desc') > -1) {
        this._Sort_Prop = this._Sort_Prop.replace('_desc', '');
    }
    else {
        this._Sort_Prop = this._Sort_Prop + '_desc';
    }

    this._updateTable();
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
    this._PeriodsMenuWrapper.show();
};

periodsVP.hide = function () {
    this._PeriodsBtn.hide();
    this._PeriodsMenuWrapper.hide();
    this._Table.hide();
    this._TableBtn.hide();
    this._PausePlayBtn.hide();
};

periodsVP.hideModals = function () {
    this._Table.hide();
    this._PeriodsMenuWrapper.hide();
};

periodsVP = null;
