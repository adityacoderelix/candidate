import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        if(file.fieldname === "resume") {
            cb(null, "uploads/resumes/");
        }
        else if(file.fieldname === "offerLetter") {
            cb(null, "uploads/offerLetters/");
        }
    },

    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + "-" + (file.originalname)
        );
    }
});

const upload = multer({ storage });

export default upload;