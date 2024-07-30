const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../../config/s3.config');
const env = require('../../config/env.config');
const BASE_DIR = `${env.PROJECT_NAME}/${env.NODE_ENV}`;
const { logger } = require('../../helpers');

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: env.BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.originalname });
        },
        key: function (req, file, cb) {
            const fileName = `${new Date().getTime()}-${(new Date().getTime()) * Math.random()}-${file.originalname}`;
            cb(null, `${BASE_DIR}/${fileName}`);
        },
    }),
    limits: { fileSize: 1024 * 1024 * 20, files: 10 },
    fileFilter: function (req, file, cb) {

        //? Only specific image files are allowed
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg|webp|bmp|tiff|ico|apng)$/)) {
            return cb(new Error('fileFormatError: Only image files are allowed!'), false);
        }
        cb(null, true);
    },
});

// delete file from s3
const deleteFile = (key) => {
    const params = {
        Bucket: env.BUCKET,
        Key: key
    };

    s3.deleteObject(params, (err, data) => {
        if (err) {
            logger.error('✘ Error deleting file from s3: ', err);
        } else {
            logger.info('✔ File deleted from s3: ', data);
        }
    });
};

module.exports = {
    upload,
    deleteFile,
};