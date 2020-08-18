const chalk = require("chalk")

var errorBody = function (message, status) {
    this.message = message;
    this.status = status;
}

var addTrade = function (currentNoOfShares, data) {

    // If selling
    if (data.action === 0) {

        // Cannot sell more number of shares than we currently have 
        if (currentNoOfShares < data.quantity) {
            throw new errorBody("Cannot sell more shares than we own right now", 400);
        }

        else
            currentNoOfShares = currentNoOfShares - data.quantity;
    }

    // If buying
    else {
        currentNoOfShares += data.quantity;
    }

    var updates = {
        newNoOfShares: currentNoOfShares,
    }

    return updates;
}


var deleteTrade = (security) => {

    var currentNoOfShares = security.noOfShares;

    var originalAction = security.trades[0].action;
    var originalQuantity = security.trades[0].quantity;

    // share were bought, and now deleted
    if (originalAction === 1)
        currentNoOfShares -= originalQuantity;

    // shares were sold and now deleted.
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

        // 00 
        if (data.action === 0)
            currentNoOfShares = currentNoOfShares + originalQuantity - data.quantity;

        // 01
        else
            currentNoOfShares = currentNoOfShares + originalQuantity + data.quantity;
    }

    else {
        // 10
        if (data.action === 0)
            currentNoOfShares = currentNoOfShares - data.quantity - originalQuantity;

        // 11
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