import {ApiErrorBody} from "../app/classes/apiErrorBody";
import { Response } from "express";

const express = require('express');
const bodyParser = require("body-parser");
const db = require('../config/db');
const MongoClient = require("mongodb").MongoClient;
const cors = require('cors');

const port = 3001;
const app = express();

app.set('port', process.env.PORT || port);

//Body parsing middleware.

app.use(bodyParser.json());

//Cross Origin Middleware.

app.use(cors());

//Error handling middleware.

app.use((err: any, req: Request, res: Response, next: any) => {
    console.log('middleware err', err);
    res.status(500).send(new ApiErrorBody());
});

MongoClient.connect(db.url, (err: any, database: any) => {
    (err) && console.log(err);
    const db = database.db('menu');

    require('../app/routes')(app, db);

    app.listen(app.get('port'),() => {
        const date = new Date().toString();
        console.log(date);
        console.log(('App is running at http://localhost:%d in %s mode'),
            app.get('port'), app.get('env'));
    })
});

