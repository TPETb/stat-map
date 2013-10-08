/*
 * Statistics Map name space
 */
if (!SM) {
    var SM = {};
}

/*
 * type: View class
 */
SM.StatisticsMenuItemView = function (options) {
    this._ParentNode = options.parentNode;
    this._Model = options.model;
    this._DomNode = null;
    this._Items = [];
    this._Active = false;

    this.SetActive = new TVL.Event();

    this._render();
    this.addItems(this._Model.getItems());
    this._addEventListeners();
};

var statMenuItemViewP = SM.StatisticsMenuItemView.prototype;

statMenuItemViewP._render = function () {
    this._DomNode = $('<li></li>');

    this._Title = $('<a href="#">' + this._Model.getTitle() + '</a>');
    this._Title.appendTo(this._DomNode);

    this._DomNode.appendTo(this._ParentNode);
};

statMenuItemViewP._addEventListeners = function () {
    this._Title.on('click', $.proxy(this._onClick, this));

    for (var i=0; i < this._Items.length; i++) {
        this._Items[i].SetActive.add(this._onItemSetActive, this);
    }
};

statMenuItemViewP._onClick = function () {
    if (this._Items.length === 0) {
        this.setActive(true);
        this._Model.setActive(true);
    }
};

statMenuItemViewP._onItemSetActive = function (sender) {
    this.SetActive.fire(sender);
};

statMenuItemViewP.addItems = function (statistics) {
    if (statistics.length > 0) {
        var subMenu = $('<ul></ul>');
        subMenu.appendTo(this._DomNode);
        for (var i = 0; i < statistics.length; i++) {
            this._Items.push(new SM.StatisticsMenuItemView({
                parentNode: subMenu,
                model: statistics[i]
            }));
        }
    }
};

statMenuItemViewP.setActive = function (state, activeSender) {
    this._Active = state;

    if (state) {
        this._Title.addClass('active');
        this.SetActive.fire(this);
    }
    else {
        this._Title.removeClass('active');
        for (var i = 0; i < this._Items.length; i++) {
            if (this._Items[i] !== activeSender) {
                this._Items[i].setActive(state, activeSender);
            }
        }
    }
};

statMenuItemViewP.dispose = function () {
    // todo: implement
    for (var i = 0; i < this._Items.length; i++) {
        this._Items[i].dispose();
    }
    this._Items = [];
}

statMenuItemViewP = null;

