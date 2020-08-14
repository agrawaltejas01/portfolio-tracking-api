const router = require('express').Router();
const trades = require('../schema/trades-schema');
const chalk = require('chalk');
const ObjectId = require('mongodb').ObjectID;

var calculateReturns = require("../utils/portfolio-utils").calculateReturns;
var calculateAvgBuyPrice = require("../utils/portfolio-utils").calculateAvgBuyPrice

router.route("/fetchPortFolios").get((req, res) => {
    trades.find()
        .then((trades) => {
            res.json(trades);
        }).catch((err) => console.log(chalk.red("Error in portfolio/fetchPortFolios : " + err)));
});

router.route("/fetchHoldings").get((req, res) => {
    trades.find()
        .then((trades) => {

            var securities = [];

            trades.forEach((trade) => {


                var currentSecurity = {
                    ticker: trade._id,
                    averageBuyPrice: calculateAvgBuyPrice(trade.trades),
                    shares: trade.noOfShares
                }

                securities.push(currentSecurity);
            })

            res.json(securities);
        }).catch((err) => console.log(chalk.red("Error in portfolio/fetchHoldings : " + err)));
});

router.route("/fetchReturns").get((req, res) => {
    trades.find()
        .then((trades) => {


            var totalReturn = 0;

            trades.forEach((trade) => {
                totalReturn += calculateReturns(trade);
            })

            res.json({
                totalReturn: totalReturn
            });
        }).catch((err) => console.log(chalk.red("Error in portfolio/fetchHoldings : " + err)));
});

module.exports = router;