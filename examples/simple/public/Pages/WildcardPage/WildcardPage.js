Site.extend(WildcardPage, Page);

function WildcardPage(parameters, url, wildcard_contents) {
    var page = this;

    WildcardPage.superConstructor.call(this);

    page.element.addClass("wildcard_page").append(
        $("<div />").text("Wildcard page loaded with: \"" + wildcard_contents + "\". Use your back button.")
    )
}
Site.add_url("/wildcard/*", WildcardPage);

WildcardPage.prototype.get_title = function() {
    var page = this;
    return "Wildcard Page";
}

WildcardPage.prototype.init = function() {
    var page = this;

}

WildcardPage.prototype.remove = function() {
    var page = this;

}

WildcardPage.prototype.resize = function(resize_obj) {
    var page = this;

}