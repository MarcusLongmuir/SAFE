function ParamPage(req) {
    var page = this;

    page.my_param = req.params.my_param;

    page.element = $("<div />").addClass("param_page").append(
        $("<div />").text("Param page loaded with: \"" + req.params.my_param + "\". Use your back button.")
    )
}
SAFE.add_url("/param_page/:my_param", ParamPage);

ParamPage.prototype.get_title = function() {
    return page.my_param;
}