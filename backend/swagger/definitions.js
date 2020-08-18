const ticker = {
    type: "string",
    description: "Unique Id for a security"
};

const tradeId = {
    type: "string",
    description: "Unique Id for trade of the security"
};

const action = {
    type: "number",
    description: "Number of trade sold or bought"
};

const quantity = {
    type: "number",
    description: "Number of trade sold or bought"
};

const price = {
    type: "number",
    description: "Price of selling or buying trade"
};

const timeStamp = {
    type: "string",
    description: "Timestamp of creation of trade"

};

const avgBuyPrice = {
    type: "number",
    description: "Average buy price calculated using weighted average"
};

const noOfShares = {
    type: "number",
    description: "Total number of shares that user owns"
};

const totalReturns = {
    type: "number",
    description: "Total returns obtained after all trades"
}

const definitions = {
    addTradeInput: {
        type: 'object',
        properties: {
            ticker: ticker,
            action: action,
            quantity: quantity,
            price: price
        }
    },
    addTradeOutPut: {
        type: "object",
        properties: {
            ticker: ticker,
            tradeId: tradeId,
            action: action,
            quantity: quantity,
            price: price
        }
    },
    deleteTradeOutput: {
        type: "object",
        properties: {
            ticker: ticker,
            tradeId: tradeId
        }
    },
    updateTradeInput: {
        type: "object",
        properties: {
            action: action,
            quantity: quantity,
            price: price
        }
    },
    portfolioOutput: {
        type: "object",
        properties: {
            ticker: ticker,
            trades: {
                type: "array",
                properties: {
                    tradeId: tradeId,
                    timeStamp: timeStamp,
                    action: action,
                    quantity: quantity,
                    price: price
                }
            }
        }
    },
    holdingsOutput: {
        type: "object",
        properties: {
            ticker: ticker,
            avgBuyPrice: avgBuyPrice,
            noOfShares: noOfShares,
        }
    },
    returnsOutput: {
        type: "object",
        properties: {
            totalReturns: totalReturns
        }
    }

}

module.exports = definitions;