import React, { useState, useEffect } from 'react'
import { getPayments } from './PaymentsAPI'
import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import { MdEdit, MdAdd, MdCreditCard } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "react-loader-spinner";
import { getLocalizedText } from '../utils/utils'
import { hasPermission } from '../utils/auth';
import Moment from 'react-moment';

const ListPayments = () => {

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        setLoading(true);
        getPayments({}).then(data => {

            setPayments(data.items);
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
                            <h5 className="card-title"><MdCreditCard /> {t("payments.payments")}
                                &nbsp;
                            </h5>
                        </div>

                        <div className='col-md-4 col-sm-6' style={{ textAlign: 'end' }}>
                            {hasPermission('articles.modify') ? (<Link className="add-btn" to={"/admin/slider/create"}><MdAdd size={20} />  {t("dashboard.add")}</Link>) : null}
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
                    <div className="table-responsive">
                        <table className="table   table-hover">
                            <thead>
                                <tr>

                                    <th>
                                        No.
                                    </th>
                                    <th className='text-center'>
                                        Payment Method
                                    </th>
                                    <th>
                                        Amount
                                    </th>
                                    <th>
                                        Date
                                    </th>

                                    <th></th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    payments.map(item => (
                                        <tr key={item._id}>

                                            <td>
                                                <Link to={"/admin/payments/" + item._id}>
                                                #{("000000".substring(("" + item.serialNumber).length) + item.serialNumber)}
                                                </Link>

                                            </td>
                                            <td className='text-center'>
                                                KNET
                                            </td>
                                            <td>
                                                {item.amount.toFixed(3)} {item.currencyCode}
                                            </td>
                                            <td>
                                                <Moment date={item.date} format="DD-MM-YYYY hh:mm a" />
                                            </td>

                                            <td className="row justify-content-end">
                                                <Link className="btn btn-primary" to={"/admin/payments/edit/" + item._id} title={t("dashboard.edit")}> <MdEdit /> </Link> &nbsp;

                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>




        </div>
    )
}


export default ListPayments;