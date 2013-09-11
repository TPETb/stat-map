/*
 * Tretyakov Vladimir Library name space
 */
if (!TVL) {
    var TVL = {};
}

/*
 * Class for creating custom events.
 * The concept is based on .NET Framework Delegate class nature
 * Naming is switched from Delegate to Event for newbies
 */
TVL.Event = function () {
    this._On = null;

    if (!( this instanceof TVL.Event )) {
        return new TVL.Event();
    }
};

var eventP = TVL.Event.prototype;

/*
 * Method for adding a callback for created event
 *
 * @param {Function} callback
 * @param {Object}   context
 */
eventP.add = function (callback, context) {
    if (!callback) return;
    if (!this._On) this._On = [];

    var id = this._On.length;

    if (!context) context = null;

    return this._On.push({
        callback: callback,
        context: context
    });
};

/*
 * Method for firing an event with passing additional parameters
 *
 * @param  {Object} sender   - the context in which event was fired
 * @param  {Object} settings - map of settings pased to callback
 *
 * @return {[type]}          - returns the result of callback invocation
 */
eventP.fire = function (sender, settings) {
    if (!sender || !this._On) return;
    if (!settings) settings = {};

    var res;
    var eventHandlers;
    var handler;

    eventHandlers = [].concat(this._On);

    for (var i = 0; i < eventHandlers.length; i++) {
        handler = eventHandlers[i];

        if (handler && handler.callback) {
            if (handler.context) {
                res = handler.callback.call(handler.context, sender, settings);
            } else {
                res = handler.callback.call(sender, sender, settings);
            }
        }
    }

    return res;
};

/*
 * Method to remove one or several callbacks for event
 *
 * @param  {Function|Array|undefined} callback
 */
eventP.remove = function (callback) {
    if (!this._On) return;

    var type = ( typeof ( callback ) ).toLowerCase();
    var i;

    // in case of single funciton removing it
    if (type == 'function') {
        for (i = this._On.length - 1; i >= 0; i--) {
            if (!this._On[i]) continue;
            if (this._On[i].callback == callback) {
                this._On.splice(i, 1);
                return;
            }
        }

        // in case of array trying to remove callbacks for each element of the array
    } else if (Array.isArray(callback)) {
        for (i = 0; i < callback.length; i++) {
            this.remove(callback[i]);
        }

        // if didn't pass anything, removing all the callbacks for event
    } else if (type == 'undefined') {
        this._On = [];
    }
};

eventP = null;


/*
 * Extends the prototype of SubClass with methods of SuperClass
 *
 * @param  {Function} SubClass
 * @param  {Function} SuperClass
 */
TVL.extend = function (SubClass, SuperClass) {
    var F = function () {};
    F.prototype = SuperClass.prototype;

    // This property is later used in call function, to provide inheritance of properties,
    // and using of parent methods
    SubClass._superClass = SuperClass.prototype;

    SubClass.prototype = new F();
    SubClass.prototype.constructor = SubClass;
};

