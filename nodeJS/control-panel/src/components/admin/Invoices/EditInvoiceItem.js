import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getInvoice, updateItemAvailable, updateItemConfirmed, addItemMessage, deleteInvoiceItem} from './InvoicesAPI'
import { useTranslation } from "react-i18next"
import { ThreeDots } from  'react-loader-spinner'
import {
    MdBurstMode, MdClose, MdAddComment, MdAdd, MdTimer, MdHistory, MdSend,
    MdCalendarToday, MdBadge, MdInfoOutline, MdReplay, MdRefresh, MdOutlineHourglassEmpty, MdProductionQuantityLimits, MdOutlineRemoveShoppingCart, MdOutlineAddShoppingCart, MdOutlineMarkEmailUnread, MdOutlineZoomOutMap, MdCardGiftcard, MdOutlineAddCircleOutline, MdSave
} from "react-icons/md";
import { getLocalizedText, getProductThumb } from '../utils/utils'
import Moment from 'react-moment';
import { hasPermission } from '../utils/auth';
import { Helmet } from "react-helmet";


const EditInvoiceItem = (props) => {

    let navigate = useNavigate();
    if (!hasPermission('invoices.modify')) {
        navigate("/admin/invoices", { replace: true });
    }

    const [invoiceItem, setInvoiceItem] = useState(props.item);
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const [showMessageId, setShowMessageId] = useState();
    const [message, setMessage] = useState('');
    const [showHistoryId, setShowHistoryId] = useState();
    const [showNewMessage, setShowNewMessage] = useState(false);

    useEffect(() => {
       
    }, []);


    const deleteItem = () => {
        deleteInvoiceItem(invoiceItem._id).then(() => {
            if(props.onItemModified){
                props.onItemModified(true);
            }
        }).catch(e => {
            console.log(e);
        });
    }

    

    const addMessage = () => {
        if(message ){
            
           
            addItemMessage(invoiceItem.invoice, invoiceItem._id, message).then(() => {
                setShowNewMessage(false);
                let cloned = JSON.parse(JSON.stringify(invoiceItem));
                if(!cloned.messages){
                    cloned.messages = [];
                }
                cloned.messages.push({
                    date: new Date(),
                    message: message,
                    addedBy: {firstName: localStorage.getItem("userName")}
                })
                setInvoiceItem(cloned);
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
        //sendTocompanies(invoiceId)
    }

    //----------------------

    const startShipment = () => {
        // createShipment(invoiceId).then(res => {

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
        // let cloned = JSON.parse(JSON.stringify(invoice));
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
        // setInvoice(cloned);
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

                                    <ThreeDots
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
                                        <label htmlFor="title" className="form-control" style={{ binvoice: 'none' }}>
                                            <a href={"https://Invoicing/product/" + invoiceItem.product.alias.toLowerCase()} target="_blank">
                                                {invoiceItem.product.alias}
                                            </a>
                                        </label>
                                    </div>

                                    <div className="col-3">
                                        <label htmlFor="title" className="form-label">  {t("product.name")}</label>
                                        <label htmlFor="title" className="form-control" style={{ binvoice: 'none' }}>
                                            {getLocalizedText(invoiceItem.product.name, i18n)}
                                        </label>
                                    </div>

                                    <div className="col-2">
                                        <label htmlFor="title" className="form-label">

                                            {t("product.price")} / {t("product.unit")} </label>
                                        <label htmlFor="title" className="form-control" style={{ binvoice: 'none' }}>
                                            {invoiceItem.itemPrice.amount}  {invoiceItem.itemPrice.currencyCode}
                                        </label>
                                    </div>

                                    <div className="col-2">
                                        <label htmlFor="title" className="form-label"> {t("product.units")}</label>
                                        <label htmlFor="title" className="form-control" style={{ binvoice: 'none' }}>
                                            {invoiceItem.qty}
                                        </label>

                                    </div>

                                    <div className="col-2">
                                        <label htmlFor="title" className="form-label"> {t("product.subtotal")}</label>
                                        <label htmlFor="title" className="form-control" style={{ binvoice: 'none' }}>
                                            {invoiceItem.itemPrice.subtotal}  {invoiceItem.itemPrice.currencyCode}
                                        </label>

                                    </div>

                                </div>
                                <div className='row'>
                                    <div className="col-3">
                                        <label htmlFor="title" className="form-label"> {t("product.company")}</label>
                                        <label htmlFor="title" className="form-control" style={{ binvoice: 'none' }}>
                                            {getLocalizedText(invoiceItem.company.name, i18n)}
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

                                    {invoiceItem.messages.map(message => (
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
        width: '100%', binvoiceTop: 'solid 1px #18bc9c',
        binvoiceRight: 'solid 1px #18bc9c', binvoiceBottom: 'solid 1px #18bc9c'
        , binvoiceLeft: '5px solid #18bc9c',
        display: 'block', binvoiceColor: '#18bc9c', binvoiceRadius: '.25rem', minHeight: '60px',
        binvoiceColor: '#18bc9c'
    },
    calloutRTL: {
        width: '100%', binvoiceTop: 'solid 1px #18bc9c',
        binvoiceLeft: 'solid 1px #18bc9c', binvoiceBottom: 'solid 1px #18bc9c'
        , binvoiceRight: '5px solid #18bc9c',
        display: 'block', binvoiceColor: '#18bc9c', binvoiceRadius: '.25rem', minHeight: '60px',
        binvoiceColor: '#18bc9c'
    },
    calloutInfo: {
        textAlign: 'start', color: '#18bc9c',
        binvoiceRight: 'solid 1px #18bc9c', display: 'inline-block'
    }, calloutInfoRTL: {
        textAlign: 'start', color: '#18bc9c',
        binvoiceLeft: 'solid 1px #18bc9c', display: 'inline-block'
    }
}

export default EditInvoiceItem;