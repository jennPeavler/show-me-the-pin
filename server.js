const webPush = require('web-push')
const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/show_me_the_pins';
const promise = require('bluebird');
const pgp = require('pg-promise')({
    promiseLib: promise
});
const db = pgp(connectionString);
app.set('port', (process.env.PORT || 3001))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
webPush.setGCMAPIKey('BGGVP-YnOCGyLSqDenJGe7tkmqbNgyKjUlzlpCRtgU2YBvonZZWh5vgNhiyB6MoVe06L-8LW47l7zKvhFa1R-8U');


// const vapidKeys = {
//   publicKey: 'BGGVP-YnOCGyLSqDenJGe7tkmqbNgyKjUlzlpCRtgU2YBvonZZWh5vgNhiyB6MoVe06L-8LW47l7zKvhFa1R-8U',
//   privateKey: 'H7eTw9rLYYyrML9fDIqkhloYjUPo11y5cJ8zng1hIPA'
// }
//
// webpush.setVapidDetails(
//   'mailto:jenn.peavler@gmail.com',
//   vapidKeys.publickKey,
//   vapidKeys.privateKey
// )

app.post('/api/save-subscription', (req, res) => {
  console.log(req.body)
  db.none('INSERT INTO subscriptions(subscription) values($1)', [req.body])
  .then(()=> {
    res.sendStatus(201)
  })
  .catch((err) => {
    res.sendStatus(500);
  })
});

app.get('/api/save-subscription', (req, res, next) => {
  db.any('select * from subscriptions')
  .then(data => {
    console.log(data);
    res.status(200).json({
      status: 'success',
      data: data,
      message: 'Retrieved push subscriptions'
    })
  }).catch(err=>next(err))
})

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
