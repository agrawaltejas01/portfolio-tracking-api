const express = require('express')
const bodyParser = require('body-parser');
const mongo = require("mongoose");
const cors = require('cors');
const chalk = require('chalk');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swagger/swagger')

const constants = require('./utils/constants')

const tradeRouter = require('./routers/trade-routes');
const portFolioRouter = require('./routers/portfolio-routes');

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());

var db = mongo.connect(constants.dataBaseUrl,
    {
        useNewUrlParser: true,
        useCreateIndex: true,

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/trade', tradeRouter);
app.use('/portfolio', portFolioRouter);

app.listen(port, () => console.log(chalk.green("API is running on " + port)));