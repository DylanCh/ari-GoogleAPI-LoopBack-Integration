'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

var unirest = require("unirest");



app.get('/test',function(request,response){
  var theme = request.query.theme;
  var dataArray;
  var req = unirest("GET", "https://core.ac.uk:443/api-v2/articles/search/"+request.query.theme);

  req.query({
    "page": "1",
    "pageSize": "10",
    "metadata": "true",
    "fulltext": "false",
    "citations": "false",
    "similar": "false",
    "duplicate": "false",
    "urls": "false",
    "faithfulMetadata": "false",
    "apiKey": ""
  });

  req.headers({
    "postman-token": "4715b309-2ea8-d53f-d93e-a913e7880b97",
    "cache-control": "no-cache"
  });


  req.end(function (res) {
    if (res.error) throw new Error(res.error);

    console.log(res.body);

     dataArray = res.body.data;
     response.setHeader('content-type','application/json');
    response.send(dataArray);
    response.end();

  });    



    
});

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
