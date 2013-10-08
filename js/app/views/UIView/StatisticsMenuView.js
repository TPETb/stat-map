/*
 * Statistics Map name space
 */
if (!SM) {
    var SM = {};
}

/*
 * type: View class
 */
SM.StatisticsMenuView = function (options) {
    this._Model = options.model;
    this._Toolbar3 = $('#Toolbar3');
    this._Menu = null;
    this._Items = [];
    this._DomNode = null;

    this.ItemChecked = new TVL.Event();

    this.init(options);
};

var statMenuViewP = SM.StatisticsMenuView.prototype;

statMenuViewP.init = function (options) {
    this._render();
    this._addEventListeners();
};

statMenuViewP._render = function () {
    this._Menu = $('<ul id="StatisticsMenu" class="menu-std">');
    this._Menu.menu();
    this._Toolbar3.append(this._Menu);
    this._Menu.hide();
    this._DomNode = $('#StatisticsMenu');
};

statMenuViewP._addEventListeners = function () {
    this._Model.StatisticsListRetrieved.add(this._onStatisticsListRetrieved, this);
};

statMenuViewP._onStatisticsListRetrieved = function () {
    this.addItems(this._Model.getStatistics().getItems());
};

statMenuViewP.addItems = function (statistics) {
    for (var i = 0; i < statistics.length; i++) {
        this._Items.push(new SM.StatisticsMenuItemView({
            parentNode: this._DomNode,
            model: statistics[i]
        }));
    }

    for (var i=0; i < this._Items.length; i++) {
        this._Items[i].SetActive.add(this._onItemSetActive, this);
    }

    this._Menu.menu('refresh');
};

statMenuViewP._onItemSetActive = function (sender) {
    for (var i = 0; i < this._Items.length; i++) {
        this._Items[i].setActive(false, sender);
    }

    this.hide();
    this.ItemChecked.fire(this);
};

statMenuViewP.setActive = function (state) {
    if (!state) {
        for (var i = 0; i < this._Items.length; i++) {
            this._Items[i].setActive(state);
        }
    }
};

statMenuViewP.removeItems = function () {
    // todo: impement
    for (var i = 0; i < this._Items.length; i++) {
        this._Items[i].dispose();
    }
    this._Items = [];
};

statMenuViewP.show = function () {
    this._Menu.show();
};

statMenuViewP.hide = function () {
    this._Menu.hide();
};

statMenuViewP.toggle = function () {
    this._Menu.toggle();
};

statMenuViewP.isVisible = function () {
    return this._Menu.is(':visible');
};

statMenuViewP = null;

