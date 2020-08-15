const chalk = require('chalk');

var validatePortFolioUrlBody = (data) => {
    if (Object.keys(data).length > 0)
        return false;

    return true;
}

var addTradeReqBody = (data) => {

    if (Object.keys(data).length != 4)
        return false;

    if (!data.hasOwnProperty('ticker')) {
        console.log(chalk.red("No ticker provided in request"));
        return false;
    }

    if (!data.hasOwnProperty('action')) {
        console.log(chalk.red("No action provided in request"));
        return false;
    }

    if (!data.hasOwnProperty('quantity')) {
        console.log(chalk.red("No quantity provided in request"));
        return false;
    }

    if (!data.hasOwnProperty('price')) {
        console.log(chalk.red("No price provided in request"));
        return false;
    }

    return true;
}

var updateTradeReqBody = (data) => {

    if (Object.keys(data).length != 5)
        return false;

    if (!data.hasOwnProperty('ticker')) {
        console.log(chalk.red("No ticker provided in request"));
        return false;
    }

    if (!data.hasOwnProperty('tradeId')) {
        console.log(chalk.red("No tradeId provided in request"));
        return false;
    }

    if (!data.hasOwnProperty('action')) {
        console.log(chalk.red("No action provided in request"));
        return false;
    }

    if (!data.hasOwnProperty('quantity')) {
        console.log(chalk.red("No quantity provided in request"));
        return false;
    }

    if (!data.hasOwnProperty('price')) {
        console.log(chalk.red("No price provided in request"));
        return false;
    }

    return true;
}


var deleteTradeReqBody = (data) => {

    if (Object.keys(data).length != 2)
        return false;

    if (!data.hasOwnProperty('ticker')) {
        console.log(chalk.red("No ticker provided in request"));
        return false;
    }

    if (!data.hasOwnProperty('tradeId')) {
        console.log(chalk.red("No tradeId provided in request"));
        return false;
    }
    
    return true;
}


module.exports = {
    validatePortFolioUrlBody : validatePortFolioUrlBody,
    addTradeReqBody : addTradeReqBody,
    updateTradeReqBody : updateTradeReqBody,
    deleteTradeReqBody : deleteTradeReqBody,
}