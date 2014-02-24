var SM = SM || {};

(function ($) {
    SM.Taxonomy_Options_Modal_View = SM.Base_Modal_View.extend({

        template: _.template($('#Taxonomy_Options_Modal_Template').html()),

        events: _.extend({
            "click .BtnZoomIn": "_on_BtnZoomIn_Click",
            "click .BtnInfo": "_on_BtnInfo_Click"
        }, SM.Base_Modal_View.prototype.events),

        initialize: function (config) {
            this._Title = config.title;
            this._render();

            this.ZoomIn = new TVL.Event();
            this.Info = new TVL.Event();

            this._add_EventListeners();
        },

        _render: function() {
            this.$el.html(this.template({ title: this._Title }));
        },

        _on_Hide: function () {
            //this.remove();
        },

        set_Title: function (title) {
            this.$el.find('h3').html(title);
        },

        _on_Close_Click: function (event) {
            this.trigger('Cancel');
            this.hide();
        },

        _on_BtnZoomIn_Click: function (event) {
//            this.trigger('ZoomIn');
            this.ZoomIn.fire(this);
            this.hide();
        },

        _on_BtnInfo_Click: function (event) {
//            this.trigger('Info');
            this.Info.fire(this);
            this.hide();
        },

        set_Object_Name: function (objectName) {
            this._ObjectName = objectName;
            this.set_Title(SM.App.getModel().getFocusedObject(objectName).title);
        },

        get_Object_Name: function () {
            return this._ObjectName;
        }

    });
})(jQuery);

