const express = require('express');
const app = express();
const registerRoute = express.Router();
const controller = require("../../modules/controller/registerController")
const multer = require("multer");
const upload = multer({dest: 'upload/images/'});
const configureFileUpload = require("../../modules/Utils/file");



registerRoute.post("/signup", configureFileUpload.upload.single('image') ,controller.signup);

registerRoute.post("/send/otp/signin", controller.signinWithOTP);
 
registerRoute.post("/signin/otp",controller.signin);


module.exports = registerRoute;