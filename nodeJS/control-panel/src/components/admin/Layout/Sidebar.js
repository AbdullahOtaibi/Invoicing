import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    MdSettings, MdDescription, MdOutlineViewCarousel,
    MdCollections, MdBurstMode, MdCollectionsBookmark
    , MdBusinessCenter, MdInsertLink, MdGroup, MdLocalShipping,
    MdOutlineCategory, MdOutlineCardGiftcard, MdOutlineDashboard,
    MdOutlineReceiptLong, MdReduceCapacity, MdRealEstateAgent, MdOutlineMarkAsUnread, MdCalendarViewMonth, MdContacts, MdOutlineGroup, MdReceipt, MdReceiptLong, MdPayment, MdCategory
} from "react-icons/md";
import { BsMenuButtonFill, BsCreditCard } from 'react-icons/bs';
import { TbReportAnalytics } from "react-icons/tb";

import { useTranslation } from "react-i18next";
import '../../../assets/css/dark-side-style.css'
import '../../../assets/css/waves.min.css'


const Sidebar = () => {
    const { t } = useTranslation();
    const location = useLocation();

    const getClass = (linkUrl) => {
        if (("" + location.pathname) == '/admin' && linkUrl == '/admin') {
            return 'active';
        }
        else if (linkUrl != "/admin" && ("" + location.pathname).substring(6).indexOf(linkUrl.substring(6)) >= 0) {
            return 'active';
        }
        else {
            return ''
        }

    }
    const [shippingExpanded, showShippingSubmenu] = useState(false);
    const [paymentsExpanded, showPaymentsSubMenu] = useState(false);

    return (
        <nav id="sidebar" className="nav-sidebar d-print-none" style={{ minHeight: '100vh' }}>
            <ul className="list-unstyled components" id="accordion">
                <li className={getClass('/admin')}>
                    <Link to="/admin" className="wave-effect  waves-effect waves-button">
                        <MdOutlineDashboard size={18} />&nbsp; {t("sidebar.dashboard")} </Link>
                </li>

                {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("invoices.view") > -1 ? (
                    <li className={getClass('/admin/Contact')}>
                        <Link className="wave-effect waves-effect waves-button" to="/admin/Contact" >
                            <MdContacts size={18} /> &nbsp; {t("sidebar.Contact")}
                        </Link >
                    </li>) : null}

                {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("invoices.view") > -1 ? (
                    <li className={getClass('/admin/FullCalendar')}>
                        <Link className="wave-effect waves-effect waves-button" to="/admin/FullCalendar" >
                            <MdCalendarViewMonth size={18} /> &nbsp; {t("sidebar.FullCalendar")}
                        </Link >
                    </li>) : null}


                {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("invoices.view") > -1 ? (
                    <li className={getClass('/admin/Package')}>
                        <Link className="wave-effect waves-effect waves-button" to="/admin/Package" >
                            <MdCollections size={18} /> &nbsp; {t("sidebar.Package")}
                        </Link >
                    </li>) : null}

                {/* 
                {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("settings.view") > -1 ? (
                    <li className={getClass('/admin/settings')}>
                        <Link className="wave-effect waves-effect waves-button" to="/admin/settings" >
                            <MdSettings size={18} /> &nbsp; {t("sidebar.settings")}
                        </Link >
                    </li>) : null}

                {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("settings.view") > -1 ? (
                    <li className={getClass('/admin/communications')}>
                        <Link className="wave-effect waves-effect waves-button" to="/admin/communications" >
                            <MdOutlineMarkAsUnread size={18} /> &nbsp; {t("communications.communications")}
                        </Link >
                    </li>) : null}

                    {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("settings.view") > -1 ? (
                    <li className={getClass('/admin/messages')}>
                        <Link className="wave-effect waves-effect waves-button" to="/admin/messages" >
                            <MdOutlineMarkAsUnread size={18} /> &nbsp; {t("communications.messages")}
                        </Link >
                    </li>) : null}


                    



                {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("menus.view") > -1 ? (
                    <li className={getClass('/admin/navigation-menus')}>
                        <Link className="wave-effect waves-effect waves-button" to="/admin/navigation-menus" >
                            <BsMenuButtonFill size={18} /> &nbsp; {t("sidebar.menus")}
                        </Link >
                    </li>) : null}

                {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("contentCategories.view") > -1 ? (
                    <li className={getClass('/admin/categories')}>
                        <Link className="wave-effect waves-effect waves-button" to="/admin/categories" >
                            <MdCollectionsBookmark size={18} /> &nbsp; {t("sidebar.categories")}
                        </Link >
                    </li>) : null} */}

                {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("articles.view") > -1 ? (
                    <li className={getClass('/admin/articles')}>
                        <Link className="wave-effect waves-effect waves-button" to="/admin/articles" >
                            <MdDescription size={18} /> &nbsp; {t("sidebar.articles")}
                        </Link >
                    </li>) : null}



                    {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("invoices.view") > -1 ? (
                    <li className={getClass('/admin/Contract')}>
                        <Link className="wave-effect waves-effect waves-button" to="/admin/Contract" >
                            <MdReceipt size={18} /> &nbsp; {t("sidebar.contracts")}
                        </Link >
                    </li>) : null}


                    {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("invoices.view") > -1 ? (
                    <li className={getClass('/admin/Receipt')}>
                        <Link className="wave-effect waves-effect waves-button" to="/admin/Receipt" >
                            <MdReceipt size={18} /> &nbsp; {t("sidebar.Receipt")}
                        </Link >
                    </li>) : null}



               

                {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("invoices.view") > -1 ? (
                    <li className={getClass('/admin/invoices')}>
                        <Link className="wave-effect waves-effect waves-button" to="/admin/invoices" >
                            <MdDescription size={18} /> &nbsp; {t("sidebar.invoices")}
                        </Link >
                    </li>) : null}


                    {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("invoices.view") > -1 ? (
                    <li className={getClass('/admin/expenses')}>
                        <Link className="wave-effect waves-effect waves-button" to="/admin/expenses" >
                            <MdPayment size={18} /> &nbsp; {t("sidebar.expenses")}
                        </Link >
                    </li>) : null}


                <li className={getClass('/admin/expenseCategories')}>
                    <Link className="wave-effect waves-effect waves-button" to="/admin/expenseCategories" >
                            <MdCategory size={18} /> &nbsp; {t("sidebar.expensesCategory")}
                        </Link >
                    </li>


                {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("users.view") > -1 ? (
                    <li className={getClass('/admin/users')}>
                        <Link className="wave-effect waves-effect waves-button" to="/admin/users" >
                            <MdGroup size={18} />&nbsp;  {t("sidebar.users")}
                        </Link >
                    </li>) : null}

                {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("vendors.view") > -1 ? (
                    <li className={getClass('/admin/companies')}>
                        <Link className="wave-effect waves-effect waves-button" to="/admin/companies" >
                             <MdRealEstateAgent size={18} /> &nbsp; {t("sidebar.companies")}
                        </Link >
                    </li>) : null}

                    {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("vendors.view") > -1 ? (
                    <li className={getClass('/admin/reports')}>
                        <Link className="wave-effect waves-effect waves-button" to="/admin/reports" >
                             <TbReportAnalytics size={18} /> &nbsp; {t("sidebar.reports")}
                        </Link >
                    </li>) : null}

                {/* {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("users.view") > -1 ? (
                    <li className={getClass('/admin/clients')}>
                        <Link className="wave-effect waves-effect waves-button" to="/admin/clients" >
                            <MdReduceCapacity size={18} />&nbsp; {t("sidebar.clients")}
                        </Link >
                    </li>) : null}


                */}


                {/* {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("shippingCompanies.view") > -1 ? (<li className={getClass('/admin/logistics')}>
                    <Link to="#" className="wave-effect waves-effect waves-button" onClick={() => showShippingSubmenu(!shippingExpanded)}>
                        <MdLocalShipping size={18} /> &nbsp; {t("sidebar.logistics")}
                    </Link>
                    <ul className="list-unstyled" style={{ display: shippingExpanded ? 'block' : 'none' }}>
                        {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("shippingCompanies.view") > -1 ? (
                            <li className={getClass('/admin/shippingCompanies')}>
                                <Link to="/admin/shippingCompanies" className="wave-effect waves-effect waves-button">
                                    {t("sidebar.shippingCompanies")}
                                </Link>

                            </li>) : null}
                        {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("shippingCompanies.view") > -1 ? (
                            <li className={getClass('/admin/shipments')}>
                                <Link to="/admin/shipments" className="wave-effect waves-effect waves-button">
                                    {t("sidebar.shipments")}
                                </Link>

                            </li>) : null}
                    </ul>
                </li>) : null} */}





                {/* <li>
                    <a href="#blog" className="accordion-toggle wave-effect waves-effect waves-button" data-toggle="collapse" aria-expanded="false">
                        <i className="fas fa-fw fa-newspaper"></i>Blog
                    </a>
                    <ul className="collapse list-unstyled" id="blog" data-parent="#accordion">
                        <li>
                            <a href="https://dev.geniusocean.net/eCommerceDon/admin/blog/category"><span>Categories</span></a>
                        </li>
                        <li>
                            <a href="https://dev.geniusocean.net/eCommerceDon/admin/blog"><span>Posts</span></a>
                        </li>
                    </ul>
                </li> */}







            </ul>
            <p className="version-name pl-4 pr-4" style={{ textAlign: 'start' }}> Version: 1.0</p>
        </nav>
    )
}

export default Sidebar
