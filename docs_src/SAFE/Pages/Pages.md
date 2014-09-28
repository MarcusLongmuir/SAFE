Each page is a subclass of ```Page```. The newly defined page should set the url patterns that it should be used for using the ```Site.add_url``` function with the url pattern and the class name or class itself. Multiple URL patterns can be set, as described in [Routing](/docs/SAFE/Routing).

The Page's constructor is called with a request object and the previous page, if one was present.

The request object contains the following keys:

* ```query```
	
	query parameters (e.g. "?my_param=3")

* ```params```
	
	Parameters that appear in the url scheme that was used parameters (e.g. "username" in "/user/:username").

* ```url_pattern```

	The URL pattern that was matched and caused this page class to be selected

* ```url```

	The URL that was requested.