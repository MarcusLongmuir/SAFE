(function($) {
    $.fn.ajax_url = function(custom_trigger, on_trigger) {
        var element = this;
        element.on('tap',function(event) {
            var custom_trigger_return = null;
            if (custom_trigger != null) {
                custom_trigger_return = custom_trigger(event);
            }
            if (custom_trigger_return == null || custom_trigger_return === true) {
                //Navigate to the new page
                if (on_trigger != null) {
                    on_trigger(event);
                }
                if (event.metaKey === true) {
                    //Being opened in another tab
                } else {
                    if (Site.history_state_supported) {
                        if (!event.isDefaultPrevented()) {
                            event.preventDefault();
                            Site.load_url($(element).attr("href"), true);
                        }
                    }
                }
            } else { //custom_trigger_return==false
                event.preventDefault();
            }
        });

        return element;
    };
})(jQuery);