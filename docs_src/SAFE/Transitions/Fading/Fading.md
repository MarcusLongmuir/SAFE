The fading example code provided performs the following:

* Appends the new page element

* If there is an old page:
	
	* Checks the inline style height and calculated height of the new page

	* Sets the height of the new page element to the old page element's height

	* Absolutely positions the old page element and sets its width and height to prevent it from changing during transition.

	* Fades out the old page in 500ms, revealing the new page element

	* Removes the old page element

	* Animates the new page element's height to its original calculated or set height in 500ms