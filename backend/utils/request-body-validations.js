const chalk = require('chalk');
const errorBody = require('./trades-utils').errorBody;

// Body should be empty in portfolio APIs
var validatePortFolioUrlBody = (data) => {
    if (Object.keys(data).length > 0) {
        console.log(chalk.red("No Parameters are expected"));
        throw new errorBody("No Parameters are expected", 400);
    }

    return true;
}

var bodyLength = (data, len) => {
    if (Object.keys(data).length != len) {
        console.log(chalk.red("Invalid number of parameter recieved"));
        console.log(chalk.red("Expected number of parameters : " + len + " recieved : " + Object.keys(data).length));
        throw new errorBody("Expected number of parameters : " + len + " recieved : " + Object.keys(data).length, 400);
    }

    return true;
}

var validateTicker = (data) => {
    if (!data.hasOwnProperty('ticker')) {
        console.log(chalk.red("No ticker provided in request"));
        throw new errorBody("No ticker provided in request", 400);
    }

    if (typeof data.ticker != "string") {
        console.log(chalk.red("ticker must be a string"));
        throw new errorBody("ticker must be a string", 400);
    }

    return true;
}

// Ticker is objectId. Hence should be a 24 char long string representing hexaDecimal value
var tradeIdUrl = (data) => {
    if (!data.hasOwnProperty('tradeId')) {
        console.log(chalk.red("No tradeId provided in request"));
        throw new errorBody("No tradeId provided in request", 400);
    }

    if (!Boolean(data.tradeId.match(/^[0-9a-f]{24}$/i))) {
        console.log(chalk.red("tradeId must be a 24 character long hex(0-9a-f) string"));
        throw new errorBody("tradeId must be a 24 character long hex(0-9a-f) string", 400);
    }


    return true;
}

var validateAction = (data) => {
    if (!data.hasOwnProperty('action')) {
        console.log(chalk.red("No action provided in request"));
        throw new errorBody("No action provided in request", 400);
    }

    if (typeof data.action != "number") {
        console.log(chalk.red("action must be a number"));
        throw new errorBody("action must be a number", 400);
    }

    if (data.action != 0 && data.action != 1) {
        console.log(chalk.red("action must be either 0(sell) or 1(buy)"));
        throw new errorBody("action must be either 0(sell) or 1(buy)", 400);
    }

    return true;
}

var validateQuantity = (data) => {
    if (!data.hasOwnProperty('quantity')) {
        console.log(chalk.red("No quantity provided in request"));
        throw new errorBody("No quantity provided in request", 400);
    }

    if (!Number.isInteger(data.quantity)) {
        console.log(chalk.red("quantity must be a integer number"));
        throw new errorBody("quantity must be a integer number", 400);
    }

    if (data.quantity <= 0) {
        console.log(chalk.red("quantity must be greater than 0 "));
        throw new errorBody("quantity must be greater than 0 ", 400);
    }


    return true;
}

var validatePrice = (data) => {
    if (!data.hasOwnProperty('price')) {
        console.log(chalk.red("No price provided in request"));
        throw new errorBody("No price provided in request", 400);
    }

    if (typeof data.price != "number") {
        console.log(chalk.red("price must be a number"));
        throw new errorBody("price must be a number", 400);
    }

    if (data.price <= 0) {
        console.log(chalk.red("price must be greater than 0 "));
        throw new errorBody("price must be greater than 0 ", 400);
    }


    return true;
}

var addTradeReqBody = (data) => {

    return bodyLength(data, 4) && validateTicker(data) && validateAction(data)
        && validatePrice(data) && validateQuantity(data);
}

var updateTradeReqBody = (req) => {

    return bodyLength(req.body, 3) && tradeIdUrl(req.params) &&
        validateAction(req.body) && validatePrice(req.body) && validateQuantity(req.body);

}

var deleteTradeReqBody = (req) => {
    return bodyLength(req.body, 0) && tradeIdUrl(req.params);
}



module.exports = {
    validatePortFolioUrlBody: validatePortFolioUrlBody,
    addTradeReqBody: addTradeReqBody,
    updateTradeReqBody: updateTradeReqBody,
    deleteTradeReqBody: deleteTradeReqBody,
}