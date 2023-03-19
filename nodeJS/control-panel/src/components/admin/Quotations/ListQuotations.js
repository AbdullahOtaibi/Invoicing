import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdCollectionsBookmark, MdDelete, MdEdit, MdAdd } from "react-icons/md"
import { getNewQuotations, removeQuotation } from './QuotationsAPI'
import Loader from "react-loader-spinner"
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getLocalizedText } from '../utils/utils'
import { Tabs, Tab } from 'react-bootstrap'
import { hasPermission } from '../utils/auth';

const ListQuotations = (props) => {

    let navigate = useNavigate();
    if (!hasPermission('orders.view')) {
        navigate("/admin", { replace: true });
    }


    const { t, i18n } = useTranslation();
    const [newQuotations, setNewQuotations] = useState([]);
    const [closedQuotations, setClosedQuotations] = useState([]);
    const [all, setAll] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState(true);
    const { catIdParam, companyIdParam } = useParams();




    useEffect(() => {

        getNewQuotations().then(data => {
            setNewQuotations(data);
        }).catch(e => {
            console.log(e);
        });



    }, []);

    const deleteQuotation = (id) => {
        removeQuotation(id).then(res => {
            setNewQuotations(newQuotations.filter(p => p._id != id));
            setAll(all.filter(p => p._id != id));
        });
    }





    return (
        <div className="conatiner">
            <div className="card">
                <div className="card-body">


                    <div className='row'>
                        <div className='col-md-8 col-sm-6'>
                            <h5 className="card-title"><MdCollectionsBookmark /> {t("dashboard.quotations")}
                                &nbsp;
                            </h5>
                        </div>

                        <div className='col-md-4 col-sm-6' style={{ textAlign: 'end' }}>
                            {hasPermission('orders.modify') ? (<Link className="add-btn" to={"/admin/quotations/create"}><MdAdd size={20} />  {t("dashboard.add")}</Link>) : null}
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
                        defaultActiveKey="newQuotations"
                        transition={false}
                        id="noanim-tab-example"
                        className="mb-3" >
                        <Tab eventKey="newQuotations" title={t("quotation.newQuotations")} tabClassName="tab-item">
                            <div className="table-responsive">
                                <table className="table   table-hover">
                                    <thead>
                                        <tr>
                                            <th>
                                                <a href="#" >
                                                    {t("quotation.quotationNumber")}
                                                </a>

                                            </th>
                                            <th>
                                                <a href="#" >
                                                    {t("order.clientName")}
                                                </a>
                                            </th>
                                            <th>
                                                <a href="#" >
                                                    {t("quotation.date")}
                                                </a>
                                            </th>
                                            <th className="text-center">
                                                <a href="#">
                                                    {t("quotation.quotationStatus")}
                                                </a>

                                            </th>


                                            <th>

                                            </th>
                                            <th></th>

                                        </tr>


                                    </thead>
                                    <tbody>
                                        {
                                            newQuotations.map(item => (
                                                <tr key={'' + item.id}>
                                                    <td>
                                                        <Link to={'/admin/quotations/' + item._id}>
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

                                                    <td className="justify-content-end" style={{ textAlign: 'end' }}>
                                                        {/* <Link className="btn btn-primary" to={"/admin/products/options/" + item._id} title={t("product.productOptions")} ><MdTune /> </Link> &nbsp; */}
                                                        <Link className="btn btn-primary" to={"/admin/quotations/edit/" + item._id} title={t("dashboard.edit")} ><MdEdit /> </Link> &nbsp;
                                                        <Link className="btn btn-danger" to="#" title={t("dashboard.delete")} onClick={e => deleteQuotation(item._id)} ><MdDelete /></Link>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th colSpan="5" className="text-right">
                                                {/* <span style={{ color: 'gray' }}> Count: {orders.length} </span> */}
                                            </th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </Tab>
                        <Tab eventKey="closedOrders" title={t("quotation.closedQuotations")} tabClassName="tab-item">
                            <div className="table-responsive">
                                <table className="table table-hover">
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
                                            closedQuotations.map(item => (
                                                <tr key={'' + item.id}>
                                                    <td>
                                                        #{("000000".substring(("" + item.serialNumber).length) + item.serialNumber)}
                                                    </td>
                                                    <td>
                                                        {getLocalizedText(item.name, i18n)}

                                                    </td>
                                                    <td>
                                                        {item.alias}
                                                    </td>
                                                    <td>
                                                        {item.company ? getLocalizedText(item.company.name, i18n) : null}
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" id="customCheck1" checked={item.published} onChange={() => { }} />
                                                            <label className="custom-control-label" htmlFor="customCheck1"></label>
                                                        </div>
                                                    </td>

                                                    <td className="justify-content-end" style={{ textAlign: 'end' }}>
                                                        {/* <Link className="btn btn-primary" to={"/admin/products/options/" + item._id} title={t("product.productOptions")} ><MdTune /> </Link> &nbsp; */}
                                                        <Link className="btn btn-primary" to={"/admin/quotations/edit/" + item._id} title={t("dashboard.edit")} ><MdEdit /> </Link> &nbsp;
                                                        <Link className="btn btn-danger" to="#" title={t("dashboard.delete")} onClick={e => deleteQuotation(item._id)} ><MdDelete /></Link>
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

export default ListQuotations;