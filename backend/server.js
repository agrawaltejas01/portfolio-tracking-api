const express = require('express')
const bodyParser = require('body-parser');
const mongo = require("mongoose");
const cors = require('cors');
const chalk = require('chalk');

const tradeRouter = require('./routers/trade-routes');
const portFolioRouter = require('./routers/portfolio-routes');

const app = express();
const port = process.env.PORT || 8000;

// used so that we can directly use req.body
// Otherwise we have to use JSON.parse() and all those things
app.use(bodyParser.json());

var db = mongo.connect('mongodb://127.0.0.1:27017/portfolio-tracker',
    {
        useNewUrlParser: true,
        useCreateIndex : true,

    },
    function (error, response) {
        if (error) {
            console.log(chalk.red("Error in connecting to database"));
            console.log(error);
        }

        else
            console.log(chalk.green("Successfully connected to database portfolio-tracker"));
    }
)

app.use(cors());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('/trade', tradeRouter);
app.use('/portfolio', portFolioRouter);

app.listen(port, () => console.log(chalk.green("API is running on 8080")));