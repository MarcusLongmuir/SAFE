This is the minimal example of a SAFE site. To start the server, run:

npm install
bower install
node app


*This will include the latest version of SAFE from Bower. If you want to avoid this (most likely for development of SAFE):

cd up to the SAFE directory (you're presumably reading this from the examples folder of the SAFE directory)

run:
bower link

This will tell bower that this is the local reference to the 'safe' package.

Now cd back to this directory and run:
bower link safe

This will symlink the SAFE directory to bower_components/safe in this directory, allowing you to modify the SAFE project and have the changes reflected in this example app.