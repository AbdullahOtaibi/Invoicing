import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdCollectionsBookmark, MdDelete, MdEdit, MdAdd, MdLocalShipping, MdContacts } from "react-icons/md"
import { ThreeDots } from  'react-loader-spinner'
import { Link, useNavigate } from 'react-router-dom'
import { getLocalizedText } from '../utils/utils'
import { hasPermission } from '../utils/auth';
import { Helmet } from "react-helmet";
import { getContacts } from './ContactAPI'



const ListContact = (props) =>{

    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);

    const [contacts, setContacts] = useState([]);

    const [contactsSort, setContactsSort] = useState('_idDesc');
    const [contactsPage, setContactsPage] = useState(0);
    const [contactsPages, setContactsPages] = useState(0);
    


const loadNewPage = (newPage) => {
    if (newPage < 0 || (newPage >= contactsPages && contactsPages > 0)) {
        return;
    }
}
    useEffect(() => {
        setLoading(true);
        setContactsPage(0);
    }, []);
       
    useEffect( ()=>{

            getContacts({
                page: contactsPage,
               status: props.status
               }).then(data => {
                   setLoading(false);
                   setContacts(data.items || []);
                   setContactsPage(data.page );
                   console.log("data.items:" +  JSON.stringify( data.items) ) ;
                   console.log("data.pages:" +data.pages) ;
                   setContactsPages(data.pages);
               }).catch(e => {
                   setLoading(false);
                   console.log(e);
               });
        }
        , [])
    
    //console.log("newPage:" +contactsPage) ;
    


    
   


    return (
        <div className="conatiner">
            <Helmet>
                <title>{'Invoicing | Admin | Contacts'} </title>
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
                                                <a href="#" >
                                                {t("contact.contactName")}
                                                </a>

                                            </th>
                                            <th>
                                                <a href="#" >
                                                {t("contact.mobile")}
                                                </a>

                                            </th>
                                            <th>
                                                <a href="#" >
                                                {t("contact.subContactName")}
                                                </a>

                                            </th>

                                            <th>
                                                <a href="#" >
                                                {t("contact.contactType")}
                                                </a>

                                            </th>

                                            <th>
                                                <a href="#" >
                                                {t("contact.subContactMobile")}
                                                </a>

                                            </th>
                                            <th>
                                                <a href="#" >
                                                {t("contact.note")}
                                                </a>

                                            </th>
                                           
                                             
                                         

                                        </tr>


                                    </thead>
                                    <tbody>
                                        { 

                                        
                                            contacts.map(item => (

                                                <tr key={'' + item.id}>
                                                    <td>
                                                        <Link to={'/admin/Contact/view/' + item._id} className='text-info'>
                                                            {item.contactName}

                                                        </Link>
                                                    </td>
                                                    
                                                    <td> {item.contactType}</td>
                                                    <td>
                                                        {item.mobile}
                                                    </td>
                                                  <td> {item.subContactName}</td>
                                                  
                                                  <td>{item.subContactMobile}</td>
                                                  <td> {item.note}</td>
                                               
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th colSpan="7" className="text-right">
                                                <nav aria-label="Page navigation example">
                                                    <ul className="pagination">

                                                        {contactsPages > 1 ? (<li className="page-item"><label className="page-link" href="#" onClick={() => loadNewPage(contactsPage - 1)}>Previous</label></li>) : null}

                                                        {Array.from(Array(contactsPages), (e, i) => {
                                                            console.log('i:' + i , "contactsPages:" +contactsPages) ;
                                                            return <li className={i == contactsPage ? "page-item active" : "page-item"} key={i}>
                                                                <label className="page-link" onClick={() => loadNewPage(i)}>
                                                                    {i + 1}
                                                                </label>
                                                            </li>
                                                        })}


                                                        {contactsPages > 1 ? (<li className="page-item"><label className="page-link" href="#" onClick={() => loadNewPage(contactsPage + 1)}>Next</label></li>) : null}

                                                    </ul>
                                                </nav>
                                            </th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>






                



                    <br />

                </div>
            </div>
        </div>


    );

} ;

export default ListContact;