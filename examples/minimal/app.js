var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
app.set('port', process.env.PORT || 5000);
app.use(express.static(path.join(__dirname, 'public')));

//Serve the same html file for all paths (if a static file wasn't served)
app.use('/*', function(req, res) {
    res.sendFile('public/index.html');
});
http.createServer(app).listen(app.get('port'), function() {
    console.log('Server started on port ' + app.get('port'));
});