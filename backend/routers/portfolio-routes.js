const router = require('express').Router();
const chalk = require('chalk');

var validatePortFolioUrlBody = require("../utils/request-body-validations").validatePortFolioUrlBody
var getAllSecurities = require("../utils/database-operations").getAllSecurities;
var utils = require("../utils/portfolio-utils");

var errorBody = require("../utils/trades-utils").errorBody;

router.route("/").get(async (req, res) => {

    try {

        // Validate request body
        if (!validatePortFolioUrlBody(req.body))
            throw new errorBody("/fetchPortFolios Does not accept any parameters", 400);

        // Read operation on database
        const securityAndtrades = await getAllSecurities();

        console.log("Successful requeset from /portfolio/")
        var securities = [];

        // Prepare response object body
        securityAndtrades.forEach((security) => {
            var currentSecurity = {
                ticker: security._id,
                trades: security.trades
            };

            securities.push(currentSecurity);
        })
        res.status(200).json(securities);
    }
    catch (error) {
        console.log(chalk.red("Error in portfolio/ : " + error.message));
        res.status(error.status).send("Error : " + error.message);
    }
});

router.route("/holdings").get(async (req, res) => {

    try {
        // Validate request body
        if (!validatePortFolioUrlBody(req.body))
            throw new errorBody("/holdings does not accept any parameters", 400);

        // Read operation on database
        const securityAndtrades = await getAllSecurities();

        var securities = [];

        // Prepare response object body
        securityAndtrades.forEach((security) => {

            var currentSecurity = {
                ticker: security._id,
                averageBuyPrice: utils.calculateAvgBuyPrice(security.trades),
                shares: security.noOfShares
            }

            securities.push(currentSecurity);
        })
        console.log("Successful requeset from /portfolio/holdings")
        res.status(200).json(securities);
    }
    catch (error) {
        console.log(chalk.red("Error in portfolio/holdings : " + error.message))
        res.status(error.status).send("Error : " + error.message);
    }
});

router.route("/returns").get(async (req, res) => {

    try {

        // Validate request body
        if (!validatePortFolioUrlBody(req.body))
            throw new errorBody("/returns Does not accept any parameters", 400);

        // Read operation on database
        const securityAndtrades = await getAllSecurities();

        var totalReturn = 0;
        securityAndtrades.forEach((security) => {

            totalReturn += utils.calculateReturns(security);
        })

        console.log("Successful requeset from /portfolio/returns");

        // Prepare response object body
        res.status(200).json({
            totalReturn: totalReturn
        });
    }
    catch (error) {
        console.log(chalk.red("Error in portfolio/returns : " + error.message))
        res.status(error.status).send("Error : " + error.message);
    }
});

module.exports = router;