import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdCollectionsBookmark, MdDelete, MdEdit, MdAdd, MdLocalShipping } from "react-icons/md"
import { getPostedInvoices, getNewInvoices, getIncompleteInvoices, removeInvoice } 
from './InvoicesAPI'
import { ThreeDots } from  'react-loader-spinner'
import { Link, useNavigate } from 'react-router-dom'
import { getLocalizedText } from '../utils/utils'
import { Tabs, Tab } from 'react-bootstrap'
import { hasPermission } from '../utils/auth';
import { Helmet } from "react-helmet";
import  Listinv from "./ListInv"
import  './ListInvoice.css'


const ListInvoices = (props) => {
    let navigate = useNavigate();
    if (!hasPermission('invoices.view')) {
        navigate("/admin", { replace: true });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');


    const { t, i18n } = useTranslation();
    const [newInvoices, setNewInvoices] = useState([]);
    const [postedInvoices, setPostedInvoices] = useState([]);
    const [incompleteInvoices, setIncompleteInvoices] = useState([]);
    const [loading, setLoading] = useState(false);

    const [newInvoicesSort, setNewInvoicesSort] = useState('_idDesc');
    const [newInvoicesPage, setNewInvoicesPage] = useState(0);
    const [newInvoicesPages, setNewInvoicesPages] = useState(0);


    useEffect( ()=>{console.log('********test ....') ; 
    console.log(JSON.stringify(newInvoices));
 

} , setNewInvoices);



    return (
        <div className="conatiner">
            <Helmet>
                <title>{'Invoicing | Admin | Invoices'} </title>
            </Helmet>
            <div className="card">
                <div className={"card-body"}>

                
                    <div className='row'>
                        <div className='col-md-8 col-sm-6'>
                            <h5 className="card-title"><MdCollectionsBookmark /> 
                                <span className='text-info px-2'> {t("sidebar.invoices")} </span>
                            </h5>
                        </div>

                        <div className='col-md-4 col-sm-6' style={{ textAlign: 'end' }}>
                            {hasPermission('invoices.modify') ? (<Link className="add-btn" to={"/admin/invoices/create"}><MdAdd size={20} />  {t("dashboard.add")}</Link>) : null}
                        </div>
                    </div>


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

                    <Tabs
                       defaultActiveKey= {status? status: "new"}
                        transition={false}
                        id="noanim-tab-example"
                        className="mb-3 " >
                        <Tab eventKey="new" title= {  t("invoice.newInvoices") 
                    } tabClassName="tab-item btn-info  ">
                            <div className="table-responsive">
                          <Listinv status= "new" />
                            </div>
                        </Tab>
                       
                        
                        <Tab eventKey="posted" title={t("invoice.postedInvoices")} tabClassName="tab-item btn-success">
                            <div className="table-responsive ">
                            <Listinv status= "posted" />
                            </div>
                        </Tab>

                        <Tab eventKey="stuck" title={t("invoice.stuckInvoices")} tabClassName="tab-item btn-warning">
                            <div className="table-responsive">
                            <Listinv status= "stuck" />

                                {/* <table className="table   table-hover">
                                    <thead>
                                        <tr>

                                            <th>
                                                {t("invoice.invoiceNumber")}
                                            </th>
                                            <th>
                                                <a href="#" >
                                                    {t("invoice.fullName")}
                                                </a>
                                            </th>
                                            <th>
                                                <a href="#" >
                                                    {t("invoice.issuedDate")}
                                                </a>
                                            </th>

                                            <th className="text-center">
                                                <a href="#">
                                                    {t("product.products")}
                                                </a>

                                            </th>

                                            <th className="text-center">
                                                <a href="#">
                                                    {t("invoice.totalAmount")}
                                                </a>

                                            </th>

                                            <th></th>

                                        </tr>


                                    </thead>
                                    <tbody>
                                        {
                                            incompleteInvoices.map(item => (
                                                <tr key={'' + item.id}>
                                                    <td>
                                                        <Link to={'/admin/invoices/' + item._id}>
                                                            #{("000000".substring(("" + item.serialNumber).length) + item.serialNumber)}

                                                        </Link>
                                                    </td>
                                                    <td>
                                                     

                                                    </td>
                                                    <td>
                                                       
                                                    </td>
                                                    <td className="text-center">
                                                        {item.items ? item.items.length : 0} 
                                                    </td>

                                                    <td className="text-center">
                                                        {item && item.totalAmount ?item.totalAmount.amount + ' ' + item.totalAmount.currencyCode: null }   
                                                    </td>


                                                    <td className="justify-content-end" style={{ textAlign: 'end' }}>
                                                      
                                                        <Link className="btn btn-primary" to={"/admin/invoices/ViewInvoice/" + item._id} title={t("dashboard.edit")} ><MdEdit /> </Link> &nbsp;
                                                        <Link className="btn btn-danger" to="#" title={t("dashboard.delete")} onClick={e => deleteInvoice(item._id)} ><MdDelete /></Link>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th colSpan="6" className="text-right">

                                            </th>
                                        </tr>
                                    </tfoot>
                                </table> */}
                            </div>
                        </Tab>

                    </Tabs>



                    <br />

                </div>
            </div>
        </div>


    );
}

export default ListInvoices;