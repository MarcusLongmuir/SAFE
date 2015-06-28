function ParamPage(req) {
    var page = this;

    page.my_param = req.params.my_param;

    page.element = $("<div />").addClass("param_page");

    React.render(
        <div>
            Param page loaded with: "{page.my_param}". Use your back button.
        </div>,
        page.element[0]//React wants the DOM element (not jQuery wrapped)
    );
}
SAFE.add_url("/param_page/:my_param", ParamPage);

ParamPage.prototype.get_title = function() {
    var page = this;
    return page.my_param;
}