import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getOrder, getPaymentsByOrderId, getShipmentByOrderId } from './OrdersAPI'
import { useTranslation } from "react-i18next"
import { ThreeDots } from  'react-loader-spinner'
import { MdOutlineReceiptLong, MdEdit, MdClose, MdHistoryToggleOff, MdPayment, MdLocalShipping } from "react-icons/md";
import { getLocalizedText } from '../utils/utils'
import { hasPermission } from '../utils/auth';
import { Helmet } from "react-helmet";
import Moment from 'react-moment';

const ViewOrder = (props) => {

    let navigate = useNavigate();
    if (!hasPermission('orders.view')) {
        navigate("/admin", { replace: true });
    }

    const [order, setOrder] = useState({});
    const [payments, setPayments] = useState([]);
    const [shipment, setShipment] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const { orderId } = useParams();
    const [companies, setCompanies] = useState([]);
    const subtotal = (items) => {
        let result = 0;
        items.forEach(item => {
            if(item.itemPrice){
                result += item.itemPrice.subtotal;
            }
           
        });
        return result.toFixed(3);
    }
    useEffect(() => {
        setLoading(true);
        getOrder(orderId).then(data => {
            setLoading(false);
            console.log(data);
            setOrder(data);
            fillcompanies(data);
        }).catch(e => {
            setLoading(false);
            console.log(e);
        })
    }, []);

    useEffect(() => {
        getPaymentsByOrderId(orderId).then(res => {
            setPayments(res.data);
        }).catch(e => {
            console.log(e);
        });
    }, []);


    useEffect(() => {
        getShipmentByOrderId(orderId).then(res => {
            setShipment(res.data);
        }).catch(e => {
            console.log(e);
        });
    }, []);




    const fillcompanies = (data) => {
        if (!data.items || data.items.length == 0) {
            return;
        }
        let uniqueuecompanies = [];
        data.items.forEach(item => {
            let companyExists = uniqueuecompanies.filter(v =>  item.company && v._id == item.company._id).length > 0;
            if (!companyExists) {
                uniqueuecompanies.push(item.company);
            }
        });
        console.log(companies);
        setCompanies(uniqueuecompanies);
    }


    const totalPaid = () => {
        let total = 0;
        let currencyCode = "";
        if (payments && payments.length > 0) {
            currencyCode = payments[0].currencyCode;
        }
        payments.forEach(payment => {
            total += payment.amount;
        })
        return total.toFixed(3) + " " + currencyCode;
    }


    return (<>
        <Helmet>
            <title>{'Invoicing | Admin | View Order'} </title>
        </Helmet>


        <div className="row">
            <div className='col col-8'>
                <div className="card">
                    <h5 className="card-header"><MdOutlineReceiptLong /> {t("order.orderDetails")}</h5>
                    <div className="card-body">

                        <div className="container text-center">
                            <ThreeDots
                                type="ThreeDots"
                                color="#00BFFF"
                                height={100}
                                width={100}
                                visible={loading}

                            />
                        </div>


                        <form>
                            <div className='row'>
                                <div className="mb-3 col-6">
                                    <label htmlFor="title" className="form-label">{t("order.orderNumber")}</label>
                                    <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                                        {("000000".substring(("" + order.serialNumber).length) + order.serialNumber)}
                                    </label>
                                </div>

                                <div className="mb-3 col-6">
                                    <label htmlFor="title" className="form-label">{t("order.orderDate")}</label>
                                    <label htmlFor="title" className="form-control" style={{ border: 'none' }}>

                                        <Moment date={order.dateAdded} format="DD-MM-YYYY hh:mm a" />
                                    </label>
                                </div>

                                <div className="mb-3 col-6">
                                    <label htmlFor="title" className="form-label">{t("order.clientName")}</label>
                                    <label htmlFor="title" className="form-control" style={{ border: 'none' }}>{order.client ? order.client.firstName : null} {order.client ? order.client.surName : null}</label>
                                </div>

                                <div className="mb-3 col-6">
                                    <label htmlFor="title" className="form-label">{t("order.orderStatus")}</label>
                                    <label htmlFor="title" className="form-control" style={{ border: 'none' }}>{order.status ? getLocalizedText(order.status.name, i18n) : null} </label>
                                </div>




                                {companies.map(company => (
                                    <table className='table table-sm border border-1'>
                                        <thead>
                                            <tr className='table-primary'>
                                                <th colSpan={7}>
                                                    {company ? getLocalizedText(company.name, i18n) : null}
                                                </th>
                                            </tr>
                                            <tr>
                                                <th>
                                                    {localStorage.getItem("role") == "Administrator" ? t("product.alias") : t("product.sku")}

                                                </th>
                                                <th>
                                                    {t("product.name")}
                                                </th>
                                                <th className='text-center'>
                                                    {t("product.units")}
                                                </th>
                                                <th className='text-center'>
                                                    Available
                                                </th>
                                                <th className='text-center'>
                                                    Confirmed
                                                </th>
                                                <th className='text-center'>
                                                    {t("product.subtotal")}
                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody>

                                            {order.items && company ? (order.items.filter(i => i.company._id == company._id).map(item => (
                                               item.product?(<tr key={item._id}>
                                                <td>
                                                    {localStorage.getItem("role") == "Administrator" ? item.product.alias : item.product.sku}

                                                </td>
                                                <td>
                                                    {getLocalizedText(item.product.name, i18n)}
                                                </td>
                                                <td className='text-center'>
                                                    {item.qty}
                                                </td>
                                                <td className='text-center'>
                                                    <input type="checkbox" disabled="true" checked={item.status && item.status.available} />
                                                </td>
                                                <td className='text-center'>
                                                    <input type="checkbox" disabled="true" checked={item.status && item.status.confirmed} />
                                                </td>
                                                <td className='text-center'>
                                                    {item.itemPrice.subtotal} $
                                                </td>


                                            </tr>):null
                                            ))) : null}
                                            <tr>
                                                <td colSpan={4} >

                                                </td>
                                                <td style={{ backgroundColor: '#000', color: '#fff', textAlign: 'center' }} className="px-2">
                                                    {t("product.subtotal")} :
                                                </td>
                                                <td className='text-center'>
                                                    {subtotal(order.items.filter(i => i.company._id == company._id))} $
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                ))}


                                {order.actions && localStorage.getItem("role") == "Administrator" ? (
                                    <table className='table table-sm border table-striped border-1 mt-5'>
                                        <thead>
                                            <tr className='table-dark'>
                                                <th colSpan={3}>
                                                    <MdHistoryToggleOff size={20} /> History
                                                </th>
                                            </tr>
                                            <tr>
                                                <th className='px-4'>
                                                    Date/Time
                                                </th>
                                                <th>
                                                    User
                                                </th>
                                                <th>
                                                    Action
                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className='px-4' style={{fontSize:'12px'}}>
                                                    <Moment date={order.dateAdded} format="DD/MM/YYYY" />
                                                    <br />
                                                    <Moment date={order.dateAdded} format="HH:mm a" />
                                                </td>
                                                <td>
                                                    {order.client.firstName}   {order.client.surName}
                                                </td>
                                                <td>
                                                    Order Created
                                                </td>
                                            </tr>
                                            {order.actions.map(oa => (
                                                <tr key={oa._id}>
                                                    <td className='px-4' style={{fontSize:'12px'}}>
                                                        <Moment date={oa.date} format="DD/MM/YYYY" />
                                                        <br />
                                                        <Moment date={oa.date} format="HH:mm a" />
                                                    </td>
                                                    <td>
                                                    {oa.createdBy.firstName}   {oa.createdBy.surName}
                                                    </td>
                                                    <td>
                                                        {oa.message}
                                                    </td>

                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>) : null}


                                <div className="mb-3 row col justify-content-end" >
                                    <Link className="add-btn btn-warning" to='/admin/orders' ><MdClose size={20} /> &nbsp; {t("close")}</Link> &nbsp;
                                    <Link className="add-btn btn-primary" to={'/admin/orders/edit/' + order._id}><MdEdit size={20} />&nbsp;  {t("dashboard.edit")}</Link>
                                </div>
                            </div>
                        </form>
                    </div>


                </div>
            </div>
            <div className='col col-4'>
                <div className='card'>
                    <h5 className="card-header"><MdPayment size={24} /> {t("payments.paymentDetails")}</h5>
                    <div className='card-body pt-1'>
                        {payments && payments.length > 0 ? (
                            <table className='table  table-sm'>
                                <thead>
                                    <tr>
                                        <th>
                                            {t("quotation.date")}
                                        </th>
                                        <th>
                                            {t("amount")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map(payment =>
                                        <tr>
                                            <td>
                                                <Moment date={payment.date} format="DD-MM-YYYY" />
                                            </td>
                                            <td>
                                                {payment.amount} &nbsp; {payment.currencyCode}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className='mt-2'>
                                        <td style={{ backgroundColor: '#ffc107', textAlign: 'center' }}>
                                            {t("payments.totalPaid")}:
                                        </td>
                                        <td style={{ backgroundColor: '#000', color: '#fff', textAlign: 'center' }}>
                                            {totalPaid()}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>) : (
                            <div className='row'>
                                <div className='col col-12 text-center pt-4'>
                                    <img src="/images/card.svg" style={{ width: '40%' }} />
                                </div>
                                <div className='col col-12 text-center pt-4' style={{ textTransform: 'uppercase' }}>
                                    <b> NO PAYMENT DETAILS</b>
                                </div>
                            </div>

                        )}
                    </div>
                </div>




                <div className='card mt-4'>
                    <h5 className="card-header"><MdLocalShipping size={24} /> {t("shipping.shippingDetails")}</h5>
                    <div className='card-body pt-1 px-0'>
                        {order.shippingAddress ? (<>
                            <table className='table table-sm'>
                                <tbody>
                                    <tr>
                                        <td>
                                            Full Name:
                                        </td>
                                        <td>
                                            {order.shippingAddress.fullName}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Address:
                                        </td>
                                        <td>
                                            {order.shippingAddress.city}, {order.shippingAddress.addressLine1}, {order.shippingAddress.addressLine2}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Phone Number:
                                        </td>
                                        <td>
                                            {order.shippingAddress.phoneNumber}
                                        </td>
                                    </tr>
                                    {order.shippingCompany ? (<>
                                        <tr>
                                            <td>
                                                Shipping Company:
                                            </td>
                                            <td>
                                                {getLocalizedText(order.shippingCompany.name, i18n)}

                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Shipping Method:
                                            </td>
                                            <td>
                                                {order.shippingMethod == 'sea' ? t("shipping.seaShipment") : null}
                                                {order.shippingMethod == 'air' ? t("shipping.airShipment") : null}
                                                {order.shippingMethod == 'land' ? t("shipping.landShipment") : null}
                                                {order.shippingMethod == 'other' ? t("shipping.otherShipmentMethod") : null}
                                                

                                            </td>
                                        </tr>
                                    </>

                                    ) : null}

                                </tbody>
                            </table>
                            <div className='row'>
                                <div className='col col-12 text-center pt-4'>

                                </div>
                            </div>
                        </>) : (
                            <div className='row'>
                                <div className='col col-12 text-center pt-4'>
                                    <img src="/images/package.svg" style={{ width: '40%' }} />
                                </div>
                                <div className='col col-12 text-center pt-4' style={{ textTransform: 'uppercase' }}>
                                    <b> NO SHIPPING DETAILS</b>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    </>
    )
}


export default ViewOrder;