function PageTwo(req) {
    var page = this;

    page.element = $("<div />").addClass("page_two");

    //Render the JSX template into the page.element.
    //Uses diff rather than destroying + recreating
    React.render(
        <div>
            <div>This is page two</div>
            <a href='/'>Go back to homepage</a>
        </div>,
        page.element[0]//React wants the DOM element (not jQuery wrapped)
    );

    //Need to add events to <a/> tags for no-reload routing
    page.element.ajax_url();
}
SAFE.add_url("/pagetwo/", PageTwo);

PageTwo.prototype.get_title = function() {
    return "Page Two";
}