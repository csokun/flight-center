const express = require('express');
const request = require('request');
const util = require('util');
const getAsync = util.promisify(request.get);
const app = new express();
const FLIGHT_API_BASE_URL = 'http://node.locomote.com/code-task';

// disable cache
app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});

app.get('/airlines', (req, res, next) => {
    getAsync(`${FLIGHT_API_BASE_URL}/airlines`)
        .then(result => res.json(JSON.parse(result.body)))
        .catch(next);    
});

app.get('/airports', (req, res, next) => {
    let q = req.query.q || '';
    getAsync(`${FLIGHT_API_BASE_URL}/airports?q=${q}`)
        .then(result => {
            try {
                let airports = JSON.parse(result.body);
                res.json(airports);
            } catch(e) {
                res.status(400).json({ message: result.body });
            }
        }).catch(next);
});

app.get('/search', (req, res, next) => {
    getAsync('${FLIGHT_API_BASE_URL}/airlines').then(result => {
        let airlines = JSON.parse(result.body);

        let queries = airlines.map(airline => {
            return getAsync(`${FLIGHT_API_BASE_URL}/flight_search/${airline.code}?date=2018-09-02&from=SYD&to=JFK`)
                .then(matched => {
                    try {
                        let schedules = JSON.parse(matched.body);
                        return schedules;
                    } catch(e) {
                        console.error(e);
                        return [];
                    }
                });
        });

        Promise.all(queries).then(schedules => {
            res.json(schedules.reduce((a, b) => a.concat(b) ));
        });
    }).catch(next);
});

// startup
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), "0.0.0.0", function() {
  console.log('Express server listening on port ' + server.address().port);
});
