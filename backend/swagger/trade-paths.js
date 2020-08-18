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
        description: "Add new trade",
        requestBody: {
            description: "Add a trade for a security",
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
                description: "New Trade Added",
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
    description: "Delete a trade",

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
    description: "Delete a trade",

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
        description: "Add a trade for a security",
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
            description: "Trade deleted successfully",
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
