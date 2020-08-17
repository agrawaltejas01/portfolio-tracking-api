const router = require('express').Router();
const chalk = require('chalk');

var requestBodyValidator = require("../utils/request-body-validations");
var utils = require("../utils/trades-utils");
var database = require('../utils/database-operations');


router.route("/addTrade").post(async (req, res) => {


    try {

        // Validate Request Body
        if (!requestBodyValidator.addTradeReqBody(req.body)) {
            throw new utils.errorBody("Invalid Body recieved", 400);
        }

        const security = await database.getNoOfShares(req.body.ticker);

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
        updates = utils.addTrade(currentNoOfShares, req.body);

        if (updates === null) {
            throw new utils.errorBody("Cannot sell more shares than we own right now");
        }

        // Do the update operation in database
        database.upsertSecurityTrades(req, res, updates);


    }
    catch (error) {
        console.log(chalk.red("Error in calling /addTrade : " + error.message));
        res.status(error.status).send("Error in calling in /addTrade : " + error.message);
    }


});



router.route("/updateTrade").patch(async (req, res) => {

    try {

        // Validate Request Body
        if (!requestBodyValidator.updateTradeReqBody(req.body)) {
            throw new utils.errorBody("Invalid Body recieved", 400);
        }

        const security = await database.getSecurityByTradeID(req.body.tradeId);

        // ticker does not exist
        if (security === null) {
            throw new utils.errorBody("No share was found (Perhaps wrong tradeId)");
        }

        // Get new value of noOfShares
        newNoOfShares = utils.updateTrade(security, req.body)

        // Warn user about the action
        if (newNoOfShares < 0)
            console.log(chalk.yellow.bold("total number of shares after deleting this trade will be negative"));

        // No trade with given tradeID was found
        if (newNoOfShares === null) {
            throw new utils.errorBody("No share was found (Perhaps Wrong tradeId)");
        }

        database.updateTrade(req, res, newNoOfShares);

    }
    catch (error) {
        console.log(chalk.red("Error in calling /updateTrade : " + error.message));
        res.status(error.status).send("Error in calling in /updateTrade : " + error.message);
    }

});

router.route("/deleteTrade").delete(async (req, res) => {

    try {
        // Delete Request Body
        if (!requestBodyValidator.deleteTradeReqBody(req.body)) {
            throw new utils.errorBody("Invalid Body recieved", 404);
        }

        const security = await database.getSecurityByTradeID(req.body.tradeId);

        // ticker does not exist
        if (security === null) {
            throw new utils.errorBody("No share was found (Perhaps wrong tradeId)");
        }

        // Get new value of noOfShares
        newNoOfShares = utils.deleteTrade(security)

        // Warn user about the action
        if (newNoOfShares < 0)
            console.log(chalk.yellow.bold("total number of shares after deleting this trade will be negative"));

        // No trade with given tradeID was found
        if (newNoOfShares === null) {
            throw new utils.errorBody("No share was found (Perhaps Wrong tradeId)");
        }

        database.deleteTrade(req, res, newNoOfShares);
    }
    catch (error) {
        console.log(chalk.red("Error in calling /deleteTrade : " + error.message));
        res.status(error.status).send("Error in calling in /deleteTrade : " + error.message);
    }
})

module.exports = router;