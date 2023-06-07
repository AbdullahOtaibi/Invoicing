import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getQuotation } from './QuotationsAPI'
import { useTranslation } from "react-i18next"
import { ThreeDots } from  'react-loader-spinner'
import { MdBurstMode, MdEdit, MdClose } from "react-icons/md";
import { getLocalizedText } from '../utils/utils'
import { hasPermission } from '../utils/auth';
import Moment from 'react-moment';

const ViewQuotation = (props) => {

    let navigate = useNavigate();
    if (!hasPermission('orders.view')) {
        navigate("/admin", { replace: true });
    }


    const [quotation, setQuotation] = useState({});
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const { quotationId } = useParams();

    useEffect(() => {
        setLoading(true);
        getQuotation(quotationId).then(data => {
            setLoading(false);
            console.log(data);
            setQuotation(data);
        }).catch(e => {
            setLoading(false);
        });
    }, []);




    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title"><MdBurstMode /> {t("quotation.quotationDetails")}</h5>
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
                            <label htmlFor="title" className="form-label">{t("quotation.quotationNumber")}</label>
                            <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                                #{("000000".substring(("" + quotation.serialNumber).length) + quotation.serialNumber)}
                            </label>
                        </div>

                        <div className="mb-3 col-6">
                            <label htmlFor="title" className="form-label">{t("quotation.date")}</label>
                            <label htmlFor="title" className="form-control" style={{ border: 'none' }}>
                                <Moment date={quotation.dateAdded} format="DD-MM-YYYY hh:mm a" />
                            </label>
                        </div>

                        <div className="mb-3 col-6">
                            <label htmlFor="title" className="form-label">{t("order.clientName")}</label>
                            <label htmlFor="title" className="form-control" style={{ border: 'none' }}>{quotation.client ? quotation.client.firstName : null} {quotation.client ? quotation.client.surName : null}</label>
                        </div>

                        <div className="mb-3 col-6">
                            <label htmlFor="title" className="form-label">{t("quotation.quotationStatus")}</label>
                            <label htmlFor="title" className="form-control" style={{ border: 'none' }}>{quotation.status ? getLocalizedText(quotation.status.name, i18n) : null} </label>
                        </div>

                        <table className='table'>
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
                                    <th>
                                        Available
                                    </th>
                                    <th>
                                        Confirmed
                                    </th>
                                    <th>
                                        {t("product.subtotal")}
                                    </th>

                                </tr>
                            </thead>
                            <tbody>




                                {quotation.items ? (quotation.items.sort((a, b) => {
                                    return a.product.company._id - b.product.company._id;
                                }).map(item => (
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
                                        <td>
                                            <input type="checkbox" disabled="true" checked={item.status && item.status.available} />
                                        </td>
                                        <td>
                                            <input type="checkbox" disabled="true" checked={item.status && item.status.confirmed} />
                                        </td>
                                        <td>
                                            {/* {item.itemPrice.subtotal} $ */}
                                        </td>


                                    </tr>
                                ))) : null}
                            </tbody>
                        </table>


                        <div className="mb-3 row col justify-content-end" >
                            <Link className="add-btn btn-warning" to='/admin/quotations' ><MdClose size={20} /> &nbsp; {t("close")}</Link> &nbsp;
                            <Link className="add-btn btn-primary" to={'/admin/quotations/edit/' + quotation._id}><MdEdit size={20} />&nbsp;  {t("dashboard.edit")}</Link>
                        </div>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default ViewQuotation;