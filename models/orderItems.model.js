const { Schema, model } = require("mongoose");

const orderItemsSchema = new Schema(
    {

        orderNumber: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        subProductId: { type: Schema.Types.ObjectId, ref: "SubProduct" },
        name: { type: String, required: true },
        images: { type: [String], required: true },
        price: { type: Number, required: true },
        quantity: { type: Number,required: true },
        taxAmount: { type: Number, default: 0 },
        totalAmount: { type: Number, required: true }, // qty*price+taxAmount
        isActive: { type: Boolean, default: true }

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

let orderItemsModel = model("OrderItems", orderItemsSchema, "OrderItems");

module.exports = orderItemsModel;
