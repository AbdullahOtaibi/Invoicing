import React,{ useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getShipment } from './ShipmentsAPI'
import { useTranslation } from "react-i18next"
import { ThreeDots } from  'react-loader-spinner'
import { MdBurstMode, MdEdit, MdClose, MdDownload } from "react-icons/md";
import { getThumbUrl } from '../utils/utils'


const ViewShipment = (props) => {
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
                        {shipment && shipment.insurance ? (<div className="card mb-3">
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
                                    <a href={"/uploads/" + shipment.insurance.uploadFolder + shipment.insurance.fileUrl} target="_blank" rel="noopener noreferrer">

                                        <MdDownload />&nbsp;
                                        Download File
                                    </a>
                                </div>
                            </div>
                        </div>) : null}


                        {shipment && shipment.factoryLoadingPhotos && shipment.factoryLoadingPhotos.length > 0 ? (<div className="card mb-3">
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
                                    <div className='row'>
                                        {shipment.factoryLoadingPhotos.map(img => (<div className='img-thumbnail m-1 mr-1 col col-auto' style={{ width: '300px' }}>
                                            <img src={getThumbUrl(img)} style={{ width: '300px' }} alt="factoy Loading Photo" />
                                        </div>))}
                                    </div>
                                </div>
                            </div>
                        </div>) : null}
                        {shipment && shipment.warehouseLoadingPhotos && shipment.warehouseLoadingPhotos.length > 0 ? (
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
                                        <div className='row'>
                                            {shipment.warehouseLoadingPhotos.map(img => (<div className='img-thumbnail m-1 mr-1 col col-auto' style={{ width: '300px' }}>
                                                <img src={getThumbUrl(img)} style={{ width: '300px' }} />
                                            </div>))}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                        {shipment && shipment.cmr && shipment.cmr.url ? (
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
                                        <a href={"/uploads/" + shipment.cmr.uploadFolder + shipment.cmr.url} target="_blank" rel="noopener noreferrer">

                                            <MdDownload />&nbsp;
                                            Download File
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {shipment && shipment.departurePhotos && shipment.departurePhotos.length > 0 ? (
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

                                <div id="collapseOne" className={step5Shown ? "collapse show" : "collapse"} aria-labelledby="packingAndLoadingForDeparturePhotos" data-parent="#accordionExample">
                                    <div className="card-body">
                                        <div className='row'>
                                            {shipment.departurePhotos.map(img => (<div className='img-thumbnail m-1 mr-1 col col-auto' style={{ width: '300px' }}>
                                                <img src={getThumbUrl(img)} style={{ width: '300px' }} />
                                            </div>))}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {shipment && shipment.transitePhotos && shipment.transitePhotos.length > 0 ? (
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

                                <div id="collapseOne" className={step6Shown ? "collapse show" : "collapse"} aria-labelledby="loadingFromTransitePhotos" data-parent="#accordionExample">
                                    <div className="card-body">
                                        <div className='row'>
                                            {shipment.transitePhotos.map(img => (<div className='img-thumbnail m-1 mr-1 col col-auto' style={{ width: '300px' }}>
                                                <img src={getThumbUrl(img)} style={{ width: '300px' }} />
                                            </div>))}

                                        </div>
                                    </div>
                                </div>
                            </div>) : null}

                        {shipment && shipment.deliveryPhotos && shipment.deliveryPhotos.length > 0 ? (
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

                                <div id="collapseOne" className={step7Shown ? "collapse show" : "collapse"} aria-labelledby="loadingForDeliveryPhotos" data-parent="#accordionExample">
                                    <div className="card-body">
                                        <div className='row'>
                                            {shipment.deliveryPhotos.map(img => (<div className='img-thumbnail m-1 mr-1 col col-auto' style={{ width: '300px' }}>
                                                <img src={getThumbUrl(img)} style={{ width: '300px' }} />
                                            </div>))}


                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>


                    <div className='row'>
                        <div className="mb-3 mt-3 col row col-12 justify-content-end" >
                            <br /><br />
                            <Link className="add-btn btn-warning" to='/admin/shipments' ><MdClose size={20} />
                                &nbsp; {t("close")}</Link> &nbsp;
                            <Link className="add-btn btn-primary" to={'/admin/shipments/edit/' + shipment._id}>
                                <MdEdit size={20} />&nbsp;  {t("dashboard.edit")}</Link>
                        </div>
                    </div>

                </form>
            </div>


        </div>
    )
}


export default ViewShipment;