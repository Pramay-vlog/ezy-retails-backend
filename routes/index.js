const app = require("express")();
const env = require("../config/env.config");


app.get("/", (req, res) => res.send(`Welcome to ${env.PROJECT_NAME} APIs!`));


app.use("/role", require("./role.routes"));
app.use("/user", require("./user.routes"));
app.use("/heroSection", require("./hero-section.routes"));
app.use("/category", require("./category.routes"));
app.use("/subcategory", require("./subcategory.routes"));
app.use("/product", require("./product.routes"));
app.use("/productTags", require("./productTags.routes"));
app.use("/favorite", require("./favorite.routes"));
app.use("/cart", require("./cart.routes"));
app.use("/wallet", require("./wallet.routes"));
app.use("/location", require("./location.routes"));


module.exports = app;