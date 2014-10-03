SAFE provides optional callbacks for various events affecting the current page.

* ```init``` is called after the page is appended to the DOM.

* ```remove``` is called prior to the page being removed from the DOM.

* ```new_url``` is called when the current page can handle the new route being loaded.
	
	If this method is undefined, a new instance of the page is used.

* ```resize``` is called before the page transition, after the page transition and upon each window resize event.