function calculateY(x, k) {
  return k * Math.sin(x);
}

function generateX() {
  var x = [];
  for(var it = 0; it < 100; it++) {
    x.push((it/100) * 2 * Math.PI);
  };

  return x;
}

$.get('http://localhost:3000/weather', function(data) {
  var parsedData = JSON.parse(data);
  var lat = parsedData.coord.lat;
  var lon = parsedData.coord.lon;

  var amp = (lat + lon) / 2;

  var ctx = $('#longLatPlot').get(0).getContext('2d');

  var x = generateX();

  var y = [];

  var labels = [];

  for(var it = 0; it < x.length; it++) {
    y.push(calculateY(x[it], amp));
    labels.push('');
  }

  var chartData = {
    labels: labels,
    datasets: [
      {
        label: 'My First dataset',
        fillColor: 'rgba(220,220,220,0.2)',
        strokeColor: 'rgba(220,220,220,1)',
        pointColor: 'rgba(220,220,220,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: y
      }
    ]
  };

  var myNewChart = new Chart(ctx).Line(chartData, {
    omitXLabels: true
  });
});