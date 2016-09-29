'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Bear = require('./app/models/bear');

mongoose.connect('mongodb://localhost:27017/node-express-tutorial');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function (req, res, next) {
    console.log('Something is happening.');
    next();
});

router.get('/', function (req, res) {
    res.json({message: 'Hello world!'});
});

router.route('/bears')
    .get(function (req, res) {
        Bear.find(function(err, bears) {
            if (err) {
                res.send(err);
            }
            res.json(bears);
        })
    })
    .post(function (req, res) {
        var bear = new Bear();
        bear.name = req.body.name;

        bear.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'Bear created!'});
        });
    });

router.route('/bears/:bear_id')
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function (err, bear) {
            if (err) {
                res.send(err);
            }
            res.json(bear);
        });
    })
    .put(function (req, res) {
        Bear.findById(req.params.bear_id, function (err, bear) {
            if (err) {
                res.send(err);
            }

            bear.name = req.body.name;

            bear.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({message: 'Bear updated!'});
            });
        });
    });

app.use('/api', router);

app.listen(port);
console.log('Server started. Listening on port ' + port);
