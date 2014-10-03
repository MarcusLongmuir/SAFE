SAFE.extend(HomePage, Page);

function HomePage(req) {
    var page = this;

    HomePage.superConstructor.call(this);

    page.element.addClass("home_page").append(
        $("<div />")
        .text("This example is powered by the SuperAwesome Front End framework")
    ,
        $("<a />",{href:"/pagetwo/"})
        .text("Go to page 2")
        .ajax_url()
    ,
        $("<div />") //Just for break
    ,
        $("<a />",{href:"/param_page/from_homepage"})
        .text("Link to /param_page/from_homepage")
        .ajax_url()
    ,
        page.stats_element = $("<div />")
    )
}
SAFE.add_url("/", HomePage);

HomePage.prototype.get_title = function() {
    var page = this;
    return null;
}

HomePage.prototype.init = function() {
    var page = this;

}

HomePage.prototype.remove = function() {
    var page = this;

}

HomePage.prototype.resize = function(resize_obj) {
    var page = this;
    page.stats_element.text("Document width: " + resize_obj.window_width + " Document height: " + resize_obj.window_height + " Large screen: " + resize_obj.large_screen);
}