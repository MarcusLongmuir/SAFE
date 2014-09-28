When the window is resized, SAFE calls ```.resize(resize_obj)``` on the active page object.

```resize_obj``` contains the following object

```json
{
	"window_width": (Equivalent to $(window).outerWidth()),
	"window_height": (Equivalent to $(window).outerWidth()),
	"doc_width": (Equivalent to $(document).width()),
	"doc_height": (Equivalent to $(document).height())
}
```