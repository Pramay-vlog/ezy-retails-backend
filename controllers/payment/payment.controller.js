const DB = require("../../models");
const { constants: { ENUM: { ROLE: { ADMIN } }, MESSAGE }, response } = require("../../helpers");
const { createOrder } = require("../order/order.controller");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/* APIS For Payment */
module.exports = exports = {

    /* Create checkout session */
    createCheckoutSession: async (req, res) => {
        try {
            req.body.userId = req.user._id

            const carts = await DB.CART.find({
                $in: req.body.cartIds,
                userId: req.body.userId
            }).populate("productId").populate("subProductId").lean();
            if (!carts || carts.length === 0) return response.BAD_REQUEST({ res, message: "Cart not found" });
            for (let i = 0; i < carts.length; i++) {
                const cart = carts[i];
                const product = await DB.PRODUCT.findOne({ _id: cart.productId })
                if (!product) return response.BAD_REQUEST({ res, message: "Product not found" });

                if (cart.quantity > product.stock) return response.BAD_REQUEST({ res, message: "Product out of stock" });

                let subProduct = null

                if (cart.subProductId) {
                    subProduct = await DB.subProduct.findOne({ _id: cart.subProductId })
                    if (!subProduct) return response.BAD_REQUEST({ res, message: "Sub Product not found" });
                    if (cart.quantity > subProduct.stock) return response.BAD_REQUEST({ res, message: "Sub Product out of stock" });
                }
            }
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: carts.map((cart) => {
                    return {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: cart.productId.name,
                                images: cart.productId.images,
                            },
                            unit_amount: cart.subProductId ? cart.subProductId.price * 100 : cart.productId.price * 100,
                        },
                        quantity: cart.quantity,
                    }
                }
                ),
                mode: 'payment',
                customer_email: req.user.email,
                metadata: { body : JSON.stringify(req.body) },
                success_url: `https://success.com/`,
                cancel_url: `https://x.com/`,
            });

            return response.OK({ res, payload: session.url });
        } catch (err) {
            console.log("🚀 ~ createCheckoutSession: ~ err", err)
            return response.INTERNAL_SERVER_ERROR({ res, message: err.message });
        }
    },

    /* Handle webhook */
    handleWebhook: async (req, res) => {
        try {
            let event;
            const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

            if (endpointSecret) {
                event = stripe.webhooks.constructEvent(
                    req.body,
                    req.headers["stripe-signature"],
                    endpointSecret
                );
            } else {
                event = req.body;
            }

            switch (event.type) {
                case "checkout.session.completed":
                    console.log("✅ Payment successful:", event);
                    req.body = {...JSON.parse(event.data.object.metadata.body),
                        paymentId: event.data.object.id,
                        paymentPlatform: "stripe",
                        paymentStatus: event.data.object.payment_status,
                    }
                    await createOrder(req, res);
                    break;

                case "checkout.session.async_payment_failed":
                    console.log("❌ Payment failed:", event.data.object);
                    break;

                case "checkout.session.expired":
                    console.log("⚠️ Checkout session expired:", event.data.object);
                    break;

                default:
                    console.log("Unhandled event:", event.type);
            }

            return res.json({ received: true });
        } catch (err) {
            console.log("🚀 ~ handleWebhook: ~ err", err)
            return response.INTERNAL_SERVER_ERROR({ res, message: err.message });
        }
    },

}