var jf = require('jsonfile'),
    rp = require('request-promise');

var secrets = jf.readFileSync('./secrets.json');

rp('http://api.openweathermap.org/data/2.5/weather?q=Krakow,pl&units=metric&APPID=' + secrets.appId)
  .then(function(response) {
    console.log(response);
  });