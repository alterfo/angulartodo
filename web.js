var express = require('express');

var app = express();


var fs = require('fs');
var buf = fs.readFileSync('index.html');
var string = buf.toString();


app.get('/', function(request, response) {
    response.send(string);
});
app.use("/", express.static(__dirname + "/"));

var port = process.env.PORT || 5000;

app.listen(port, function() {
    console.log("Listening on " + port);
});