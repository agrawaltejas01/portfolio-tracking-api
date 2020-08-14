const chalk = require("chalk")
const trades = require('../schema/trades-schema');

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

var updateAvgBuyPrice = function (currentNoOfShares, currentAvgBuyPrice, data) {

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
            currentAvgBuyPrice = data.price;
        }

        // Else we should calculate weighted average for AvgBuyPrice.
        else {
            currentAvgBuyPrice = ((currentAvgBuyPrice * currentNoOfShares) + (data.price * data.quantity)) / (currentNoOfShares + data.quantity);
            currentNoOfShares = currentNoOfShares + data.quantity;
        }
    }

    var updates = {
        newNoOfShares: currentNoOfShares,
        newAvgBuyPrice: currentAvgBuyPrice
    }

    return updates;
}

var calculateReturns = function(data)
{
    var currentPrice = 100;
    return (currentPrice - data.avgBuyPrice) * (data.noOfShares) 
}

module.exports = {
    validateTradeData: validateTradeData,
    updateAvgBuyPrice: updateAvgBuyPrice,
    calculateReturns : calculateReturns
}