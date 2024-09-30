const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
    {

        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        shippingAddressId: { type: Schema.Types.ObjectId, ref: "ShippingAddress", required: true },
        orderNumber: { type: String, require: true },
        orderDate : {type : Date, default : new Date()},
        deliveryDate : {type : Date},
        totalAmount : {type  : Number, default : 0},
        taxAmount : {type : Number, default : 0},
        coupenCode : {type : String},
        discountAmount : {type : Number, default : 0},
        walletAmount : {type : Number, default : 0},
        shippingCharge : {type : Number, default : 0},
        subTotal  : {type : Number, default : 0}, // totalAmount + taxAmount - discountAmount - walletAmount + shippingCharge
        paymentId : {type : String},
        paymentPlatform : {type : String},
        shippingType : {type : String},
        trackingNo : {type : String},
        trackingUrl : {type : String},
        orderStatus : {type : String, enum : ["Order Confirmed", "In Progress", "Shipped", "Canceled", "Returned"], default: "Order Confirmed"},
        isActive: { type: Boolean, default: true }

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

let orderModel = model("Order", orderSchema, "Order");

module.exports = orderModel;
