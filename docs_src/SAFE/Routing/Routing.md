SAFE performs URL routing and handles the browser history state. Routes are added for pages using:

```javascript
SAFE.add_url("/blog/:post_title", BlogPostPage);
```

Using the ```:parameter_name``` syntax allows portions of the URL to be mapped to parameter names.

The parameter values are accessible using the request object that is provided in the Page constructor.

Wildcards can also be used and are provided in the request object's parameters under the key ```'*'```.

```javascript
SAFE.add_url("/doc/*", DocumentPage);
```

To specify a class to show in the event that none of the routes match, use ```set_404```:

```javascript
SAFE.set_404(NotFoundPage);
```