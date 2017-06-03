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

app.post('/api/save-subscription', (req, res) => {
  // console.log(req.body)
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
    const subscription = data[0].subscription
    webPush.setVapidDetails(
      'mailto:jenn.peavler@gmail.com',
      'BGGVP-YnOCGyLSqDenJGe7tkmqbNgyKjUlzlpCRtgU2YBvonZZWh5vgNhiyB6MoVe06L-8LW47l7zKvhFa1R-8U',
      'H7eTw9rLYYyrML9fDIqkhloYjUPo11y5cJ8zng1hIPA'
    )
    res.status(200).json({
      status: 'success',
      data: data,
      message: 'Retrieved push subscriptions'
    })

    return webPush.sendNotification(subscription, 'Pinball Nearby')
    .then(console.log('push notification sent'))

  }).catch(err=>next(err))
})

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`)
});
