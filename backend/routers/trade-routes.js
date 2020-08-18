const router = require('express').Router();
const chalk = require('chalk');

var requestBodyValidator = require("../utils/request-body-validations");
var utils = require("../utils/trades-utils");
var database = require('../utils/database-operations');

router.route("/").post(async (req, res) => {


    try {

        // Validate Request Body
        if (!requestBodyValidator.addTradeReqBody(req.body)) {
            throw new utils.errorBody("Invalid Body recieved", 400);
        }

        // Get current noOfShares
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


        // Do the update operation in database
        database.upsertSecurityTrades(req, res, updates);


    }
    catch (error) {
        console.log(chalk.red("Error in calling /addTrade : " + error.message));
        res.status(error.status).send("Error in calling in /addTrade : " + error.message);
    }


});


var getNewNumberOfShares = async (req, update = 1) => {

    var security = await database.getSecurityByTradeID(req.params.tradeId.toString());

    // ticker does not exist
    if (security === null) {
        throw new utils.errorBody("No trade was found (Perhaps wrong tradeId)", 404);
    }

    // Get new value of noOfShares
    if (update)
        newNoOfShares = utils.updateTrade(security, req.body);

    else
        newNoOfShares = utils.deleteTrade(security)

    // Do not allow user to do the action, if resulting noOfShares are less than 0
    if (newNoOfShares < 0) {
        console.log(newNoOfShares);
        console.log(chalk.red.bold("Operation will make total number of shares less than 0. Cannot be permitted"));
        throw new utils.errorBody("Operation will make total number of shares less than 0. Cannot be permitted", 400);
    }

    // No trade with given tradeID was found
    if (newNoOfShares === null) {
        throw new utils.errorBody("No trade was found (Perhaps Wrong tradeId)", 404);
    }

    // security object is sent for sending to response
    return security = {
        ticker: security._id,
        newNoOfShares: newNoOfShares
    };

}


router.route("/:tradeId").patch(async (req, res) => {

    try {

        // Validate Request Body
        if (!requestBodyValidator.updateTradeReqBody(req)) {
            throw new utils.errorBody("Invalid Body recieved", 400);
        }

        // Get new noOfShares
        var updatedSecurity = await getNewNumberOfShares(req, 1);

        // Perform update operation on database
        database.updateTrade(req, res, updatedSecurity);

    }
    catch (error) {
        console.log(chalk.red("Error in calling /updateTrade : " + error.message));
        res.status(error.status).send("Error in calling in /updateTrade : " + error.message);
    }

});

router.route("/:tradeId").delete(async (req, res) => {

    try {

        // Validate Request Body
        if (!requestBodyValidator.deleteTradeReqBody(req)) {
            throw new utils.errorBody("Invalid Body recieved", 400);
        }

        // Get new noOfShares
        var updatedSecurity = await getNewNumberOfShares(req, 0);

        // Perform update operation on database
        database.deleteTrade(req, res, updatedSecurity);
    }
    catch (error) {
        console.log(chalk.red("Error in calling /deleteTrade : " + error.message));
        res.status(error.status).send("Error in calling in /deleteTrade : " + error.message);
    }
})

module.exports = router;