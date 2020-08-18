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
        description: "Fetch portfolio",

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
        description: "Fetch holdings",

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
        description: "Fetch portfolio",

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