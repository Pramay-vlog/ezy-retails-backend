const DB = require("../models");
const { response, logger } = require('../helpers');
const { MESSAGE, ENUM: { ROLE } } = require('../helpers/constant.helper');
const jwt = require("jsonwebtoken");

module.exports = {
    auth: ({ isTokenRequired = true, usersAllowed = [] } = {}) => {
        
        return async (req, res, next) => {
            
            const token = req.header("x-auth-token");
            if (isTokenRequired && !token) return response.UNAUTHORIZED({ res, message: MESSAGE.UNAUTHORIZED });
            if (!isTokenRequired && !token) return next();

            let user;
            try {

                let decoded = jwt.verify(token, process.env.JWT_SECRET);
                logger.info(`[DECODED] [ID: ${res.reqId}] [${res.method}] ${res.originalUrl} [CONTENT: ${JSON.stringify(decoded)}]`);

                user = await DB.USER.findOne({ _id: decoded?._id, isActive: true }).populate("roleId").lean();
                if (!user) return response.UNAUTHORIZED({
                    res,
                    message: MESSAGE.UNAUTHORIZED,
                });

            } catch (error) {

                logger.error(`✘  AUTH ERROR: ${error}`);
                return response.UNAUTHORIZED({
                    res,
                    message: MESSAGE.UNAUTHORIZED,
                });

            }


            req.user = user;
            if (usersAllowed.length) {

                if (req.user.roleId.name === ROLE.ADMIN) return next();
                if (usersAllowed.includes("*")) return next();
                if (usersAllowed.includes(req.user.roleId.name)) return next();

                return response.UNAUTHORIZED({ res, message: MESSAGE.INVALID_TOKEN, });

            } else {

                if (req.user.roleId.name === ROLE.ADMIN) return next();
                return response.UNAUTHORIZED({ res, message: MESSAGE.INVALID_TOKEN, });

            }
        };
    },
};
