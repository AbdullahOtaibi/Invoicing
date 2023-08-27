import { useTranslation } from 'react-i18next'
import { getSummary } from './DashboardAPI'
import React, { useState, useEffect } from 'react'
import { Helmet } from "react-helmet";
import { MdPeople, MdOutlineCardGiftcard, MdOutlineFactCheck, MdOutlinePriceChange, MdOutlineMoveUp } from 'react-icons/md'
import { languages } from '../../../globals';
import { getEnabledLanguages } from '../../../services/TranslationsService';

import { getInvoiceSummary } from '../../admin/Invoices/InvoicesAPI'






const Summary = ({ notification, onHandleNotification }) => {



    const { t } = useTranslation();
    const [summary, setSummary] = useState({
        orders: 0,
        users: 0,
        quotations: 0,
        products: 0,
        newOrders: 0,
        newClients: 0
    });

    const [countNewInvoices, setcountNewInvoices] = useState({});
    const [countPostedInvoices, setCountPostedInvoices] = useState({});
    const [countStuckInvoices, setcountStuckInvoices] = useState({});
    const [countRevertedInvoices, setcountRevertedInvoices] = useState({});
    useEffect(() => {
        getInvoiceSummary({ status: "new" }).
            then((data) => {
                console.log("abd");
                console.log(data[0]);
                setcountNewInvoices(data[0])
            }).catch(e => {
                console.log("error fetching count new invoices:" + e);
            })

        getInvoiceSummary({ status: "posted" }).
            then((data) => {
                setCountPostedInvoices(data[0])
            }).catch(e => {
                console.log("error fetching count posted invoices:" + e);
            })



        getInvoiceSummary({ status: "stuck" }).
            then((data) => {
                setcountStuckInvoices(data[0])
            }).catch(e => {
                console.log("error fetching count stuck invoices:" + e);
            })

        getInvoiceSummary({ status: "reverted" }).
            then((data) => {
                setcountRevertedInvoices(data[0])
            }).catch(e => {
                console.log("error fetching count reverted invoices:" + e);
            })


    }, []);
    console.log("Languages:=============");
    console.log(languages);






    return (
        <div className="conatiner">
            <Helmet>
                <title> Invoicing | Admin | {t("sidebar.dashboard")}</title>
            </Helmet>
            <h5 className="card-title">
                {t("sidebar.dashboard")}
            </h5>
            <div className="container text-center">

            </div>
            <br />

            <div className="row row-cards-one">
                <div className="col-md-12 col-lg-6 col-xl-3">
                    <div className="mycard bg2">
                        <div className="left">
                            <h5 className="title">{t("invoice.NewInvoices")}</h5>
                            <span className="number">
                                {countNewInvoices.count}
                            </span>
                            <a href="/admin/invoices?status=new" className="link">{t("viewAll")}</a>
                        </div>
                        <div className="right d-flex align-self-center">
                            <div className="icon">
                                <MdPeople />

                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-12 col-lg-6 col-xl-3">
                    <div className="mycard bg6">
                        <div className="left">
                            <h5 className="title">{t("invoice.PostedInvoices")}</h5>
                            <span className="number">{countPostedInvoices.count}</span>
                            <a href="/admin/invoices?status=posted" className="link">{t("viewAll")}</a>
                        </div>
                        <div className="right d-flex align-self-center">
                            <div className="icon">
                                <MdOutlineFactCheck />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-12 col-lg-6 col-xl-3">
                    <div className="mycard bg1">
                        <div className="left">
                            <h5 className="title"> {t("invoice.StuckInvoices")} </h5>
                            <span className="number">
                                {countStuckInvoices.count}
                            </span>
                            <a href="/admin/invoices?status=stuck" className="link">{t("viewAll")}</a>
                        </div>
                        <div className="right d-flex align-self-center">
                            <div className="icon">
                                <MdOutlineCardGiftcard />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-12 col-lg-6 col-xl-3">
                    <div className="mycard bg4">
                        <div className="left">
                            <h5 className="title"> {t("invoice.revertedInvoices")} </h5>
                            <span className="number">
                                {countRevertedInvoices.count}
                            </span>
                            <a href="/admin/invoices?status=reverted" className="link">{t("viewAll")}</a>
                        </div>
                        <div className="right d-flex align-self-center">
                            <div className="icon">
                                <MdOutlineMoveUp />
                            </div>
                        </div>
                    </div>
                </div>


                {/* <div className="col-md-12 col-lg-6 col-xl-3">
                    <div className="mycard bg4">
                        <div className="left">
                            <h5 className="title">{t("quotations")}</h5>
                            <span className="number">
                                {summary.quotations?summary.quotations:0}
                            </span>
                            <a href="/admin/quotations" className="link">{t("viewAll")}</a>
                        </div>
                        <div className="right d-flex align-self-center">
                            <div className="icon">
                                <MdOutlinePriceChange />
                            </div>
                        </div>
                    </div>
               
                </div> */}


            </div>

            <div className="row row-cards-one">

                <div className="col-md-6 col-xl-3">
                    <div className="card c-info-box-area">
                        <div className="c-info-box box2">
                            <p>  {countNewInvoices.count} </p>
                        </div>
                        <div className="c-info-box-content">
                            <h6 className="title text-left text-info">Total Summary:</h6>

                            <table className='text text-left'>
                                <tbody>
                                    <tr>
                                        <td > {t("invoice.sumTaxInclusiveAmount")}  </td>
                                        <td>{numericFormat(countNewInvoices.sumTaxInclusiveAmount)}</td>
                                    </tr>
                                    <tr >
                                        <td className='pr-2'>{t("invoice.sumAllowanceTotalAmount")}   </td>
                                        <td>{numericFormat(countNewInvoices.sumAllowanceTotalAmount)}</td>
                                    </tr>
                                </tbody>
                                <tfoot className='font-weight-bold text-info'>
                                    <td> {t("invoice.taxExclusiveAmount")}  </td>
                                    <td>{numericFormat(countNewInvoices.taxExclusiveAmount)}</td>
                                </tfoot>
                            </table>


                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3">
                    <div className="card c-info-box-area">
                        <div className="c-info-box box4">
                            <p>{countPostedInvoices.count}</p>
                        </div>
                        <div className="c-info-box-content">
                            <h6 className="title text-left text-success">Total Summary:</h6>

                            <table className='text text-left'>
                                <tbody>
                                    <tr>
                                        <td > {t("invoice.sumTaxInclusiveAmount")}  </td>
                                        <td>{numericFormat(countPostedInvoices.sumTaxInclusiveAmount)}</td>
                                    </tr>
                                    <tr >
                                        <td className='pr-2'>{t("invoice.sumAllowanceTotalAmount")}   </td>
                                        <td>{numericFormat(countPostedInvoices.sumAllowanceTotalAmount)}</td>
                                    </tr>
                                </tbody>
                                <tfoot className='font-weight-bold text-success'>
                                    <td> {t("invoice.taxExclusiveAmount")}  </td>
                                    <td>{numericFormat(countPostedInvoices.taxExclusiveAmount)}</td>
                                </tfoot>
                            </table>

                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-xl-3">
                    <div className="card c-info-box-area">
                        <div className="c-info-box box1">
                            <p>{countStuckInvoices.count}</p>
                        </div>
                        <div className="c-info-box-content">
                            <h6 className="title text-left text-warning ">Total Summary:</h6>
                            <table className='text text-left'>
                                <tbody>
                                    <tr>
                                        <td > {t("invoice.sumTaxInclusiveAmount")}  </td>
                                        <td>{numericFormat(countStuckInvoices.sumTaxInclusiveAmount)}</td>
                                    </tr>
                                    <tr >
                                        <td className='pr-2'>{t("invoice.sumAllowanceTotalAmount")}   </td>
                                        <td>{numericFormat(countStuckInvoices.sumAllowanceTotalAmount)}</td>
                                    </tr>
                                </tbody>
                                <tfoot className='font-weight-bold text-warning'>
                                    <td> {t("invoice.taxExclusiveAmount")}  </td>
                                    <td>{numericFormat(countStuckInvoices.taxExclusiveAmount)}</td>
                                </tfoot>
                            </table>

                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-xl-3">
                    <div className="card c-info-box-area">
                        <div className="c-info-box box4">
                            <p>{countStuckInvoices.count}</p>
                        </div>
                        <div className="c-info-box-content">
                            <h6 className="title text-left text-warning ">Total Summary:</h6>
                            <table className='text text-left'>
                                <tbody>
                                    <tr>
                                        <td > {t("invoice.sumTaxInclusiveAmount")}  </td>
                                        <td>{numericFormat(countRevertedInvoices.sumTaxInclusiveAmount)}</td>
                                    </tr>
                                    <tr >
                                        <td className='pr-2'>{t("invoice.sumAllowanceTotalAmount")}   </td>
                                        <td>{numericFormat(countRevertedInvoices.sumAllowanceTotalAmount)}</td>
                                    </tr>
                                </tbody>
                                <tfoot className='font-weight-bold text-warning'>
                                    <td> {t("invoice.taxExclusiveAmount")}  </td>
                                    <td>{numericFormat(countRevertedInvoices.taxExclusiveAmount)}</td>
                                </tfoot>
                            </table>

                        </div>
                    </div>
                </div>
                {/* <div className="col-md-6 col-xl-3">
                    <div className="card c-info-box-area">
                        <div className="c-info-box box3">
                            <p> {summary.newOrders?summary.newOrders:0}  </p>
                        </div>
                        <div className="c-info-box-content">
                            <h6 className="title">Total Sales</h6>
                            <p className="text">Last 30 days</p>
                        </div>
                    </div>
                </div> */}

            </div>








        </div>
    )

    function numericFormat(val) {
        return !isNaN(val) ? val.toFixed(3) : val;
    }
}

export default Summary