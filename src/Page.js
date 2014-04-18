function Page() {
    var page = this;
    page.element = $("<div />");
}

Page.prototype.new_url = function() {
    return "NOT_SET";
}

Page.prototype.get_title = function() {
    return null;
}

Page.prototype.resize = function(resize_obj) {}

Page.prototype.init = function() {}

Page.prototype.remove = function() {}