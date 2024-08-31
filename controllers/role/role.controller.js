const DB = require("../../models");
const { response } = require('../../helpers');

module.exports = {

    createRole: async (req, res) => {
        if (await DB.ROLE.findOne({ name: req.body.name }).lean()) return response.DUPLICATE_VALUE({ res });
        return response.OK({ res, payload: await DB.ROLE.create(req.body) });
    },
    getRoleForAdmin: async (req, res) => {
        const roles = await DB.ROLE.findOne({ name: "admin" }).lean()
        return response.OK({ res, payload: roles });
    },
    getRoleForUser: async (req, res) => {
        const roles = await DB.ROLE.findOne({ name: "user" }).lean()
        return response.OK({ res, payload: roles });
    },

};
