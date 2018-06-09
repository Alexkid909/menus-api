const express = require('express');
const bodyParser = require("body-parser");
const db = require('../config/db');
const MongoClient = require("mongodb").MongoClient;

const port = 3001;
const app = express();

app.set('port', process.env.PORT || port);

app.use(bodyParser.urlencoded({extend: true}));

MongoClient.connect(db.url, (err: any, database: any) => {
    (err) && console.log(err);

    app.listen(app.get('port'),() => {
        const date = new Date().toDateString();
        console.log(date);
        console.log(('App is running at http://localhost:%d in %s mode'),
            app.get('port'), app.get('env'));
    })
});

