const messages = require("../../json/message.json");
const { response } = require("../../helpers");

/* APIS For Upload */
module.exports = exports = {

    /* Create Upload API */
    uploadFiles: async (req, res) => {
        if (req.files.length === 0) return response.INTERNAL_SERVER_ERROR({ res, message: messages.INTERNAL_SERVER_ERROR })
        return response.OK({
            res, payload: {
                path:
                    req?.files && req?.files.length > 0 && req?.files.map((file) => file.key.split("/").slice(0, file.key.split("/").length - 1).join("/")),
                    // ?.key.split("/").slice(0, req?.file?.key.split("/").length - 1).join("/"),
                url: req?.files && req?.files.length > 0 && req?.files.map((file) => file.location),
            }
        });
    },
};
