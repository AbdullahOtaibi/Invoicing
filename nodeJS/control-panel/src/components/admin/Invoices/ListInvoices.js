import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdCollectionsBookmark, MdDelete, MdEdit, MdAdd, MdLocalShipping } from "react-icons/md"
import { getClosedInvoices, getNewInvoices, getIncompleteInvoices, removeInvoice } from './InvoicesAPI'
import Loader from "react-loader-spinner"
import { Link, useNavigate } from 'react-router-dom'
import { getLocalizedText } from '../utils/utils'
import { Tabs, Tab } from 'react-bootstrap'
import { hasPermission } from '../utils/auth';
import { Helmet } from "react-helmet";

const ListInvoices = (props) => {

    let navigate = useNavigate();
    if (!hasPermission('invoices.view')) {
        navigate("/admin", { replace: true });
    }

    const { t, i18n } = useTranslation();
    const [newInvoices, setNewInvoices] = useState([]);
    const [closedInvoices, setClosedInvoices] = useState([]);
    const [incompleteInvoices, setIncompleteInvoices] = useState([]);
    const [loading, setLoading] = useState(false);

    const [newInvoicesSort, setNewInvoicesSort] = useState('_idDesc');
    const [newInvoicesPage, setNewInvoicesPage] = useState(0);
    const [newInvoicesPages, setNewInvoicesPages] = useState(0);

    const [closedInvoicesSort, setClosedInvoicesSort] = useState('_idDesc');
    const [closedInvoicesPage, setClosedInvoicesPage] = useState(0);
    const [closedInvoicesPages, setClosedInvoicesPages] = useState(0);

    const [incompleteInvoicesSort, setIncompleteInvoicesSort] = useState('_idDesc');
    const [incompleteInvoicesPage, setIncompleteInvoicesPage] = useState(0);
    const [incompleteInvoicesPages, setIncompleteInvoicesPages] = useState(0);




    const loadNewPage = (newPage) => {
        if (newPage < 0 || (newPage >= newInvoicesPages && newInvoicesPages > 0)) {
            return;
        }
        setLoading(true);
        setNewInvoicesPage(newPage);
        getNewInvoices({
            invoiceBy: newInvoicesSort,
            page: newPage
        }).then(data => {
            setLoading(false);
            setNewInvoices(data.items);
            setNewInvoicesPage(data.page);
            setNewInvoicesPages(data.pages);
        }).catch(e => {
            setLoading(false);
            console.log(e);
        });
    }

    const loadClosedPage = (newPage) => {
        if (newPage < 0 || (newPage >= closedInvoicesPages && closedInvoicesPages > 0)) {
            return;
        }
        setLoading(true);
        setClosedInvoicesPage(newPage);
        getClosedInvoices({
            invoiceBy: closedInvoicesSort,
            page: newPage
        }).then(data => {
            setLoading(false);
            setClosedInvoices(data.items);
            setClosedInvoicesPage(data.page);
            setClosedInvoicesPages(data.pages);
        }).catch(e => {
            setLoading(false);
            console.log(e);
        });
    }

    const loadIncompletePage = (newPage) => {
        if (newPage < 0 || (newPage >= incompleteInvoicesPages && incompleteInvoicesPages > 0)) {
            return;
        }
        setLoading(true);
        setIncompleteInvoicesPage(newPage);
        getIncompleteInvoices({
            invoiceBy: incompleteInvoicesSort,
            page: newPage
        }).then(data => {
            setLoading(false);
            setIncompleteInvoices(data.items);
            setIncompleteInvoicesPage(data.page);
            setIncompleteInvoicesPages(data.pages);
        }).catch(e => {
            setLoading(false);
            console.log(e);
        });
    }




    useEffect(() => {
        loadNewPage(0);
        loadClosedPage(0);
        loadIncompletePage(0);
    }, []);

    const deleteInvoice = (id) => {
        removeInvoice(id).then(res => {
            setNewInvoices(newInvoices.filter(o => o._id != id));
        });
        
    }





    return (
        <div className="conatiner">
            <Helmet>
                <title>{'Invoicing | Admin | Invoices'} </title>
            </Helmet>
            <div className="card">
                <div className="card-body">


                    <div className='row'>
                        <div className='col-md-8 col-sm-6'>
                            <h5 className="card-title"><MdCollectionsBookmark /> {t("sidebar.invoices")}
                                &nbsp;
                            </h5>
                        </div>

                        <div className='col-md-4 col-sm-6' style={{ textAlign: 'end' }}>
                            {hasPermission('invoices.modify') ? (<Link className="add-btn" to={"/admin/invoices/create"}><MdAdd size={20} />  {t("dashboard.add")}</Link>) : null}
                        </div>
                    </div>


                    <div className="container text-center">
                        <Loader
                            type="ThreeDots"
                            color="#00BFFF"
                            height={100}
                            width={100}
                            visible={loading}
                        />
                    </div>
                    <br />

                    <Tabs
                        defaultActiveKey="newInvoices"
                        transition={false}
                        id="noanim-tab-example"
                        className="mb-3" >
                        <Tab eventKey="newInvoices" title={t("invoice.newInvoices")} tabClassName="tab-item">
                            <div className="table-responsive">
                                <table className="table   table-hover">
                                    <thead>
                                        <tr>
                                            <th>
                                                <a href="#" >
                                                    {t("invoice.invoiceNumber")}
                                                </a>

                                            </th>
                                            <th>
                                                <a href="#" >
                                                    {t("invoice.clientName")}
                                                </a>
                                            </th>
                                            <th>
                                                <a href="#" >
                                                    {t("invoice.invoiceDate")}
                                                </a>
                                            </th>
                                            <th className="text-center">
                                                <a href="#">
                                                    {t("invoice.invoiceStatus")}
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
                                            newInvoices.map(item => (
                                                <tr key={'' + item.id}>
                                                    <td>
                                                        <Link to={'/admin/invoices/' + item._id}>
                                                            #{("000000".substring(("" + item.serialNumber).length) + item.serialNumber)}

                                                        </Link>
                                                    </td>
                                                    <td>
                                                        {/* {item.client.firstName} {item.client.surName} */}
                                                    </td>
                                                    <td>
                                                        {item.dateAdded.toString().substring(0, 19).replace('T', ' ')}
                                                    </td>
                                                    <td className="text-center">
                                                        {/* {getLocalizedText(item.status.name, i18n)} */}
                                                    </td>
                                                    <td className="text-center">
                                                        {item.items ? item.items.length : 0} 
                                                    </td>

                                                    <td className="text-center">
                                                        {item.totalAmount ? item.totalAmount.amount : 0} $
                                                    </td>

                                                    <td className="justify-content-end" style={{textAlign:'end'}}>
                                                        {/* <Link className="btn btn-primary" to={"/admin/products/options/" + item._id} title={t("product.productOptions")} ><MdTune /> </Link> &nbsp; */}

                                                        {item.shipment ? (<><Link className="btn btn-primary" to={"/admin/shipments/" + item.shipment} title={t("dashboard.shipmentDetails")} ><MdLocalShipping /> </Link> &nbsp;</>) : null}
                                                        <Link className="btn btn-primary" to={"/admin/invoices/edit/" + item._id} title={t("dashboard.edit")} ><MdEdit /> </Link> &nbsp;
                                                        <Link className="btn btn-danger" to="#" title={t("dashboard.delete")} onClick={e => deleteInvoice(item._id)} ><MdDelete /></Link>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th colSpan="7" className="text-right">
                                                <nav aria-label="Page navigation example">
                                                    <ul className="pagination">

                                                        {newInvoicesPages > 1 ? (<li className="page-item"><label className="page-link" href="#" onClick={() => loadNewPage(newInvoicesPage - 1)}>Previous</label></li>) : null}

                                                        {Array.from(Array(newInvoicesPages), (e, i) => {
                                                            return <li className={i == newInvoicesPage ? "page-item active" : "page-item"} key={i}>
                                                                <label className="page-link" onClick={() => loadNewPage(i)}>
                                                                    {i + 1}
                                                                </label>
                                                            </li>
                                                        })}


                                                        {newInvoicesPages > 1 ? (<li className="page-item"><label className="page-link" href="#" onClick={() => loadNewPage(newInvoicesPage + 1)}>Next</label></li>) : null}

                                                    </ul>
                                                </nav>
                                            </th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </Tab>
                        <Tab eventKey="closedInvoices" title={t("invoice.closedInvoices")} tabClassName="tab-item">
                            <div className="table-responsive">
                                <table className="table   table-hover">
                                    <thead>
                                        <tr>
                                            <th>
                                                <a href="#" >
                                                    {t("invoice.invoiceNumber")}
                                                </a>

                                            </th>
                                            <th>
                                                <a href="#" >
                                                    {t("invoice.clientName")}
                                                </a>
                                            </th>
                                            <th>
                                                <a href="#" >
                                                    {t("invoice.invoiceDate")}
                                                </a>
                                            </th>
                                            <th className="text-center">
                                                <a href="#">
                                                    {t("invoice.dateClosed")}
                                                </a>

                                            </th>


                                            <th className="text-center">
                                                <a href="#">
                                                    {t("invoice.totalAmount")}
                                                </a>

                                            </th>
                                            <th>

                                            </th>
                                            <th></th>

                                        </tr>


                                    </thead>
                                    <tbody>
                                        {
                                            closedInvoices.map(item => (
                                                <tr key={'' + item.id}>
                                                    <td>
                                                        <Link to={'/admin/invoices/' + item._id}>
                                                            #{("000000".substring(("" + item.serialNumber).length) + item.serialNumber)}

                                                        </Link>


                                                    </td>
                                                    <td>
                                                        {/* {item.client.firstName} {item.client.surName} */}
                                                    </td>
                                                    <td>
                                                        {item.dateAdded.toString().substring(0, 19).replace('T', ' ')}
                                                    </td>
                                                    <td className="text-center">
                                                        {/* {item.dateClosed.toString().substring(0, 19).replace('T', ' ')} */}
                                                    </td>

                                                    <td className="justify-content-end" style={{textAlign:'end'}}>
                                                        {/* <Link className="btn btn-primary" to={"/admin/products/options/" + item._id} title={t("product.productOptions")} ><MdTune /> </Link> &nbsp; */}
                                                        <Link className="btn btn-primary" to={"/admin/invoices/edit/" + item._id} title={t("dashboard.edit")} ><MdEdit /> </Link> &nbsp;
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
                                </table>
                            </div>
                        </Tab>
                        <Tab eventKey="incompleteInvoices" title={t("invoice.incompleteInvoices")} tabClassName="tab-item">
                            <div className="table-responsive">
                                <table className="table   table-hover">
                                    <thead>
                                        <tr>

                                            <th>
                                                {t("invoice.invoiceNumber")}
                                            </th>
                                            <th>
                                                <a href="#" >
                                                    {t("invoice.clientName")}
                                                </a>
                                            </th>
                                            <th>
                                                <a href="#" >
                                                    {t("invoice.invoiceDate")}
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
                                                        {/* {item.client.firstName} {item.client.surName} */}

                                                    </td>
                                                    <td>
                                                        {item.dateAdded.toString().substring(0, 19).replace('T', ' ')}
                                                    </td>
                                                    <td className="text-center">
                                                        {item.items ? item.items.length : 0} 
                                                    </td>

                                                    <td className="text-center">
                                                        {item && item.totalAmount ?item.totalAmount.amount + ' ' + item.totalAmount.currencyCode: null }   
                                                    </td>


                                                    <td className="justify-content-end" style={{ textAlign: 'end' }}>
                                                        {/* <Link className="btn btn-primary" to={"/admin/products/options/" + item._id} title={t("product.productOptions")} ><MdTune /> </Link> &nbsp; */}
                                                        <Link className="btn btn-primary" to={"/admin/invoices/edit/" + item._id} title={t("dashboard.edit")} ><MdEdit /> </Link> &nbsp;
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
                                </table>
                            </div>
                        </Tab>
                    </Tabs>



                    <br />

                </div>
            </div>
        </div>
    )
}

export default ListInvoices;