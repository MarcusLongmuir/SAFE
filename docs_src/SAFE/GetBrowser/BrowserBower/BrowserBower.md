SAFE is available as a [Bower](http://bower.io) package. To install into your existing project, use:

```bash
bower install safe --save
```

Alternatively, if you do not have an existing ```bower.json``` file, an example is shown to the right. If you use this file, all you need to run is:

```bash
bower install
```

####bower_components location####
By default bower components are installed to ```./bower_components/```. If you want to install the bower components to a public folder (e.g. you aren't bundling your javascript), then you will want to create a ```.bowerrc``` file that indicates the directory to install bower components to. An example is provided to the right.