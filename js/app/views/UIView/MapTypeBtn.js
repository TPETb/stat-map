/*
 * Statistics Map name space
 */
if (!SM) {
    var SM = {};
}

/*
 * type: View class
 */
SM.MapTypeBtn = function () {
    this._ParentNode = $('#Toolbar5') ;

    this.StateChanged = new TVL.Event();

    this._render();
    this._addEventListeners();
};

var mapTypeP = SM.MapTypeBtn.prototype;

mapTypeP._render = function () {
    this._DomNode = $('<button type="button" class="btn btn-default" id="MapTypeBtn">' +
        '<span class="glyphicon welayats glyphicon-adjust"></span>' +
        '<span class="glyphicon etraps glyphicon-align-center"></span>' +
        '<span class="glyphicon welayat glyphicon-align-justify"></span>' +
        '<span class="inner"></span>' +
        '</button>');
    this._ParentNode.append(this._DomNode);
};

mapTypeP._addEventListeners = function () {
    this._DomNode.on('click', $.proxy(this._onClick, this));
};

mapTypeP._onClick = function () {
    var newState;
    switch (this._State) {
        case 'welayats':
            newState = 'etraps';
            break;
        case 'etraps':
            newState = 'welayats';
            break;
        case 'welayat':
            newState = 'welayats';
            break;
    }
    this.setState(newState);
    this.StateChanged.fire(this);
};

mapTypeP.setState = function (state) {
    this._DomNode.find('.glyphicon').each(function () {
        $(this).hide();
    });

    switch(state) {
        case 'welayats':
            this._DomNode.find('.etraps').show();
            this._DomNode.find('.inner').html(' Этрапы');
            break;
        case 'etraps':
            this._DomNode.find('.welayats').show();
            this._DomNode.find('.inner').html(' Велаяты');
            break;
        case 'welayat':
            this._DomNode.find('.welayats').show();
            this._DomNode.find('.inner').html(' Общая карта');
            break;
    }

    this._State = state;
};

mapTypeP.getState = function () {
    return this._State;
};

mapTypeP.show = function () {
    this._DomNode.show();
};

mapTypeP.hide = function () {
    this._DomNode.hide();
};

mapTypeP.toggle = function () {
    this._DomNode.toggle();
};

mapTypeP = null;
