function PageTwo(req) {
    var page = this;

    page.element = $("<div />").addClass("page_two").append(
        $("<div />").text("This is page two")
        ,
        $("<a />",{href:'/'}).ajax_url()
        .text("Go back to homepage")
    )
}
SAFE.add_url("/pagetwo/", PageTwo);

PageTwo.prototype.get_title = function() {
    return "Page Two";
}