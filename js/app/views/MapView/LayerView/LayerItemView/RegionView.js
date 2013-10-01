/**
 * Statistics map name space
 */
if (!SM) {
    var SM = {};
}

SM.RegionView = function (options) {
    this._indicator = null;
    this._indicatedValue = null;

    this.init(options);
};

TVL.extend(SM.RegionView, SM.PolygonView);

proto = SM.RegionView.prototype;

proto.init = function (options) {
    this._superClass.init(options);

    this.setStyle({
        "fillColor": null,
        "fillOpacity": 0,
        "stroke": true,
        "color": "red",
        "dashArray": "3, 2",
        "weight": 2
    });
};

proto.setIndicator = function (indicator) {
    this._indicator = indicator;
};

proto.setIndicatedValue = function (value) {
    this._indicatedValue = value;

    // Calculate rate and apply style correspondingly
    var rate = 0;
    for (var i = 0; i < this._indicator.range.length; i++) {
        if (this._indicatedValue >= this._indicator.range[i].min && this._indicatedValue <= this._indicator.range[i].max) {
            rate = this._indicator.range[i].rate;
        }
    }

    var config = SM.App.getModel().getConfig();

    this._setStyle(config.rates[i].polyStyle);
};