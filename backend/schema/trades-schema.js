const mongo = require('mongoose');
const Schema = mongo.Schema;
const ObjectId = require('mongodb').ObjectID;
// const ObjectId = mongo.Schema.Types.ObjectID;

const tradeSchema = new Schema(
    {
        _id: { type: String, required: true },
        avgBuyPrice: {
            type: Number,
            default: 0,
        },

        noOfShares: {
            type: Number,
            default: 0,
            validate(value) {
                if (value < 0)
                    throw new Error("number of shares cannot be less than 0");
            }
        },

        trades: [{
            _id: { type: ObjectId, required: true },
            action: {
                type: Number,
                required: true,
                validate(value) {
                    if (value < 0 || value > 1)
                        throw new Error("Action of trade can only be 1 or 0");
                }
            },

            quantity: {
                type: Number,
                required: true,
                validate(value) {
                    if (value <= 0)
                        throw new Error("quantity of trade cannot be less than or equal to 0");
                }
            },

            price: {
                type: Number,
                required: true,
                validate(value) {
                    if (value <= 0)
                        throw new Error("Price of trade cannot be less than or equal to 0");
                }
            },

            timeStamp: {
                type: Date,
                default: new Date(),
            }
        }]
    },

    {
        versionKey: false
    }
);


const trades = mongo.model("trades", tradeSchema, "trades");
module.exports = trades;