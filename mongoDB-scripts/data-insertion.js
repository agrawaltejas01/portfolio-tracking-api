// use portfolio-tracker

// "trades.action" = 0 => sell
// "trades.action" = 1 => buy

db.trades.insertMany(
    [
        {
            _id: "TCS",
            noOfShares : 2,
            trades: [
                {
                    id : ObjectId(),
                    action : 1,
                    quantity : 3,
                    price : "300.45"
                },

                {
                    id : ObjectId(),
                    action : 0,
                    quantity : 1,
                }
            ]
        },

        {
            _id: "WIPRO",
            noOfShares : 5,
            trades: [
                {
                    id : ObjectId(),
                    action : 1,
                    quantity : 5,
                    price : "218.65"
                },

                {
                    id : ObjectId(),
                    action : 1,
                    quantity : 3,
                    price : "230.65"
                },

                {
                    id : ObjectId(),
                    action : 0,
                    quantity : 3,
                }
            ]
        },

        {
            _id: "GODREJIND",
            noOfShares : 4,
            trades: [
                {
                    id : ObjectId(),
                    action : 1,
                    quantity : 8,
                    price : "238.00"
                },

                {
                    id : ObjectId(),
                    action : 0,
                    quantity : 4,
                }
            ]
        }
    ]
);