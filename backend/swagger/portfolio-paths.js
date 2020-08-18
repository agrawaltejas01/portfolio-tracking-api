const tags = [
    'portfolio'
];

const produces = [
    'application/json'
];

const status400 = {
    description: "Invalid Body recieved"
};

const fetchPortfolioPath = {
    get: {
        tags: tags,
        description: "Return list of all securities along with all corresponing trades.",

        produces: produces,

        responses: {
            '200': {
                description: "Portfolio successfully fetched from database",
                schema: {
                    $ref: '#/definitions/portfolioOutput'
                }
            },

            '400': status400
        }
    }
};

const fetchHoldingPath = {
    get: {
        tags: tags,
        description: "Holding consists of average buy price and number of shares. \
                       Average Buy Price is weighted average of all the shares bought (In the order of purchase). \
                        Selling a share does not affect average buy price, only total number of shares",

        produces: produces,

        responses: {
            '200': {
                description: "Holdings successfully calculated",
                schema: {
                    $ref: '#/definitions/holdingsOutput'
                }
            },

            '400': status400
        }
    }
};

const fetchReturnsPath = {
    get: {
        tags: tags,
        description: "Returns are calculated as : SUM((CURRENT_PRICE[ticker] - AVERAGE_BUY_PRICE[ticker]) *\
                        CURRENT_QUANTITY[ticker]). CURRENT_PRICE is assumed to be 100",

        produces: produces,

        responses: {
            '200': {
                description: "Returns successfully calculated",
                schema: {
                    $ref: '#/definitions/returnsOutput'
                }
            },

            '400': status400
        }
    }
};

module.exports = {
    fetchPortfolioPath: fetchPortfolioPath,
    fetchHoldingPath: fetchHoldingPath,
    fetchReturnsPath: fetchReturnsPath
}