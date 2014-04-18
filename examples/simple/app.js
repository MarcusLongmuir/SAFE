var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
app.set('port', process.env.PORT || 5000);
app.use(express.static(path.join(__dirname, 'public')));

/* Required because safe.min.js isn't in this directory. 
 * If it were then this could be omitted. */
var fs = require('fs');
app.set('views', __dirname);
app.engine('js', function(path, options, cb) {
    fs.readFile(path, 'utf-8', cb);
});
app.get('/safe.min.js', function(req, res) {
    res.render('../../safe.min.js');
});


//Serve the same html file (if a static file wasn't served)
app.get('/*', function(req, res) {
    res.sendfile('public/index.html');
});
http.createServer(app).listen(app.get('port'), function() {
    console.log('Server started on port ' + app.get('port'));
});