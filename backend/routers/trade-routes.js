const router = require('express').Router();
const chalk = require('chalk');

var validateTradeData = require("../utils/trades-utils").validateTradeData;
var validateUpdateNoOfShares = require("../utils/trades-utils").validateUpdateNoOfShares;
var deleteOrUpdateTrade = require("../utils/trades-utils").deleteOrUpdateTrade;

var getSecurityByID = require('./database-operations').getSecurityByID;
var updateSecurityTrades = require('./database-operations').updateSecurityTrades;
var updateTrade = require('./database-operations').updateTrade;
var deleteTrade = require('./database-operations').deleteTrade;

router.route("/addTrade").post((req, res) => {

    if (!validateTradeData(req.body)) {
        console.log(chalk.red("Error in /addTrade"));
        res.header(400).send("Error in data validations");
        return;
    }

    getSecurityByID(req.body.ticker).then((security) => {

        if (security) {
            var currentNoOfShares = security.noOfShares;
        }

        else {
            var currentNoOfShares = 0;
        }

        updates = validateUpdateNoOfShares(currentNoOfShares, req.body);

        if (updates === null) {
            console.log(chalk.red("Cannot sell more shares than we own right now"));
            res.header(400).send("Cannot sell more shares than we own right now");
            return;
        }

        updateSecurityTrades(req, res, updates);

    }).catch((err) => {
        console.log("Error in calling getSecurityByID " + err);
    });


});



router.route("/updateTrade").patch((req, res) => {

    getSecurityByID(req.body.ticker).then((security) => {

        // ticker does not exist
        if (security === null) {
            res.send("No share was found");
            return;
        }

        if (!validateTradeData(req.body)) {
            console.log(chalk.red("Error in /updateTrade"));
            res.header(400).send("Error in data validations");
            return;
        }

        newNoOfShares = deleteOrUpdateTrade(security, req.body, 1)

        if (newNoOfShares < 0)
            console.log(chalk.yellow.bold("total number of shares after deleting this trade will be negative"));

        // No trade with given tradeID was found
        if (newNoOfShares === null) {
            res.send("No share was found");
            return;
        }

        updateTrade(req, res, newNoOfShares);
    }).catch((err) => {
        console.log("Error in calling getSecurityByID " + err);
    });


});

router.route("/deleteTrade").delete((req, res) => {

    getSecurityByID(req.body.ticker).then((security) => {

        // ticker does not exist
        if (security === null) {
            res.send("No share was found");
            return;
        }

        newNoOfShares = deleteOrUpdateTrade(security, req.body, 0)

        if (newNoOfShares < 0)
            console.log(chalk.yellow.bold("total number of shares after deleting this trade will be negative"));

        // No trade with given tradeID was found
        if (newNoOfShares === null) {
            res.send("No share was found");
            return;
        }

        deleteTrade(req, res, newNoOfShares);
    }).catch((err) => {
        console.log("Error in calling getSecurityByID " + err);
    });
})

module.exports = router;