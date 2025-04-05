const DB = require("../../models");
const { constants: { ENUM: { ROLE: { ADMIN } }, MESSAGE }, response } = require("../../helpers");
const { deleteFile } = require("../../service/file/file.upload");

/* APIS For Order */
module.exports = exports = {

    /* Create Order API */
    createOrder: async (req, res) => {

        
        req.body.userId = req.user?._id || req.body.userId;

        const carts = await DB.CART.find({ 
            $in : req.body.cartIds,
            userId: req.body.userId })

        // order number generation and validation (not exist in db)
        let orderNumber = Math.floor(100000 + Math.random() * 900000);
        let orderExists = await DB.ORDER.findOne({ orderNumber });

        while (orderExists) {
            orderNumber = Math.floor(100000 + Math.random() * 900000);
            orderExists = await DB.ORDER.findOne({ orderNumber });
        }


        let orderItems = []

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

            // add order items and order 
            let orderItem = {
                userId: req.user?._id || req.body.userId,
                orderNumber: orderNumber + "00" + i + 1,
                productId: cart.productId,
                subProductId: cart.subProductId,
                name: subProduct ? subProduct.name : product.name,
                images: subProduct ? subProduct.images : product.images,
                quantity: cart.quantity,
                price: subProduct ? subProduct.price : product.price,
                totalAmount: subProduct ? subProduct.price * cart.quantity : product.price * cart.quantity,
            }

            // add order items
            orderItems.push(orderItem)
        }

        // create order
        let order = await DB.ORDER.create(req.body);

        // create order items
        orderItems = orderItems.map((item) => ({ ...item, orderId: order._id }));

        await DB.ORDER_ITEMS.insertMany(orderItems);

        //Order Metrics - discount, tax, shipping, totalAmount, totalItems
        let totalAmount = orderItems.reduce((acc, item) => acc + item.totalAmount, 0)
        let discountAmount = 0
        let taxAmount = 0
        let shippingCharge = 0
        let walletAmount = 0

        // Update orders with pending details
        await DB.ORDER.findByIdAndUpdate(
            order._id,
            {
                orderNumber,
                totalAmount,
                orderDate: new Date(),
                subTotal: totalAmount + shippingCharge + taxAmount - discountAmount - walletAmount,
            },
            { new: true }
        );

        // Update product stock
        for (let i = 0; i < carts.length; i++) {
            const cart = carts[i];
            const product = await DB.PRODUCT.findOne({ _id: cart.productId })
            if (cart.subProductId) {
                const subProduct = await DB.subProduct.findOne({ _id: cart.subProductId })
                await DB.subProduct.findByIdAndUpdate(
                    cart.subProductId,
                    { stock: subProduct.stock - cart.quantity },
                    { new: true }
                );
            } else {
                await DB.PRODUCT.findByIdAndUpdate(
                    cart.productId,
                    { stock: product.stock - cart.quantity },
                    { new: true }
                );
            }
        }

        // delete cart
        await DB.CART.deleteMany({ userId: req.user?._id || req.body.userId });


        console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 ORDER CREATED SUCCESSFULLY 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀")
        
        return response.OK({ res, payload: order });

    },

    /* Get Order API */
    getOrder: async (req, res) => {

        let { page, limit, skip, sortBy, sortOrder, search, ...query } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 100;
        sortBy = sortBy || "createdAt";
        sortOrder = sortOrder || -1;

        query = req.user?.roleId.name === ADMIN ? { ...query } : { isActive: true, ...query };
        search ? query.$or = [{ title: { $regex: search, $options: "i" } }] : "";
        const orderes = await DB.ORDER.find({ userId: req.user._id })
        return response.OK({ res, payload: { data: orderes } });

    },

    getOrderWithItems: async (req, res) => {
        let { page, limit, skip, sortBy, sortOrder, search, ...query } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 100;
        sortBy = sortBy || "createdAt";
        sortOrder = sortOrder || -1;

        query = req.user?.roleId.name === ADMIN ? { ...query } : { isActive: true, ...query };
        search ? query.$or = [{ title: { $regex: search, $options: "i" } }] : "";
        const orderes = await DB.ORDER.aggregate([
            {
                $match: { userId: req.user._id }
            },
            {
                $lookup: {
                    from: "OrderItems",
                    localField: "_id",
                    foreignField: "orderId",
                    as: "orderItems"
                }
            },
            // sort 
            { $sort: { [sortBy]: sortOrder } },
            // skip
            { $skip: (page - 1) * limit },
            // limit
            { $limit: limit }
        ])

        return response.OK({ res, payload: { data: orderes } });
    },

    /* Update Order API*/
    updateOrder: async (req, res) => {

        const order = await DB.ORDER.findById(req.params._id);
        if (!order) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        let data = await DB.ORDER.findByIdAndUpdate(req.params._id, req.body, { new: true });

        return response.OK({ res });

    },

    /* Delete Order API*/
    deleteOrder: async (req, res) => {

        let orderExists = await DB.ORDER.findOne({ _id: req.params._id }).lean();
        if (!orderExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        await DB.ORDER.findByIdAndDelete(req.params._id, { isActive: false, });
        return response.OK({ res });

    },

};
