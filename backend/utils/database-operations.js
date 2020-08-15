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
}

var getSecurityByID = async (id) => {

    try {
        var security = await trades.findById(id);
        return security;
    }
    catch (error) {
        console.log(chalk.red("Error in getSecurityByID : " + error));
        res.status(400).send("Error in getSecurityByID : " + error);
    }

}

var updateSecurityTrades = async (req, res, updates) => {

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

        res.send("New Trade was successfully added in security : " + req.body.ticker);

    }
    catch (error) {
        console.log(chalk.red("Error in adding trade(/addTrade) for Error : " + error));
        res.status(400).send("Error in calling in /addTrade : " + error);
    }

}

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

        res.send("Trade was successfully updated for ticker " + req.body.ticker);
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
        );
        res.send("Trade was successfully deleted for ticker " + req.body.ticker);

    }
    catch (error) {
        console.log(chalk.red("Error in deleting trade(/deleteTrade) : " + error));
        res.status(400).send("Error in calling in /deleteTrade : " + error);
    }
};

module.exports = {
    getSecurityByID: getSecurityByID,
    updateSecurityTrades: updateSecurityTrades,
    updateTrade: updateTrade,
    deleteTrade: deleteTrade,
    getAllSecurities : getAllSecurities,
}