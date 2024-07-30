const DB = require("../../models");
const { constants: { ENUM: { ROLE: { ADMIN } }, MESSAGE }, response } = require("../../helpers");


/* APIS For Location */
module.exports = exports = {

    /* Create Location API */
    createLocation: async (req, res) => {

        const location = await DB.LOCATION.create(req.body);
        return response.OK({ res, payload: location });

    },


    /* Get Location API */
    getLocation: async (req, res) => {

        let { page, limit, skip, sortBy, sortOrder, search, ...query } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 100;
        sortBy = sortBy || "createdAt";
        sortOrder = sortOrder || -1;

        query = req.user?.roleId.name === ADMIN ? { ...query } : { isActive: true, ...query };
        search ? query.$or = [{ name: { $regex: search, $options: "i" } }] : ""

        const locations = await DB.LOCATION
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ [sortBy]: sortOrder })
            .lean();

        return response.OK({ res, payload: { count: await DB.LOCATION.countDocuments(query), data: locations } });

    },


    /* Update Location API*/
    updateLocation: async (req, res) => {

        let locationExists = await DB.LOCATION.findOne({ _id: req.params._id, isActive: true }).lean();
        if (!locationExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        await DB.LOCATION.findByIdAndUpdate(req.params._id, req.body, { new: true, });
        return response.OK({ res });

    },


    /* Delete Location API*/
    deleteLocation: async (req, res) => {

        let locationExists = await DB.LOCATION.findOne({ _id: req.params._id }).lean();
        if (!locationExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        await DB.LOCATION.findByIdAndUpdate(req.params._id, { isActive: false, });
        return response.OK({ res });

    },

};
