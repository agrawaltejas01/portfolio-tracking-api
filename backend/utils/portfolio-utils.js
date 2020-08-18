const constants = require('./constants')

var calculateReturns = function (data) {
    var currentPrice = constants.currentPrice;
    return (currentPrice - calculateAvgBuyPrice(data.trades)) * (data.noOfShares)
};

var calculateAvgBuyPrice = function (data) {
    var sortedAccordingToTime = data.sort((a, b) => a.timeStamp.toString().localeCompare(b.timeStamp.toString()));

    var currShares = 0;
    var currAvgBuyPrice = 0;

    sortedAccordingToTime.forEach((trade) => {

        if (trade.action === 1) {
            currAvgBuyPrice = ((currAvgBuyPrice * currShares) + (trade.quantity * trade.price)) / (currShares + trade.quantity);
            currShares += trade.quantity;
        }

        else
            currShares -= trade.quantity;
    });

    return currAvgBuyPrice;

};

module.exports = {
    calculateReturns: calculateReturns,
    calculateAvgBuyPrice: calculateAvgBuyPrice,
}