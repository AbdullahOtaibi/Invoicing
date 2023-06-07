import React, { useState, useEffect } from 'react'
import { getMailTemplates, removeMailTemplate } from './CommunicationsAPI'
import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import { MdEdit, MdDelete, MdOutlineMarkAsUnread, MdAdd } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from  'react-loader-spinner';
import { getLocalizedText } from '../utils/utils'
import { hasPermission } from '../utils/auth';

const ListMailTemplates = () => {

    const [mailTemplates, setMailTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        setLoading(true);
        getMailTemplates().then(res => {

            setMailTemplates(res.data);
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

    const deleteMailTemplates = (id) => {
        removeMailTemplate(id).then(res => {
            setMailTemplates(mailTemplates.filter(a => a.id != id));
        });
    }


    return (
        <div className="conatiner">
            <div className="card">
                <div className="card-body">


                    <div className='row'>
                        <div className='col-md-8 col-sm-6'>
                            <h5 className="card-title"><MdOutlineMarkAsUnread /> {t("communications.mailTemplates")}
                                &nbsp;
                            </h5>
                        </div>

                        <div className='col-md-4 col-sm-6' style={{ textAlign: 'end' }}>

                            <Link className="add-btn" to={"/admin/communications/message-queue"}><MdOutlineMarkAsUnread size={20} />  {t("communications.messageQueue")}</Link>
                            &nbsp;
                            {hasPermission('articles.modify') ? (<Link className="add-btn" to={"/admin/communications/create-mail-template"}><MdAdd size={20} />  {t("dashboard.add")}</Link>) : null}
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
                    <div className="table-responsive">
                        <table className="table   table-hover">
                            <thead>
                                <tr>
                                    <th>
                                        {t("dashboard.alias")}
                                    </th>
                                    <th>
                                        {t("communications.subject")}
                                    </th>
                                    <th className="text-center">
                                        {t("dashboard.published")}
                                    </th>
                                    <th></th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    mailTemplates.map(item => (
                                        <tr key={item._id}>

                                            <td>
                                                {item.code}

                                            </td>
                                            <td>
                                                {getLocalizedText(item.subject, i18n)}

                                            </td>
                                            <td className="text-center">
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" id="customCheck1" checked={item.published} onChange={() => { }} />
                                                    <label className="custom-control-label" htmlFor="customCheck1"></label>
                                                </div>
                                            </td>
                                            <td className="text-end">
                                                <Link className="btn btn-primary" to={"/admin/communications/edit-mail-template/" + item._id} title={t("dashboard.edit")}> <MdEdit /> </Link> &nbsp;
                                                <Link className="btn btn-danger" to="#" title={t("dashboard.delete")} onClick={e => deleteMailTemplates(item._id)}> <MdDelete /> </Link>
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


export default ListMailTemplates;