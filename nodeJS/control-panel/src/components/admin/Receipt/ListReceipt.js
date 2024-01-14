import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import {   MdAdd, MdReceipt, MdSearch } from "react-icons/md"
import { ThreeDots } from 'react-loader-spinner'
import { Link } from 'react-router-dom'
import { getLocalizedText } from '../utils/utils'
import { hasPermission } from '../utils/auth';
import { Helmet } from "react-helmet";
import { getReceipts } from './ReceiptAPI'
import ReceiptListControl from './ReceiptListControl'
import ReceiptSearch from './ReceiptSearch'
import { use } from 'i18next'

const ListReceipt = (props) => {
    const [searchVisible , setSearchVisible] = useState(false) ;
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [packages , setPackages] = useState([]) ; 
    const[filterSearch , setFilterSearch] = useState({}) ;

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
            //console.log("data.items:" + JSON.stringify(data.items));
            console.log("data.pages:" + data.pages);
            setreceiptsPages(data.pages);
        }).catch(e => {
            setLoading(false);
            console.log(e);
        });
    }


    , []) 
 
    //************** */

    const setSearchFilterChanged = (filter) => {

                        console.log(filter);
                       console.log("call searchFilterChanged method from receipt search control ........");
                       setFilterSearch(filter) ;
                      /* setSearchFilterChanged({
                           seqNumber: seqNumber,
                           contact: contact,
                           contract: contract,
                       });*/

                  
               };

               //useEffect(() => { console.log("abd") ; setSearchFilterChanged(); }, [props.setSearchFilterChanged]);


    //****************** */


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

                    <div className='row'>
                    {searchVisible && <ReceiptSearch  setSearchFilterChanged = {setSearchFilterChanged}/> }
                    </div>

                    <ReceiptListControl  filter= {filterSearch} />
               


                    <br />

                </div>
            </div>
        </div>


    );


};

export default ListReceipt;