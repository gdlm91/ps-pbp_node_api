let request = require('request').defaults({
    json: true
});
let async = require('async');

module.exports = function (app) {

    /** Read */
    app.get('/pets', function (req, res) {

        async.parallel({

            cats: function (cb) {
                request({ uri: 'http://localhost:3001/cats' }, function (err, response, body) {
                    if(err) return cb({service: 'cats', err: err});

                    if (response.statusCode !== 200) return cb({service: 'cats', statusCode: response.statusCode});

                    cb(null, body.data);
                })
            },

            dogs: function (cb) {
                request({ uri: 'http://localhost:3002/dogs' }, function (err, response, body) {
                    if(err) return cb({service: 'dogs', err: err});

                    if (response.statusCode !== 200) return cb({service: 'dogs', statusCode: response.statusCode});

                    cb(null, body.data);
                })
            }

        }, function (err, results) {
            res.json({
                err: err,
                results: results
            })
        })

    })

    /** Ping */
    app.get('/ping', function(req, res) {
        res.json({pong: Date.now()});
    })

}