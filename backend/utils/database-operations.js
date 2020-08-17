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

var getNoOfShares = async (ticker) => {

    try {
        var security = await trades.findOne(
            {
                _id : ticker
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

var getSecurityByTradeID = async (tradeId) => {

    try {
        var security = await trades.findOne(
            {
                "trades._id": new ObjectId(tradeId)
            },

            {
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


var upsertSecurityTrades = async (req, res, updates) => {

    try {
        await trades.updateOne(
            {
                _id: req.body.ticker
            },

            {
                $push: {
                    trades:
                    {
                        _id: new ObjectId(),
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
        res.send("New Trade was successfully added in security : " + req.body.ticker);

    }
    catch (error) {
        console.log(chalk.red("Error in adding trade(/addTrade) for Error : " + error));
        res.status(400).send("Error in calling in /addTrade : " + error);
    }

};

var updateTrade = async (req, res, newNoOfShares) => {

    try {
        await trades.updateOne(
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
        )

        console.log(chalk.green("Successful request to update trades (patch /trades/)"));
        console.log(req.body);
        res.send("Trade was successfully updated for ticker " + req.body.tradeId);
    }
    catch (error) {
        console.log(chalk.red("Error in updating trade(/updateTrade) : " + error));
        res.status(400).send("Error in calling in /updateTrade : " + error);
    }
};

var deleteTrade = async (req, res, newNoOfShares) => {

    try {
        await trades.updateOne(
            {
                "trades._id": req.body.tradeId
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
        );

        console.log(chalk.green("Successful request to delete trade (delete /trades/)"));
        console.log(req.body);
        res.send("Trade was successfully deleted for ticker " + req.body.tradeId);

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