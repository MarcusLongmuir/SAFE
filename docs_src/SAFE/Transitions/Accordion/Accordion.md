The accordion example code provided performs the following:

* Appends the new page element

* If there is an old page:
	
	* Hides the new page

	* Calls jQuery's ```.slideUp``` function on the old page element with a duration of 500ms.

	* Simultaneously calls jQuery's ```.slideDown``` function on the new page elemnent with a duration of 500ms.

	* Removes the old page element upon animation completion.