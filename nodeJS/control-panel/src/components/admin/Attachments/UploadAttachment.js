import React, { useState, useRef } from 'react'
import { ProgressBar, Button } from 'react-bootstrap'
import { upload } from '../../../services/ApiClient'
import { toast } from 'react-toastify'
import { useTranslation } from "react-i18next"
import LocalizedTextEditor from '../Shared/LocalizedTextEditor'

const UploadAttachment = (props) => {
    const { t, i18n } = useTranslation();
    const parentId = props.parentId;
    const uploadFolder = props.uploadFolder || "";
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState(null);
    const [description, setDescription] = useState({});
    const fileRef = useRef();
    const [progress, setProgress] = useState(0);
    const [contentLocale, setContentLocale] = useState('en');

    const updateFile = (event) => {
        setFile(event.target.files[0]);
        setFileName(event.target.files[0].name);
    }
    const setLocalTextValue = (textObject, newValue) => {
        if (contentLocale == 'en') {
            textObject.english = newValue;
        } else if (contentLocale == 'ar') {
            textObject.arabic = newValue;
        } else if (contentLocale == 'tr') {
            textObject.turkish = newValue;
        }
    }

    const changeLocale = (newLocale) => {
        setContentLocale(newLocale);
       

    }

    const updateDescription = (newValue, locale) => {
        setContentLocale(locale);
        console.log("EditProduct - newValue: " + newValue + ", locale: " + locale);
        let cloned = JSON.parse(JSON.stringify(description));
        setLocalTextValue(cloned, newValue);
        setDescription(cloned);

        
    }

    const uploadFile = () => {
        const formData = new FormData();
        setUploading(true);
        formData.append("file", file);
        formData.append("fileType", "file-attachment");
        formData.append("parentId", parentId);
        
        if (props.uploadFolder) {
            formData.append("uploadFolder", props.uploadFolder);
        }
        upload(process.env.REACT_APP_API_BASE_URL + "/v1/file-upload", formData, updateProgressPercentage).then(res => {
            setFileName(null);
            fileRef.current.value = null;
            console.log(res);
            setUploading(false);
            toast.success(t("succeed"));
            if (props.handleUpload != null) {
                props.handleUpload({ url: res.path, uploadFolder: res.uploadFolder, description: description });
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
                <div className="mb-3 col">
                    <label htmlFor="description" className="form-label"> {t("product.description")}</label>
                    <LocalizedTextEditor placeholder={t("product.description")} locale={contentLocale} textObject={description}
                                            onLocalChanged={changeLocale} onChange={updateDescription} />

                    
                </div>
                <div className='col'></div>
            </div>

            <div className="row">
                <div className="col">
                <label htmlFor="file" className="form-label"> {t("fileToUpload")}</label>
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

export default UploadAttachment;