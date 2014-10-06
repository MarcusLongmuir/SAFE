var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
app.set('port', process.env.PORT || 5000);
app.use(express.static(path.join(__dirname, '../public')));

//Serve the same html file (if a static file wasn't served)
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../public_src/root.html'));
});

http.createServer(app).listen(app.get('port'), function() {
    console.log('Server started on port ' + app.get('port'));
});