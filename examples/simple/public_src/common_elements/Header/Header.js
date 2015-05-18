function Header() {
    var header = this;

    header.element = $("<div />").append(
        $("<a />",{"href":"/"}).ajax_url()
        .text("HomePage ")
    ,
        $("<a />",{"href":"/pagetwo/"}).ajax_url()
        .text("PageTwo ")
    ,
        $("<a />",{"href":"/param_page/came_from_header"}).ajax_url()
        .text("ParamPage ")
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

    //Can react to resizing
}