const tags = [
    'trade'
];

const produces = [
    'application/json'
];

const status400 = {
    description: "Invalid Body recieved / Operation not permitted"
};

const status404 = {
    description: "Given tradeId not found"
};

const addTradePath = {
    post: {
        tags: tags,
        description: "Place a trade. A trade will be placed when user buys or sells share ,\
                      affecting total number of shares. A user cannot sell more shares than he owns",
        requestBody: {
            description: "ticker of security, action (0 for buying, 1 for selling), quantity (whole number)\
                          ,price(greater than 0)",
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: '#/definitions/addTradeInput'
                    }
                }
            }
        },
        produces: produces,

        responses: {
            '200': {
                description: "New Trade Placed",
                schema: {
                    $ref: '#/definitions/addTradeOutPut'
                }
            },
            '400': status400
        }
    }
};

const deleteTradePath = {
    tags: tags,
    description: "Delete a trade. Total number of shares will be updated accordingly. \
                  Operation will not be permitted if resulting number of total shares become less than 0 ",

    parameters: [
        {
            name: "tradeId",
            in: "path",
            required: true,
            description: "Unique tradeId for the trade to be deleted",
            type: "string"
        }
    ],

    produces: produces,

    responses: {
        '200': {
            description: "Trade deleted successfully",
            schema: {
                $ref: '#/definitions/deleteTradeOutput'
            }
        },
        '400': status400,
        '404': status404
    }
};

const updateTradePath = {
    tags: tags,
    description: "Upsate a trade. User can update action(buying or selling), quantity of shares, price of shares.\
                All the validations of placing the trade apply. Operation will not be permitted if resulting number\
                 of total shares become less than 0 ",

    parameters: [
        {
            name: "tradeId",
            in: "path",
            required: true,
            description: "Unique tradeId for the trade to be deleted",
            type: "string"
        }
    ],

    requestBody: {
        description: "action (0 for buying, 1 for selling), quantity (whole number)\
                        ,price(greater than 0)",
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: '#/definitions/updateTradeInput'
                }
            }
        }
    },

    produces: produces,

    responses: {
        '200': {
            description: "Trade updated successfully",
            schema: {
                $ref: '#/definitions/addTradeOutPut'
            }
        },
        '400': status400,
        '404': status404
    }
};

module.exports = {
    addTradePath: addTradePath,
    deleteTradePath: deleteTradePath,
    updateTradePath: updateTradePath
}
