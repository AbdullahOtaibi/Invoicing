import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getOrder, updateItemAvailable, updateItemConfirmed, addItemMessage, sendTocompanies, closeOrder } from './OrdersAPI'
import { useTranslation } from "react-i18next"
import Loader from "react-loader-spinner"
import {
    MdBurstMode, MdClose, MdAddComment, MdAdd, MdTimer, MdHistory, MdSend,
    MdCalendarToday, MdBadge, MdInfoOutline, MdReplay, MdPerson
} from "react-icons/md";
import { getLocalizedText } from '../utils/utils'
import { createShipment } from '../Shipments/ShipmentsAPI'
import Moment from 'react-moment';
import { hasPermission } from '../utils/auth';
import { Helmet } from "react-helmet";


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
    const [showHistoryId, setShowHistoryId] = useState();
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        reload();
    }, []);

    const reload = () => {
        setLoading(true);

        getOrder(orderId).then(data => {
            setLoading(false);
            console.log(data);
            setOrder(data);
            fillcompanies(data);
        }).catch(e => {
            setLoading(false);
        });
    }

    const setOrderClosed = () => {
        closeOrder(orderId);
        let cloned = JSON.parse(JSON.stringify(order));
        cloned.status = 100;
        setOrder(order);
    }

    const fillcompanies = (data) => {
        if (!data.items || data.items.length == 0) {
            return;
        }
        let uniqueuecompanies = [];
        data.items.forEach(item => {
            let companyExists = uniqueuecompanies.filter(v => item.company && v._id == item.company._id).length > 0;
            if (!companyExists) {
                uniqueuecompanies.push(item.company);
            }
        });
        console.log(companies);
        setCompanies(uniqueuecompanies);
    }






    const toggleAvailable = (event, orderId, itemId) => {
        setLoading(true);
        let cloned = JSON.parse(JSON.stringify(order));
        let selectedItem = cloned.items.filter(i => i._id == itemId)[0];
        if (!selectedItem.status) {
            selectedItem.status = {
                available: '-'
            }
        }
        selectedItem.status.available = event.target.value;
        updateItemAvailable(orderId, itemId, selectedItem.status.available).then(() => { reload(); });
        //setOrder(cloned);
    }

    const toggleConfirmed = (orderId, itemId) => {
        setLoading(true);
        let cloned = JSON.parse(JSON.stringify(order));
        let selectedItem = cloned.items.filter(i => i._id == itemId)[0];
        if (!selectedItem.status) {
            selectedItem.status = {
                available: false,
                confirmed: false
            }
        }
        if (selectedItem.status.confirmed == true) {
            selectedItem.status.confirmed = false;
        } else {
            selectedItem.status.confirmed = true;
        }

        updateItemConfirmed(orderId, itemId, selectedItem.status.confirmed).then(res => {
            reload();
        });
        //.then(() => { reload() });
        setOrder(cloned);
    }



    const showAddMessage = itemId => {
        setShowMessageId(itemId);
    }

    const hideAddMessage = () => {
        setShowMessageId(null);
    }


    const addMessage = itemId => {
        setLoading(true);
        if (!message || message.length == 0) {
            return;
        }

        let cloned = JSON.parse(JSON.stringify(order));
        let selectedItem = cloned.items.filter(i => i._id == itemId)[0];
        if (!selectedItem.messages) {
            selectedItem.messages = [];
        }
        selectedItem.messages.push({ message: message });
        setOrder(cloned);
        addItemMessage(order._id, itemId, message)
            .then(() => { reload() });
        setMessage(null);
        setShowMessageId(null);
    }

    const updateMessage = (event) => {
        setMessage(event.target.value);
    }


    const showHistory = itemId => {
        if (showHistoryId == itemId) {
            setShowHistoryId();
        } else {
            setShowHistoryId(itemId);
        }

    }

    const returnToClient = () => {

    }


    const doPost = () => {
        sendTocompanies(orderId)
    }

    //----------------------

    const startShipment = () => {
        createShipment(orderId).then(res => {

        }).catch(e => {

        });
    }


    const getItemsByStatus = (companyId, statusId) => {
        return order.items.sort((a, b) => {
            return a.company._id - b.company._id;
        }).filter(i => i.company._id == companyId && i.available == true);
    }


    return (
        <div className="card">
            <Helmet>
                <title>{'Invoicing | Admin | Edit Order'} </title>
            </Helmet>
            <div className="card-body">
                <h5 className="card-title">
                    <div className='row'>
                        <div className='col-10'>
                            <MdBurstMode />
                            {t("order.orderDetails")}
                        </div>
                        <div className='col-2 p-0' style={{ textAlign: 'end' }}>

                            <Loader
                                type="ThreeDots"
                                color="#00BFFF"
                                visible={loading}
                                height={20}



                            />
                        </div>
                    </div>

                </h5>
                <div className="container text-center">

                </div>
                <br />
                <form>
                    <div className='row'>
                        <div className="mb-3 col-6">
                            <label htmlFor="title" className="form-label"># {t("order.orderNumber")}</label>
                            <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                                {("000000".substring(("" + order.serialNumber).length) + order.serialNumber)}
                            </label>
                        </div>

                        <div className="mb-3 col-6">
                            <label htmlFor="title" className="form-label"> <MdCalendarToday /> {t("order.orderDate")}</label>
                            <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                                <Moment date={order.dateAdded} format="DD-MM-YYYY hh:mm a" />
                            </label>
                        </div>

                        <div className="mb-3 col-6">
                            <label htmlFor="title" className="form-label">
                                <MdBadge /> &nbsp;
                                {t("order.clientName")}</label>
                            <label htmlFor="title" className="form-control" style={{ border: 'none' }}>{order.client ? order.client.firstName : null} {order.client ? order.client.surName : null}</label>
                        </div>

                        <div className="mb-3 col-6">
                            <label htmlFor="title" className="form-label"><MdInfoOutline /> {t("order.orderStatus")}</label>
                            <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                                {order.status ? getLocalizedText(order.status.name, i18n) : null}
                            </label>

                        </div>
                    </div>
                    <div className='row'>




                        {companies.map(company => (
                            <table className='table mb-5 table-sm'>
                                <thead>
                                    <tr className='table-primary'>
                                        <th colSpan={6}>
                                            {company ? getLocalizedText(company.name, i18n) : null}
                                        </th>
                                        <th colSpan={2} style={{ textAlign: 'end' }}>
                                            {localStorage.getItem("role") == "Administrator" ? (
                                                <Link className="add-btn btn-warning" to={'#'} onClick={doPost}><MdSend size={20} />
                                                    {t("order.sendForcompany")}
                                                </Link>
                                            ) : null}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            {localStorage.getItem("role") == "Administrator" ? t("product.alias") : t("product.sku")}
                                        </th>
                                        <th>
                                            {t("product.name")}
                                        </th>
                                        <th>
                                            {t("product.company")}
                                        </th>
                                        <th>
                                            {t("product.units")}
                                        </th>


                                        <th className='text-center'>
                                            {t("order.available")}
                                        </th>


                                        <th className='text-center'>
                                            {t("order.confirmed")}
                                        </th>

                                        <th>
                                            {t("product.price")}
                                        </th>
                                        <th>

                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items ? (order.items.sort((a, b) => {
                                        return a.product.company._id - b.company._id;
                                    }).filter(i => i.company._id == company._id).map(item => (<>
                                        <tr key={item._id}>
                                            <td>
                                                {localStorage.getItem("role") == "Administrator" ? item.product.alias : item.product.sku}
                                            </td>
                                            <td>
                                                {getLocalizedText(item.product.name, i18n)}
                                            </td>
                                            <td>
                                                {getLocalizedText(item.company.name, i18n)}
                                            </td>
                                            <td>
                                                {item.qty}
                                            </td>


                                            <td className='text-center'>
                                                <select classNam='form-control'
                                                    value={(typeof (item.status.available) != "undefined") ? item.status.available : '-'} onChange={(event) => toggleAvailable(event, order._id, item._id)}>
                                                    <option value="-">Not Set</option>
                                                    <option value={true}>Available</option>
                                                    <option value={false}>Not Available</option>
                                                </select>

                                            </td>
                                            <td className='text-center'>
                                                <input type="checkbox" checked={item.status && item.status.confirmed}
                                                    title={"updated by"}
                                                    onChange={() => toggleConfirmed(order._id, item._id)} style={{ cursor: 'pointer' }} />
                                            </td>


                                            <td>
                                                {item.itemPrice.subtotal} $
                                            </td>
                                            <td style={{ textAlign: 'end' }}>
                                                {item.messages && item.messages.length > 0 ? (
                                                    <Link to="#" className='add-btn btn-info ml-3 mr-3' onClick={() => showHistory(item._id)}>
                                                        <MdHistory /> {t("order.history")}</Link>) : null}

                                                <Link to="#" className='add-btn' onClick={() => showAddMessage(item._id)}><MdAddComment size={18} /> &nbsp;
                                                    {t("order.addComment")}
                                                </Link>
                                            </td>
                                        </tr>
                                        {showMessageId == item._id ? (<tr>
                                            <td colSpan={7}>
                                                <input type='text' className='form-control' value={message} onChange={updateMessage} />
                                            </td>
                                            <td className='pt-3'>

                                                <Link to="#" className='add-btn ml-3 mr-3' onClick={() => addMessage(item._id)}>
                                                    <MdAdd size={20} /> {t("dashboard.save")} </Link>
                                                <Link to="#" className='btn-danger add-btn' onClick={hideAddMessage}> <MdClose /> {t("close")} </Link>
                                            </td>
                                        </tr>) : null}

                                        {item.messages && item.messages.length > 0 ? (<>
                                            {showHistoryId == item._id ? (<tr>
                                                <td>

                                                </td>
                                                <td colspan={6}>
                                                    {item.messages.map(msg => (<>

                                                        <div className='row'>

                                                            <div className='col-9'>
                                                                <div className=" mt-1 p-1 justify-content-center align-items-center "
                                                                    style={i18n.language == 'ar' ? styles.calloutRTL : styles.callout}>

                                                                    <div className=' pt-1' style={i18n.language == 'ar' ? styles.calloutInfoRTL : styles.calloutInfo}>
                                                                        <MdPerson />&nbsp;
                                                                        {msg.addedBy ? "" + msg.addedBy.firstName + " " + msg.addedBy.surName : "Me"} &nbsp;
                                                                        <br />
                                                                        <MdCalendarToday />&nbsp;
                                                                        {msg.date ? (<>
                                                                            <Moment date={msg.date} format="DD-MM-YYYY " />
                                                                            <br />
                                                                            <MdTimer />
                                                                            &nbsp;<Moment date={msg.date} format="hh:mm a" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                        </>) : "Just Now"}

                                                                    </div>
                                                                    <div className='px-3' style={{ display: 'inline-block', position: 'absolute', fontWeight: 'normal' }}>
                                                                        {msg.message}
                                                                    </div>


                                                                </div>
                                                            </div>
                                                        </div>



                                                    </>


                                                    ))}
                                                </td>
                                                <td></td>
                                            </tr>) : null}
                                        </>) : null}

                                    </>
                                    ))) : null}
                                </tbody>
                            </table>))}
                    </div>

                    {localStorage.getItem("role") == "Administrator" ? (<div className="mb-3 row" >
                        <div className='col-12'>
                            <textarea className='form-control' placeholder={t("order.notesForClient")}></textarea>
                        </div>

                    </div>) : null}

                    <div className='row'>
                        <div className="mb-3  col justify-content-end" >
                            <Link className="add-btn btn-warning" to={'/admin/orders/' + order._id} ><MdClose size={20} /> {t("close")}</Link> &nbsp; &nbsp;

                            {localStorage.getItem("role") == "Administrator" ? (
                                <Link className="add-btn btn-primary" to={'#'} onClick={returnToClient}><MdReplay size={20} /> {t("order.returnToClient")}</Link>
                            ) : null}
                            &nbsp; &nbsp;

                            {localStorage.getItem("role") == "Administrator" ? (
                                <Link className="add-btn btn-primary" to={'#'} onClick={doPost}><MdSend size={20} /> {t("order.sendForcompanies")}</Link>
                            ) : null}




                            {/* <Link className="add-btn btn-primary" to={'#'} onClick={doPost}><MdSave size={20} /> {t("dashboard.save")}</Link> */}
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-12'>
                            <hr />
                            <p>
                                following Options are for test purposes only.
                            </p>
                            <hr />
                            <button type='button' className='add-btn btn-danger'
                                onClick={startShipment}>
                                Start Shipping
                            </button>
                            &nbsp;
                            <button type='button' className='add-btn btn-danger'
                                onClick={setOrderClosed}>
                                Close Order
                            </button>


                        </div>
                    </div>


                </form>

            </div>


        </div>
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
    }
}

export default EditOrder;