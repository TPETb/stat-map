var SM = SM || {};

(function ($) {
    SM.Taxonomy_Info_Modal_View = SM.Base_Modal_View.extend({

        template: _.template($('#Taxonomy_Info_Modal_Template').html()),

        events: _.extend({
//            "click .BtnInfo": "_on_BtnInfo_Click"
        }, SM.Base_Modal_View.prototype.events),

        initialize: function (config) {
            this._Content = config.content;
            this._render();

            this._add_EventListeners();
        },

        setContent: function (content){
            this._Content = content;
        },

        _render: function() {
            this.$el.html(this.template({ content: this._Content }));
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
        }
    });
})(jQuery);

