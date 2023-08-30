import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import './ContractSearch.css';
import { MdSearch, MdClose } from "react-icons/md";
import PackageSearchControl from "../Package/PackageSearchControl"
import ContactSearchControl from "../Contact/ContactSearchControl";
const ContractSearch = (props) => {
    const { t, i18n } = useTranslation();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [contact, setContact] = useState(null);
    const [status, setStatus] = useState('');
    const [searchVisible, setSearchVisible] = useState(props.searchVisible);



    const visiblityChanged = (show) => {
        if (props.visiblityChanged) {
            props.visiblityChanged(show);
        }
    }

   
    

    const handleEnter = (e) => {
        if (e.keyCode == 13) {
            doSearch();
            }

    } ;
/*
    useEffect(() => {
        if(primaryName && primaryName.length > 2){
            doSearch();
        }
        if(secondaryName && secondaryName.length > 2){
            doSearch();
        }
        if(primaryPhone && primaryPhone.length > 2){
            doSearch();
        }
        if(secondaryPhone && secondaryPhone.length > 2){
            doSearch();
        }
    }, [primaryName, secondaryName, primaryPhone, secondaryPhone]);
*/

    const doSearch = () => {
        if (props.searchFilterChanged) {
            props.searchFilterChanged({
               /* primaryName: primaryName,
                primaryPhone: primaryPhone,
                secondaryName: secondaryName,
                secondaryPhone: secondaryPhone*/
            });

        }
    }

    return (<><div className='invoiceSearch'>
        <div className='card'>
            <form>
                <div className='row mt-3'>
                    <div className="mb-3 col ">
                        <div className="col col-auto">
                        {t("contracts.seqNumber")}
                        </div>
                        <div className="col col">
                            <input
                                type="text"
                                className="form-control"
                             
                                onKeyUp={handleEnter}
                            />
                        </div>
                    </div>

                    <div className="mb-3 col ">
                        <div className="col col-auto">
                        {t("contracts.contactName")}
                        </div>
                        <div className="col col">
                        <ContactSearchControl
                 //   handleSelectContact={setConatct} 
                   // value={contract.contactName}
                    contactType={["Client", "Vendor"]}

                  />
                        </div>
                    </div>

                    <div className="mb-3 col ">
                        <div className="col col-auto">
                            {t("contracts.packageName")}
                        </div>
                        <div className="col col">
                        <PackageSearchControl
                    // handleSelectPackage={setPackage}
                    //  value={contract.packageName}
                  />
                        </div>
                    </div>

                    <div className="mb-3 col ">
                        <div className="col col-auto">
                        {t("contracts.lessThanOrEqualBalance")}
                        </div>
                        <div className="col col">
                            <input
                                type="text"
                                className="form-control"
                              
                                onKeyUp={handleEnter}
                            />
                        </div>
                    </div>


                </div>


                <div className='row mt-3'>
                    <div className="mb-3 col ">
                        <div className="col col-auto">
                        {t("contracts.greaterThanOrEqualBalance")}
                        </div>
                        <div className="col col">
                            <input
                                type="text"
                                className="form-control"
                             
                                onKeyUp={handleEnter}
                            />
                        </div>
                    </div>

                    <div className="mb-3 col ">
                      
                    </div>

                    <div className="mb-3 col ">
                   
                    </div>

                    <div className="mb-3 col ">
                       
                    </div>


                </div>
                
                
            
                <div className='row mb-3'>
                    <div className='col text-end px-4 mb-2'>
                        <button type='button' className='btn btn-secondary' onClick={() => { visiblityChanged(!searchVisible) }}><MdClose /> {t("close")}</button>
                        <button type='button' className='btn btn-primary mx-2' onClick={doSearch}><MdSearch /> {t("search")}</button>
                    </div>
                </div>
            </form>
        </div>

    </div>
    </>

    );
}
export default ContractSearch;