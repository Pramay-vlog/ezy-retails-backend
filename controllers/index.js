module.exports = {

    ROLE: {
        APIS: require("./role/role.controller"),
        VALIDATOR: require("./role/role.validator"),
    },
    USER: {
        APIS: require("./user/user.controller"),
        VALIDATOR: require("./user/user.validator"),
    },
    HEROSECTION: {
        APIS: require("./heroSection/hero-section.controller"),
        VALIDATOR: require("./heroSection/hero-section.validator"),
    },
    CATEGORY: {
        APIS: require("./category/category.controller"),
        VALIDATOR: require("./category/category.validator"),
    },
    SUBCATEGORY: {
        APIS: require("./subcategory/subcategory.controller"),
        VALIDATOR: require("./subcategory/subcategory.validator"),
    },
    PRODUCT: {
        APIS: require("./product/product.controller"),
        VALIDATOR: require("./product/product.validator"),
    },
    PRODUCTTAGS: {
        APIS: require("./productTags/productTags.controller"),
        VALIDATOR: require("./productTags/productTags.validator"),
    },
    FAVORITE: {
        APIS: require("./favorite/favorite.controller"),
        VALIDATOR: require("./favorite/favorite.validator"),
    },
    CART: {
        APIS: require("./cart/cart.controller"),
        VALIDATOR: require("./cart/cart.validator"),
    },
    WALLET: {
        APIS: require("./wallet/wallet.controller"),
        VALIDATOR: require("./wallet/wallet.validator"),
    },
    LOCATION: {
        APIS: require("./location/location.controller"),
        VALIDATOR: require("./location/location.validator"),
    },
    SHIPPING_ADDRESS: {
        APIS: require("./shippingAddress/shippingAddress.controller"),
        VALIDATOR: require("./shippingAddress/shippingAddress.validator"),
    },
    ORDER: {
        APIS: require("./order/order.controller"),
        VALIDATOR: require("./order/order.validator"),
    },
    PRODUCT_ATTRIBUTE: {
        APIS: require("./productAttribute/productAttribute.controller"),
        VALIDATOR: require("./productAttribute/productAttribute.validator")
    },
    PRODUCT_VARIANTS: {
        APIS: require("./productVariants/productVariants.controller"),
        VALIDATOR: require("./productVariants/productVariants.validator")
    },
    PRODUCT_VARIANT_COMBINATIONS: {
        APIS: require("./productVariantCombinations/productVariantCombinations.controller"),
        VALIDATOR: require("./productVariantCombinations/productVariantCombinations.validator")
    },
    UPLOADS: {
        APIS: require("./uploads/uploads.controller"),
        VALIDATOR: require("./uploads/uploads.validator"),
    },

};
