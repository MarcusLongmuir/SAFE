@import("../bower_components/history.js/scripts/bundled-uncompressed/html5/jquery.history.js");
@import("jquery.ajax_url.js");
@import("jquery.tap.js");
@import("Page.js");
function SAFEClass() {
    var sf = this;

    SAFE = this;
    Site = this;//Legacy alias

    sf.initial_url = true;
    sf.urls = [];
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
    SAFEClass.console = cons;
} else {
    SAFEClass.console = console;
}

//Used to subclass Javascript classes
SAFEClass.prototype.extend = function(sub, sup) {
    function emptyclass() {}
    emptyclass.prototype = sup.prototype;
    sub.prototype = new emptyclass();
    sub.prototype.constructor = sub;
    sub.superConstructor = sup;
    sub.superClass = sup.prototype;
}

SAFEClass.prototype.url_changed = function(url) {
    var sf = this;

};

SAFEClass.prototype.on_resize = function(resize_obj) {
    var sf = this;
};

SAFEClass.prototype.pre_load = function(class_obj, details, old_page) {
    var sf = this;

    //Must return undefined (null shows 404)
};

SAFEClass.prototype.transition_page = function(new_page, old_page){
    var sf = this;

    return false;
}

SAFEClass.prototype.parse_query_string = function(query_string) {
    var query_split = query_string.split('&');
    var params = {};
    for (var i = 0; i < query_split.length; i++) {
        pair = query_split[i].split('=');
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }

    return params;
}

SAFEClass.prototype.build_query_string = function(params) {
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

SAFEClass.prototype.scroll_to_anchor = function(anchor){
    var sf = this;

    if(anchor[0]!==undefined){
        $(window).scrollTop(anchor.offset().top);
    }
}

SAFEClass.prototype.use_page_class = function(details){
    var sf = this;

    var class_name = details.class_name;

    var class_obj;
    sf.current_details = details;
    if((typeof class_name)==='string'){
        //This is the name of a class, rather than the class itself

        var found_class = window[class_name];
        if(found_class===undefined){
            if(sf.load_page_class!==null){

                var load_class = class_name;

                sf.load_page_class(load_class,function(class_def, class_css){
                    var css = document.createElement("style");
                    css.type = "text/css";
                    if (css.styleSheet){
                        css.styleSheet.cssText = class_css;
                    } else {
                        css.appendChild(document.createTextNode(class_css));
                    }
                    $("head")[0].appendChild(css);

                    //Re-add class_name because it will be removed
                    details.class_name = class_name;
                    if(sf.current_details===details){
                        sf.use_page_class(details);
                    }
                });

                if(sf.loading_page!==null){
                    class_obj = sf.loading_page;
                } else {
                    return;
                }

            } else {
                SAFEClass.console.error("The requested class ("+class_name+") was not found and dynamic class loading is not enabled");
                class_obj = null;
            }
        } else {
            class_obj = found_class;
        }
    } else {
        class_obj = class_name;
    }

    if (class_obj == null) { //404
        if (sf.no_page_found_class == null) {
            if (sf.current_page != null) {
                if(sf.current_page.remove){
                    sf.current_page.remove();
                }
                sf.current_page = null;
                sf.previous_class = null;
            }
            SAFEClass.console.error("No 404 page set. Use SAFE.set_no_page_found_class(class_name) to set one.");
            return;
        } else {
            class_obj = sf.no_page_found_class;
        }
    }

    var redirect_response;
    if(typeof class_obj.redirect === 'function'){
        redirect_response = class_obj.redirect(details);
    } else if(typeof class_obj.prototype.redirect === 'function'){
        redirect_response = class_obj.prototype.redirect(details);
    }
    if (redirect_response !== undefined) {
        if((typeof redirect_response) === 'function'){
            //Given a class
        } else if(redirect_response===null){
            //Load the 404 page
            details.class_name = null;
            sf.use_page_class(details);
            return;
        } else {
            //Load as URL
            sf.load_url(redirect_response, false);
        }
        return;
    }

    if (class_obj === sf.previous_class && sf.current_page.new_url) {
        var new_url_response = sf.current_page.new_url(details);

        if(new_url_response===false){
            //Explicit false - the page doesn't want to handle this request
        } else {
            //The page is handling this request
            if(details.anchor){
                sf.scroll_to_anchor($("a[name*='"+details.anchor+"']"));
            }
            return;
        }
    }

    var old_page = null;
    if (sf.current_page != null) {
        if(sf.current_page.remove){
            sf.current_page.remove();
        }
        old_page = sf.current_page;
    }

    var pre_load_response = sf.pre_load(class_obj, details, old_page);

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
            sf.load_url(pre_load_response, false);
        }
        return;
    }

    var details_for_page = JSON.parse(JSON.stringify(details));

    //Would create a circular structure if details were output via JSON.stringify
    delete details_for_page.class_name;

    /* Anonymous class used to get a reference to the new page before
     * calling the constructor such that SAFE.current_page works in the
     * constructor. */
    var anon_class = function(){};
    anon_class.prototype = class_obj.prototype;
    sf.current_page = new anon_class();

    var new_page = class_obj.call(sf.current_page, details_for_page, old_page);
    sf.previous_class = class_obj;

    //Call before page transition to give the opportunity to correctly size any page elements
    sf.resize();

    var transition_response = sf.transition_page(sf.current_page, old_page, details_for_page);

    if (transition_response === true) {
        //The callback handled the page switching
    } else {
        sf.element.empty();
        sf.element.append(sf.current_page.element);
    }
    if(sf.current_page.init){
        sf.current_page.init();
    }

    //Call the global resize function to correctly position everything
    sf.resize();

    if(details.anchor){
        sf.scroll_to_anchor($("a[name*='"+details.anchor+"']"));
    }
}

SAFEClass.prototype.set_no_page_found_class = function(class_name) {
    var sf = this;
    sf.no_page_found_class = class_name;
}

//Alias for set_no_page_found_class
SAFEClass.prototype.set_404 = function(class_name) {
    var sf = this;
    sf.no_page_found_class = class_name;
}

SAFEClass.prototype.ajax_post = function(request) {
    request.cache = false;
    request.type = "post";
    request.contentType = "application/json; charset=utf-8",
    request.data = JSON.stringify(request.data);
    request.dataType = "json";
    return $.ajax(request);
}

SAFEClass.prototype.ajax_get = function(request) {
    request.cache = false;
    request.dataType = "json";
    request.type = "get";
    return $.ajax(request);
}

SAFEClass.prototype.ajax_delete = function(request) {
    request.cache = false;
    request.dataType = "json";
    request.type = "delete";
    return $.ajax(request);
}

SAFEClass.prototype.resize = function() {
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

    if (sf.current_page != null && sf.current_page.resize) {
        sf.current_page.resize(sf.resize_obj);
    }
}

SAFEClass.prototype.init = function(desired_url) {
    var sf = this;

    var path_name = window.location.pathname;
    if (window.location.search != null) {
        path_name += window.location.search;
    }
    if (window.location.hash != null) {
        path_name += window.location.hash;
    }

    var current_url = path_name;
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

        History.Adapter.bind(window, 'statechange', function() {
            if (sf.ignore_next_url) {
                sf.ignore_next_url = false;
                return;
            }
            var state = History.getState();
            if (state != null) {
                sf.load_url(state.url, false);
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

SAFEClass.prototype.reload_page = function() {
    var sf = this;

    sf.use_page_class(sf.current_class_and_details);
}

SAFEClass.prototype.replace_current_url = function(new_url, call_url_changed) {
    /* Change the current url without loading any new page or providing a new url to the current page. This function is rarely useful and should be avoided in most circumstances. */
    var sf = this;

    call_url_changed = (typeof call_url_changed)!="undefined" ? call_url_changed: true;

    var previous_ignore_value = sf.ignore_next_url;
    sf.ignore_next_url = true;
    History.replaceState(null, "", SAFE.origin + new_url);
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

SAFEClass.prototype.add_history_state = function(url){
    var sf = this;

    var full_url;
    if(url.substring(0,SAFE.origin.length)===SAFE.origin){
        full_url = url;
    } else {
        full_url = SAFE.origin + url;
    }

    sf.ignore_next_url = true;
    History.pushState(null, "", full_url);
}

SAFEClass.prototype.add_url = function(url, class_name) {
    var sf = this;

    sf.urls.push([url,class_name]);
}

SAFEClass.prototype.add_url_map = function(url_map, class_name) {
    var sf = this;

    for(var url in url_map){
        var class_name = url_map[url];
        sf.add_url(url, class_name);
    }
}

SAFEClass.prototype.scroll_bar_width = function() {
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

SAFEClass.prototype.get_class_for_url = function(url_with_query) {
    var sf = this;

    var class_and_details = sf.get_class_and_details_for_url(url_with_query);

    var class_def = window[class_and_details.class_name];
    if(class_def===undefined){
        class_def = class_and_details.class_name;
    }

    if (class_and_details != null) {
        return class_def;
    }
    return null;
}

SAFEClass.prototype.get_class_and_details_for_url = function(url_with_query) {
    var sf = this;

    var query_params = {};

    //Gets "anchors"
    var split_by_hash = url_with_query.split("#");
    var anchor = split_by_hash[1];

    var url_split = split_by_hash[0].split("?");
    if (url_split.length > 1) {
        query_params = sf.parse_query_string(url_split[1]);
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
            SAFEClass.console.error("The requested url (" + url_with_query + ") was not relative to the domain/origin and within the SAFE.path scope");
            return null;
        }
        url = url.substring(effective_path.length - 1);
    }


    var url_parts = url.split("/");
    if(url_parts[url_parts.length-1]===""){
        //Remove empty last
        url_parts.pop();
    }

    if(url_parts[0]===""){
        //Remove empty first
        url_parts.shift();
    }

    //Defaults
    var class_name = null;
    var url_params = {};
    var url_pattern = null;

    //Loop through the available names to check for wildcard paths
    for (var i = 0; i < sf.urls.length; i++) {

        var map_pair = sf.urls[i];

        var map_url = map_pair[0];
        var map_class_name = map_pair[1];

        var this_url_params = {};

        var map_url_parts = map_url.split("/");
        if(map_url_parts[map_url_parts.length-1]===""){
            //Remove empty last
            map_url_parts.pop();
        }


        var substring_start = 0;
        if(map_url_parts[0]===""){
            //Remove empty first
            map_url_parts.shift();
            substring_start++;
        }

        if(map_url_parts.length>url_parts.length){
            continue;
        }

        var is_valid = true;
        var had_wildcard = false;
        for(var k = 0; k < map_url_parts.length; k++){
            var map_part = map_url_parts[k];
            var part = url_parts[k];
            if(map_part[0]===":"){
                var param_name = map_part.substring(1);
                this_url_params[param_name] = decodeURIComponent(part);
            } else if(map_part[0]==="*"){
                is_valid = true;
                had_wildcard = true;
                this_url_params["*"] = url.substring(substring_start);
                break;
            } else if(map_part!==part) {
                is_valid = false;
                break;
            }
            substring_start+=part.length+1;
        }
        if(!had_wildcard && url_parts.length!==map_url_parts.length){
            is_valid = false;
        }
        if(!is_valid){
            continue;
        }

        class_name = map_class_name;
        url_params = this_url_params;
        url_pattern = map_url;
        break;
    }

    return {
        'class_name': class_name,
        'query': query_params,
        'params': url_params,
        'anchor': anchor,
        'url': url,
        'url_pattern': url_pattern,
        'url_with_query': url_with_query.substring(effective_path.length-1),
        'full_url': SAFE.origin+url,
        'initial': sf.initial_url
    };
}

SAFEClass.prototype.load_url = function(url_with_query, push_state) {
    var sf = this;

    if(typeof push_state === 'undefined'){
        push_state = true;
    }

    var full_url;
    if(url_with_query.substring(0,SAFE.origin.length)===SAFE.origin){
        full_url = url_with_query;
    } else {
        full_url = SAFE.origin + url_with_query;
    }

    if (!sf.history_state_supported) {
        var target = full_url;
        if (window.location != target && window.location != full_url) {
            window.location = target;
            return;
        }
    } else {
        sf.ignore_next_url = true;
        if (push_state) {
            History.pushState(null, "", full_url);
            sf.previous_url = full_url;
        } else {
            History.replaceState(null, "", full_url);
        }
        sf.ignore_next_url = false;
    }

    sf.current_url = full_url;

    sf.current_class_and_details = sf.get_class_and_details_for_url(url_with_query);

    if (sf.current_class_and_details.class_name == null) {
        SAFEClass.console.error("Page not found for url (" + sf.current_class_and_details.url + "). The full url was (" + url_with_query + ")");
    }
    sf.use_page_class(sf.current_class_and_details);

    sf.url_changed(
        window.location.toString(),
        window.location.pathname,
        window.location.toString().substring(Site.origin.length),
        sf.initial_url
    );

    sf.initial_url = false;
}

var Site;
var SAFE;
new SAFEClass();
