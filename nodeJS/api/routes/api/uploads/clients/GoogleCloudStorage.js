const { Storage } = require('@google-cloud/storage');
const path = require('path');




function GoogleCloudStorage() {

    const bucketName = 'waredly-uploads';

    this.createDirectory = async () => {

    }


    this.uploadFile = async (filePath, destFileName) => {
        let result = {};

        try {
            const storage = new Storage({
                keyFilename: path.join(__dirname, '../../../../config/google-api-key.json'),
                projectId: 'waredly'
            });

            await storage.bucket(bucketName).upload(filePath, {
                destination: destFileName,
            });
            console.log(`${filePath} uploaded to ${bucketName}`);
            result.success = true;
            result.filePath = "";

        } catch (e) {
            console.error(e.message);
            result.success = false;
            result.errorMessage = e.message;
        }
    }


}

module.exports = new GoogleCloudStorage();
