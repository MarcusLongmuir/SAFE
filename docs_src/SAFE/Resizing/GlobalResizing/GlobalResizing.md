Most sites have elements that persist between pages such as headers, menus and footer elements. To deliver resize events to these elements, use the ```SAFE.on_resize``` callback.

The example to the right defines a ```Header``` element with a ```.resize``` function and passes the ```resize_obj``` to it from ```SAFE.on_resize```.