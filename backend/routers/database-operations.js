const trades = require('../schema/trades-schema');
const ObjectId = require('mongodb').ObjectID;

var getSecurityByID = async function(id) {

    var security = await trades.findById(id);
    return security;

}

var updateSecurityTrades = function(req, res, updates) {

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
};

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
};

module.exports = {
    getSecurityByID : getSecurityByID,
    updateSecurityTrades : updateSecurityTrades,
    updateTrade : updateTrade,
    deleteTrade : deleteTrade,

}