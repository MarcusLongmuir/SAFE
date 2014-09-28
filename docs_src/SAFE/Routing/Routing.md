SAFE performs URL routing and handles the browser history state. Routes are added for pages using:

```javascript
Site.add_url("/blog/:post_title", BlogPostPage);
```

Using the ```:post_title``` syntax allows portions of the URL to be mapped to parameter names.

The parameter values are accessible using the request object that is provided in the Page constructor.

Wildcards can also be used and are provided in the request object's parameters under the key ```'*'```.

```javascript
Site.add_url("/doc/*", DocumentPage);
```