const express = require('express');

import { HelperService } from "../app/services/helpers.service";
import { CustomErrorHandler } from "../app/classes/custom-error-handler";
import { AuthService } from "../app/services/auth.service";
import { Config } from "../config/config";
import { requestHeaderValidator } from "../app/validation/request-header-validator";

const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const cors = require('cors');
const http = require('http');
const Sentry = require('@sentry/node');
const requestIp = require('request-ip');
const app = express();

const config = new Config(process.env.NODE_ENV);
const customErrorHandler = new CustomErrorHandler();

Sentry.init({
    dsn: global.config.sentryUrl,
    autoBreadcrumbs: { console: false }
});

// IP address middleware.

app.use(requestIp.mw());

//Cross Origin Middleware.

app.use(cors());

// Request header validation;

app.use(requestHeaderValidator);

//Auth token verification middleware'

app.use(AuthService.verifyAuthentication);

//Body parsing middleware.

app.use(bodyParser.json());

// Global rate limiter

app.use(HelperService.apiLimiter());

// Auth route specific rate limiting

app.use('/users/authenticate', HelperService.apiLimiter(5, 10));
app.use('/users/register', HelperService.apiLimiter(5, 10));

MongoClient.connect(global.config.dbUrl, (err: any, database: any) => {
    (err) && console.log(err);
    const db = database.db('menu');

    require('../app/routes')(app, db);

    // Error handling middleware.

    app.use(customErrorHandler.handleErrors);

    http.createServer(app).listen(global.config.httpPort,() => {
        console.log((`App is running at http://localhost:${global.config.httpPort} in ${global.config.name} mode`));
        console.log('port' + global.config.httpPort, 'env' + app.get('env'));
    });
});

