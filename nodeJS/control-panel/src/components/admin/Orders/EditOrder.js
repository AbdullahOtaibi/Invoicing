import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getOrder, updateItemAvailable, requestPayment, addOrderItem, sendOrderMessage } from './OrdersAPI'
import { useTranslation } from "react-i18next"
import Loader from "react-loader-spinner"
import {
    MdClose, MdAddShoppingCart, MdOutlineRequestPage, MdHourglassEmpty,
    MdCalendarToday, MdBadge, MdInfoOutline, MdRefresh, MdPayment, MdProductionQuantityLimits, MdOutlineRemoveShoppingCart, MdOutlineAddShoppingCart,
    MdOutlineMarkEmailUnread, MdOutlineOpenInNew, MdOutlineForwardToInbox, MdOutlineCalculate, MdOutlineReceiptLong
} from "react-icons/md";
import { getLocalizedText, getProductThumb } from '../utils/utils'
import Moment from 'react-moment';
import { hasPermission } from '../utils/auth';
import { Helmet } from "react-helmet";
import EditOrderItem from './EditOrderItem'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import ProductSearch from './ProductSearch'


const EditOrder = (props) => {

    let navigate = useNavigate();
    if (!hasPermission('orders.modify')) {
        navigate("/admin/orders", { replace: true });
    }

    const [order, setOrder] = useState({});
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const { orderId } = useParams();
    const [showMessageId, setShowMessageId] = useState();
    const [message, setMessage] = useState('');
    const [companies, setCompanies] = useState([]);
    const [targetId, setTargetId] = useState('-');
    const [draggedItemId, setDraggedItemId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showProductSearchModal, setShowProductSearchModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [paymentRequest, setPaymentRequest] = useState({});
    const [mailModalTitle, setMailModalTitle] = useState('');
    const [messageObject, setMessageObject] = useState({});

    useEffect(() => {
        reload();
    }, []);

    useEffect(() => {
        console.log('target id: ' + targetId);
    }, [targetId]);

    const reload = () => {
        setLoading(true);

        getOrder(orderId).then(data => {
            setLoading(false);
            console.log(data);
            data.items = data.items.filter(item => (item.status && item.status.deleted !== true));
            setOrder(data);
            fillcompanies(data);
        }).catch(e => {
            setLoading(false);
        });
    }

    const itemUpdated = (deleted) => {
        reload();
        if (deleted == true) {
            setShowModal(false);
        }

    }


    const showMessageClient = (clientId, clientName) => {

        let cloned = JSON.parse(JSON.stringify(messageObject));
        cloned.clientId = clientId;
        setMessageObject(cloned);
        setMailModalTitle(t("writeAMessageFor") + ' ' + clientName);
        setShowMessageModal(true);
    }

    const showMessagecompany = (companyId, companyName) => {
        let cloned = JSON.parse(JSON.stringify(messageObject));
        cloned.companyId = companyId;
        setMessageObject(cloned);
        setMailModalTitle(t("writeAMessageFor") + ' ' + companyName);
        setShowMessageModal(true);
    }

    const showMessageAdmin = () => {
        setMailModalTitle(t("writeAMessageFor") + ' Waredly');
        setShowMessageModal(true);
    }

    const postMessage = () => {
        //orderId, clientId, companyId, messageBody
        let cloned = JSON.parse(JSON.stringify(messageObject));
        cloned.orderId = orderId;
        setMessageObject(cloned);
        sendOrderMessage(cloned).then(data => {
           setMessageObject({companyId:null, clientId: null, messageBody:'' });
           setShowMessageModal(false);
           toast.success(t("succeed"));

        }).catch(e => {
            console.log(e);
        });
    }

    const updateMessageContent = (event) => {
        let cloned = JSON.parse(JSON.stringify(messageObject));
        cloned.messageBody = event.target.value;
        setMessageObject(cloned);
    }


    const fillcompanies = (data) => {

        if (!data || !data.items || data.items.length == 0) {
            return;
        }
        let uniqueuecompanies = [];
        data.items.forEach(item => {
            console.log(item.company);
            let companyExists = (uniqueuecompanies.filter(v => item.company && v._id == item.company._id)).length > 0;
            console.log('company ' + item.company._id + ' exist ? ' + companyExists);
            if (!companyExists && item.status.deleted != true) {
                uniqueuecompanies.push(item.company);
                console.log('company pushed.')
            }
        });
        console.log(uniqueuecompanies);
        setCompanies(uniqueuecompanies);
    }


    const getCountByStatus = (statusId) => {
        let items = [];
        if (order && order.items) {
            items = order.items.filter(item => item.status.available == statusId && item.status.deleted != true);
        }
        if (items) {
            return items.length;
        } else {
            return 0;
        }
    }


    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleClosePaymentModal = () => {
        setShowPaymentModal(false);
    }

    const handleCloseProductSearchModal = () => {
        setShowProductSearchModal(false);
    }

    const handleCloseMessageModal = () => {
        setShowMessageModal(false);
    }



    const showProductSearch = () => {
        setShowProductSearchModal(true);
    }




    const getcompanyItemsByStatus = (companyId, statusId) => {
        return order.items.filter(i => i.company._id == companyId && i.status.available == statusId && i.status.deleted != true);
    }

    const ItemCard = ({ item }) => {
        return (item && item.product ? (<div className='card mb-2 shadow-sm' style={{ ...styles.itemCard }}
            draggable="true"
            id={item._id}
            onDragStart={dragstart_handler}
            onDragEnd={dragend_handler} >
            <div className='row'>
                <div className='col col-auto'>
                    <img src={getProductThumb(item.product)} style={{ width: '100px', height: '100px', cursor: 'pointer' }} alt="" />
                </div>
                <div className='col py-4 px-0'>

                    {getLocalizedText(item.product.name, i18n)}
                    &nbsp;
                    {item.messages && item.messages.length > 0 ? (<><MdOutlineMarkEmailUnread size={30} color={'var(--danger)'} />
                        <span className='badge bg-danger' style={i18n.language == 'ar' ? styles.billRTL : styles.bill}>{item.messages.length}</span>
                    </>) : null}
                    <br />
                    <span style={{ fontWeight: 'normal', fontSize: '12px' }}>
                        {item.product.alias}
                    </span>


                </div>

                <div className='col col-auto py-4 px-0 text-center'>

                    {t("product.units")} <br />
                    {item.qty}

                </div>
                <div className='col col-auto text-end mx-1' style={{ lineHeight: '100px' }}>

                    <MdOutlineOpenInNew size={30} onClick={() => { setShowModal(true); setSelectedItem(item) }} />
                    <br />


                </div>

            </div>

        </div>) : null);
    }

    const updateItemStatus = (itemId, statusId) => {
        let cloned = JSON.parse(JSON.stringify(order));
        let selectedItem = cloned.items.filter(item => item._id == itemId);
        if (selectedItem && selectedItem.length > 0) {
            selectedItem = selectedItem[0];
        }
        if (selectedItem) {
            if (!selectedItem.status) {
                selectedItem.status = {}
            }
            if (statusId == 'true') {
                selectedItem.status.available = true;
            } else if (statusId == 'false') {
                selectedItem.status.available = false;
            } else {
                selectedItem.status.available = null;
            }

        }

        updateItemAvailable(orderId, itemId, selectedItem.status.available).then(() => { console.log('updated') });


        setOrder(cloned);
    }
    /*---------- Drag & Drop --------------------------*/

    const dragstart_handler = (event) => {



        //console.log("dragstart: event.target.id = " + event.target.id);
        event.dataTransfer.setData("id", event.target.id);
        //event.dataTransfer.setData("available", event.target.getAttribute("available"));
        event.dataTransfer.effectAllowed = "move";
        //setDraggedItemId(event.target.id);
        console.log("dragstart_handler : " + event.target.id);
    }
    const dragend_handler = (event) => {
        console.log("dragend_handler : " + event.dataTransfer.getData("id") + " -->  " + event.target.id);
        //console.log("============================= DRAG END ====================== ");
        event.preventDefault();
        //setDragTo(-1);
        var id = event.dataTransfer.getData("id");
        var available = event.dataTransfer.getData("available");
        setTargetId(null);

    }
    const dragover_handler = (event, companyId, statusId) => {
        console.log("dragover_handler - item id : " + event.dataTransfer.getData("id") + " - " + statusId);
        if (companyId) {
            setTargetId(statusId);
        }
        event.preventDefault();
        var id = event.dataTransfer.getData("id");
        var order = event.dataTransfer.getData("available");


    }
    const drop_handler = (event) => {
        console.log("drop_handler - item Id : " + event.dataTransfer.getData("id"));


        updateItemStatus(event.dataTransfer.getData("id"), targetId);

        setTargetId(null);
        setDraggedItemId(null);
    }
    //-------------------------------------------------------------

    const handleShowPaymentModal = () => {
        setShowPaymentModal(true);
    }

    const updatePaymentAmount = (event) => {
        setPaymentRequest({ ...paymentRequest, amount: event.target.value })
    }



    const updatePaymentDescription = (event) => {

    }

    const requestClientPayment = () => {
        let cloned = JSON.parse(JSON.stringify(paymentRequest));
        cloned.client = order.client._id;
        cloned.order = order._id;
        cloned.currencyCode = "USD";
        requestPayment(cloned).then(data => {
            toast.success(t("succeed"));
            setShowPaymentModal(false);
        }).catch(e => {
            console.log(e);
            toast.error(t(e.message));
        });
    }

    const addProductToOrder = (prod, qty) => {
        addOrderItem(orderId, prod._id, qty).then(data => {
            if (data.success === true) {
                toast.success(t("succeed"));
                setShowProductSearchModal(false);
                reload();
            } else {
                toast.error(t("error"));
            }
        }).catch(e => {
            console.log(e);
            toast.error(t(e.message));
        });

    }


    return (
        <>
            <div className='row'>
                <div className='col-12'>


                    <div className="card">
                        <Helmet>
                            <title>{'Invoicing | Admin | Edit Order'} </title>
                        </Helmet>
                        <h5 className="card-header">
                            <div className='row'>
                                <div className='col col-auto'>
                                    <MdOutlineReceiptLong size={24} /> &nbsp;
                                    {t("order.orderDetails")}
                                </div>
                                <div className='col-2 p-0' style={{ textAlign: 'end' }}>

                                    <Loader
                                        type="ThreeDots"
                                        color="#00BFFF"
                                        visible={loading}
                                        height={20} />
                                </div>
                                <div className='col text-end' >
                                    <Link to="/admin/orders" className='btn btn-danger' style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                                        <MdClose size={20} />  {t("close")}
                                    </Link>
                                    &nbsp;


                                    <button type='button' className='btn btn-primary' onClick={showProductSearch}
                                        style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                                        <MdAddShoppingCart size={20} />  {t("product.addProduct")}
                                    </button>
                                    &nbsp;

                                    <button type='button' className='btn btn-primary' onClick={handleShowPaymentModal}
                                        style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                                        <MdPayment size={20} />  {t("payments.requestPayment")}
                                    </button>
                                    &nbsp;



                                    <button type="button" className='btn btn-primary' onClick={reload}>
                                        <MdRefresh size={20} />
                                    </button>
                                </div>
                            </div>

                        </h5>

                        <div className="card-body">

                            <div className="container text-center">

                            </div>

                            <form>
                                <div className='row'>
                                    <div className="col-3">
                                        <label htmlFor="title" className="form-label"># {t("order.orderNumber")}</label>
                                        <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                                            {("000000".substring(("" + order.serialNumber).length) + order.serialNumber)}
                                        </label>
                                    </div>

                                    <div className="col-3">
                                        <label htmlFor="title" className="form-label"> <MdCalendarToday /> {t("order.orderDate")}</label>
                                        <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                                            <Moment date={order.dateAdded} format="DD-MM-YYYY hh:mm a" />
                                        </label>
                                    </div>

                                    <div className="col-3">
                                        <label htmlFor="title" className="form-label">
                                            <MdBadge /> &nbsp;
                                            {t("order.clientName")}</label>
                                        <label htmlFor="title" className="form-control" style={{ border: 'none' }}>{order.client ? order.client.firstName : null} {order.client ? order.client.surName : null}</label>
                                    </div>

                                    <div className="col-3">
                                        <label htmlFor="title" className="form-label"><MdInfoOutline /> {t("order.orderStatus")}</label>
                                        <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                                            {order.status ? getLocalizedText(order.status.name, i18n) : null}
                                        </label>

                                    </div>
                                </div>

                                <div className='row'>
                                    <div className="col-3">
                                        <label htmlFor="title" className="form-label"><MdOutlineCalculate />  {t("order.totalAmount")}</label>
                                        <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                                            {order && order.totalAmount ? order.totalAmount.amount + ' ' + order.totalAmount.currencyCode : null}
                                        </label>
                                    </div>

                                    <div className="col-3">
                                        <label htmlFor="title" className="form-label"> <MdOutlineReceiptLong /> {t("payments.totalPaid")}</label>
                                        <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                                            0 USD
                                        </label>
                                    </div>

                                    <div className="col-3">
                                        <label htmlFor="title" className="form-label">
                                            <MdOutlineRequestPage /> &nbsp;
                                            {t("payments.remainingAmount")}</label>
                                        <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                                            {order && order.totalAmount ? order.totalAmount.amount + ' ' + order.totalAmount.currencyCode : null}
                                        </label>
                                    </div>

                                    <div className="col-3">
                                        <label htmlFor="title" className="form-label"><MdHourglassEmpty /> {t("payments.outstandingPaymentAmount")}</label>
                                        <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                                            {order && order.totalAmount ? (order.totalAmount.amount / 10).toFixed(2) + ' ' + order.totalAmount.currencyCode : null}
                                        </label>

                                    </div>
                                </div>


                                <div className='row'>
                                    <div className="col-4 text-center">
                                        <div className="row row-cards-one">
                                            <div className="col-md-12">
                                                <div className="mycard bg3">
                                                    <div className="left">
                                                        <h5 className="title">  {t("unknown")} </h5>
                                                        <span className="number">
                                                            {getCountByStatus(null)}
                                                        </span>

                                                    </div>
                                                    <div className="right d-flex align-self-center">
                                                        <div className="icon">
                                                            <MdProductionQuantityLimits size={80} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-4 text-center">
                                        <div className="row row-cards-one">
                                            <div className="col-md-12">
                                                <div className="mycard bg1">
                                                    <div className="left">
                                                        <h5 className="title">  {t("order.unavailable")} </h5>
                                                        <span className="number">
                                                            {getCountByStatus(false)}
                                                        </span>
                                                    </div>
                                                    <div className="right d-flex align-self-center">
                                                        <div className="icon">
                                                            <MdOutlineRemoveShoppingCart size={80} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-4 text-center">
                                        <div className="row row-cards-one">
                                            <div className="col-md-12">
                                                <div className="mycard bg6">
                                                    <div className="left">
                                                        <h5 className="title">   {t("order.available")}</h5>
                                                        <span className="number">
                                                            {getCountByStatus(true)}
                                                        </span>

                                                    </div>
                                                    <div className="right d-flex align-self-center">
                                                        <div className="icon">
                                                            <MdOutlineAddShoppingCart size={80} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>

                        </div>


                    </div>

                </div>
            </div>



            {companies.map(company => (
                (<div className='row' key={company._id}>
                    <div className='col-12'>

                        <div className='card mt-3 mb-3'>
                            <h5 className="card-header">
                                {getLocalizedText(company.name, i18n)}
                            </h5>
                            <div className='card-body' >


                                <div className='row'>
                                    <div className='col-4'>
                                        <div style={targetId == 'null' ? styles.dropTarget : styles.statusColumn}
                                            onDragOver={(event) => { dragover_handler(event, company._id, 'null'); }} onDrop={drop_handler}
                                            id={company._id + '-pending'}>
                                            <div style={styles.statusHeader}>
                                                {t("unknown")}
                                            </div>
                                            <div className='pending-items' style={styles.itemsContainer}>
                                                {getcompanyItemsByStatus(company._id, null).map(item => (
                                                    <ItemCard item={item} key={item._id} />
                                                ))}
                                            </div>

                                        </div>
                                    </div>
                                    <div className='col-4' >
                                        <div style={targetId == 'false' ? styles.dropTarget : styles.statusColumn}
                                            onDragOver={(event) => { dragover_handler(event, company._id, 'false'); }}
                                            onDrop={drop_handler}
                                            id={company._id + '-unavailable'}>
                                            <div style={styles.statusHeader}>
                                                {t("order.unavailable")}
                                            </div>
                                            <div className='unavailable-items' style={styles.itemsContainer}>
                                                {getcompanyItemsByStatus(company._id, false).map(item => (
                                                    <ItemCard item={item} key={item._id} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-4' >
                                        <div style={targetId == 'true' ? styles.dropTarget : styles.statusColumn}
                                            onDragOver={(event) => { dragover_handler(event, company._id, 'true'); }}
                                            onDrop={drop_handler} id={company._id + '-available'}>
                                            <div style={styles.statusHeader}>
                                                {t("order.available")}
                                            </div>
                                            <div className='available-items' style={styles.itemsContainer}>
                                                {getcompanyItemsByStatus(company._id, true).map(item => (
                                                    <ItemCard item={item} key={item._id} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                </div>


                            </div>
                            <div className='card-footer text-end'>
                                {localStorage.getItem("role") == "Administrator" ? (<>
                                    <button type='button' className='btn btn-success shadow-sm' onClick={() => { showMessageClient(order.client._id, order.client ? order.client.firstName + ' ' + order.client.surName : null) }}>
                                        <MdOutlineForwardToInbox size={24} /> &nbsp;<b> {t("writeAMessageFor")}</b> <b style={{ color: 'yellow' }}>
                                            {order.client ? order.client.firstName : null} {order.client ? order.client.surName : null}
                                        </b>
                                    </button>
                                    &nbsp;&nbsp;

                                    <button type='button' className='btn btn-success shadow-sm' onClick={() => { showMessagecompany(company._id, getLocalizedText(company.name, i18n)) }}>
                                        <MdOutlineForwardToInbox size={24} /> &nbsp;<b> {t("writeAMessageFor")} </b> <b style={{ color: 'yellow' }}>{getLocalizedText(company.name, i18n)}</b>
                                    </button>
                                </>) : null}

                                {localStorage.getItem("role") == "company" ? (<>
                                    <button type='button' className='btn btn-success shadow-sm'>
                                        <MdOutlineForwardToInbox size={24} /> &nbsp;
                                        {i18n.language == 'tr' ? (<><b style={{ color: 'yellow' }}>
                                            Waredly
                                        </b>
                                            <b>
                                                {t("writeAMessageFor")}
                                            </b>

                                        </>
                                        ) : (<> <b>
                                            {t("writeAMessageFor")}
                                        </b>

                                            <b style={{ color: 'yellow' }}>
                                                Waredly
                                            </b>
                                        </>)}

                                    </button>
                                </>) : null}
                            </div>
                        </div>

                    </div>
                </div>
                )
            ))}

            <Modal
                show={showModal}
                onHide={handleCloseModal}
                backdrop="static"
                size="xl"
                keyboard={false}
            >
                <Modal.Header>
                    <div className='row' style={{ width: '100%' }}>
                        <div className='col'>
                            <Modal.Title>
                                {t("product.description")}

                            </Modal.Title>


                        </div>
                        <div className='col col-auto px-0 text-end'>
                            <button type='button' className='btn btn-link' onClick={handleCloseModal}>
                                <MdClose size={30} />
                            </button>
                        </div>
                    </div>


                </Modal.Header>
                <Modal.Body>
                    <EditOrderItem item={selectedItem} onItemModified={itemUpdated} />
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>

            <Modal
                show={showPaymentModal}
                onHide={handleClosePaymentModal}
                backdrop="static"
                size="lg"
                keyboard={false}
            >
                <Modal.Header>
                    <div className='row' style={{ width: '100%' }}>
                        <div className='col text-start'>
                            <Modal.Title className="text-start">
                                {t("payments.requestPayment")}

                            </Modal.Title>
                        </div>
                        <div className='col col-auto px-0 text-end'>
                            <button type='button' className='btn btn-link' onClick={handleClosePaymentModal}>
                                <MdClose size={30} />
                            </button>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className='col-12'>
                            <div className="mb-3">
                                <label htmlFor="paymentAmount" className="form-label">{t("amount")} </label>
                                <input type="text" className="form-control" id="paymentAmount" value={paymentRequest.amount} onChange={updatePaymentAmount} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="oPaymentDescription" className="form-label">{t("product.description")} </label>
                                <textarea rows="5" className="form-control" id="oPaymentDescription"
                                    value={paymentRequest.description} onChange={updatePaymentDescription} />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="row">
                        <div className='col-12 text-end'>
                            <button type='button' className='btn btn-danger' onClick={handleClosePaymentModal}>
                                CLOSE
                            </button>
                            &nbsp;
                            <button type='button' className='btn btn-success' onClick={requestClientPayment}>
                                SAVE
                            </button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>





            <Modal
                show={showProductSearchModal}
                onHide={handleCloseProductSearchModal}
                backdrop="static"
                size="lg"
                keyboard={false}
            >
                <Modal.Header>
                    <div className='row' style={{ width: '100%' }}>
                        <div className='col text-start'>
                            <Modal.Title className="text-start">
                                {t("product.addProduct")}

                            </Modal.Title>
                        </div>
                        <div className='col col-auto px-0 text-end'>
                            <button type='button' className='btn btn-link' onClick={handleCloseProductSearchModal}>
                                <MdClose size={30} />
                            </button>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <ProductSearch onProductAdded={addProductToOrder} />
                </Modal.Body>
                <Modal.Footer>
                    <div className="row">
                        <div className='col-12 text-end'>
                            <button type='button' className='btn btn-danger' onClick={handleCloseProductSearchModal}>
                                CLOSE
                            </button>

                        </div>
                    </div>
                </Modal.Footer>
            </Modal>


            <Modal
                show={showMessageModal}
                onHide={handleCloseProductSearchModal}
                backdrop="static"
                size="lg"
                keyboard={false}
            >
                <Modal.Header>
                    <div className='row' style={{ width: '100%', direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}>
                        <div className='col text-start'>
                            <Modal.Title className="text-start">
                                {mailModalTitle}

                            </Modal.Title>
                        </div>
                        <div className='col col-auto px-0 text-end'>
                            <button type='button' className='btn btn-link' onClick={handleCloseMessageModal}>
                                <MdClose size={30} />
                            </button>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <textarea className='form-control' rows="5" value={messageObject.messageBody} onChange={updateMessageContent} />
                </Modal.Body>
                <Modal.Footer>
                    <div className="row" style={{ width: '100%', direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}>
                        <div className='col-12 text-end' style={{ textAlign: 'end' }}>
                            <button type='button' className='btn btn-danger' onClick={handleCloseMessageModal}>
                                {t("close")}
                            </button>
                            &nbsp;
                            <button type='button' className='btn btn-primary' onClick={postMessage}>
                                {t("sendByEmail")}
                            </button>

                        </div>
                    </div>
                </Modal.Footer>
            </Modal>





        </>
    )
}

const styles = {
    callout: {
        width: '100%', borderTop: 'solid 1px #18bc9c',
        borderRight: 'solid 1px #18bc9c', borderBottom: 'solid 1px #18bc9c'
        , borderLeft: '5px solid #18bc9c',
        display: 'block', borderColor: '#18bc9c', borderRadius: '.25rem', minHeight: '60px',
        borderColor: '#18bc9c'
    },
    calloutRTL: {
        width: '100%', borderTop: 'solid 1px #18bc9c',
        borderLeft: 'solid 1px #18bc9c', borderBottom: 'solid 1px #18bc9c'
        , borderRight: '5px solid #18bc9c',
        display: 'block', borderColor: '#18bc9c', borderRadius: '.25rem', minHeight: '60px',
        borderColor: '#18bc9c'
    },
    calloutInfo: {
        textAlign: 'start', color: '#18bc9c',
        borderRight: 'solid 1px #18bc9c', display: 'inline-block'
    }, calloutInfoRTL: {
        textAlign: 'start', color: '#18bc9c',
        borderLeft: 'solid 1px #18bc9c', display: 'inline-block'
    },
    statusHeader: {
        padding: '10px',
        color: '#5e6c84',
        fontSize: '12px'
    },
    statusColumn: {
        backgroundColor: '#ecf0f1',
        borderRadius: '5px',
        minHeight: '200px'
    },
    itemsContainer: {
        padding: '10px'
    },
    itemCard: {
        cursor: 'pointer'

    },
    dropTarget: {
        backgroundColor: '#18bc9c',
        borderRadius: '5px',
        minHeight: '200px',


    },
    bill: {
        color: '#fff', top: '-10px', left: '-10px', position: 'relative'
    },
    billRTL: {
        color: '#fff', top: '-10px', right: '-10px', position: 'relative'
    }
}

export default EditOrder;