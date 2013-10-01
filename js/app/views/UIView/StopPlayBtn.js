/*
 * Statistics Map name space
 */
if (!SM) {
    var SM = {};
}

/*
 * type: View class
 */
SM.StopPlayBtn = function () {
    this._ParentNode = $('body');

    this.Click = new TVL.Event();

    this._render();
    this._addEventListeners();
};

var stopPlayP = SM.StopPlayBtn.prototype;

stopPlayP._render = function () {
    this._DomNode = $('<button type="button" class="btn btn-default btn-xs" id="StopPlayBtn">' +
        '<span class="glyphicon glyphicon-play"></span>' +
        '<span class="glyphicon glyphicon-eject"></span>' +
        '</button>');
    this._DomNode.find('.glyphicon-eject').hide();
    this._ParentNode.append(this._DomNode);
};

stopPlayP._addEventListeners = function () {
    this._DomNode.on('click', $.proxy(this._onClick, this));
};

stopPlayP._onClick = function () {
    this._DomNode.find('.glyphicon').each(function () {
        $(this).toggle();
    });
    this.Click.fire(this);
};

stopPlayP.getState = function () {
    if (this._DomNode.find('.glyphicon-eject').is(":visible")) {
        return 'active';
    }
    else {
        return 'inActive';
    }
};

stopPlayP.show = function () {
    this._DomNode.show();
};

stopPlayP.hide = function () {
    this._DomNode.hide();
};

stopPlayP.toggle = function () {
    this._DomNode.toggle();
};

stopPlayP = null;
