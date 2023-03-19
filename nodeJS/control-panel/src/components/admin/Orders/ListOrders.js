import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdCollectionsBookmark, MdDelete, MdEdit, MdAdd, MdLocalShipping } from "react-icons/md"
import { getClosedOrders, getNewOrders, getIncompleteOrders, removeOrder } from './OrdersAPI'
import Loader from "react-loader-spinner"
import { Link, useNavigate } from 'react-router-dom'
import { getLocalizedText } from '../utils/utils'
import { Tabs, Tab } from 'react-bootstrap'
import { hasPermission } from '../utils/auth';
import { Helmet } from "react-helmet";

const ListOrders = (props) => {

    let navigate = useNavigate();
    if (!hasPermission('orders.view')) {
        navigate("/admin", { replace: true });
    }

    const { t, i18n } = useTranslation();
    const [newOrders, setNewOrders] = useState([]);
    const [closedOrders, setClosedOrders] = useState([]);
    const [incompleteOrders, setIncompleteOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const [newOrdersSort, setNewOrdersSort] = useState('_idDesc');
    const [newOrdersPage, setNewOrdersPage] = useState(0);
    const [newOrdersPages, setNewOrdersPages] = useState(0);

    const [closedOrdersSort, setClosedOrdersSort] = useState('_idDesc');
    const [closedOrdersPage, setClosedOrdersPage] = useState(0);
    const [closedOrdersPages, setClosedOrdersPages] = useState(0);

    const [incompleteOrdersSort, setIncompleteOrdersSort] = useState('_idDesc');
    const [incompleteOrdersPage, setIncompleteOrdersPage] = useState(0);
    const [incompleteOrdersPages, setIncompleteOrdersPages] = useState(0);




    const loadNewPage = (newPage) => {
        if (newPage < 0 || (newPage >= newOrdersPages && newOrdersPages > 0)) {
            return;
        }
        setLoading(true);
        setNewOrdersPage(newPage);
        getNewOrders({
            orderBy: newOrdersSort,
            page: newPage
        }).then(data => {
            setLoading(false);
            setNewOrders(data.items);
            setNewOrdersPage(data.page);
            setNewOrdersPages(data.pages);
        }).catch(e => {
            setLoading(false);
            console.log(e);
        });
    }

    const loadClosedPage = (newPage) => {
        if (newPage < 0 || (newPage >= closedOrdersPages && closedOrdersPages > 0)) {
            return;
        }
        setLoading(true);
        setClosedOrdersPage(newPage);
        getClosedOrders({
            orderBy: closedOrdersSort,
            page: newPage
        }).then(data => {
            setLoading(false);
            setClosedOrders(data.items);
            setClosedOrdersPage(data.page);
            setClosedOrdersPages(data.pages);
        }).catch(e => {
            setLoading(false);
            console.log(e);
        });
    }

    const loadIncompletePage = (newPage) => {
        if (newPage < 0 || (newPage >= incompleteOrdersPages && incompleteOrdersPages > 0)) {
            return;
        }
        setLoading(true);
        setIncompleteOrdersPage(newPage);
        getIncompleteOrders({
            orderBy: incompleteOrdersSort,
            page: newPage
        }).then(data => {
            setLoading(false);
            setIncompleteOrders(data.items);
            setIncompleteOrdersPage(data.page);
            setIncompleteOrdersPages(data.pages);
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

    const deleteOrder = (id) => {
        removeOrder(id).then(res => {
            setNewOrders(newOrders.filter(o => o._id != id));
        });
        
    }





    return (
        <div className="conatiner">
            <Helmet>
                <title>{'Invoicing | Admin | Orders'} </title>
            </Helmet>
            <div className="card">
                <div className="card-body">


                    <div className='row'>
                        <div className='col-md-8 col-sm-6'>
                            <h5 className="card-title"><MdCollectionsBookmark /> {t("sidebar.orders")}
                                &nbsp;
                            </h5>
                        </div>

                        <div className='col-md-4 col-sm-6' style={{ textAlign: 'end' }}>
                            {hasPermission('orders.modify') ? (<Link className="add-btn" to={"/admin/orders/create"}><MdAdd size={20} />  {t("dashboard.add")}</Link>) : null}
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
                        defaultActiveKey="newOrders"
                        transition={false}
                        id="noanim-tab-example"
                        className="mb-3" >
                        <Tab eventKey="newOrders" title={t("order.newOrders")} tabClassName="tab-item">
                            <div className="table-responsive">
                                <table className="table   table-hover">
                                    <thead>
                                        <tr>
                                            <th>
                                                <a href="#" >
                                                    {t("order.orderNumber")}
                                                </a>

                                            </th>
                                            <th>
                                                <a href="#" >
                                                    {t("order.clientName")}
                                                </a>
                                            </th>
                                            <th>
                                                <a href="#" >
                                                    {t("order.orderDate")}
                                                </a>
                                            </th>
                                            <th className="text-center">
                                                <a href="#">
                                                    {t("order.orderStatus")}
                                                </a>

                                            </th>
                                            <th className="text-center">
                                                <a href="#">
                                                    {t("product.products")}
                                                </a>

                                            </th>

                                            <th className="text-center">
                                                <a href="#">
                                                    {t("order.totalAmount")}
                                                </a>

                                            </th>

                                            <th></th>

                                        </tr>


                                    </thead>
                                    <tbody>
                                        {
                                            newOrders.map(item => (
                                                <tr key={'' + item.id}>
                                                    <td>
                                                        <Link to={'/admin/orders/' + item._id}>
                                                            #{("000000".substring(("" + item.serialNumber).length) + item.serialNumber)}

                                                        </Link>
                                                    </td>
                                                    <td>
                                                        {item.client.firstName} {item.client.surName}
                                                    </td>
                                                    <td>
                                                        {item.dateAdded.toString().substring(0, 19).replace('T', ' ')}
                                                    </td>
                                                    <td className="text-center">
                                                        {getLocalizedText(item.status.name, i18n)}
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
                                                        <Link className="btn btn-primary" to={"/admin/orders/edit/" + item._id} title={t("dashboard.edit")} ><MdEdit /> </Link> &nbsp;
                                                        <Link className="btn btn-danger" to="#" title={t("dashboard.delete")} onClick={e => deleteOrder(item._id)} ><MdDelete /></Link>
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

                                                        {newOrdersPages > 1 ? (<li className="page-item"><label className="page-link" href="#" onClick={() => loadNewPage(newOrdersPage - 1)}>Previous</label></li>) : null}

                                                        {Array.from(Array(newOrdersPages), (e, i) => {
                                                            return <li className={i == newOrdersPage ? "page-item active" : "page-item"} key={i}>
                                                                <label className="page-link" onClick={() => loadNewPage(i)}>
                                                                    {i + 1}
                                                                </label>
                                                            </li>
                                                        })}


                                                        {newOrdersPages > 1 ? (<li className="page-item"><label className="page-link" href="#" onClick={() => loadNewPage(newOrdersPage + 1)}>Next</label></li>) : null}

                                                    </ul>
                                                </nav>
                                            </th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </Tab>
                        <Tab eventKey="closedOrders" title={t("order.closedOrders")} tabClassName="tab-item">
                            <div className="table-responsive">
                                <table className="table   table-hover">
                                    <thead>
                                        <tr>
                                            <th>
                                                <a href="#" >
                                                    {t("order.orderNumber")}
                                                </a>

                                            </th>
                                            <th>
                                                <a href="#" >
                                                    {t("order.clientName")}
                                                </a>
                                            </th>
                                            <th>
                                                <a href="#" >
                                                    {t("order.orderDate")}
                                                </a>
                                            </th>
                                            <th className="text-center">
                                                <a href="#">
                                                    {t("order.dateClosed")}
                                                </a>

                                            </th>


                                            <th className="text-center">
                                                <a href="#">
                                                    {t("order.totalAmount")}
                                                </a>

                                            </th>
                                            <th>

                                            </th>
                                            <th></th>

                                        </tr>


                                    </thead>
                                    <tbody>
                                        {
                                            closedOrders.map(item => (
                                                <tr key={'' + item.id}>
                                                    <td>
                                                        <Link to={'/admin/orders/' + item._id}>
                                                            #{("000000".substring(("" + item.serialNumber).length) + item.serialNumber)}

                                                        </Link>


                                                    </td>
                                                    <td>
                                                        {item.client.firstName} {item.client.surName}
                                                    </td>
                                                    <td>
                                                        {item.dateAdded.toString().substring(0, 19).replace('T', ' ')}
                                                    </td>
                                                    <td className="text-center">
                                                        {item.dateClosed.toString().substring(0, 19).replace('T', ' ')}
                                                    </td>

                                                    <td className="justify-content-end" style={{textAlign:'end'}}>
                                                        {/* <Link className="btn btn-primary" to={"/admin/products/options/" + item._id} title={t("product.productOptions")} ><MdTune /> </Link> &nbsp; */}
                                                        <Link className="btn btn-primary" to={"/admin/orders/edit/" + item._id} title={t("dashboard.edit")} ><MdEdit /> </Link> &nbsp;
                                                        <Link className="btn btn-danger" to="#" title={t("dashboard.delete")} onClick={e => deleteOrder(item._id)} ><MdDelete /></Link>
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
                        <Tab eventKey="incompleteOrders" title={t("order.incompleteOrders")} tabClassName="tab-item">
                            <div className="table-responsive">
                                <table className="table   table-hover">
                                    <thead>
                                        <tr>

                                            <th>
                                                {t("order.orderNumber")}
                                            </th>
                                            <th>
                                                <a href="#" >
                                                    {t("order.clientName")}
                                                </a>
                                            </th>
                                            <th>
                                                <a href="#" >
                                                    {t("order.orderDate")}
                                                </a>
                                            </th>

                                            <th className="text-center">
                                                <a href="#">
                                                    {t("product.products")}
                                                </a>

                                            </th>

                                            <th className="text-center">
                                                <a href="#">
                                                    {t("order.totalAmount")}
                                                </a>

                                            </th>

                                            <th></th>

                                        </tr>


                                    </thead>
                                    <tbody>
                                        {
                                            incompleteOrders.map(item => (
                                                <tr key={'' + item.id}>
                                                    <td>
                                                        <Link to={'/admin/orders/' + item._id}>
                                                            #{("000000".substring(("" + item.serialNumber).length) + item.serialNumber)}

                                                        </Link>
                                                    </td>
                                                    <td>
                                                        {item.client.firstName} {item.client.surName}

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
                                                        <Link className="btn btn-primary" to={"/admin/orders/edit/" + item._id} title={t("dashboard.edit")} ><MdEdit /> </Link> &nbsp;
                                                        <Link className="btn btn-danger" to="#" title={t("dashboard.delete")} onClick={e => deleteOrder(item._id)} ><MdDelete /></Link>
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

export default ListOrders;