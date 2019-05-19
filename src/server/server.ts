const express = require('express');

import { CustomerErrorHandler } from "../app/classes/customerErrorHandler";
import { AuthService } from "../app/services/auth.service";
import { Config } from "../config/config";
import { NextFunction } from "express";

import { CustomRequest } from "../app/classes/request/customRequest";
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const cors = require('cors');
const https = require('https');
const http = require('http');
const fs = require('fs');

const requestIp = require('request-ip');

const app = express();
const customErrorHandler = new CustomerErrorHandler();


const config = new Config(process.env.NODE_ENV);
//

// IP address middleware.

app.use(requestIp.mw());

//Cross Origin Middleware.

app.use(cors());

//Auth token verification middleware'

app.use(AuthService.verifyAuthentication);

//Body parsing middleware.

app.use(bodyParser.json());

app.use((req: CustomRequest, res: any, next: NextFunction) => {
    if(req.secure) {
        next();
    } else {
        res.redirect(301, `https://${req.headers.host.split(':')[0]}:${global.config.httpsPort}${req.url}`);
    }
});

MongoClient.connect(global.config.dbUrl, (err: any, database: any) => {
    (err) && console.log(err);
    const db = database.db('menu');

    require('../app/routes')(app, db);

    // Error handling middleware.

    app.use(customErrorHandler.handleErrors);

    const key = fs.readFileSync('src/cert/server.key');
    const cert = fs.readFileSync('src/cert/server.cert');

    http.createServer(app).listen(global.config.httpPort,() => {
        const date = new Date().toString();
        console.log(date);
        console.log(('App is running at http://localhost:%d in %s mode'),
            global.config.httpPort, app.get('env'));
    });

    https.createServer({key, cert}, app).listen(global.config.httpsPort,() => {
        const date = new Date().toString();
        console.log(date);
        console.log(('App is running at https://localhost:%d in %s mode'),
            global.config.httpsPort, app.get('env'));
    })
});

