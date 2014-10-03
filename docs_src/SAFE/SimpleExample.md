The example to the right shows an extremely simple SAFE site - just two pages with links between them. Click the "Run on CodePen" button to  try it out.

The example first includes [jQuery](http://jquery.com) and the ```safe.min.js``` file. ```The safe.min.js``` file will create a ```SAFE``` singleton that acts as a controller for all page loading and url handling.

Two pages are defined (```HomePage``` and ```AboutPage```) by ```SAFE.extend```ing ```Page```. Each page is assigned a URL that it will respond to using ```SAFE.add_url```.

Internal links - those linking to pages within the site - should use the ```ajax_url``` plugin. This plugin prevents the default action (unless opened in a new tab or cmd/ctrl clicked) and loads the URL using SAFE.

The ```SAFE.path``` value is used to specify the folder within the domain that the site is contained within. For example, if the "homepage" for the site was accessible at http://example.com/my_site/ then the ```SAFE.path``` would be ```"/my_site/"```. If the site's root is the domain then ```SAFE.path``` should be ignored. For the purposes of this example, it has been set to the first url that is opened to make it work on CodePen.

```SAFE.init``` loads the current address.