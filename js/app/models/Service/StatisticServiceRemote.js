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
//    $.getJSON(this._Url)
//            .done($.proxy(this._onRetrieved, this))
//            .fail($.proxy(function(jqXHR) {
//        console.log("failed request:");
//        console.log(jqXHR);
//    }, this));

    $.ajax({
        type: 'GET',
        url: this._Url,
        async: false,
        jsonpCallback: this._Url.replace('.js', '').replace(/[^a-zA-Z0-9]/g, ''),
        contentType: "application/javascript",
        dataType: 'jsonp',
        crossDomain: true,
        success: $.proxy(this._onRetrieved, this)
    });
};

statServiceRP._onRetrieved = function(data) {
    this.Retrieved.fire(this, data);
};

statServiceRP = null;