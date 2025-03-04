const DB = require("../../models");
const { constants: { ENUM: { ROLE: { ADMIN } }, MESSAGE }, response } = require("../../helpers");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/* APIS For Payment */
module.exports = exports = {

    /* Create checkout session */
    createCheckoutSession: async (req, res) => {
        try {
            if (req.body.productIds.length !== req.body.quantities.length) {
                return response.BAD_REQUEST({ res, message: MESSAGE.PAYMENT_QTY_MISMATCH });
            }
            
            let lineItems = []
            for (let i = 0; i < req.body.productIds.length; i++) {
                const product = await DB.PRODUCT.findOne({ _id: req.body.productIds[i], isActive: true });
                if (!product) return response.BAD_REQUEST({ res, message: MESSAGE.NOT_FOUND });

                lineItems.push({
                    price_data: {
                        currency: req.body.price_data?.currency || 'usd',
                        product_data: {
                            name: product.name,
                        },
                        unit_amount: product.price * 100,
                    },
                    quantity: req.body.quantities[i],
                });
            }

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                customer_email: req.user.email,
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
                    console.log("✅ Payment successful:", event.data.object);
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

            res.json({ received: true });
        } catch (err) {
            console.log("🚀 ~ handleWebhook: ~ err", err)
            return response.INTERNAL_SERVER_ERROR({ res, message: err.message });
        }
    },

}