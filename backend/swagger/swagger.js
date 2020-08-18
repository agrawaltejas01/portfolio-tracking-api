const definition = require('./definitions');
const tradePaths = require('./trade-paths');
const portfolioPaths = require('./portfolio-paths');

const swaggerDocument = {
    openapi: '3.0.1',
    info: {
        title: 'Portfolio Tracker API',
        description: 'Add, Update, Delete Trade. Fetch Portfolio, Holdings. Returns'
    },

    host: "localhost:8000",
    tags: [
        {
            name: "trade",
            description: "APIs for trades(Add, Delete, Update)"
        },

        {
            name: "portfolio",
            description: "APIs for fetching portfolio, holdings, returns"
        }
    ],

    definitions: definition,

    paths: {
        "/trade": tradePaths.addTradePath,

        "/trade/{tradeId}": {
            delete: tradePaths.deleteTradePath,

            patch: tradePaths.updateTradePath
        },

        "/portfolio/": portfolioPaths.fetchPortfolioPath,

        "/portfolio/holdings": portfolioPaths.fetchHoldingPath,

        "/portfolio/returns": portfolioPaths.fetchReturnsPath

    }
}


module.exports = swaggerDocument;