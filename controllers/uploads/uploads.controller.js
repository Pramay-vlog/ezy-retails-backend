const messages = require("../../json/message.json");
const { response } = require("../../helpers");

/* APIS For Upload */
module.exports = exports = {

    /* Create Upload API */
    uploadFiles: async (req, res) => {
        if (!req.file) return response.INTERNAL_SERVER_ERROR({ res, message: messages.INTERNAL_SERVER_ERROR })
        return response.OK({
            res, payload: {
                path:
                    req?.file?.key.split("/").slice(0, req?.file?.key.split("/").length - 1).join("/"),
                url: req?.file?.location
            }
        });
    },
};
