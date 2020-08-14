const chalk = require("chalk")
const trades = require('../schema/trades-schema');
const objectId = require('mongoose').mongo.ObjectID;

var validateTradeData = function (data) {
    if (data.action < 0 || data.action > 1) {
        console.log(chalk.red("Action of trade can only be 0 or 1"));
        return false;
    }

    if (data.quantity <= 0) {
        console.log(chalk.red("Quantity of trade should be greater than 0"));
        return false;
    }

    // check price only if action is 1 => (buy)
    if (data.action === 1 && data.price <= 0) {
        console.log(chalk.red("Price of trade should be greater than 0"));
        return false;
    }

    return true;
}

var validateUpdateNoOfShares = function (currentNoOfShares, data) {

    // If selling, update only noOfShares
    if (data.action === 0) {

        // Cannot sell more number of shares than we currently have 
        if (currentNoOfShares < data.quantity) {
            return null
        }

        else
            currentNoOfShares = currentNoOfShares - data.quantity;
    }

    else {

        // If we dont have any no of shares right now
        // set them directly
        if (currentNoOfShares === 0) {
            currentNoOfShares = data.quantity;
        }

        // Else we should calculate weighted average for AvgBuyPrice.
        else {
            currentNoOfShares = currentNoOfShares + data.quantity;
        }
    }

    var updates = {
        newNoOfShares: currentNoOfShares,
    }

    return updates;
}

// update = 1 => update
// update = 0 => delete
var deleteOrUpdateTrade = function (security, data, update = 1) {
    var currentNoOfShares = security.noOfShares;
    var sharesToBeUpdated = 0;
    var action = -1;
    var originalQuantity = 0;
    security.trades.forEach((trade) => {
        if ((trade._id).equals(data.tradeId)) {
            sharesToBeUpdated = trade.quantity;
            action = trade.action;
            originalQuantity = trade.quantity;
            return;
        }
    });

    if (update === 0) {
        // share were bought, and now deleted
        if (action === 1)
            currentNoOfShares -= sharesToBeUpdated;

        else if (action === 0)
            currentNoOfShares += sharesToBeUpdated;
    }

    else {

        // original action was sell
        if(action === 0)
        {
            if(data.action === 0)
                currentNoOfShares = currentNoOfShares + originalQuantity - data.quantity;
            
            else
                currentNoOfShares = currentNoOfShares + originalQuantity + data.quantity;
        }

        else
        {
            if(data.action === 0)
                currentNoOfShares = currentNoOfShares - data.quantity - originalQuantity;
            
            else
                currentNoOfShares = currentNoOfShares + data.quantity - originalQuantity;
        }
    }

    if (sharesToBeUpdated === 0) {
        console.log(chalk.yellow("No trade was found"));
        return null;
    }
    console.log(currentNoOfShares);
    return currentNoOfShares;
}

module.exports = {
    validateTradeData: validateTradeData,
    validateUpdateNoOfShares: validateUpdateNoOfShares,
    deleteOrUpdateTrade: deleteOrUpdateTrade,
}