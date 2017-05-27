const webPush = require('web-push')
const express = require('express')
var bodyParser = require('body-parser')
const app = express()
app.set('port', (process.env.PORT || 3001))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
webPush.setGCMAPIKey('BGGVP-YnOCGyLSqDenJGe7tkmqbNgyKjUlzlpCRtgU2YBvonZZWh5vgNhiyB6MoVe06L-8LW47l7zKvhFa1R-8U');


app.post('/register', function(req, res) {
  console.log(req);
  res.sendStatus(201)
});

app.post('/sendNotification', function(req, res) {
  //console.log('notification', req.body);
  setTimeout(function() {
    webPush.sendNotification({
      endpoint: req.body.endpoint,
      TTL: req.body.ttl,
      keys: {
        p256dh: req.body.key,
        auth: req.body.authSecret
      }
    }, req.body.payload)
    .then(function() {
      res.sendStatus(201);
    })
    .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  }, req.body.delay * 1000);
});


app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`)
});
