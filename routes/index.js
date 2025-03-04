const app = require("express")();
const env = require("../config/env.config");


app.get("/", (req, res) => res.send(`Welcome to ${env.PROJECT_NAME} APIs!`));


app.use("/role", require("./role.routes"));
app.use("/user", require("./user.routes"));
app.use("/heroSection", require("./hero-section.routes"));
app.use("/category", require("./category.routes"));
app.use("/subcategory", require("./subcategory.routes"));
app.use("/productTags", require("./productTags.routes"));
app.use("/favorite", require("./favorite.routes"));
app.use("/cart", require("./cart.routes"));
app.use("/wallet", require("./wallet.routes"));
app.use("/location", require("./location.routes"));
app.use("/shippingAddress", require("./shippingAddress.routes"));
app.use("/order", require("./order.routes"));
app.use("/product", require("./product.routes"));
app.use("/product-attribute", require("./productAttribute.routes"));
app.use("/product-variants", require("./productVariants.routes"));
app.use("/product-variant-combinations", require("./productVariantCombinations.routes"));
app.use("/uploads", require("./uploads.routes"));
app.use("/payment", require("./payment.routes"));


module.exports = app;