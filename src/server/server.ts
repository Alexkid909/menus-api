import { CustomerErrorHandler } from "../app/classes/customerErrorHandler";
import {required} from "joi";

const express = require('express');
const bodyParser = require("body-parser");
const db = require('../config/db');
const MongoClient = require("mongodb").MongoClient;
const cors = require('cors');
// require request-ip and register it as middleware
const requestIp = require('request-ip');

const port = 3001;
const app = express();
const customErrorHandler = new CustomerErrorHandler();


app.set('port', process.env.PORT || port);

// IP address middleware.

app.use(requestIp.mw());

//Body parsing middleware.

app.use(bodyParser.json());

//Cross Origin Middleware.

app.use(cors());

MongoClient.connect(db.url, (err: any, database: any) => {
    (err) && console.log(err);
    const db = database.db('menu');

    require('../app/routes')(app, db);

    // Error handling middleware.

    app.use(customErrorHandler.handleErrors);

    app.listen(app.get('port'),() => {
        const date = new Date().toString();
        console.log(date);
        console.log(('App is running at http://localhost:%d in %s mode'),
            app.get('port'), app.get('env'));
    })
});

