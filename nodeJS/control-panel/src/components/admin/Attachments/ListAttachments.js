import { Button } from 'react-bootstrap';
import React,{ useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import UploadAttachment from './UploadAttachment';

const ListAttachments = (props) => {

    const { t } = useTranslation();
    const productId = props.productId;

    let attachments = props.attachments;

    if (attachments == null) {
        attachments = [];
    }
    const attachmentUploaded = uploadedImage => {
        attachments = [...attachments, uploadedImage];        //alert('uploaded...' + info.path);
        if (props.handleChange != null) {
            props.handleChange(attachments);
        }
    }

    const removeAttachment = attachmentUrl => {
        attachments = attachments.filter(att => att.url !== attachmentUrl);
        if (props.handleChange != null) {
            props.handleChange(attachments);
        }
    }

    return (
        <div>
            <h4>{t("product.attachments")}</h4>
            {attachments != null ? (<div className="row p-3">
                {
                    attachments.map(item => (
                        <div className="col-6 p-5" key={item.url}>

                            <div className='row' style={{border:'1px solid rgba(0, 0, 0, 0.1)'}}>

                                <div className='col-10 pt-2'>
                                    <span style={{ textAlign: 'start' }}>{item.url}</span>
                                </div>
                                <div className='col-2 p-0' style={{textAlign:'end'}}>
                                    <Button variant="danger" onClick={e => removeAttachment(item.url)} >{t("dashboard.delete")}</Button>
                                </div>



                            </div>
                        </div>
                    ))
                }

            </div>) : (<></>)}

            <hr />
            <UploadAttachment handleUpload={attachmentUploaded} productId={productId} parentId={props.parentId} uploadFolder={props.uploadFolder}/>
        </div>
    )
}

export default ListAttachments;
