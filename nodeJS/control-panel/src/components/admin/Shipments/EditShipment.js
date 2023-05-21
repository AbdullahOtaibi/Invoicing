import React,{ useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getShipment, updateShipment } from './ShipmentsAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import { ThreeDots } from  'react-loader-spinner'
import { MdBurstMode, MdSave, MdClose, MdDownload, MdAttachment, MdDelete } from "react-icons/md";
import UploadAttachment from '../Attachments/UploadAttachment'
import ListImages from '../Images/ListImages'


const EditShipment = (props) => {
    const [contentLocale, setContentLocale] = useState('en');
    const [shipment, setShipment] = useState({});
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const { shipmentId } = useParams();
    const [step1Shown, setStep1Shown] = useState(true);
    const [step2Shown, setStep2Shown] = useState(true);
    const [step3Shown, setStep3Shown] = useState(true);
    const [step4Shown, setStep4Shown] = useState(true);
    const [step5Shown, setStep5Shown] = useState(true);
    const [step6Shown, setStep6Shown] = useState(true);
    const [step7Shown, setStep7Shown] = useState(true);


    useEffect(() => {
        setLoading(true);
        getShipment(shipmentId).then(data => {
            setLoading(false);
            console.log(data);
            setShipment(data);

        }).catch(e => {
            setLoading(false);
            console.log(e);
        })
    }, []);

  

    const changeLocale = (newLocale) => {
        setContentLocale(newLocale);

    }


    const doPost = data => {
        updateShipment(shipment).then(data => {
            toast.success(t("succeed"));
            setShipment(shipment);
        }).catch(e => {
            toast.error(t(e.message));
        });
    }

    const factoyLoadingPhotosUpdated = imgs => {
        // console.log(imgs);
         let cloned = JSON.parse(JSON.stringify(shipment));
         cloned.factoryLoadingPhotos = imgs;
        //  imgs.map(img => {
        //      cloned.factoryLoadingPhotos.push(img)
        //  });

         setShipment(cloned);
    }

    const warehouseLoadingPhotosUpdated = imgs => {
        let cloned = JSON.parse(JSON.stringify(shipment));
        cloned.warehouseLoadingPhotos = imgs;
        setShipment(cloned);
    }

    const packingAndLoadingForDeparturePhotosUpdated = imgs => {
        let cloned = JSON.parse(JSON.stringify(shipment));
        cloned.departurePhotos = imgs;
        setShipment(cloned);
        
    }

    const loadingFromTransitePhotosUpdated = imgs => {
        let cloned = JSON.parse(JSON.stringify(shipment));
        cloned.transitePhotos = imgs;
        setShipment(cloned);
    }

    const loadingForDeliveryPhotosUpdated = imgs => {
        
        let cloned = JSON.parse(JSON.stringify(shipment));
        cloned.deliveryPhotos = imgs;
        setShipment(cloned);
    }



    const insuranceUploaded = uploadedImage => {
        let cloned = JSON.parse(JSON.stringify(shipment));
        if (!cloned.insurance) {
            cloned.insurance = {};
        }
        // url: res.path, uploadFolder: res.uploadFolder, thumbnailUrl: res.thumbnailUrl
        cloned.insurance.fileUrl = uploadedImage.url;
        cloned.insurance.uploadFolder = uploadedImage.uploadFolder;
        setShipment(cloned);
    }

    const cmrUploaded = uploadedImage => {
        let cloned = JSON.parse(JSON.stringify(shipment));
        if (!cloned.cmr) {
            cloned.cmr = {};
        }
        // url: res.path, uploadFolder: res.uploadFolder, thumbnailUrl: res.thumbnailUrl
        cloned.cmr.url = uploadedImage.url;
        cloned.cmr.uploadFolder = uploadedImage.uploadFolder;
        setShipment(cloned);
    }

    


    const removeInsurance = () => {
        let cloned = JSON.parse(JSON.stringify(shipment));
        cloned.insurance = null;
        setShipment(cloned);
    }

    const removeCMR = () => {
        let cloned = JSON.parse(JSON.stringify(shipment));
        cloned.cmr = null;
        setShipment(cloned);
    }

    


    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title"><MdBurstMode /> {t("shipping.shipmentDetails")}</h5>
                <div className="container text-center">
                    <ThreeDots
                        type="ThreeDots"
                        color="#00BFFF"
                        height={100}
                        width={100}
                        visible={loading}
                    />
                </div>
                <br />

                <form>
                    <div className='row'>
                        <div className="mb-3 col-6">
                            <label htmlFor="title" className="form-label">{t("order.orderNumber")}</label>
                            <label htmlFor="title" className="form-control" style={{ border: 'none' }}>{shipment._id}</label>
                        </div>

                        <div className="mb-3 col-6">
                            <label htmlFor="title" className="form-label">{t("quotation.date")}</label>
                            <label htmlFor="title" className="form-control" style={{ border: 'none' }}>{shipment.startDate}</label>
                        </div>
                    </div>


                    <div className="accordion" id="accordionExample">


                        <div className="card mb-3">
                            <div className="card-header" id="insurance">
                                <h2 className="mb-0">
                                    <button className="btn btn-link btn-block text-left" type="button" data-toggle="collapse"
                                        data-target="#insuranceArea" aria-expanded="true" aria-controls="insurance"
                                        onClick={() => setStep1Shown(!step1Shown)}
                                        style={{ fontWeight: 'bold' }}
                                    >
                                        {t("shipping.insurance")}
                                    </button>
                                </h2>
                            </div>

                            <div id="insuranceArea" className={step1Shown ? "collapse show" : "collapse"} aria-labelledby="insuranceArea" data-parent="#accordionExample">
                                <div className="card-body">
                                    {shipment && shipment.insurance && shipment.insurance.fileUrl ? (
                                        <>
                                            <MdAttachment />
                                            {shipment.insurance.fileUrl} &nbsp;
                                            <button type='button' className='btn btn-sm btn-danger' onClick={removeInsurance}>
                                                <MdDelete />
                                            </button>
                                            <br /><br />


                                            <a href={"/uploads/" + shipment.insurance.uploadFolder + shipment.insurance.fileUrl} 
                                            rel="noopener noreferrer" target="_blank">

                                                <MdDownload />&nbsp;
                                                Download File
                                            </a><br /><br /></>) : (<>
                                                Upload Insurance <br /><br />

                                                <UploadAttachment uploadFolder="shipments" handleUpload={insuranceUploaded} parentId={shipmentId} />
                                            </>
                                    )}




                                </div>
                            </div>
                        </div>

                        {shipment && shipment.insurance && shipment.insurance.fileUrl ? (
                            <div className="card mb-3">
                                <div className="card-header" id="factoyLoadingPhotos">
                                    <h2 className="mb-0">
                                        <button className="btn btn-link btn-block text-left" type="button" data-toggle="collapse"
                                            data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"
                                            onClick={() => setStep2Shown(!step2Shown)}
                                            style={{ fontWeight: 'bold' }}>
                                            {t("shipping.factoyLoadingPhotos")}
                                        </button>
                                    </h2>
                                </div>

                                <div id="collapseOne" className={step2Shown ? "collapse show" : "collapse"} aria-labelledby="factoyLoadingPhotos" data-parent="#accordionExample">
                                    <div className="card-body">

                                        <ListImages uploadFolder="shipments" 
                                        parentId={shipmentId}
                                        images={shipment.factoryLoadingPhotos}
                                         handleChange={factoyLoadingPhotosUpdated} />


                                    </div>
                                </div>
                            </div>) : null}

                        {shipment && shipment.factoryLoadingPhotos && shipment.factoryLoadingPhotos.length > 0? (
                            <div className="card mb-3">
                                <div className="card-header" id="warehouseLoadingPhotos">
                                    <h2 className="mb-0">
                                        <button className="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseOne"
                                            aria-expanded="true" aria-controls="collapseOne"
                                            onClick={() => setStep3Shown(!step3Shown)}
                                            style={{ fontWeight: 'bold' }}>
                                            {t("shipping.warehouseLoadingPhotos")}
                                        </button>
                                    </h2>
                                </div>

                                <div id="collapseOne" className={step3Shown ? "collapse show" : "collapse"} aria-labelledby="warehouseLoadingPhotos" data-parent="#accordionExample">
                                    <div className="card-body">
                                    <ListImages uploadFolder="shipments" 
                                        parentId={shipmentId}
                                        images={shipment.warehouseLoadingPhotos}
                                         handleChange={warehouseLoadingPhotosUpdated} />
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {shipment && shipment.warehouseLoadingPhotos && shipment.warehouseLoadingPhotos.length > 0 ? (
                            <div className="card mb-3">
                                <div className="card-header" id="CMR">
                                    <h2 className="mb-0">
                                        <button className="btn btn-link btn-block text-left" type="button" data-toggle="collapse"
                                            data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"
                                            onClick={() => setStep4Shown(!step4Shown)}
                                            style={{ fontWeight: 'bold' }}>
                                            CMR
                                        </button>
                                    </h2>
                                </div>

                                <div id="collapseOne" className={step4Shown ? "collapse show" : "collapse"} aria-labelledby="CMR" data-parent="#accordionExample">
                                    <div className="card-body">
                                    {shipment && shipment.cmr ? (
                                        <>
                                            <MdAttachment />
                                            {shipment.cmr.url} &nbsp;
                                            <button type='button' className='btn btn-sm btn-danger' onClick={removeCMR}>
                                                <MdDelete />
                                            </button>
                                            <br /><br />


                                            <a href={"/uploads/" + shipment.cmr.uploadFolder + shipment.cmr.url} target="_blank" rel="noopener noreferrer">

                                                <MdDownload />&nbsp;
                                                Download File
                                            </a><br /><br /></>) : (<>
                                                Upload CMR <br /><br />

                                                <UploadAttachment uploadFolder="shipments" handleUpload={cmrUploaded} parentId={shipmentId} />
                                            </>
                                    )}


                                    </div>
                                </div>
                            </div>) : null}

                        {shipment && shipment.cmr && shipment.cmr.url ? (
                            <div className="card mb-3">
                                <div className="card-header" id="packingAndLoadingForDeparturePhotos">
                                    <h2 className="mb-0">
                                        <button className="btn btn-link btn-block text-left" type="button" data-toggle="collapse"
                                            data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"
                                            onClick={() => setStep5Shown(!step5Shown)}
                                            style={{ fontWeight: 'bold' }}>
                                            {t("shipping.packingAndLoadingForDeparturePhotos")}
                                        </button>
                                    </h2>
                                </div>

                                <div id="collapseOne" className={step5Shown ? "collapse show" : "collapse"}
                                    aria-labelledby="packingAndLoadingForDeparturePhotos" data-parent="#accordionExample">
                                    <div className="card-body">
                                        <ListImages uploadFolder="shipments" 
                                         parentId={shipmentId}
                                         images={shipment.departurePhotos}
                                        handleChange={packingAndLoadingForDeparturePhotosUpdated}
                                         />
                                        
                                        
                                        
                                    </div>
                                </div>
                            </div>) : null}

                        {shipment && shipment.departurePhotos &&  shipment.departurePhotos.length > 0? (
                            <div className="card mb-3">
                                <div className="card-header" id="loadingFromTransitePhotos">
                                    <h2 className="mb-0">
                                        <button className="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseOne"
                                            aria-expanded="true" aria-controls="collapseOne"
                                            onClick={() => setStep6Shown(!step6Shown)}
                                            style={{ fontWeight: 'bold' }}>
                                            {t("shipping.loadingFromTransitePhotos")}
                                        </button>
                                    </h2>
                                </div>

                                <div id="collapseOne" className={step6Shown ? "collapse show" : "collapse"}
                                    aria-labelledby="loadingFromTransitePhotos" data-parent="#accordionExample">
                                    <div className="card-body">

                                    <ListImages uploadFolder="shipments" 
                                         parentId={shipmentId}
                                         images={shipment.transitePhotos}
                                        handleChange={loadingFromTransitePhotosUpdated}
                                         />


                                       
                                    </div>
                                </div>
                            </div>) : null}


                        {shipment && shipment.transitePhotos && shipment.transitePhotos.length > 0 ? (
                            <div className="card mb-3">
                                <div className="card-header" id="loadingForDeliveryPhotos">
                                    <h2 className="mb-0">
                                        <button className="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseOne"
                                            aria-expanded="true" aria-controls="collapseOne"
                                            onClick={() => setStep7Shown(!step7Shown)}
                                            style={{ fontWeight: 'bold' }}>
                                            {t("shipping.loadingForDeliveryPhotos")}
                                        </button>
                                    </h2>
                                </div>

                                <div id="collapseOne" className={step7Shown ? "collapse show" : "collapse"}
                                    aria-labelledby="loadingForDeliveryPhotos" data-parent="#accordionExample">
                                    <div className="card-body">
                                        

                                        <ListImages uploadFolder="shipments" 
                                         parentId={shipmentId}
                                         images={shipment.deliveryPhotos}
                                        handleChange={loadingForDeliveryPhotosUpdated}
                                         />

                                    </div>
                                </div>
                            </div>) : null}
                    </div>


                    <div className='row'>
                        <div className="mb-3 mt-3 col row col-12 justify-content-end" >
                            <br /><br />
                            <Link className="add-btn btn-warning" to={'/admin/shipments/' + shipmentId} ><MdClose size={20} />
                                &nbsp; {t("close")}</Link> &nbsp;
                            <Link className="add-btn btn-primary" to={'#'} onClick={doPost}>
                                <MdSave size={20} />&nbsp;  {t("dashboard.save")}</Link>
                        </div>
                    </div>

                </form>
            </div>


        </div>
    )
}



export default EditShipment;