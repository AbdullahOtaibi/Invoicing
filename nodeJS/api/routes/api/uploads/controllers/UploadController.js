const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const process = require('process');
const verifyToken = require('../../utils/auth');
const sharp = require('sharp');
const fs = require('fs');
//const googleCloudeStorage = require('../clients/GoogleCloudStorage');

router.post('/', verifyToken, async (req, res) => {
    try {
        console.log(req);
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "uploadedFile") to retrieve the uploaded file
            let uploadedFile = req.files.file;
            let parentId = req.body.parentId;
            let uploadFolder = req.body.uploadFolder || "";
            let fullDirectoryPath = process.env.UPLOAD_ROOT;
            

            if (!uploadFolder.endsWith("/")) {
                uploadFolder += "/";
            }
            if (parentId) {
                uploadFolder += parentId + "/";
            }

            if (uploadFolder) {
                fullDirectoryPath += uploadFolder;
            }
            if (!fullDirectoryPath.endsWith("/")) {
                fullDirectoryPath += "/";
            }

            if (!fs.existsSync(fullDirectoryPath)) {
                fs.mkdirSync(fullDirectoryPath);
            }


            let fullFileName = fullDirectoryPath + uploadedFile.name;
            let fileName = uploadedFile.name;


            fullFileName = fullDirectoryPath + uploadedFile.name;

            fileName = uploadedFile.name;

            console.log('file Uploaded :' + fullFileName);
            await uploadedFile.mv(fullFileName);

            console.log("result : " + fileName);
            // await  googleCloudeStorage.uploadFile(fullFileName,uploadFolder + fileName );
            //send response
            res.send({
                uploadFolder: uploadFolder,
                path: fileName,
                success: true,
                message: null
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.post('/upload-image', verifyToken, async (req, res) => {
    try {
        console.log(req);
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "uploadedFile") to retrieve the uploaded file
            let uploadedFile = req.files.file;
            let parentId = req.body.parentId;
            let fileType = req.body.fileType;
            let productId = req.body.productId;
            let uploadFolder = req.body.uploadFolder || "";


            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            ///media/osama/C486A97186A96520/Development/store/github/MarbleTown/nodejs/routes/api/uploads/controllers/UploadController.js
            let fullDirectoryPath = process.env.UPLOAD_ROOT;
            let tmpPath = process.env.UPLOAD_ROOT + "temp/";

            if (!uploadFolder.endsWith("/")) {
                uploadFolder += "/";
            }
            if (parentId) {
                uploadFolder += parentId + "/";
            }
            if (productId) {
                uploadFolder += productId + "/";
            }



            if (uploadFolder) {
                fullDirectoryPath += uploadFolder;
            }
            if (!fullDirectoryPath.endsWith("/")) {
                fullDirectoryPath += "/";
            }

            if (!fs.existsSync(fullDirectoryPath)) {
                fs.mkdirSync(fullDirectoryPath);
            }


           
            let fileName = uploadedFile.name;
            fileName = uploadedFile.name;
            fileName = fileName.substring(0,fileName.lastIndexOf(".")) + ".webp";
            let fullFileName = fullDirectoryPath + fileName ;

            //fullFileName = fullDirectoryPath + uploadedFile.name;
            let thumbnailFileFullPath = fullDirectoryPath + "thumb_" + fileName ;
           

            console.log('file Uploaded :' + fullFileName);
           
            tmpPath += uploadedFile.name;
            await uploadedFile.mv(tmpPath);
            await sharp(tmpPath)
                .resize(800)
                .webp({ quality: 90 })
                .toFile(fullFileName)




            await sharp(tmpPath).resize(500, 350, {
                fit: 'inside',
                position: 'center'
            })
            .webp({ quality: 90 })
            .toFile(thumbnailFileFullPath);
           
            fs.unlinkSync(tmpPath);


            console.log("result : " + fileName);
            //send response
            res.send({
                uploadFolder: uploadFolder,
                path: fileName,
                thumbnailUrl: "thumb_" + fileName,
                success: true,
                message: null
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});





module.exports = router;