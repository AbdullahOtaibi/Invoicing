import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdCollectionsBookmark, MdDelete, MdEdit, MdAdd, MdSearch, MdContacts, MdCollections, MdReceipt } from "react-icons/md"
import { ThreeDots } from 'react-loader-spinner'
import { Link, useNavigate } from 'react-router-dom'
import { getLocalizedText } from '../utils/utils'
import { hasPermission } from '../utils/auth';
import { Helmet } from "react-helmet";
import { getReceipts } from './ReceiptAPI'




const ListReceipt = (props) => {

    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [packages , setPackages] = useState([]) ; 

    //const [contactsSort, setContactsSort] = useState('_idDesc');
    const [receiptsPage, setReceiptsPage] = useState(0);
    const [receiptsPages, setreceiptsPages] = useState(0);
    const loadNewPage = (newPage) => {
        if (newPage < 0 || (newPage >= receiptsPages && receiptsPages > 0)) {
            return;
        }
    }
    useEffect( ()=> {

        getReceipts({
            page: receiptsPage,
            
        }).then(data => {
            setLoading(false);
            setPackages(data.items || []);
            setReceiptsPage(data.page);
            console.log("data.items:" + JSON.stringify(data.items));
            console.log("data.pages:" + data.pages);
            setreceiptsPages(data.pages);
        }).catch(e => {
            setLoading(false);
            console.log(e);
        });
    }


    , []) 

    return (
        <div className="conatiner">
            <Helmet>
                <title>{'Invoicing | Admin | Receipts'} </title>
            </Helmet>
            <div className="card">
                <div className={"card-body"}>


                    <div className='row'>
                        <div className='col-md-8 col-sm-6'>
                            <h5 className="card-title"><MdReceipt />
                                <span className='text-info px-2'> {t("sidebar.Receipt")} </span>
                            </h5>
                        </div>

                        <div className='col-md-4 col-sm-6' style={{ textAlign: 'end' }}>
                            
                          
                            <a className="add-btn btn-info btn-lg" href={"/admin/Receipt/create"}><MdAdd size={20} />  {t("dashboard.add")}</a>
                            
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
                                      
                                            {t("receipt.seqNumber")}
                                    

                                    </th>
                                    <th>
                                     
                                            {t("receipt.receiptAmount")}
                                  

                                    </th>
                                    <th>
                                     
                                     {t("receipt.receiptTotalInstallments")}
                           

                             </th>
                             <th>
                                     
                                     {t("receipt.receiptTotalInvoice")}
                           

                             </th>
                                

                                   
                                    <th>
                                      
                                            {t("receipt.packageName")}
                                     

                                    </th>
                                    <th>
                                      
                                      {t("receipt.packagePrice")}
                               

                              </th>



                                </tr>


                            </thead>
                            <tbody>
                                {


                                    packages.map(item => (

                                        <tr key={'' + item.id}>
                                            <td>
                                                <Link to={'/admin/Receipt/view/' + item._id} className='text-info'>
                                                    {item.seqNumber}

                                                </Link>
                                            </td>
                                            <td>{item.receiptAmount}</td>
                                         

                                            <td> {item.receiptTotalInvoice}</td>
                                            <td>{item.receiptAmount}</td>
                                            <td> { item.packageName}</td>
                                            <td> { item.packagePrice}</td>
                                           
                                  

                                        </tr>
                                    ))
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="7" className="text-right">
                                        <nav aria-label="Page navigation example">
                                            <ul className="pagination">

                                                {receiptsPages > 1 ? (<li className="page-item"><label className="page-link" href="#" onClick={() => loadNewPage(receiptsPage - 1)}>Previous</label></li>) : null}

                                                {Array.from(Array(receiptsPages), (e, i) => {
                                                    console.log('i:' + i, "receiptsPages:" + receiptsPages);
                                                    return <li className={i == receiptsPage ? "page-item active" : "page-item"} key={i}>
                                                        <label className="page-link" onClick={() => loadNewPage(i)}>
                                                            {i + 1}
                                                        </label>
                                                    </li>
                                                })}


                                                {receiptsPages > 1 ? (<li className="page-item"><label className="page-link" href="#" onClick={() => loadNewPage(receiptsPage + 1)}>Next</label></li>) : null}

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


};

export default ListReceipt;