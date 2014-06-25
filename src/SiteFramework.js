@import("../bower_components/history.js/scripts/bundled-uncompressed/html5/jquery.history.js");
@import("jquery.ajax_url.js");
@import("jquery.tap.js");
@import("Page.js");

function SAFE() {
    var sf = this;

    Site = this;
    sf.debug = false;
    sf.initial_url = true;
    sf.map = {};
    sf.ignore_next_url = false;
    sf.origin = window.location.protocol + "//" + window.location.hostname;
    if (window.location.port != "") {
        sf.origin += ":" + window.location.port;
    }
    sf.path = "/";
    sf.previous_url = document.referrer;
    sf.load_page_class = null;
    sf.loading_page = null;
    sf.scroll_bar_width_value = -1;

    sf.element = $("<div />");

    sf.is_touchscreen = ('ontouchstart' in document.documentElement);
    sf.history_state_supported = !! (window.history && window.history.pushState);

    sf.current_page = null;
    sf.no_page_found_class = null;
}

if (typeof(console) === 'undefined') {
    var cons = {}
    cons.log = cons.error = cons.info = cons.debug = cons.warn = cons.trace = cons.dir = cons.dirxml = cons.group = cons.groupEnd = cons.time = cons.timeEnd = cons.assert = cons.profile = function() {};
    SAFE.console = cons;
} else {
    SAFE.console = console;
}

//Used to subclass Javascript classes
SAFE.prototype.extend = function(sub, sup) {
    function emptyclass() {}
    emptyclass.prototype = sup.prototype;
    sub.prototype = new emptyclass();
    sub.prototype.constructor = sub;
    sub.superConstructor = sup;
    sub.superClass = sup.prototype;
}

SAFE.prototype.url_changed = function(url) {
    var sf = this;

};

SAFE.prototype.on_resize = function(resize_obj) {
    var sf = this;
    
};

SAFE.prototype.pre_load = function(class_name, parameters, url, wildcard_contents) {
    var sf = this;

    //Must return undefined (null shows 404)
};

SAFE.prototype.transition_page = function(new_page, old_page){
    var sf = this;

    return false;
}

SAFE.prototype.parse_query_string = function(query_string) {
    var query_split = query_string.split('&');
    var params = {};
    for (var i = 0; i < query_split.length; i++) {
        pair = query_split[i].split('=');
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }

    return params;
}

SAFE.prototype.build_query_string = function(params) {
    var query_string = "";
    var had_query_params = false;
    var ret = [];
    for (var d in params) {
        had_query_params = true;
        ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(params[d]));
    }
    if (had_query_params) {
        query_string = "?" + ret.join("&");
    }

    return query_string;
}

SAFE.prototype.scroll_to_anchor = function(anchor){
    var sf = this;

    if(anchor){
        $(window).scrollTop(anchor.offset().top);
    }
}

SAFE.prototype.use_page_class = function(details){
    var sf = this;

    if(!details){
        details = {};
    }

    var class_name = details.class_name;
    var parameters = details.parameters;
    var url = details.url;
    var wildcard_contents = details.wildcard_contents;

    var class_name;
    if((typeof class_name)==='string'){
        //This is the name of a class, rather than the class itself

        var found_class = window[class_name];
        if(found_class===undefined){
            if(sf.load_page_class!==null){

                var load_class = class_name;

                console.log(load_class.toString());

                sf.load_page_class(load_class,function(class_def, class_css){
                    var css = document.createElement("style");
                    css.type = "text/css";
                    if (css.styleSheet){
                        css.styleSheet.cssText = class_css;
                    } else {
                        css.appendChild(document.createTextNode(class_css));
                    }
                    $("head")[0].appendChild(css);
                    sf.use_page_class(details);
                });


                if(sf.loading_page!==null){
                    class_name = sf.loading_page;
                } else {
                    return;
                }

            } else {
                SAFE.console.error("The requested class ("+class_name+") was not found and dynamic class loading is not enabled");
                class_name = null;
            }
        } else {
            class_name = found_class;
        }
    }

    if (class_name == null) { //404
        if (sf.no_page_found_class == null) {
            if (sf.current_page != null) {
                sf.current_page.remove();
                sf.current_page = null;
                sf.previous_class = null;
            }
            SAFE.console.error("No 404 page set. Use Site.set_no_page_found_class(class_name) to set one.");
            return;
        } else {
            class_name = sf.no_page_found_class;
        }
    }

    if (class_name === sf.previous_class) {
        var new_url_response = sf.current_page.new_url(parameters, url, wildcard_contents);
        if (new_url_response != "NOT_SET") {
            if(details.anchor){
                sf.scroll_to_anchor($("a[name*='"+details.anchor+"']"));
            }
            return;
        }
    }

    var old_page = null;
    if (sf.current_page != null) {
        sf.current_page.remove();
        old_page = sf.current_page;
    }


    var pre_load_response = sf.pre_load(class_name, parameters, url, wildcard_contents);

    if (pre_load_response !== undefined) {
        if((typeof pre_load_response) === 'function'){
            //Given a class
        } else if(pre_load_response===null){
            //Load the 404 page
            details.class_name = null;
            sf.use_page_class(details);
            return;
        } else {
            //Load as URL
            sf.load_url(pre_load_response, true);
        }
        return;
    }

    var new_page = new class_name(parameters, url, wildcard_contents, old_page);
    sf.current_page = new_page;
    sf.previous_class = class_name;


    var transition_response = sf.transition_page(sf.current_page, old_page);

    if (transition_response === true) {
        //The callback handled the page switching
    } else {
        sf.element.empty();
        sf.element.append(sf.current_page.element);
    }
    sf.current_page.init();

    //Call the global resize function to correctly position everything
    sf.resize();

    if(details.anchor){
        sf.scroll_to_anchor($("a[name*='"+details.anchor+"']"));
    }
}

SAFE.prototype.set_no_page_found_class = function(class_name) {
    var sf = this;

    sf.no_page_found_class = class_name;
}

SAFE.prototype.ajax_post = function(request) {
    request.cache = false;
    request.type = "post";
    request.contentType = "application/json; charset=utf-8",
    request.data = JSON.stringify(request.data);
    request.dataType = "json";
    return $.ajax(request);
}

SAFE.prototype.ajax_get = function(request) {
    request.cache = false;
    request.dataType = "json";
    request.type = "get";
    return $.ajax(request);
}

SAFE.prototype.ajax_delete = function(request) {
    request.cache = false;
    request.dataType = "json";
    request.type = "delete";
    return $.ajax(request);
}

SAFE.prototype.resize = function() {
    var sf = this;

    var doc_width = $(document).width() - sf.scroll_bar_width();
    var doc_height = $(document).height();

    var window_width = $(window).outerWidth();
    var window_height = $(window).outerHeight();

    sf.resize_obj = {
        scroll_bar_width: sf.scroll_bar_width(),
        doc_width: doc_width,
        doc_height: doc_height,
        window_width: window_width,
        window_height: window_height
    }

    sf.on_resize(sf.resize_obj);

    if (sf.current_page != null) {
        sf.current_page.resize(sf.resize_obj);
    }
}

SAFE.prototype.init = function(desired_url) {
    var sf = this;

    var path_name = window.location.pathname;
    if (window.location.search != null) {
        path_name += window.location.search;
    }

    var current_url = decodeURIComponent(path_name);
    if (desired_url != null) {
        if (desired_url != current_url) {
            current_url = desired_url;
            if (!sf.history_state_supported) {
                window.location = desired_url;
                return;
            }
        }
    }

    if (sf.history_state_supported) {

        History.replaceState(null, "", Site.origin + current_url);

        History.Adapter.bind(window, 'statechange', function() {
            if (sf.ignore_next_url) {
                sf.ignore_next_url = false;
                return;
            }
            var state = History.getState();
            if (state != null) {
                sf.load_url(decodeURIComponent(state.url), false);
            }
        });
    }

    $(window).resize(function() {
        sf.resize();
    }).resize();


    if (current_url == null) {
        current_url = "";
    }
    sf.load_url(current_url, false);
}

SAFE.prototype.reload_page = function() {
    var sf = this;

    sf.use_page_class(sf.current_class_and_details);
}

SAFE.prototype.replace_current_url = function(new_url, call_url_changed) {
    /* Change the current url without loading any new page or providing a new url to the current page. This function is rarely useful and should be avoided in most circumstances. */
    var sf = this;

    call_url_changed = (typeof call_url_changed)!="undefined" ? call_url_changed: true;

    var previous_ignore_value = sf.ignore_next_url;
    sf.ignore_next_url = true;
    History.replaceState(null, "", Site.origin + new_url);
    sf.ignore_next_url = previous_ignore_value;

    if(call_url_changed){
        sf.url_changed(
            window.location.toString(),
            window.location.pathname,
            window.location.toString().substring(Site.origin.length),
            false
        );
    }
}

SAFE.prototype.add_url = function(url, class_name) {
    var sf = this;

    sf.map[url] = class_name;
}

SAFE.prototype.scroll_bar_width = function() {
    var sf = this;

    if (sf.scroll_bar_width_value != -1) {
        return sf.scroll_bar_width_value;
    }
    var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div>');
    $('body').append(div);
    var w1 = $('div', div).innerWidth();
    div.css('overflow-y', 'scroll');
    var w2 = $('div', div).innerWidth();
    div.remove();
    sf.scroll_bar_width_value = w1 - w2;

    return sf.scroll_bar_width_value;
}

SAFE.prototype.get_class_for_url = function(url_with_parameters) {
    var sf = this;

    var class_and_details = sf.get_class_and_details_for_url(url_with_parameters);

    var class_def = window[class_and_details.class_name];
    if(class_def===undefined){
        class_def = class_and_details.class_name;
    }

    if (class_and_details != null) {
        return class_def;
    }
    return null;
}

SAFE.prototype.get_class_and_details_for_url = function(url_with_parameters) {
    var sf = this;

    var parameters = {};

    //Gets "anchors"
    var split_by_hash = url_with_parameters.split("#");
    var anchor = split_by_hash[1];

    var url_split = split_by_hash[0].split("?");
    if (url_split.length > 1) {
        parameters = sf.parse_query_string(url_split[1]);
    }

    var url = url_split[0];

    if (url.length >= sf.origin.length) {
        if (url.substring(0, sf.origin.length) == sf.origin) {
            url = url.substring(sf.origin.length);
        }
    }

    var effective_path = sf.path;
    if (effective_path != "") {
        if(effective_path[0]!="/"){
            effective_path = "/"+effective_path;
        }
        if (effective_path[effective_path.length - 1] != '/') {
            effective_path += "/";
        }
    }

    if (effective_path.length > 0) {
        if (
            effective_path.length > url.length ||
            url.substring(0, effective_path.length) != effective_path
        ) {
            SAFE.console.error("The requested url (" + url_with_parameters + ") was not relative to the domain/origin and within the Site.path scope");
            return null;
        }
        url = url.substring(effective_path.length - 1);
    }

    var class_name = sf.map[url];
    var wildcard_contents = null;

    var wildcard_contents = null;
    if (class_name == null) {
        //Loop through the available names to check for wildcard paths
        for (var map_url in sf.map) {

            var index_of_wildcard = map_url.indexOf("*");
            if (index_of_wildcard != -1) {
                var url_substring = map_url.substring(0, index_of_wildcard);
                if (url_substring.length < url.length) {
                    if (url_substring == url.substring(0, url_substring.length)) {
                        class_name = sf.map[map_url];
                        wildcard_contents = url.substring(url_substring.length);
                        url = url_substring + "*";
                    }
                }
            }
        }
    }

    return {
        'class_name': class_name,
        'parameters': parameters,
        'url': url,
        'wildcard_contents': wildcard_contents,
        'anchor': anchor
    };
}

//url_with_parameters must be relative to domain (not origin)
SAFE.prototype.load_url = function(url_with_parameters, push_state) {
    var sf = this;

    var full_url = Site.origin + url_with_parameters;

    if (!sf.history_state_supported) {
        var target = encodeURI(full_url);
        if (window.location != target) {
            window.location = target;
            return;
        }
    } else {
        if (push_state) {
            sf.ignore_next_url = true;
            History.pushState(null, "", full_url);
            sf.previous_url = full_url;
        }
    }

    sf.current_url = full_url;

    sf.current_class_and_details = sf.get_class_and_details_for_url(url_with_parameters);

    if (sf.current_class_and_details.class_name != null) {
        sf.use_page_class(sf.current_class_and_details);
    } else {
        //Show page not found
        SAFE.console.error("Page not found for url (" + sf.current_class_and_details.url + "). The full url was (" + url_with_parameters + ")");
        sf.use_page_class(null);
    }

    sf.url_changed(
        window.location.toString(),
        window.location.pathname,
        window.location.toString().substring(Site.origin.length),
        sf.initial_url
    );

    sf.initial_url = false;
}

var Site;
new SAFE();