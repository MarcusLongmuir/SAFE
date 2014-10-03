SAFE.extend(ParamPage, Page);

function ParamPage(req) {
    var page = this;

    page.my_param = req.params.my_param;

    ParamPage.superConstructor.call(this);

    page.element.addClass("param_page").append(
        $("<div />")
        .text("Param page loaded with: \"" + req.params.my_param + "\". Use your back button.")
    )
}
SAFE.add_url("/param_page/:my_param", ParamPage);

ParamPage.prototype.get_title = function() {
    var page = this;
    return page.my_param;
}

ParamPage.prototype.init = function() {
    var page = this;
}

ParamPage.prototype.remove = function() {
    var page = this;
}

ParamPage.prototype.resize = function(resize_obj) {
    var page = this;
}