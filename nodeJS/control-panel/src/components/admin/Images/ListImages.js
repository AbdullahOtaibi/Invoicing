import { Button } from 'react-bootstrap';
import React,{ useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import UploadImage from './UploadImage';
import { useParams } from 'react-router-dom'
import { getThumbUrl } from '../utils/utils'

const ListImages = (props) => {

    const { t } = useTranslation();
   // const { productId } = useParams();
   const productId = props.productId;
   const uploadFolder = props.uploadFolder || "";

    let images = props.images;

    if(images == null){
        images = [];
    }
    const imageUploaded = uploadedImage => {
        images = [...images, uploadedImage];        //alert('uploaded...' + info.path);
        if (props.handleChange != null) {
            props.handleChange(images);
        }
    }

    const removeImage = imgUrl => {
        images = images.filter(img => img.url !== imgUrl);
        if (props.handleChange != null) {
            props.handleChange(images);
        }
    }

    return (
        <div>
            {/* <h4>{t("images")}</h4> */}
            {images != null ? (<div className="row">
                {
                    images.map(img => (
                        <div className="col-md-3" key={img.url}>
                            <div className="card" style={{ width: 310 }}>

                                <img src={getThumbUrl(img)} alt="..." className="img-thumbnail rounded" style={{ width: '100%' }} />
                                <br />
                                 <span style={{textAlign:'left', float:'left'}}>{img.url}</span> 
                                 <br/>
                                <Button variant="danger" onClick={e => removeImage(img.url)} >DELTE</Button>
                            </div>
                        </div>
                    ))
                }

            </div>) : (<></>)}

            <hr />
            <UploadImage handleUpload={imageUploaded} productId={productId} parentId={props.parentId} uploadFolder={uploadFolder} />
        </div>
    )
}

export default ListImages;
