import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import {   MdAdd, MdReceipt } from "react-icons/md"
import { ThreeDots } from 'react-loader-spinner'
import { Link } from 'react-router-dom'
import { getLocalizedText } from '../utils/utils'
import { hasPermission } from '../utils/auth';
import { Helmet } from "react-helmet";
import { getReceipts } from './ReceiptAPI'




const ReceiptListControl = (props) => {

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

        var filter = {
            page: receiptsPage,  
        } 

        if (props.contractId) {
            filter.contractId = props.contractId;
        }

        getReceipts(
           filter
        ).then(data => {
            setLoading(false);
            setPackages(data.items || []);
            setReceiptsPage(data.page);
            //console.log("data.items:" + JSON.stringify(data.items));
            console.log("data.pages:" + data.pages);
            setreceiptsPages(data.pages);
        }).catch(e => {
            setLoading(false);
            console.log(e);
        });
    }


    , [props]) 

    const handleReceiptSelected = (item) => {
        if(props.handleReceiptSelected){
            props.handleReceiptSelected(item);
        }
        return true;
    };

    return (
        <div className="conatiner">
          
          
               


                


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

                                    <th>    {t("receipt.contactName")}  </th>
                                    <th>    {t("receipt.contract")}  </th>
                                    <th>
                                     
                                            {t("receipt.receiptAmount")}
                                  

                                    </th>
                                    <th>{t("receipt.note")} </th>
                                 
                           

                                   
                                  
                                  



                                </tr>


                            </thead>
                            <tbody>
                                {
                                    packages.map(item => (

                                        <tr key={'' + item.id}>
                                            <td> 
                                               {
                                                !props.handleReceiptSelected ?  
                                                <Link to={'/admin/Receipt/view/' + item._id} className='text-info'>
                                                {item.seqNumber} </Link> : 
                                              <a href="#" onClick={(e) => {e.preventDefault(); handleReceiptSelected(item) ; return true; }} className='text-info'>{item.seqNumber}  </a>
                                               }
                                               
                                            </td>

                                            <td> {item.contact?.contactName}</td>
                                             <td>{item.contract?.seqNumber}</td>
                                            <td>{item.receiptAmount}</td>
                                            <td>{item.note}</td>
                                           
                                  

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


                    

              
            
        </div>


    );


};

export default ReceiptListControl;