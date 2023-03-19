import React,{ useState, useRef } from 'react'
import { ProgressBar, Button } from 'react-bootstrap'
import { upload } from '../../../services/ApiClient'
import { toast } from 'react-toastify'
import { useTranslation } from "react-i18next"

const UploadImage = (props) => {
    const { t } = useTranslation();
    const productId = props.productId;
    const parentId = props.parentId;
    const uploadFolder = props.uploadFolder || "";
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState(null);
    const fileRef = useRef();
    const [progress, setProgress] = useState(0);

    const updateFile = (event) => {
        setFile(event.target.files[0]);
        setFileName(event.target.files[0].name);
    }

    const uploadFile = () => {
        const formData = new FormData();
        setUploading(true);
        formData.append("file", file);
        formData.append("fileType", "image-attachment");
        if(productId){
            formData.append("productId", productId);
        }
        if(parentId){
            formData.append("parentId", parentId);
        }
        
        if (uploadFolder) {
            formData.append("uploadFolder", uploadFolder);
        }

        upload(process.env.REACT_APP_API_BASE_URL + "/v1/file-upload/upload-image", formData, updateProgressPercentage).then(res => {
            setFileName(null);
            fileRef.current.value = null;
            console.log(res);
            setUploading(false);
            toast.success(t("succeed"));
            if (props.handleUpload != null) {
                props.handleUpload({ url: res.path, uploadFolder: res.uploadFolder, thumbnailUrl: res.thumbnailUrl });
            }
        }).catch(e => {
            setUploading(false);
            console.log(e.message);
            toast.error(e.message);
        });



    }

    const updateProgressPercentage = percentage => {
        setProgress(percentage);
    }

    return (
        <div style={{ width: '100%' }}>
            <div className="row">
                <div className="col">

                    <input type="file" className="form-control" onChange={updateFile} ref={fileRef} />
                </div>
                <div className="col">
                    {fileName != null ? (<Button onClick={uploadFile}>Upload</Button>) : (null)}

                </div>
            </div>
            <div className="row">
                <div className="col">
                    {uploading ? (<ProgressBar animated now={progress} />) : (<></>)}

                </div>
            </div>
        </div>
    )
}

export default UploadImage;