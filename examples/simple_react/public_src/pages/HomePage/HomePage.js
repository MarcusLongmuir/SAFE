function HomePage(req) {
    var page = this;

    //Create the page element that SAFE will use
    page.element = $("<div/>").addClass("home_page")

    //Set some properties that can't be undefined in render
    page.large_screen = false;
    page.timer_completed = false;

    page.render();
}
SAFE.add_url("/", HomePage);

HomePage.prototype.init = function() {
    var page = this;

    setTimeout(function(){
        page.timer_completed = true;
        page.render();
    },2000);
};

HomePage.prototype.render = function(){
    var page = this;

    //Render the JSX template into the page.element.
    //Uses diff rather than destroying + recreating
    React.render(
        <div>
            <div>This example is powered by the SuperAwesome Front End framework</div>
            <a href="/pagetwo/">Go to page 2</a>
            <div></div>
            <a href="/param_page/from_homepage">Link to /param_page/from_homepage</a>
            <div>
                <div>Document width: {page.width}px</div>
                <div>Document height: {page.height}px</div>
                <div>Large screen: {page.large_screen.toString()}</div>
                <div>Timer completed (2 seconds after init): {page.timer_completed.toString()}</div>
            </div>
        </div>,
        page.element[0]//React wants the DOM element (not jQuery wrapped)
    );

    //Need to add events to <a/> tags for no-reload routing
    page.element.ajax_url();
}

//Use the resize event from SAFE to modify properties + re-render
HomePage.prototype.resize = function(resize_obj) {
    var page = this;

    page.width = resize_obj.window_width;
    page.height = resize_obj.window_height;
    page.large_screen = resize_obj.large_screen;

    page.render();
}