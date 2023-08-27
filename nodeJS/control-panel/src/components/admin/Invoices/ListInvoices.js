import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdCollectionsBookmark, MdDelete, MdEdit, MdAdd, MdSearch } from "react-icons/md"
import { RiFileExcel2Line } from 'react-icons/ri'
import { getPostedInvoices, getNewInvoices, getIncompleteInvoices, removeInvoice }
    from './InvoicesAPI'
import { ThreeDots } from 'react-loader-spinner'
import { Link, useNavigate } from 'react-router-dom'
import { getLocalizedText } from '../utils/utils'
import { Tabs, Tab } from 'react-bootstrap'
import { hasPermission } from '../utils/auth';
import { Helmet } from "react-helmet";
import Listinv from "./ListInv"
import './ListInvoice.css'
import InvoiceSearch from './InvoiceSearch'
import { getInvoicesAsExcel } from './InvoicesAPI'
import { downloadXLSFile } from '../../../services/ApiClient';


const ListInvoices = (props) => {
    let navigate = useNavigate();
    if (!hasPermission('invoices.view')) {
        navigate("/admin", { replace: true });
    }


    const urlParams = new URLSearchParams(window.location.search);
    //const status = urlParams.get('status');
    const [status, setStatus] = useState(urlParams.get('status'));

    const { t, i18n } = useTranslation();
    const [searchVisible, setSearchVisible] = useState(false);
    const [newInvoices, setNewInvoices] = useState([]);
    const [postedInvoices, setPostedInvoices] = useState([]);
    const [incompleteInvoices, setIncompleteInvoices] = useState([]);
    const [loading, setLoading] = useState(false);

    const [newInvoicesSort, setNewInvoicesSort] = useState('_idDesc');
    const [newInvoicesPage, setNewInvoicesPage] = useState(0);
    const [newInvoicesPages, setNewInvoicesPages] = useState(0);

    const [newCount, setNewCount] = useState(0);
    const [postedCount, setPostedCount] = useState(0);
    const [stuckCount, setStuckCount] = useState(0);
    const [searchCount, setSearchCount] = useState(0);
    const [revertedCount, setRevertedCount] = useState(0);
    
    const [filter, setFilter] = useState(null);

    const downloadExcel =  () => {
        const outputFilename = `${Date.now()}.xls`;
        downloadXLSFile('/v1/invoices/filterExcel').then(url => {
           // alert(url);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', outputFilename);
            document.body.appendChild(link);
            link.click();
        });
    }



    const searchFilterChanged = (newFilter) => {
        //alert(JSON.stringify(newFilter));
        setFilter(newFilter);
        setStatus("all");
    }


    useEffect(() => {
       // console.log('********test ....');
       // console.log(JSON.stringify(newInvoices));


    }, [newInvoices]);



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
                         {hasPermission('invoices.modify') ? (
                    
                            <Link className="add-btn btn-info btn-lg" to="/admin/invoices/create">
                            <MdAdd size={20} /> &nbsp; {t("dashboard.add")}
                          </Link>

                            ) : null
                           
                            }
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
                        defaultActiveKey={status ? status : "all"}
                        activeKey={status ? status : "all"}
                        transition={false}
                        id="noanim-tab-example"
                        onSelect={(e) => { setStatus(e); }}
                        className="mb-3 " >

                        <Tab eventKey="all" title={t("viewAll") + ' (' + searchCount + ')'} tabClassName="tab-item btn-dark">
                            <div className="table-responsive">
                                <div ckassName='row mb-5 mt-5'>
                                    <div className='col'>
                                       
                                        <button type='button' className='btn btn-success btn-lg mr-3 ' onClick={downloadExcel}>
                                            <RiFileExcel2Line size={20} /> Download Excel
                                        </button>
                                        <button  type='button' className='btn btn-success btn-lg mr-3 ' 
                                         onClick={() => { setSearchVisible(!searchVisible); }} >
                                            <MdSearch size={20} />  {t("search")}</button>

                                    </div>
                                </div>

                                {searchVisible ? (<InvoiceSearch searchVisible={searchVisible} searchFilterChanged={searchFilterChanged} visiblityChanged={(show) => { setSearchVisible(show) }} />) : null}

                                <Listinv status="all" updateCount={setSearchCount} filter={filter} />
                            </div>
                        </Tab>


                        <Tab eventKey="new" title={t("invoice.newInvoices") + ' (' + newCount + ')'
                        } tabClassName="tab-item btn-info  ">
                            <div className="table-responsive">
                                <Listinv status="new" updateCount={setNewCount} />
                            </div>
                        </Tab>


                        <Tab eventKey="posted" title={t("invoice.postedInvoices") + ' (' + postedCount + ')'} tabClassName="tab-item btn-success">
                            <div className="table-responsive ">
                                <Listinv status="posted" updateCount={setPostedCount} />
                            </div>
                        </Tab>

                        <Tab eventKey="stuck" title={t("invoice.stuckInvoices") + ' (' + stuckCount + ')'} tabClassName="tab-item btn-warning">
                            <div className="table-responsive">
                                <Listinv status="stuck" updateCount={setStuckCount} />
                            </div>
                        </Tab>

                        <Tab eventKey="reverted" title={t("invoice.revertedInvoices") + ' (' + revertedCount + ')'} tabClassName="tab-item btn-danger">
                            <div className="table-responsive">
                                <Listinv status="reverted" updateCount={setRevertedCount} />
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