var SM = SM || {};

(function ($) {
    SM.Base_Modal_View = Backbone.View.extend({

        tagName: 'div',

        className: 'modal fade',

        events: {
            "click .BtnClose": "_on_Close_Click",
            "click .va-btn-close": "_on_Close_Click",
            "click .BtnEdit": "_on_BtnEdit_Click",
            "click .BtnSave": "_on_BtnSave_Click",
            "click .BtnCancel": "_on_BtnCancel_Click",
            "click .BtnSend": "_on_BtnSend_Click"
        },

        _add_EventListeners: function () {
            this.$el.on('hidden.bs.modal', _.bind(this._on_Hide, this));
        },


        // controls handlers

        _on_Close_Click: function () {
            this.hide();
        },

        _on_BtnEdit_Click: function () {
            this.set_ViewMode('edit');
        },

        _on_BtnSend_Click: function () {

        },


        // render logic

        _render: function() {
            this.$el.html(this.template({ viewMode: this._ViewMode }));
            $('body').append(this.$el);
        },


        // public api

        set_ViewMode: function () {

        },

        get_ViewMode: function () {
            return this._ViewMode;
        },

        show: function () {
            this.$el.modal('show');
            return this;
        },

        hide: function () {
            this.$el.modal('hide');
            return this;
        }

    });

})(jQuery);

