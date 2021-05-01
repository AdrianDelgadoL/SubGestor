const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, '../sub-gestor-code/public/images');
    },
    filename(req, file, cb) {
        const ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
});
module.exports =  upload = multer({storage})
