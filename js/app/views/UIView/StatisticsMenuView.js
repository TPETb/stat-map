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
    this._ParentNode = options.parentNode;
    this._Model = options.model;
    this._DomNode = null;
    this._Toolbar3 = $('#Toolbar3');
    this._Items = [];
    this._Active = false;

    this.SetActive = new TVL.Event();

    this._render();
    this.addItems(this._Model.getItems());
    this._addEventListeners();
};

var statMenuViewP = SM.StatisticsMenuView.prototype;

statMenuViewP._render = function () {
    if (this._Model.getItems().length > 0) {
        this._DomNode = $('<ul class="menu-std">');
        this._Toolbar3.append(this._DomNode);
        this._DomNode.hide();
    }

    if (this._ParentNode) {
        this._Title = $('<li>' + this._Model.getTitle() + '</li>');
        this._Title.appendTo(this._ParentNode);
    }

    if (this._ParentNode && this._DomNode) {
        this._BackBtn = $('<li class="menu-btn-back">Назад</li>');
        this._DomNode.append(this._BackBtn);
    }
}

statMenuViewP.addItems = function (statistics) {
    if (statistics.length > 0) {

        for (var i = 0; i < statistics.length; i++) {
            this._Items.push(new SM.StatisticsMenuView({
                parentNode: this._DomNode,
                model: statistics[i]
            }));
        }
    }
};

statMenuViewP._addEventListeners = function () {
    if (this._Title) {
        this._Title.on('click', $.proxy(this._onClick, this));
    }

    if (this._BackBtn) {
        this._BackBtn.on('click', $.proxy(this._onBackBtnClick, this));
    }

    for (var i=0; i < this._Items.length; i++) {
        this._Items[i].SetActive.add(this._onItemSetActive, this);
    }
};

statMenuViewP._onClick = function () {
    if (this._Items.length === 0) {
        this.setActive(true);
        this._Model.setActive(true);
    }
    else {
        this._ParentNode.hide();
        this._DomNode.show();
//        this._ParentNode.slideUp();
//        this._DomNode.slideDown();
    }
};

statMenuViewP._onBackBtnClick = function () {
    this._ParentNode.show();
    this._DomNode.hide();
//    this._ParentNode.slideDown();
//    this._DomNode.slideUp();
};

statMenuViewP._onItemSetActive = function (sender) {
    this.SetActive.fire(sender);
};

statMenuViewP.setActive = function (state, activeSender) {
    this._Active = state;

    if (state) {
        this.SetActive.fire(this);
    }
    else {
        for (var i = 0; i < this._Items.length; i++) {
            if (this._Items[i] !== activeSender) {
                this._Items[i].setActive(false, activeSender);
            }
        }
    }
};

statMenuViewP.show = function () {
    this._DomNode.show();
};

statMenuViewP.hide = function () {
    if (this._DomNode) {
        this._DomNode.hide();
    }
    for (var i=0; i < this._Items.length; i++) {
        this._Items[i].hide();
    }
};

statMenuViewP.toggle = function () {
    if (this.isVisible()){
        this.hide();
    }
    else {
        this.hide();
        this.show();
    }
};

statMenuViewP.isVisible = function () {
    return this._DomNode.is(':visible');
};

statMenuViewP = null;

