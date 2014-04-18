Site.extend(HomePage, Page);

function HomePage(parameters, url) {
    var page = this;

    HomePage.superConstructor.call(this);

    page.element.addClass("home_page").append(
        $("<div />").text("This example is powered by the SuperAwesome Front End framework")
    ).append(
        $("<a href='/pagetwo/' />").text("Go to page 2")
        .ajax_url()
    ).append(
        $("<div />") //Just for break
    ).append(
        $("<a href='/wildcard/any_string_here' />")
        .text("Link to wildcard page")
        .ajax_url()
    ).append(
        $("<br />")
    ).append(
        page.stats_element = $("<div />")
    )
}
Site.add_url("/", HomePage);
Site.add_url("/index.html", HomePage);

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
    page.stats_element.text("Document width: " + resize_obj.doc_width + " Document height: " + resize_obj.doc_height + " Large screen: " + resize_obj.large_screen);

}