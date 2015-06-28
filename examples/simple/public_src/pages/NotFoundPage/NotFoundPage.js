function NotFoundPage(req) {
    var page = this;

    page.element = $("<div />").addClass("not_found_page").append(
        $("<div />").text("404 - Page not found")
        ,
        $("<a />",{href:'/'}).ajax_url()
        .text("Go back to homepage")
    )
}
//No urls - only accessible when used as a 404 page

NotFoundPage.prototype.get_title = function() {
    return "Page Not Found";
}