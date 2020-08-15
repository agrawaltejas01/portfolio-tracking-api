const router = require('express').Router();
const trades = require('../schema/trades-schema');
const chalk = require('chalk');

var getAllSecurities = require("../utils/database-operations").getAllSecurities;

var calculateReturns = require("../utils/portfolio-utils").calculateReturns;
var calculateAvgBuyPrice = require("../utils/portfolio-utils").calculateAvgBuyPrice;

router.route("/fetchPortFolios").get(async (req, res) => {

    try {
        const securityAndtrades = await getAllSecurities();

        console.log(securityAndtrades);
        res.status(200).json(securityAndtrades);
    }
    catch (error) {
        console.log(chalk.red("Error in portfolio/fetchPortFolios : " + error));
        res.status(400).send("Error : " + error);
    }
});

router.route("/fetchHoldings").get(async (req, res) => {

    try {
        const securityAndtrades = await getAllSecurities();

        var securities = [];
        securityAndtrades.forEach((security) => {

            var currentSecurity = {
                ticker: security._id,
                averageBuyPrice: calculateAvgBuyPrice(security.trades),
                shares: security.noOfShares
            }

            securities.push(currentSecurity);
        })

        res.status(200).json(securities);
    }
    catch (error) {
        console.log(chalk.red("Error in portfolio/fetchHoldings : " + error))
        res.status(400).send("Error : " + error);
    }
});

router.route("/fetchReturns").get(async (req, res) => {

    try {
        const securityAndtrades = await getAllSecurities();

        var totalReturn = 0;
        securityAndtrades.forEach((security) => {

            totalReturn += calculateReturns(security);
        })

        res.status(200).json({
            totalReturn: totalReturn
        });
    }
    catch (error) {
        console.log(chalk.red("Error in portfolio/fetchReturns : " + error))
        res.status(400).send("Error : " + error);
    }
});

module.exports = router;