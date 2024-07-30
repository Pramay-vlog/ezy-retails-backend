const DB = require("../../models");
const { constants: { MESSAGE }, response } = require("../../helpers");
const { deleteFile } = require("../../service/file/file.upload");

/* APIS For HeroSection */
module.exports = exports = {

    /* Create HeroSection API */
    createHeroSection: async (req, res) => {

        req.body.image = req.file?.location;
        req.body.priority = (await DB.HEROSECTION.findOne().sort({ priority: -1 }).limit(1).lean())?.priority + 1 || 1;
        const heroSection = await DB.HEROSECTION.create(req.body);
        return response.OK({ res, payload: heroSection });

    },


    /* Get HeroSection API */
    getHeroSection: async (req, res) => {

        let { page, limit, skip, sortBy, sortOrder, search, ...query } = req.query;
        search ? query.$or = [{ name: { $regex: search, $options: "i" } }] : ""

        const heroSections = await DB.HEROSECTION
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ [sortBy]: sortOrder })
            .lean();

        return response.OK({ res, payload: { count: await DB.HEROSECTION.countDocuments(query), data: heroSections } });

    },


    /* Update HeroSection API*/
    updateHeroSection: async (req, res) => {

        let heroSectionExists = await DB.HEROSECTION.findOne({ _id: req.params._id, isActive: true }).lean();
        if (!heroSectionExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        if (req.file?.location) {
            deleteFile(heroSectionExists.image);
            req.body.image = req.file.location;
        }

        await DB.HEROSECTION.findByIdAndUpdate(req.params._id, req.body, { new: true, });
        return response.OK({ res });

    },


    /* Delete HeroSection API*/
    deleteHeroSection: async (req, res) => {

        let heroSectionExists = await DB.HEROSECTION.findOne({ _id: req.params._id }).lean();
        if (!heroSectionExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        deleteFile(heroSectionExists.image);

        await DB.HEROSECTION.findByIdAndUpdate(req.params._id, { isActive: false, });
        return response.OK({ res });

    },

};
