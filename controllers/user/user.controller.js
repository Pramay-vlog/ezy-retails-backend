const { constants: { ENUM: { ROLE, COUNT_MODULES }, MESSAGE }, response, logger, common } = require("../../helpers");
const DB = require("../../models");
const EMAIL = require("../../service/mail/mail.service")


module.exports = exports = {


    signIn: async (req, res) => {
        const user = await DB.USER.findOne({ email: req.body.email, isActive: true }).populate("roleId", "name").lean();
        if (!user) return response.NOT_FOUND({ res, MESSAGE: MESSAGE.NOT_FOUND });
        //* If Social user comes with password then send error message
        if (user.isSocial && req.body.password) return response.BAD_REQUEST({ res, message: "Social login Unauthorized" });
        //* if user is trying to login with social login
        if (user.isSocial === false && req.body.isSocial) return response.BAD_REQUEST({ res, message: "Unauthorized" });


        if (req.body.password && !req.body.isSocial) {
            const isPasswordMatch = await common.comparePassword({ password: req.body.password, hash: user.password });
            if (!isPasswordMatch) return response.BAD_REQUEST({ res, message: MESSAGE.INVALID_PASSWORD });
        }

        const token = await common.generateToken({ data: { _id: user._id, role: user.roleId.name } });

        return response.OK({
            res,
            payload: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.roleId.name,
                token,
            },
        });
    },


    signUp: async (req, res) => {
        if (await DB.USER.findOne({ email: req.body.email })) return response.BAD_REQUEST({ res, message: MESSAGE.DUPLICATE_ENTRY });

        const roleExists = await DB.ROLE.findById(req.body.roleId).lean();
        if (!roleExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        req.body.roleId = roleExists._id;

        await DB.USER.create(req.body);

        await DB.DATA_COUNT.findOneAndUpdate(
            { module: COUNT_MODULES.USER },
            { $inc: { count: 1 } },
            { upsert: true }
        )
        console.log(Date.now());


        exports.signIn(req, res);
    },


    forgot: async (req, res) => {
        const userExists = await DB.USER.findOne({ email: req.body.email, isActive: true }).lean();
        if (!userExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        const otp = await common.generateOTP();
        await EMAIL.sendOTP({ email: req.body.email, name: userExists.name, otp });
        logger.verbose(`[OTP] [ID: ${res.reqId}] [${res.method}] ${res.originalUrl} [CONTENT: ${JSON.stringify(otp)}]`);

        await DB.OTP.findOneAndUpdate({ email: req.body.email }, { otp: otp }, { upsert: true, new: true });
        return response.OK({ res });
    },


    verifyOtp: async (req, res) => {
        const verify = await DB.OTP.findOneAndDelete({ email: req.body.email, otp: req.body.otp });
        if (!verify) return response.BAD_REQUEST({ res, message: MESSAGE.NOT_FOUND });

        const user = await DB.USER.findOne({ email: req.body.email })
        const token = await common.generateToken({ data: { _id: user._id, role: user.roleId.name } });

        return response.OK({ res, payload: token });
    },


    resetForgotPassword: async (req, res) => {
        const user = await DB.USER.findById(req.user._id);
        if (!user) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        await DB.USER.findByIdAndUpdate(req.user._id, { password: await common.hashPassword({ password: req.body.password }) })
        return response.OK({ res });
    },


    changePassword: async (req, res) => {
        const user = await DB.USER.findById(req.user._id);
        if (!user) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        if (!await common.comparePassword({ password: req.body.oldPassword, hash: user.password })) return response.BAD_REQUEST({ res, message: MESSAGE.INVALID_PASSWORD });

        await DB.USER.findByIdAndUpdate(req.user._id, { password: await common.hashPassword({ password: req.body.newPassword }) });
        return response.OK({ res });
    },


    update: async (req, res) => {
        const user = await DB.USER.findById(req.params._id);
        if (!user) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        if (await DB.USER.findOne({ _id: { $ne: user._id }, email: req.body.email }).lean()) return response.DUPLICATE_VALUE({ res });
        let payload = await DB.USER.findByIdAndUpdate(req.params._id, req.body, { new: true });
        return response.OK({ res, payload });
    },


    getUser: async (req, res) => {
        let { page, limit, sortBy, sortOrder, search, ...query } = req.query;

        query = req.user.roleId.name === ROLE.ADMIN ? { ...query } : { _id: req.user._id };
        search ? query.$or = [{ name: { $regex: search, $options: "i" } }] : "";

        const data = await DB.USER
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ [sortBy]: sortOrder })
            .populate("roleId", "name")
            .lean();

        return response.OK({ res, payload: { count: await DB.USER.countDocuments(query), data } });
    },


    dashboardCounts: async (req, res) => {
        return response.OK({ res, payload: await DB.DATA_COUNT.find() });
    },


    toggleActive: async (req, res) => {
        const user = await DB.USER.findById(req.params._id);
        if (!user) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        await DB.USER.findByIdAndUpdate(req.params._id, { isActive: !user.isActive }, { new: true });
        await DB.DATA_COUNT.findOneAndUpdate(
            { module: COUNT_MODULES.USER },
            { $inc: { count: user.isActive ? -1 : 1 } },
            { upsert: true }
        )
        return response.OK({ res });
    }


};
