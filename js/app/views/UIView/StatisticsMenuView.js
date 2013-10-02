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
    this._ContentWrapper = $('#ContentWrapper');
    this._Menu = null;

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
    this._ContentWrapper.append(this._Menu);
    this._Menu.hide();
};

statMenuViewP._addEventListeners = function () {
    this._Model.StatisticsListRetrieved.add(this._onStatisticsListRetrieved, this);
};

statMenuViewP._onStatisticsListRetrieved = function () {
    this.addStatisticsMenuItems(this._Model.getStatistics());
};

statMenuViewP.addStatisticsMenuItems = function (statisticsConfig) {
    this._Menu.html('');

    this._addStatisticsMenuItems(this._Menu, statisticsConfig);

    this._Menu.menu('refresh');
};

statMenuViewP._addStatisticsMenuItems = function (jNode, statisticsConfig) {
    for (var i = 0; i < statisticsConfig.length; i++) {
        if (statisticsConfig[i].items) {
            var item = $('<li></li>');
            var itemTitle = $('<a href="#">' + statisticsConfig[i].title + '</a>');
            var subMenu = $('<ul></ul>');

            itemTitle.appendTo(item);
            subMenu.appendTo(item);
            item.appendTo(jNode);

            this._addStatisticsMenuItems(subMenu, statisticsConfig[i].items);
        }
        else {
            var item = $('<li><a href="#">' + statisticsConfig[i].title + '</a></li>');
            item.find('a').on('click', $.proxy(this._onMenuItemClick, this, statisticsConfig[i].name));
            item.appendTo(jNode);
        }
    }
};

statMenuViewP._onMenuItemClick = function (statisticName, event) {
    this.cancelChecked();
    $(event.target).addClass('active');

    this.ItemChecked.fire(this, statisticName);
    this._Menu.hide();
};

statMenuViewP.cancelChecked = function () {
    this._Menu.find('li.ui-menu-item a').each(function () {
        $(this).removeClass('active');
    });
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

