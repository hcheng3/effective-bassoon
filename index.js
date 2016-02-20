var jf = require('jsonfile'),
    requester = require('request-promise'),
    express   = require('express');

var secrets = jf.readFileSync('./secrets.json');

var app = express();

app.get('/weather', function (req, res) {
  requester('http://api.openweathermap.org/data/2.5/weather?q=Krakow,pl&units=metric&APPID=' + secrets.appId)
    .then(function(weather) {
      res.send(weather);
    });
});

app.use('/assets', express.static('assets'));

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html')
});

app.listen(3000);
