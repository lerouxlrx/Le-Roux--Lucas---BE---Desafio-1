const multer = require ("multer");

const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        let destinationFolder;
        switch(file.fieldname) {
            case "profile":
                destinationFolder = "./src/uploads/profiles";
                break;
            case "products":
                destinationFolder = "./src/uploads/products";
                break;
            case "documents":
                destinationFolder = "./src/uploads/documents";
                break;
        }
        cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer ({storage})

module.exports = upload