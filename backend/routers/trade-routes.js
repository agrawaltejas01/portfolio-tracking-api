const router = require('express').Router();
const trades = require('../schema/trades-schema');
const chalk = require('chalk');
const ObjectId = require('mongodb').ObjectID;

var validateTradeData = require("../utils/utils").validateTradeData;
var updateAvgBuyPrice = require("../utils/utils").updateAvgBuyPrice;
var deleteOrUpdateTrade = require("../utils/utils").deleteOrUpdateTrade;

var getSecurityByID = async (id) => {

    var security = await trades.findById(id);
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
                    timeStamp : new Date(),
                    action: req.body.action,
                    quantity: req.body.quantity,
                    price: req.body.price,
                }
            },

            $set: {
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
        }

        else {
            var currentNoOfShares = 0;
        }

        updates = updateAvgBuyPrice(currentNoOfShares, req.body);

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

var updateTrade = function (req, res, newNoOfShares) {
    trades.updateOne(
        {
            "trades._id": new ObjectId(req.body.tradeId)
        },

        {
            "trades.$.action": req.body.action,
            "trades.$.quantity": req.body.quantity,
            "trades.$.price": req.body.price,

            $set: {
                noOfShares: newNoOfShares
            }
        },

    ).then(() => {
        res.send("Trade was successfully updated");
    }).catch(() => console.log(chalk.red("Error in updating trade(/updateTrade) for security : " + req.body.id)));
}

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

var deleteTrade = function (req, res, newNoOfShares) {
    trades.updateOne(
        {
            _id: req.body.ticker
        },

        {
            $pull: {
                trades: {
                    _id: new ObjectId(req.body.tradeId)
                }
            },

            $set: {
                noOfShares: newNoOfShares
            }
        }
    ).then(() => res.send("Successfully removed the trade from given ticker"))
        .catch((err) => console.log(chalk.red("Error in trade/deleteTrade : " + err)));
}

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