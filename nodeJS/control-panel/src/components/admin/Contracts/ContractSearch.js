import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import './ContractSearch.css';
import { MdSearch, MdClose } from "react-icons/md";
import PackageSearchControl from "../Package/PackageSearchControl"
import ContactSearchControl from "../Contact/ContactSearchControl";
const ContractSearch = (props) => {
    const { t, i18n } = useTranslation();

    const [contact, setContact] = useState(null);
    const [status, setStatus] = useState('');
    const [searchVisible, setSearchVisible] = useState(props.searchVisible);
    const [minValue, setMinValue] = useState('');
    const [maxValue, setMaxValue] = useState('');
    const [seqNumber, setSeqNumber] = useState('');
    const [selectedPackage, setSelectedPackage] = useState(null);


    const updateContact = (item) => {
        if (item) {
            setContact(item._id);
        }else{
            setContact(null);
        }
    };
    const updatePackage = (item) => {
        if (item) {
            setSelectedPackage(item._id);
        }else{
            setSelectedPackage(null);
        }
    };

    const visiblityChanged = (show) => {
        if (props.visiblityChanged) {
            props.visiblityChanged(show);
        }
    }

    const updateContrctMaxValue = (event) => {
        setMaxValue(event.target.value);
    }
    const updateContrctMinValue = (event) => {
        setMinValue(event.target.value);

    }
    const updateContrctSeqNumber = (event) => {
        setSeqNumber(event.target.value);
    }


    const handleEnter = (e) => {
        if (e.keyCode == 13) {
            doSearch();
        }

    };

    useEffect(() => {
        
            doSearch();
        
       
            doSearch();
       
       
            doSearch();
        
      
            doSearch();
       
       
            doSearch();
        

    }, [minValue, maxValue, seqNumber, selectedPackage, contact]);


    const doSearch = () => {
        if (props.searchFilterChanged) {
            props.searchFilterChanged({
                contact: contact,
                status: status,
                package: selectedPackage,
                minValue: parseFloat(minValue),
                maxValue: parseFloat(maxValue),
                seqNumber: seqNumber,
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
                                onChange={updateContrctSeqNumber}
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
                                handleSelectContact={updateContact}
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
                                handleSelectPackage={updatePackage}
                            //  value={contract.packageName}
                            />
                        </div>
                    </div>

                    <div className="mb-3 col ">
                        <div className="col col-auto">
                            {t("contracts.greaterThanOrEqualBalance")}
                        </div>
                        <div className="col col">
                            <input
                                type="text"
                                className="form-control"
                                onChange={updateContrctMinValue}
                                onKeyUp={handleEnter}
                            />
                        </div>
                    </div>

                    


                </div>


                <div className='row mt-3'>
                <div className="mb-3 col ">
                        <div className="col col-auto">
                            {t("contracts.lessThanOrEqualBalance")}
                        </div>
                        <div className="col col">
                            <input
                                type="text"
                                className="form-control"
                                onChange={updateContrctMaxValue}
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