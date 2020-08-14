var calculateReturns = function (data) {
    var currentPrice = 100;
    return (currentPrice - data.avgBuyPrice) * (data.noOfShares)
};

var calculateAvgBuyPrice = function (data) {
    
};

module.exports = {
    calculateReturns : calculateReturns,
    calculateAvgBuyPrice : calculateAvgBuyPrice,
}