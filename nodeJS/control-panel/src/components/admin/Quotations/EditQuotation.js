import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getQuotation, updateItemAvailable, updateItemConfirmed, addItemMessage, sendTocompanies } from './QuotationsAPI'
import { useTranslation } from "react-i18next"
import { ThreeDots } from  'react-loader-spinner'
import {
    MdBurstMode, MdClose, MdAddComment, MdAdd, MdTimer, MdHistory, MdSend,
    MdCalendarToday, MdBadge, MdInfoOutline, MdReplay
} from "react-icons/md";
import { getLocalizedText } from '../utils/utils'
import { hasPermission } from '../utils/auth';
import Moment from 'react-moment';


const EditQuotation = (props) => {

    let navigate = useNavigate();
    if (!hasPermission('orders.modify')) {
        navigate("/admin/quotations", { replace: true });
    }


    const [quotation, setQuotation] = useState({});
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const { quotationId } = useParams();
    const [showMessageId, setShowMessageId] = useState();
    const [message, setMessage] = useState('');
    const [showHistoryId, setShowHistoryId] = useState();

    useEffect(() => {
        reload();
    }, []);

    const reload = () => {
        setLoading(true);

        getQuotation(quotationId).then(data => {
            setLoading(false);
            console.log(data);
            setQuotation(data);
        }).catch(e => {
            setLoading(false);
        });
    }





    const toggleAvailable = (event, quotationId, itemId) => {
        let cloned = JSON.parse(JSON.stringify(quotation));
        let selectedItem = cloned.items.filter(i => i._id == itemId)[0];
        if (!selectedItem.status) {
            selectedItem.status = {

            }
        }

        console.log('event.target.value:' + event.target.value);
        selectedItem.status.available = event.target.value;


        updateItemAvailable(quotationId, itemId, selectedItem.status.available);
        //.then(() => { reload(); });

    }

    const toggleConfirmed = (quotationId, itemId) => {
        let cloned = JSON.parse(JSON.stringify(quotation));
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

        updateItemConfirmed(quotationId, itemId, selectedItem.status.confirmed);
        //.then(() => { reload() });

    }



    const showAddMessage = itemId => {
        setShowMessageId(itemId);
    }

    const hideAddMessage = () => {
        setShowMessageId(null);
    }


    const addMessage = itemId => {
        if (!message || message.length == 0) {
            return;
        }

        let cloned = JSON.parse(JSON.stringify(quotation));
        let selectedItem = cloned.items.filter(i => i._id == itemId)[0];
        if (!selectedItem.messages) {
            selectedItem.messages = [];
        }
        selectedItem.messages.push({ message: message });
        setQuotation(cloned);
        addItemMessage(quotation._id, itemId, message).then(() => { reload() });
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
        sendTocompanies(quotationId)
    }


    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">
                    <div className='row'>
                        <div className='col-10'>
                            <MdBurstMode />
                            {t("quotation.quotationDetails")}
                        </div>
                        <div className='col-2 p-0' style={{ textAlign: 'end' }}>

                            <ThreeDots
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
                            <label htmlFor="title" className="form-label"># {t("quotation.quotationNumber")}</label>
                            <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                                #{("000000".substring(("" + quotation.serialNumber).length) + quotation.serialNumber)}
                            </label>
                        </div>

                        <div className="mb-3 col-6">
                            <label htmlFor="title" className="form-label"> <MdCalendarToday /> {t("quotation.date")}</label>
                            <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                            <Moment date={quotation.dateAdded} format="DD-MM-YYYY hh:mm a" />
                                </label>
                        </div>

                        <div className="mb-3 col-6">
                            <label htmlFor="title" className="form-label">
                                <MdBadge /> &nbsp;
                                {t("quotation.clientName")}</label>
                            <label htmlFor="title" className="form-control" style={{ border: 'none' }}>{quotation.client ? quotation.client.firstName : null}
                                {quotation.client ? quotation.client.surName : null}</label>
                        </div>

                        <div className="mb-3 col-6">
                            <label htmlFor="title" className="form-label"><MdInfoOutline /> {t("quotation.quotationStatus")}</label>
                            <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                                {quotation.status ? getLocalizedText(quotation.status.name, i18n) : null}
                            </label>

                        </div>
                    </div>
                    <div className='row'>
                        <table className='table mb-5'>
                            <thead>
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
                                        {t("quotation.available")}
                                    </th>


                                    <th className='text-center'>
                                        {t("quotation.confirmed")}
                                    </th>

                                    <th>
                                        {t("product.price")}
                                    </th>
                                    <th>

                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {quotation.items ? (quotation.items.sort((a, b) => {
                                    return a.product.company._id - b.product.company._id;
                                }).map(item => (<>
                                    <tr key={item._id}>
                                        <td>
                                            {localStorage.getItem("role") == "Administrator" ? item.product.alias : item.product.sku}
                                        </td>
                                        <td>
                                            {getLocalizedText(item.product.name, i18n)}
                                        </td>
                                        <td>
                                            {getLocalizedText(item.product.company.name, i18n)}
                                        </td>
                                        <td>
                                            {item.qty}
                                        </td>

                                        <td className='text-center'>
                                            <select classNam='form-control' value={item.status.available} onChange={(event) => toggleAvailable(event, quotation._id, item._id)}>
                                                <option value="">Not Set</option>
                                                <option value={true}>Available</option>
                                                <option value={false}>Not Available</option>
                                            </select>

                                        </td>
                                        {/* <td className='text-center'>
                                            <input type="checkbox" checked={item.status && item.status.available}
                                                title={"updated by"}
                                                onChange={() => toggleAvailable(quotation._id, item._id)} style={{ cursor: 'pointer' }} />
                                        </td> */}




                                        <td className='text-center'>
                                            <input type="checkbox" checked={item.status && item.status.confirmed}
                                                title={"updated by"}
                                                onChange={() => toggleConfirmed(quotation._id, item._id)} style={{ cursor: 'pointer' }} />
                                        </td>


                                        <td>
                                            <div className="row">
                                                <div className="col">

                                                    <input type="text" className="form-control" id="price" value={item.amount} />
                                                </div>
                                                <div className="col col-4">

                                                    <select className="me-sm-2 form-select form-control" id="currencyCode" value={item.currencyCode} >
                                                        <option value='USD'>USD</option>
                                                        <option value='TRY'>TRY</option>
                                                        <option value='KWD'>KWD</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'end' }}>
                                            {item.messages && item.messages.length > 0 ? (
                                                <Link to="#" className='add-btn btn-info ml-3 mr-3' onClick={() => showHistory(item._id)}>
                                                    <MdHistory /> {t("quotation.history")}</Link>) : null}

                                            <Link to="#" className='add-btn' onClick={() => showAddMessage(item._id)}><MdAddComment size={18} /> &nbsp;
                                                {t("quotation.addComment")}
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
                                                        <div className='col-3 pt-2'>
                                                            <MdTimer />  {msg.date ? msg.date.toString().substring(0, 19).replace('T', ' ') : "Just Now"}
                                                        </div>
                                                        <div className='col-9'>
                                                            <div className="alert alert-secondary" role="alert" style={{ width: '100%' }}>



                                                                {msg.addedBy ? "" + msg.addedBy.firstName + " " + msg.addedBy.surName : "Me"} : &nbsp;

                                                                {msg.message}

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
                        </table>
                    </div>

                    <div className="mb-3 row" >
                        <div className='col-12'>
                            <textarea className='form-control' placeholder={t("quotation.notesForClient")}></textarea>
                        </div>

                    </div>

                    <div className='row'>
                        <div className="mb-3  col justify-content-end" >
                            <Link className="add-btn btn-warning" to='/admin/quotations' ><MdClose size={20} /> {t("close")}</Link> &nbsp; &nbsp;

                            {localStorage.getItem("role") == "Administrator" ? (
                                <Link className="add-btn btn-primary" to={'#'} onClick={returnToClient}><MdReplay size={20} /> {t("quotation.returnToClient")}</Link>
                            ) : null}
                            &nbsp; &nbsp;

                            {localStorage.getItem("role") == "Administrator" ? (
                                <Link className="add-btn btn-primary" to={'#'} onClick={doPost}><MdSend size={20} /> {t("quotation.sendForcompanies")}</Link>
                            ) : null}




                            {/* <Link className="add-btn btn-primary" to={'#'} onClick={doPost}><MdSave size={20} /> {t("dashboard.save")}</Link> */}
                        </div>
                    </div>


                </form>

            </div>


        </div>
    )
}


export default EditQuotation;