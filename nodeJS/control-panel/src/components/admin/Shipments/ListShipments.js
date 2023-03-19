import React,{ useState, useEffect } from 'react'
import { getShipments, removeShipment } from './ShipmentsAPI'
import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import { MdEdit, MdDelete, MdBurstMode } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "react-loader-spinner";


const ListShipments = () => {

    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        setLoading(true);
        getShipments({}).then(data => {

            setShipments(data.items);
            setLoading(false);
        }).catch(e => {
            setLoading(false);
            if (e.response && e.response.status === 403) {
                window.location.href = "/admin/sign-in"
            }
            //console.log("Error : " + e.response.status);
            toast.error(e.message);
        })
    }, []);

  
    return (
        <div className="conatiner">
            <div className="card">
                <div className="card-body">


                    <div className='row'>
                        <div className='col-md-8 col-sm-6'>
                            <h5 className="card-title"><MdBurstMode /> {t("sidebar.shipments")}
                                &nbsp;
                            </h5>
                        </div>

                        {/* <div className='col-md-4 col-sm-6' style={{ textAlign: 'end' }}>
                            {hasPermission('articles.modify') ? (<Link className="add-btn" to={"/admin/slider/create"}><MdAdd size={20} />  {t("dashboard.add")}</Link>) : null}
                        </div> */}
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
                    <div className="table-responsive">
                        <table className="table   table-hover">
                            <thead>
                                <tr>
                                    <th>
                                        #
                                    </th>
                                    <th>
                                        {t("order.orderNumber")}
                                    </th>
                                    <th className="text-center">
                                        {t("quotation.date")}
                                    </th>
                                    <th></th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    shipments ? shipments.map(item => (
                                        <tr key={item._id}>
                                            <td>
                                                <Link to={"/admin/shipments/" + item._id}>
                                                    {item._id}
                                                </Link>

                                            </td>
                                            <td>
                                            <Link to={"/admin/orders/" + item.order}>
                                                    {item.order}
                                                </Link>
                                                

                                            </td>
                                            <td className="text-center">
                                                {item.startDate}
                                            </td>
                                            <td className="row justify-content-end">
                                                <Link className="btn btn-primary" to={"/admin/shipments/edit/" + item._id} title={t("dashboard.edit")}> <MdEdit /> </Link> &nbsp;
                                                <Link className="btn btn-danger" to="#" title={t("dashboard.delete")} onClick={e => removeShipment(item._id)}> <MdDelete /> </Link>
                                            </td>
                                        </tr>
                                    )) : null
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>




        </div>
    )
}


export default ListShipments;