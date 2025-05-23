require("express-async-errors");

const express = require("express");
const env = require("./config/env.config");
const app = express();

app.use(require('./middleware/request.logger'));

app.use(env.BASE_URL, require('./routes/payment.routes'));

app.use(require('cors')({ origin: '*' }));
app.use(express.json({ limit: env.JSON_BODY_LIMIT }));
app.use(express.urlencoded({ extended: false }));

app.use(env.BASE_URL, require('./routes/index'));

app.use((req, res) =>
    require('./helpers').response.NOT_FOUND({ res, message: require('./helpers/constant.helper').MESSAGE.INVALID_ROUTE })
);

app.use(require('./middleware/error.handler'));

module.exports = app;
