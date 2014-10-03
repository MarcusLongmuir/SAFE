function Header() {
    var header = this;

    header.element = $("<div />").append(
        $("<a />",{"href":"/"})
        .text("HomePage ")
        .ajax_url()
    ,
        $("<a />",{"href":"/pagetwo/"})
        .text("PageTwo ")
        .ajax_url()
    ,
        $("<a />",{"href":"/param_page/came_from_header"})
        .text("ParamPage ")
        .ajax_url()
    ,
        $("<span />")
        .text("This header changes color only when the page is reloaded")
    ).css("background-color", "rgba(" +
        Math.round(Math.random() * 255) + "," +
        Math.round(Math.random() * 255) + "," +
        Math.round(Math.random() * 255) + "," +
        Math.random() +
    ")")
}

Header.prototype.resize = function(resize_obj) {
    var header = this;
}