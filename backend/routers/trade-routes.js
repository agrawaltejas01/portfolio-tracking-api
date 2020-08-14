const router = require('express').Router();
const trades = require('../schema/trades-schema');
const chalk = require('chalk');
const ObjectId = require('mongodb').ObjectID;

var validateTradeData = require("../utils/utils").validateTradeData;
var updateAvgBuyPrice = require("../utils/utils").updateAvgBuyPrice

var getSecurityByID = async (id) => {

    var security = await trades.findById(id);
    console.log(security);
    return security;

}

var updateSecurityTrades = (req, res, updates) => {

    trades.updateOne(
        {
            _id: req.body.ticker
        },

        {
            $push: {
                trades:
                {
                    _id: new ObjectId(),
                    action: req.body.action,
                    quantity: req.body.quantity,
                    price: req.body.price,
                }
            },

            $set: {
                avgBuyPrice: updates.newAvgBuyPrice,
                noOfShares: updates.newNoOfShares
            }
        },

        {
            upsert: true
        }
    ).then(() => {
        res.send("New Trade was successfully added in security : " + req.body.ticker);
    }).catch((err) => {
        console.log(chalk.red("Error in adding trade(/addTrade) for Error : " + err));
    });

}

router.route("/addTrade").post((req, res) => {

    if (!validateTradeData(req.body)) {
        console.log(chalk.red("Error in /addTrade"));
        res.header(400).send("Error in data validations");
        return;
    }

    getSecurityByID(req.body.ticker).then((security) => {

        if (security) {
            var currentNoOfShares = security.noOfShares;
            var currentAvgBuyPrice = security.avgBuyPrice;
        }

        else{
            var currentNoOfShares = 0;
            var currentAvgBuyPrice = 0; 
        }

        updates = updateAvgBuyPrice(currentNoOfShares, currentAvgBuyPrice, req.body);

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

router.route("updateTrade").patch((req, res) => {

    if (!validateTradeData(req.body)) {
        console.log(chalk.red("Error in /addTrade"));
        res.header(400).send("Error in data validations");
        return;
    }

    trades.updateOne(
        {
            "trades._id" : new ObjectId(req.body.tradeId)
        },

        {
            "trades.$.action" : req.body.action,
            "trades.$.quantity" : req.body.quantity,
            "trades.$.price" : req.body.price,
        }
    ).then(() => {
        res.send("Trade was successfully updated");
    }).catch(() => console.log(chalk.red("Error in updating trade(/updateTrade) for security : " + req.body.id));
    
});

router.route("/deleteTrade").delete((req, res) => {

    trades.updateOne(
        {
            _id: req.body.ticker
        },

        {
            $pull: {
                trades: {
                    _id: new ObjectId(req.body.tradeId)
                }
            }
        }
    ).then(() => res.send("Successfully removed the trade from given ticker"))
        .catch((err) => console.log(chalk.red("Error in trade/deleteTrade : " + err)));
})

module.exports = router;