import { useTranslation } from 'react-i18next'
import { getSummary } from './DashboardAPI'
import React, { useState, useEffect } from 'react'
import { Helmet } from "react-helmet";
import { MdPeople, MdOutlineCardGiftcard, MdOutlineFactCheck, MdOutlinePriceChange } from 'react-icons/md'
import { languages  } from '../../../globals';
import { getEnabledLanguages } from '../../../services/TranslationsService';

const Summary = ({ notification, onHandleNotification }) => {

    const { t } = useTranslation();
    const [summary, setSummary] = useState({
        orders: 0,
        users: 0,
        quotations: 0,
        products: 0,
        newOrders: 0,
        newClients:0
    });
    console.log("Languages:=============");
    console.log(languages);
   
    const reload = () => {
        getSummary().then(data => {
           
           let tmp = {};
           
           data.forEach(item => tmp = {...tmp, ...item});
           //alert(JSON.stringify(tmp));
           setSummary(tmp);
        }).catch(e => {
            console.error(e);
        });
    }
    useEffect(() => {
        if (notification.code == 'users' || notification.code == 'orders' || notification.code == 'quotations' || notification.code == 'products') {
            reload();
        }
    }, [notification]);

    useEffect(() => {
        reload();
    }, []);

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
                    <div className="mycard bg1">
                        <div className="left">
                            <h5 className="title"> {t("sidebar.products")} </h5>
                            <span className="number">
                                {summary.products?summary.products:0}
                            </span>
                            <a href="/admin/products" className="link">{t("viewAll")}</a>
                        </div>
                        <div className="right d-flex align-self-center">
                            <div className="icon">
                                <MdOutlineCardGiftcard />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-12 col-lg-6 col-xl-3">
                    <div className="mycard bg2">
                        <div className="left">
                            <h5 className="title">{t("sidebar.users")}</h5>
                            <span className="number">
                                {summary.users?summary.users:0}
                            </span>
                            <a href="/admin/users" className="link">{t("viewAll")}</a>
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
                            <h5 className="title">{t("sidebar.orders")}</h5>
                            <span className="number">{summary.orders?summary.orders:0}</span>
                            <a href="/admin/orders" className="link">{t("viewAll")}</a>
                        </div>
                        <div className="right d-flex align-self-center">
                            <div className="icon">
                                <MdOutlineFactCheck />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-12 col-lg-6 col-xl-3">
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
                </div>


            </div>

            <div className="row row-cards-one">
                <div className="col-md-6 col-xl-3">
                    <div className="card c-info-box-area">
                        <div className="c-info-box box1">
                            <p>{summary.newClients?summary.newClients:0}</p>
                        </div>
                        <div className="c-info-box-content">
                            <h6 className="title">New Customers</h6>
                            <p className="text">Last 30 Days</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3">
                    <div className="card c-info-box-area">
                        <div className="c-info-box box2">
                            <p>{summary.allClients?summary.allClients:0}</p>
                        </div>
                        <div className="c-info-box-content">
                            <h6 className="title">Total Customers</h6>
                            <p className="text">All Time</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3">
                    <div className="card c-info-box-area">
                        <div className="c-info-box box4">
                            <p>{summary.orders?summary.orders:0}</p>
                        </div>
                        <div className="c-info-box-content">
                            <h6 className="title">Total Sales</h6>
                            <p className="text">All Time</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3">
                    <div className="card c-info-box-area">
                        <div className="c-info-box box3">
                            <p> {summary.newOrders?summary.newOrders:0}  </p>
                        </div>
                        <div className="c-info-box-content">
                            <h6 className="title">Total Sales</h6>
                            <p className="text">Last 30 days</p>
                        </div>
                    </div>
                </div>

            </div>








        </div>
    )
}

export default Summary