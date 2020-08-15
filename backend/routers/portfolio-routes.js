const router = require('express').Router();
const chalk = require('chalk');

var validatePortFolioUrlBody = require("../utils/request-body-validations").validatePortFolioUrlBody
var getAllSecurities = require("../utils/database-operations").getAllSecurities;
var utils = require("../utils/portfolio-utils");

var errorBody = require("../utils/trades-utils").errorBody;

router.route("/fetchPortFolios").get(async (req, res) => {

    try {

        if (!validatePortFolioUrlBody(req.body))
            throw new errorBody("/fetchPortFolios Does not accept any parameters", 404);

        const securityAndtrades = await getAllSecurities();

        console.log(securityAndtrades);
        res.status(200).json(securityAndtrades);
    }
    catch (error) {
        console.log(chalk.red("Error in portfolio/fetchPortFolios : " + error.message));
        res.status(error.status).send("Error : " + error.message);
    }
});

router.route("/fetchHoldings").get(async (req, res) => {

    try {

        if (!validatePortFolioUrlBody(req.body))
            throw new errorBody("/fetchHoldings Does not accept any parameters", 404);

        const securityAndtrades = await getAllSecurities();

        var securities = [];
        securityAndtrades.forEach((security) => {

            var currentSecurity = {
                ticker: security._id,
                averageBuyPrice: utils.calculateAvgBuyPrice(security.trades),
                shares: security.noOfShares
            }

            securities.push(currentSecurity);
        })

        res.status(200).json(securities);
    }
    catch (error) {
        console.log(chalk.red("Error in portfolio/fetchHoldings : " + error.message))
        res.status(error.status).send("Error : " + error.message);
    }
});

router.route("/fetchReturns").get(async (req, res) => {

    try {

        if (!validatePortFolioUrlBody(req.body))
            throw new errorBody("/fetchReturns Does not accept any parameters", 404);

        const securityAndtrades = await getAllSecurities();

        var totalReturn = 0;
        securityAndtrades.forEach((security) => {

            totalReturn += utils.calculateReturns(security);
        })

        res.status(200).json({
            totalReturn: totalReturn
        });
    }
    catch (error) {
        console.log(chalk.red("Error in portfolio/fetchReturns : " + error.message))
        res.status(error.status).send("Error : " + error.message);
    }
});

module.exports = router;