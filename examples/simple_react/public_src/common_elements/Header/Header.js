function Header() {
    var header = this;

    header.element = $("<div />")
    .addClass("header")
    .css("background-color", "rgba(" +
        Math.round(Math.random() * 255) + "," +
        Math.round(Math.random() * 255) + "," +
        Math.round(Math.random() * 255) + "," +
        Math.random() +
    ")")

    //Render the JSX template into the header.element.
    //Uses diff rather than destroying + recreating
    React.render(
        <div>
            <a href="/">HomePage </a>
            <a href="/pagetwo">PageTwo </a>
            <a href="/param_page/came_from_header">ParamPage </a>
            <span>This header changes color only when the page is reloaded</span>
        </div>,
        header.element[0]//React wants the DOM element (not jQuery wrapped)
    );

    //Need to add events to <a/> tags for no-reload routing
    header.element.ajax_url();
}

Header.prototype.resize = function(resize_obj) {
    var header = this;

    //Can react to resizing
}