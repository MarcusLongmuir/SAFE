function NotFoundPage(req) {
    var page = this;

    page.element = $("<div />").addClass("not_found_page");

    //Render the JSX template into the page.element.
    //Uses diff rather than destroying + recreating
    React.render(
        <div>
            <div>404 - Page not found</div>
            <a href='/'>Go back to homepage</a>
        </div>,
        page.element[0]//React wants the DOM element (not jQuery wrapped)
    );

    //Need to add events to <a/> tags for no-reload routing
    page.element.ajax_url();
}
//No urls - only accessible when used as a 404 page

NotFoundPage.prototype.get_title = function() {
    return "Page Not Found";
}