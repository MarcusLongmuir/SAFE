SAFE.extend(PageTwo, Page);

function PageTwo(parameters, url) {
    var page = this;

    PageTwo.superConstructor.call(this);

    page.element.addClass("page_two").append(
        $("<div />")
        .text("This is page two")
    ,
        $("<a />",{href:'/'})
        .text("Go back to homepage")
        .ajax_url()
    )
}
SAFE.add_url("/pagetwo/", PageTwo);

PageTwo.prototype.get_title = function() {
    var page = this;
    return "Page Two";
}

PageTwo.prototype.init = function() {
    var page = this;

}

PageTwo.prototype.remove = function() {
    var page = this;

}

PageTwo.prototype.resize = function(resize_obj) {
    var page = this;

}