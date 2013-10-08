/*
 * Statistics Map name space
 */
if (!SM) {
    var SM = {};
}

SM.StatisticServiceRemote = function (source) {
    this._Url = source;

    this.Retrieved = new TVL.Event();
};

var statServiceRP = SM.StatisticServiceRemote.prototype;

statServiceRP.request = function() {
    $.getJSON(this._Url)
            .done($.proxy(this._onRetrieved, this))
            .fail($.proxy(function(jqXHR) {
        console.log("failed request:");
        console.log(jqXHR);
    }, this));
};

statServiceRP._onRetrieved = function(data) {
    this.Retrieved.fire(this, data);
};

statServiceRP = null;