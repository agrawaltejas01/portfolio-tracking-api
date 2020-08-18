const trades = require('../schema/trades-schema');
const ObjectId = require('mongodb').ObjectID;
const chalk = require('chalk');

var getAllSecurities = async () => {
    try {
        var securities = await trades.find();
        return securities;
    }
    catch (error) {
        console.log(chalk.red("Error in getAllSecurities : " + error));
        res.status(400).send("Error in getAllSecurities : " + error);
    }
};

// Get current noOfShares with ticker
var getNoOfShares = async (ticker) => {

    try {
        var security = await trades.findOne(
            {
                _id: ticker
            },

            {
                noOfShares: 1
            }
        );
        return security;
    }
    catch (error) {
        console.log(chalk.red("Error in getNoOfShares : " + error));
        res.status(400).send("Error in getNoOfShares : " + error);
    }

};

// Get requested trade and currnet noOfShares
var getSecurityByTradeID = async (tradeId) => {

    console.log("Inside getSecurityByTradeID \n" + tradeId);
    try {
        var security = await trades.findOne(
            {
                "trades._id": new ObjectId(tradeId)
            },

            {
                // Project only that trade, which matches the tradeId
                trades: {
                    $elemMatch: {
                        _id: new ObjectId(tradeId)
                    }
                },
                noOfShares: 1
            }
        );

        return security;
    }
    catch (error) {
        console.log(chalk.red("Error in getSecurityByTradeID : " + error));
        res.status(400).send("Error in getSecurityByTradeID : " + error);
    }

}

// Create new Security if ticker does not exist
// Or push new trade
var upsertSecurityTrades = async (req, res, updates) => {

    var newId = new ObjectId();

    try {
        await trades.updateOne(
            {
                _id: req.body.ticker
            },

            {
                $push: {
                    trades:
                    {
                        _id: newId,
                        timeStamp: new Date(),
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
        );

        console.log(chalk.green("Successful request to add new trades (post /trades/)"));
        console.log(req.body);
        res.send({
            ticker: req.body.ticker,
            tradeId: newId,
            action: req.body.action,
            quantity: req.body.quantity,
            price: req.body.price,
        });
    }
    catch (error) {
        console.log(chalk.red("Error in adding trade(/addTrade) for Error : " + error));
        res.status(400).send("Error in calling in /addTrade : " + error);
    }

};

// Update requested trade
var updateTrade = async (req, res, updatedSecurity) => {

    try {
        await trades.updateOne(
            {
                "trades._id": new ObjectId(req.params.tradeId)
            },

            {
                "trades.$.action": req.body.action,
                "trades.$.quantity": req.body.quantity,
                "trades.$.price": req.body.price,

                $set: {
                    noOfShares: updatedSecurity.newNoOfShares
                }
            },
        )

        console.log(chalk.green("Successful request to update trades (patch /trades/)"));
        console.log(req.body);
        res.send({
            ticker: updatedSecurity.ticker,
            tradeId: req.params.tradeId,
            action: req.body.action,
            quantity: req.body.quantity,
            price: req.body.price,
        })
    }
    catch (error) {
        console.log(chalk.red("Error in updating trade(/updateTrade) : " + error));
        res.status(400).send("Error in calling /updateTrade : " + error);
    }
};

// Delete requested trade
var deleteTrade = async (req, res, updatedSecurity) => {

    try {
        await trades.updateOne(
            {
                "trades._id": req.params.tradeId
            },

            {
                $pull: {
                    trades: {
                        _id: new ObjectId(req.params.tradeId)
                    }
                },

                $set: {
                    noOfShares: updatedSecurity.newNoOfShares
                }
            }
        );

        console.log(chalk.green("Successful request to delete trade (delete /trades/)"));
        res.send({
            ticker: updatedSecurity.ticker,
            tradeId: req.params.tradeId
        })
    }
    catch (error) {
        console.log(chalk.red("Error in deleting trade(/deleteTrade) : " + error));
        res.status(400).send("Error in calling in /deleteTrade : " + error);
    }
};

module.exports = {
    getNoOfShares: getNoOfShares,
    getSecurityByTradeID: getSecurityByTradeID,
    upsertSecurityTrades: upsertSecurityTrades,
    updateTrade: updateTrade,
    deleteTrade: deleteTrade,
    getAllSecurities: getAllSecurities,
};