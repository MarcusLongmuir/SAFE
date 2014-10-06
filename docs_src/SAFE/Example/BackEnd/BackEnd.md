The same HTML file should be served for every route that SAFE will handle. This can be achieved in [Node](http://nodejs.org) using the code provided on the right (also found in the "minimal" example in the [SAFE project repository](https://github.com/SuperAwesomeLTD/SAFE/)).

This code will serve ```public/index.html``` for every request that doesn't get served by a static file.