/*
 * Statistics Map name space
 */
if (!SM) {
    var SM = {};
}

/*
 * type: View class
 */
SM.PausePlayBtn = function () {
    this._ParentNode = $('#Toolbar2') ;

    this.StateChanged = new TVL.Event();

    this._render();
    this._addEventListeners();
};

var pausePlayP = SM.PausePlayBtn.prototype;

pausePlayP._render = function () {
    this._DomNode = $('<button type="button" class="btn btn-default" id="PausePlayBtn">' +
        '<span class="glyphicon glyphicon-play"></span>' +
        '<span class="glyphicon glyphicon-pause"></span>' +
        '</button>');
    this._DomNode.find('.glyphicon-pause').hide();
    this._ParentNode.append(this._DomNode);
};

pausePlayP._addEventListeners = function () {
    this._DomNode.on('click', $.proxy(this._onClick, this));
};

pausePlayP._onClick = function () {
    this._DomNode.find('.glyphicon').each(function () {
        $(this).toggle();
    });
    this.StateChanged.fire(this);
};

pausePlayP.setState = function (state) {
    if (this.getState() !== state) {
        this._DomNode.find('.glyphicon').each(function () {
            $(this).toggle();
        });
    }
};

pausePlayP.getState = function () {
    if (this._DomNode.find('.glyphicon-pause').css("display") === 'none') {
        return 'inActive';
    }
    else {
        return 'active';
    }
};

pausePlayP.show = function () {
    this._DomNode.show();
};

pausePlayP.hide = function () {
    this._DomNode.hide();
};

pausePlayP.toggle = function () {
    this._DomNode.toggle();
};

pausePlayP = null;
