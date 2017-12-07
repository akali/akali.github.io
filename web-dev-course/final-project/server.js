var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

// app.set('views', path.join(__dirname, 'views/'));
// app.set('view engine', 'jade');
const https = require('https');
 
https.get('https://slider.kz/new/include/vk_auth.php?act=source1&q=face&page=0.json', (resp) => {
  let data = '';
 
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });
 
  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log(JSON.parse(data).explanation);
  });
 
}).on("error", (err) => {
  console.log("Error: " + err.message);
});

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res, next) {
	console.log(req + ' ' + res + ' ' + next);
	var callback = req.query.callback;
	res.end(callback + '(' + '\"Hi!\"' + ')');
});

app.get('/getjsonp', function (req, res, next) {
  
  var callback = req.query.callback;
  res.writeHead(200, { 'Content-Type': 'application/javascript' });
  res.end(callback + '(' + JSON.stringify(data) + ')');
});

app.listen(3000);
