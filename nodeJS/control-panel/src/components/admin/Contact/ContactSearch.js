import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import './ContactSearch.css';
import ContactSearchControl from './ContactSearchControl';
import { MdSearch, MdClose } from "react-icons/md";

const ContactSearch = (props) => {
    const { t, i18n } = useTranslation();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [contact, setContact] = useState(null);
    const [status, setStatus] = useState('');
    const [searchVisible, setSearchVisible] = useState(props.searchVisible);

    const [primaryName, setPrimaryName] = useState('');
    const [secondaryName, setSecondaryName] = useState('');
    const [primaryPhone, setPrimaryPhone] = useState('');
    const [secondaryPhone, setSecondaryPhone] = useState('');


    const contactSelected = (selectedContact) => {
        setContact(selectedContact);
    }
    const visiblityChanged = (show) => {
        if (props.visiblityChanged) {
            props.visiblityChanged(show);
        }
    }

    const updatePrimaryName = (e) => {
        setPrimaryName(e.target.value);
    }

    const updatePrimaryPhone = (e) => {
        setPrimaryPhone(e.target.value);
    }

    const updateSecondaryPhone = (e) => {
        setSecondaryPhone(e.target.value);
    }

    const updateSecondaryName = (e) => {
        setSecondaryName(e.target.value);
        
    }


    const handleEnter = (e) => {
        if (e.keyCode == 13) {
            doSearch();
            }
    }
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

    const doSearch = () => {
        if (props.searchFilterChanged) {
            props.searchFilterChanged({
                primaryName: primaryName,
                primaryPhone: primaryPhone,
                secondaryName: secondaryName,
                secondaryPhone: secondaryPhone
            });


        }

    }

    return (<><div className='invoiceSearch'>
        <div className='card'>
            <form>
                <div className='row mt-3'>
                    <div className="mb-3 col ">
                        <div className="col col-auto">
                            {t("contact.contactName")}
                        </div>
                        <div className="col col">
                            <input
                                type="text"
                                className="form-control"
                                value={primaryName}
                                onChange={updatePrimaryName}
                                onKeyUp={handleEnter}
                            />
                        </div>
                    </div>

                    <div className="mb-3 col ">
                        <div className="col col-auto">
                            {t("contact.mobile")}
                        </div>
                        <div className="col col">
                            <input
                                type="text"
                                className="form-control"
                                value={primaryPhone}
                                onChange={updatePrimaryPhone}
                                onKeyUp={handleEnter}
                            />
                        </div>
                    </div>

                    <div className="mb-3 col ">
                        <div className="col col-auto">
                            {t("contact.subContactName")}
                        </div>
                        <div className="col col">
                            <input
                                type="text"
                                className="form-control"
                                value={secondaryName}
                                onChange={updateSecondaryName}
                                onKeyUp={handleEnter}
                            />
                        </div>
                    </div>

                    <div className="mb-3 col ">
                        <div className="col col-auto">
                            {t("contact.subContactMobile")}
                        </div>
                        <div className="col col">
                            <input
                                type="text"
                                className="form-control"
                                value={secondaryPhone}
                                onChange={updateSecondaryPhone}
                                onKeyUp={handleEnter}
                            />
                        </div>
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
export default ContactSearch;