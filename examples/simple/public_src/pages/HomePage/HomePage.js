function HomePage(req) {
    var page = this;

    page.element = $("<div />").addClass("home_page").append(
        $("<div />").text("This example is powered by the SuperAwesome Front End framework"),
        $("<a />",{href:"/pagetwo/"}).ajax_url().text("Go to page 2"),
        $("<div />"), //Just for break
        $("<a />",{href:"/param_page/from_homepage"}).ajax_url().text("Link to /param_page/from_homepage"),
        page.stats_element = $("<div />").append(
            $("<div />").append(
                $("<span />").text("Document width: "),
                page.width_span = $("<span />")
            )
            ,
            $("<div />").append(
                $("<span />").text("Document height: "),
                page.height_span = $("<span />")
            ),
            $("<div />").append(
                $("<span />").text("Large screen: "),
                page.large_screen_span = $("<span />")
            ),
            $("<div />").append(
                $("<span />").text("Timer completed (2 seconds after init): "),
                page.timer_span = $("<span />").text("false")
            )
        )
    )
}
SAFE.add_url("/", HomePage);

HomePage.prototype.init = function() {
    var page = this;

    setTimeout(function(){
        page.timer_completed = true;
        page.timer_span.text("true");
    },2000);
}

HomePage.prototype.resize = function(resize_obj) {
    var page = this;
    
    page.width_span.text(resize_obj.window_width + "px");
    page.height_span.text(resize_obj.window_height + "px");
    page.large_screen_span.text(resize_obj.large_screen.toString());
}