const chalk = require("chalk")

var errorBody = function (message, status = 400) {
    this.message = message;
    this.status = status;
}

var addTrade = function (currentNoOfShares, data) {

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

var deleteTrade = (security) => {

    var currentNoOfShares = security.noOfShares;

    var originalAction = security.trades[0].action;
    var originalQuantity = security.trades[0].quantity;

    // share were bought, and now deleted
    if (originalAction === 1)
        currentNoOfShares -= originalQuantity;

    else
        currentNoOfShares += originalQuantity;

    if (originalQuantity === 0) {
        console.log(chalk.yellow("No trade was found"));
        return null;
    }
    return currentNoOfShares;
}

var updateTrade = function (security, data, update = 1) {

    var currentNoOfShares = security.noOfShares;
    var originalAction = security.trades[0].action;
    var originalQuantity = security.trades[0].quantity;

    // original originalAction was sell
    if (originalAction === 0) {
        if (data.action === 0)
            currentNoOfShares = currentNoOfShares + originalQuantity - data.quantity;

        else
            currentNoOfShares = currentNoOfShares + originalQuantity + data.quantity;
    }

    else {
        if (data.action === 0)
            currentNoOfShares = currentNoOfShares - data.quantity - originalQuantity;

        else
            currentNoOfShares = currentNoOfShares + data.quantity - originalQuantity;
    }


    if (originalQuantity === 0) {
        console.log(chalk.yellow("No trade was found"));
        return null;
    }
    return currentNoOfShares;
}

module.exports = {
    errorBody: errorBody,
    addTrade: addTrade,
    updateTrade: updateTrade,
    deleteTrade: deleteTrade,
}