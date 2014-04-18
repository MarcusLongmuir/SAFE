Overview
==============
The SuperAwesome Front End (SAFE) framework allows you to easily create a web front end that has the following functionality:
* Instant page loading (using HTML5 history), falling back to conventional loading where unsupported.
* Animated transitions between pages.
* Javascript resize events sent through hierarchy.

To achieve this, SAFE sites are written in Javascript (that generate elements) rather than HTML markup. The intention is for all code to be object-oriented and well structured.

How to use
=============
Learn best from examples? Check out the examples folder. Run ```node app.js```
in an example folder to start it on ```http://localhost:5000```.

Include jQuery and the safe.min.js file. The safe.min.js file will create a Site variable that acts as a controller for all page loading and url handling.

However you choose to host the site, the contents of index.html should be sent to the client regardless of which page is requested. Calling ```Site.init()``` will load the page for the current url.

Internal links - those which would load pages within the site - should use the jquery.ajax_url plugin. This plugin prevents the default action (unless opened in a new tab or cmd/ctrl clicked) and loads the url using the framework.

```javascript
$("<a />").attr("href","/another_page").ajax_url()
```


The ```Site.path``` value is used to specify the folder within the domain that the site is contained within. E.g. if the "homepage" for the site was accessible at http://example.com/my_site/ then the ```Site.path``` would be "/my_site/". If the site's root is the domain then ```Site.path``` should be ignored.

Pages
==============
Each page is a subclass of ```Page```. The newly defined page should set the url patterns that it should be used for using the ```Site.add_url``` function with the url pattern and the class name. Multiple patterns can be set.
    
```javascript
Site.add_url("/mypage/",MyPage);
Site.add_url("/mypage/*",MyPage);
```

Resizing
==============
The window.resize event is captured and passed through the element hierarchy using a commmon ```.resize(resize_obj)``` function. The ```resize_obj``` parameter is a common object that can be used to pass useful values through the hierarchy. The ```Site.on_resize(resize_obj)``` callback is called first, allowing the opportunity to perform common calculations and insert them into the ```resize_obj``` so that pages can use them.

Code Convention
==============
Classes are named using CamelCase and variables/properties/functions are named using underscore_delimited.

e.g.
The class ```MyPage``` would be instantiated as

```javascript
var my_page = new MyPage();
```

Classes constructor definition:

```javascript
function MyPage(){
	var my_page = this;
}
```
    
Class functions definition:

```javascript
MyPage.prototype.function_name(){
	var my_page = this;
}
```

```var my_page = this;``` is used to prevent confusion regarding the keyword "this" within the context of an inner function.

Subclassing "SubClass" from "SuperClass":

```javascript
extend(SubClass, SuperClass);
function SubClass(parameters){
	var sub_class = this;
	SubClass.superConstructor.call(this);
}
```


Development
==============
* ```SiteFramework.js``` - the main logic of the framework - creates the Site global. Site.element is a jQuery-created div that holds the page objects.
* ```Page.js``` - superclass of all pages. Extend to create a new page.
* ```jquery.ajax_url.js``` - A jQuery plugin for <a> elements that point to other pages within the site.
* ```jquery.tappable.js``` - A third party jQuery plugin for touch + click events.
* ```jquery.history.js``` - A third party jQuery plugin for interacting with browser history events.


Building
==============
To build the safe.js and safe.min.js files, first install dependencies:
 ```bash
npm install
```

Then run grunt using:
```bash
grunt uglify:dev uglify:prod
```

TODO
==============
* Dynamic class loading for large sites - to prevent having to load increasingly large Javascript and CSS files.
* Add URL parsing for parameter names (e.g. post_id in "/posts/:post_id/comments")