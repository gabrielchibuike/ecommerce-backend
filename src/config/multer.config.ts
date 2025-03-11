import multer from "multer";
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    const original = file.originalname.split(".")[0];
    const ext = path.extname(file.originalname);
    const newExt = original + ext;
    const arrExt = [".jpeg", ".png", ".jpg"];
    if (arrExt.includes(ext)) {
      cb(null, newExt);
    } else {
      console.log("not supported");
    }
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1048576 * 5,
  },
});
