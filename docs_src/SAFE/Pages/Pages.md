Each page is a subclass of ```Page```. The newly defined page should set the url patterns that it should be used for using the ```SAFE.add_url``` function with the url pattern and the class name or class itself. Multiple URL patterns can be set, as described in [Routing](/docs/safe/Routing).

The page's constructor is called with a request object and the previous page, if one was present.

The request object contains the following keys:

* ```query```
	
	query parameters (e.g. "?my_param=3&another=4") as an object:

        {
            "my_param": "3",
            "another": "4"
        }

* ```params```
	
	Parameters that appear in the url scheme (e.g. ```username``` in ```"/user/:username"```) as an object.

* ```url_pattern```

	The URL pattern that was matched and caused this page class to be selected

* ```url```

	The URL that was requested (without query parameters).

* ```url_with_query```

	The URL that was requested (with query parameters).