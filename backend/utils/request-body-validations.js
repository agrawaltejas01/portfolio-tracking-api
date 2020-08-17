const chalk = require('chalk');

var validatePortFolioUrlBody = (data) => {
    if (Object.keys(data).length > 0)
        return false;

    return true;
}

var bodyLength = (data, len) => {
    if (Object.keys(data).length != len) {
        console.log(chalk.red("Invalid number of parameter recieved"));
        console.log(chalk.red("Expected number of parameters : " + len + " recieved : " + Object.keys(data).length));
        return false;
    }

    return true;
}

var validateTicker = (data) => {
    if (!data.hasOwnProperty('ticker')) {
        console.log(chalk.red("No ticker provided in request"));
        return false;
    }

    if (typeof data.ticker != "string") {
        console.log(chalk.red("ticker must be a string"));
        return false;
    }

    return true;
}

var validateTradeId = (data) => {
    if (!data.hasOwnProperty('tradeId')) {
        console.log(chalk.red("No tradeId provided in request"));
        return false;
    }

    if (typeof data.tradeId != "string") {
        console.log(chalk.red("tradeId must be a string"));
        return false;
    }

    return true;
}

var validateAction = (data) => {
    if (!data.hasOwnProperty('action')) {
        console.log(chalk.red("No action provided in request"));
        return false;
    }

    if (typeof data.action != "number") {
        console.log(chalk.red("action must be a number"));
        return false;
    }

    if (data.action != 0 && data.action != 1) {
        console.log(chalk.red("action must be either 0(sell) or 1(buy)"));
        return false;
    }


    return true;
}

var validateQuantity = (data) => {
    if (!data.hasOwnProperty('quantity')) {
        console.log(chalk.red("No quantity provided in request"));
        return false;
    }

    if (!Number.isInteger(data.quantity)) {
        console.log(chalk.red("quantity must be a integer number"));
        return false;
    }

    if (data.quantity <= 0) {
        console.log(chalk.red("quantity must be greater than 0 "));
        return false;
    }


    return true;
}

var validatePrice = (data) => {
    if (!data.hasOwnProperty('price')) {
        console.log(chalk.red("No quantity provided in request"));
        return false;
    }

    if (typeof data.price != "number") {
        console.log(chalk.red("price must be a number"));
        return false;
    }

    if (data.price <= 0) {
        console.log(chalk.red("price must be greater than 0 "));
        return false;
    }


    return true;
}

var addTradeReqBody = (data) => {

    return bodyLength(data, 4) && validateTicker(data) && validateAction(data) 
            && validatePrice(data) && validateQuantity(data);
}

var updateTradeReqBody = (data) => {

    return bodyLength(data, 4) && validateTradeId(data) &&
        validateAction(data) && validatePrice(data) && validateQuantity(data);

}


var deleteTradeReqBody = (data) => {

    return bodyLength(data, 1) && validateTradeId(data)
}


module.exports = {
    validatePortFolioUrlBody: validatePortFolioUrlBody,
    addTradeReqBody: addTradeReqBody,
    updateTradeReqBody: updateTradeReqBody,
    deleteTradeReqBody: deleteTradeReqBody,
}