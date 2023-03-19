import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getOrder, updateItemAvailable, updateItemConfirmed, addItemMessage, deleteOrderItem} from './OrdersAPI'
import { useTranslation } from "react-i18next"
import Loader from "react-loader-spinner"
import {
    MdBurstMode, MdClose, MdAddComment, MdAdd, MdTimer, MdHistory, MdSend,
    MdCalendarToday, MdBadge, MdInfoOutline, MdReplay, MdRefresh, MdOutlineHourglassEmpty, MdProductionQuantityLimits, MdOutlineRemoveShoppingCart, MdOutlineAddShoppingCart, MdOutlineMarkEmailUnread, MdOutlineZoomOutMap, MdCardGiftcard, MdOutlineAddCircleOutline, MdSave
} from "react-icons/md";
import { getLocalizedText, getProductThumb } from '../utils/utils'
import Moment from 'react-moment';
import { hasPermission } from '../utils/auth';
import { Helmet } from "react-helmet";


const EditOrderItem = (props) => {

    let navigate = useNavigate();
    if (!hasPermission('orders.modify')) {
        navigate("/admin/orders", { replace: true });
    }

    const [orderItem, setOrderItem] = useState(props.item);
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const [showMessageId, setShowMessageId] = useState();
    const [message, setMessage] = useState('');
    const [showHistoryId, setShowHistoryId] = useState();
    const [showNewMessage, setShowNewMessage] = useState(false);

    useEffect(() => {
       
    }, []);


    const deleteItem = () => {
        deleteOrderItem(orderItem._id).then(() => {
            if(props.onItemModified){
                props.onItemModified(true);
            }
        }).catch(e => {
            console.log(e);
        });
    }

    

    const addMessage = () => {
        if(message ){
            
           
            addItemMessage(orderItem.order, orderItem._id, message).then(() => {
                setShowNewMessage(false);
                let cloned = JSON.parse(JSON.stringify(orderItem));
                if(!cloned.messages){
                    cloned.messages = [];
                }
                cloned.messages.push({
                    date: new Date(),
                    message: message,
                    addedBy: {firstName: localStorage.getItem("userName")}
                })
                setOrderItem(cloned);
                setMessage('');
                if(props.onItemModified){
                    props.onItemModified();
                }
            })
        }else{
            
        }
       
        
        
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
        //sendTocompanies(orderId)
    }

    //----------------------

    const startShipment = () => {
        // createShipment(orderId).then(res => {

        // }).catch(e => {

        // });
    }

    const getMessageClass = () => {
        if(message && showNewMessage){
            return 'is-valid'
        }else if(showNewMessage){
            return 'is-invalid'
        }
       
    }




    const updateItemStatus = (itemId, statusId) => {
        // let cloned = JSON.parse(JSON.stringify(order));
        // let selectedItem = cloned.items.filter(item => item._id == itemId);
        // if (selectedItem && selectedItem.length > 0) {
        //     selectedItem = selectedItem[0];
        // }
        // if (selectedItem) {
        //     if (!selectedItem.status) {
        //         selectedItem.status = {}
        //     }
        //     if (statusId == 'true') {
        //         selectedItem.status.available = true;
        //     } else if (statusId == 'false') {
        //         selectedItem.status.available = false;
        //     } else {
        //         selectedItem.status.available = null;
        //     }

        // }
        // setOrder(cloned);
    }



    return (
        <>
            <div className='row'>
                <div className='col-12'>


                    <div className="card">
                        <h5 className="card-header">
                            <div className='row'>
                                <div className='col-8'>
                                    <MdCardGiftcard size={24} /> &nbsp;
                                    {t("product.aboutProduct")}
                                </div>
                                <div className='col-2 p-0' style={{ textAlign: 'end' }}>

                                    <Loader
                                        type="ThreeDots"
                                        color="#00BFFF"
                                        visible={loading}
                                        height={20}



                                    />
                                </div>
                                <div className='col-2 text-end' >
                                
                                <button type='button' className='btn btn-danger' style={{ textTransform: 'uppercase', fontWeight: 'bold' }} onClick={deleteItem}>
                                        {t("dashboard.delete")}
                                    </button>
                                    &nbsp;
                                    <button type='button' className='btn btn-success' style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                                        {t("dashboard.save")}
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
                                        <label htmlFor="title" className="form-label"> {t("product.code")}</label>
                                        <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                                            <a href={"https://Invoicing/product/" + orderItem.product.alias.toLowerCase()} target="_blank">
                                                {orderItem.product.alias}
                                            </a>
                                        </label>
                                    </div>

                                    <div className="col-3">
                                        <label htmlFor="title" className="form-label">  {t("product.name")}</label>
                                        <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                                            {getLocalizedText(orderItem.product.name, i18n)}
                                        </label>
                                    </div>

                                    <div className="col-2">
                                        <label htmlFor="title" className="form-label">

                                            {t("product.price")} / {t("product.unit")} </label>
                                        <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                                            {orderItem.itemPrice.amount}  {orderItem.itemPrice.currencyCode}
                                        </label>
                                    </div>

                                    <div className="col-2">
                                        <label htmlFor="title" className="form-label"> {t("product.units")}</label>
                                        <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                                            {orderItem.qty}
                                        </label>

                                    </div>

                                    <div className="col-2">
                                        <label htmlFor="title" className="form-label"> {t("product.subtotal")}</label>
                                        <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                                            {orderItem.itemPrice.subtotal}  {orderItem.itemPrice.currencyCode}
                                        </label>

                                    </div>

                                </div>
                                <div className='row'>
                                    <div className="col-3">
                                        <label htmlFor="title" className="form-label"> {t("product.company")}</label>
                                        <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                                            {getLocalizedText(orderItem.company.name, i18n)}
                                        </label>
                                    </div>
                                </div>


                            </form>

                        </div>



                    </div>



                    <div className='card mt-4'>
                        <div className="card-header">
                            <div className='row'>
                                <div className='col'>
                                    Messages
                                </div>
                                <div className='col col-auto text-end'>
                                    <button type='button' className='btn btn-primary' onClick={() => setShowNewMessage(true)}>
                                        <MdOutlineAddCircleOutline size={24} /> New Message
                                    </button>

                                </div>
                            </div>


                        </div>
                        <div className='card-body'>
                            <table className='table'>
                                <thead>
                                    {showNewMessage ? (<tr className='pb-5 table-light'>
                                        <td colSpan={3} className='text-end'>
                                            <textarea className={getMessageClass() + ' form-control'} placeholder={t("quotation.message")} onChange={updateMessage} rows={5} />
                                            <div class="invalid-feedback">{t("validation.requiredField")}</div>
                                            <br/>
                                            <button type='button' className='btn btn-danger' onClick={() => setShowNewMessage(false)}>
                                                <MdClose size={24} />  {t("close")}
                                            </button>
                                            &nbsp;
                                            <button type='button' className='btn btn-success' onClick={addMessage}>
                                                <MdSave size={24} />   {t("dashboard.save")}
                                            </button>
                                        </td>
                                        
                                    </tr>) : null}

                                    <tr>
                                        <th>
                                            Date Time
                                        </th>
                                        <th>
                                            From
                                        </th>
                                        <th>
                                            Message
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {orderItem.messages.map(message => (
                                        <tr key={message._id}>
                                            <td>
                                                <Moment date={message.date} format="DD-MM-YYYY hh:mm a" />

                                            </td>
                                            <td>
                                                {message.addedBy.firstName}
                                            </td>
                                            <td>
                                                {message.message}
                                            </td>
                                        </tr>

                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </div>



                </div>
            </div>

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
    }
}

export default EditOrderItem;