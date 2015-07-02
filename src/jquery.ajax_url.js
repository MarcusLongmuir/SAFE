(function($) {
    var ajaxify = function(element, custom_trigger, on_trigger){
        element.off('tap');
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
                if (event.originalEvent.metaKey === true) {
                    //Being opened in another tab
                } else {
                    if (Site.history_state_supported) {
                        if (!event.isDefaultPrevented()) {
                            event.preventDefault();
                            setTimeout(function(){
                                //Deferred to allow the event to be prevented
                                Site.load_url($(element).attr("href"), true);
                            },1);
                        }
                    } else {
                        window.location = $(element).attr("href");
                        event.preventDefault();
                    }
                }
            } else { //custom_trigger_return==false
                event.preventDefault();
            }
        });
    }

    $.fn.ajax_url = function(custom_trigger, on_trigger) {
        return this.each(function(){

            if($(this).is("a")){
                ajaxify($(this), custom_trigger, on_trigger);
            }

            $(this).find("a").each(function(){
                var element = $(this, custom_trigger, on_trigger);
                ajaxify(element);
            });
        });
    };
})(jQuery);
