const app = require('./app');

// startup
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), "0.0.0.0", function() {
  console.log('Express server listening on port ' + server.address().port);
});
