import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdCollectionsBookmark, MdDelete, MdEdit, MdAdd, MdLocalShipping, MdContacts } from "react-icons/md"

import Loader from "react-loader-spinner"
import { Link, useNavigate } from 'react-router-dom'
import { getLocalizedText } from '../utils/utils'

import { hasPermission } from '../utils/auth';
import { Helmet } from "react-helmet";



const ListContact = (props) =>{

    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);

    return (
        <div className="conatiner">
            <Helmet>
                <title>{'Invoicing | Admin | Contact'} </title>
            </Helmet>
            <div className="card">
                <div className={"card-body"}>

                
                    <div className='row'>
                        <div className='col-md-8 col-sm-6'>
                            <h5 className="card-title"><MdContacts /> 
                                <span className='text-info px-2'> {t("sidebar.Contact")} </span>
                            </h5>
                        </div>

                        <div className='col-md-4 col-sm-6' style={{ textAlign: 'end' }}>
                            {hasPermission('invoices.modify') ? (<Link className="add-btn" to={"/admin/Contact/create"}><MdAdd size={20} />  {t("dashboard.add")}</Link>) : null}
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

                



                    <br />

                </div>
            </div>
        </div>


    );

} ;

export default ListContact 