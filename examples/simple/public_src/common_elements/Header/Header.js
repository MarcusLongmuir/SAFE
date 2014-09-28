function Header() {
    var header = this;

    header.element = $("<div />").append(
        $("<a />").text("HomePage ")
        .attr("href", "/")
        .ajax_url()
    ).append(
        $("<a />").text("PageTwo ")
        .attr("href", "/pagetwo/")
        .ajax_url()
    ).append(
        $("<a />").text("ParamPage ")
        .attr("href", "/param_page/came_from_header")
        .ajax_url()
    ).append(
        $("<span />").text("This header changes color only when the page is reloaded")
    )

    .css("background-color", "rgba(" +
        Math.round(Math.random() * 255) + "," +
        Math.round(Math.random() * 255) + "," +
        Math.round(Math.random() * 255) + "," +
        Math.random() +
        ")")
}

Header.prototype.resize = function(resize_obj) {
    var header = this;
}