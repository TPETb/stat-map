/*
 * Statistics Map name space
 */
if (!SM) {
    var SM = {};
}

/**
 * Handles the retrieval of data
 */
SM.StatisticModel = function (options) {
    this._Title = options.title;
    this._Name = options.name;
    this._Items = [];
    this._Data = null;
    this._Active = false;
    this._CurrentPeriod = null;
    this._Interval = null;

    if (options.source) {
        this._Service = new SM.StatisticServiceRemote(options.source);
    }

    this.SetActive = new TVL.Event(); // triggered when the statistic was selected from StatisticsMenuView, after data retrieved
    this.CurrentPeriodSet = new TVL.Event();
    this.CycleCancelled = new TVL.Event();

    this.addItems(options.items);

    this._addEventListeners();
};

var statModelP = SM.StatisticModel.prototype;

statModelP.addItems = function (itemsConfigArray) {
    if (itemsConfigArray) {
        for (var i = 0; i < itemsConfigArray.length; i++) {
            this._Items.push(new SM.StatisticModel(itemsConfigArray[i]));
        }
    }
};

statModelP._addEventListeners = function () {
    if (this._Service) {
        this._Service.Retrieved.add(this._onRetrieved, this);
    }
    for (var i=0; i < this._Items.length; i++) {
        this._Items[i].SetActive.add(this._onItemSetActive, this);
    }
};

statModelP.requestData = function () {
    this._Service.request();
};

statModelP._onItemSetActive = function (sender) {
    this.SetActive.fire(sender);
};

statModelP._onRetrieved = function (sender, data) {
    this._Data = data;
    this.SetActive.fire(this);
};

statModelP.setActive = function (state, activeSender) {
    this._Active = state;

    if (state) {
        if (!this._Data) {
            this.requestData();
        }
        else {
            this.SetActive.fire(this);
        }
    }
    else {
        for (var i = 0; i < this._Items.length; i++) {
            if (this._Items[i] !== activeSender) {
                this._Items[i].setActive(state, activeSender);
            }
        }
    }
};

statModelP.setActiveStatisticPeriods = function (periodsNamesArray) {
    for (var i = 0; i < this._Data.periods.length; i++) {
        this._Data.periods[i].active = false;
    }
    for (var i = 0; i < periodsNamesArray.length; i++) {
        for (var k = 0; k < this._Data.periods.length; k++) {
            if (periodsNamesArray[i] === this._Data.periods[k].name) {
                this._Data.periods[k].active = true;
            }
        }
    }
};

statModelP.playCycle = function () {
    this._updateCurrentPeriod();
    this._Interval = setInterval($.proxy(this._updateCurrentPeriod, this), 3000);
};

statModelP._updateCurrentPeriod = function () {
    if (this._CurrentPeriod) {
        for (var i = 0; i < this._Data.periods.length; i++) {
            if (this._Data.periods[i] === this._CurrentPeriod) {
                for (var k = i+1; k <= this._Data.periods.length; k++) {
                    if (k === this._Data.periods.length) {
                        this.cancelCycle();
                        return;
                    }
                    if (this._Data.periods[k].active) {
                        this._CurrentPeriod = this._Data.periods[k];
                        this.CurrentPeriodSet.fire(this);
                        break;
                    }
                }
                break;
            }
        }
    }
    else {
        for (var i = 0; i < this._Data.periods.length; i++) {
            if (this._Data.periods[i].active) {
                this._CurrentPeriod = this._Data.periods[i];
                this.CurrentPeriodSet.fire(this);
                break;
            }
        }
    }
};

statModelP.pauseCycle = function () {
    clearInterval(this._Interval);
};

statModelP.cancelCycle = function () {
    clearInterval(this._Interval);
    this._CurrentPeriod = null;
    this.CycleCancelled.fire(this);
};

statModelP.getTitle = function () {
    return this._Title;
};

statModelP.getItems = function () {
    return this._Items;
};

statModelP.getData = function () {
    return this._Data;
};

statModelP.getCurrentPeriod = function () {
    return this._CurrentPeriod;
};

statModelP.setCurrentPeriod = function (periodName) {
    for (var i = 0; i < this._Data.periods.length; i++) {
        if (this._Data.periods[i].name === periodName) {
            this._CurrentPeriod = this._Data.periods[i];
            this.CurrentPeriodSet.fire(this);
            break;
        }
    }
};

statModelP = null;