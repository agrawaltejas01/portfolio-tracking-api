const router = require('express').Router();
const chalk = require('chalk');

var validateTradeData = require("../utils/trades-utils").validateTradeData;
var validateUpdateNoOfShares = require("../utils/trades-utils").validateUpdateNoOfShares;
var deleteOrUpdateTrade = require("../utils/trades-utils").deleteOrUpdateTrade;

var getSecurityByID = require('../utils/database-operations').getSecurityByID;
var updateSecurityTrades = require('../utils/database-operations').updateSecurityTrades;
var updateTrade = require('../utils/database-operations').updateTrade;
var deleteTrade = require('../utils/database-operations').deleteTrade;

router.route("/addTrade").post(async (req, res) => {


    try {
        if (!validateTradeData(req.body)) {
            throw "Error in data validation"
        }
        const security = await getSecurityByID(req.body.ticker);

        // If security exists, get value of noOfShares
        if (security) {
            var currentNoOfShares = security.noOfShares;
        }

        // Else we will have to create new security
        // Initialize value of currentNoOfShares to 0
        else {
            var currentNoOfShares = 0;
        }

        // Validate and update noOfShares
        updates = validateUpdateNoOfShares(currentNoOfShares, req.body);

        if (updates === null) {
            throw "Cannot sell more shares than we own right now"
        }

        // Do the update operation in database
        updateSecurityTrades(req, res, updates);


    }
    catch (error) {
        console.log(chalk.red("Error in calling /addTrade : " + error));
        res.status(400).send("Error in calling in /addTrade : " + error);
    }


});



router.route("/updateTrade").patch(async (req, res) => {

    try {

        if (!validateTradeData(req.body)) {
            throw "Error in data validation"
        }

        const security = await getSecurityByID(req.body.ticker);

        // ticker does not exist
        if (security === null) {
            throw "No share was found (Perhaps wrong ticker)";
        }

        // Get new value of noOfShares
        newNoOfShares = deleteOrUpdateTrade(security, req.body, 1)

        // Warn user about the action
        if (newNoOfShares < 0)
            console.log(chalk.yellow.bold("total number of shares after deleting this trade will be negative"));

        // No trade with given tradeID was found
        if (newNoOfShares === null) {
            throw "No share was found (Perhaps Wrong tradeId)"
        }

        updateTrade(req, res, newNoOfShares);

    }
    catch (error) {
        console.log(chalk.red("Error in calling /updateTrade : " + error));
        res.status(400).send("Error in calling in /updateTrade : " + error);
    }

});

router.route("/deleteTrade").delete(async (req, res) => {

    try {

        const security = await getSecurityByID(req.body.ticker);

        // ticker does not exist
        if (security === null) {
            throw "No share was found (Perhaps wrong ticker)";
        }

        // Get new value of noOfShares
        newNoOfShares = deleteOrUpdateTrade(security, req.body, 0)

        // Warn user about the action
        if (newNoOfShares < 0)
            console.log(chalk.yellow.bold("total number of shares after deleting this trade will be negative"));

        // No trade with given tradeID was found
        if (newNoOfShares === null) {
            throw "No share was found (Perhaps Wrong tradeId)"
        }

        deleteTrade(req, res, newNoOfShares);
    }
    catch (error) {
        console.log(chalk.red("Error in calling /deleteTrade : " + error));
        res.status(400).send("Error in calling in /deleteTrade : " + error);
    }
})

module.exports = router;