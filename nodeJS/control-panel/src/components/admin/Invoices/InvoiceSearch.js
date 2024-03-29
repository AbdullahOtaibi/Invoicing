import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import './InvoiceSearch.css';
import ContactSearchControl from '../Contact/ContactSearchControl';
import { MdSearch, MdClose } from "react-icons/md";

const InvoiceSearch = (props) => {
    const { t, i18n } = useTranslation();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [contact, setContact] = useState(null);
    const [status, setStatus] = useState('');
    const [contacttype, setcontacttype] = useState('');
    const [insurance, setInsurance] = useState('');

    const [searchVisible, setSearchVisible] = useState(props.searchVisible);

    const contactSelected = (selectedContact) => {
        setContact(selectedContact);
    }
    const InsuranceSelected = (selectedInsurance) => {
        setInsurance(selectedInsurance);
    }
    const updateInsurance= (e) => {
       setcontacttype(e.target.value);
    }
    const visiblityChanged = (show) => {
        if (props.visiblityChanged) {
            props.visiblityChanged(show);
        }
    }

    const updateStatus = (e) => {
        setStatus(e.target.value);
    }

    const updateStartDate = (e) => {
        setStartDate(e.target.value);
    }

    const updateEndDate = (e) => {
        setEndDate(e.target.value);
    }

    const doSearch = () => {
        if(props.searchFilterChanged){
            props.searchFilterChanged({
                contact: contact,
                startDate: startDate,
                endDate: endDate,
                status: status,
                contacttype:contacttype,
                insurance:insurance
            });
           
            
        }
        
    }

    return (<><div className='invoiceSearch mb-5'>
        <div className='card'>
            <form>
                <div className='row mt-3' >
                    <div className="mb-3 col ">
                        <div className="col col-auto">
                            {t("sidebar.Contact")}
                        </div>
                        <div className="col col">
                            <ContactSearchControl
                                handleSelectContact={contactSelected}

                            //  value = {invoice.accountingCustomerParty.registrationName}
                            />
                        </div>
                    </div>


                    <div className="mb-3 col ">
                        <div className="col col-auto">
                        {t("invoice.insurance")}
                    </div>
                        <div className="col col">
                        <ContactSearchControl
                  handleSelectContact={InsuranceSelected}
                  value = {insurance?.contactName}
                    contactType = {["Insurance" ]}
                />
                        </div>
                    </div>


                    <div className="mb-3 col ">
                        <div className="col col-auto">
                            {t("contact.contactType")}
                        </div>
                        <div className="col col">
                        <select
                                type="text"
                                className="form-select"
                                value={contacttype}
                                onChange={updateInsurance}>
                                <option value="all"> {t("viewAll")}</option>

                                <option value={t("invoice.insurance")}> {t("invoice.insurance")}</option>                              
                              
                            </select>

                      
                        </div>
                    </div>
                    


                    

                    <div className="mb-3 col ">
                        <div className="col col-auto">
                            {t("FullCalendar.start")}
                        </div>
                        <div className="col col">
                            <input
                                type="date"
                                className="form-control"
                                value={startDate}
                                onChange={updateStartDate}
                            />
                        </div>
                    </div>

                    <div className="mb-3 col ">
                        <div className="col col-auto">
                            {t("FullCalendar.end")}
                        </div>
                        <div className="col col">
                            <input
                                type="date"
                                className="form-control"
                                value={endDate}
                                onChange={updateEndDate}
                            />
                        </div>
                    </div>

                    <div className="mb-3 col ">
                        <div className="col col-auto">
                            {t("invoice.status")}
                        </div>
                        <div className="col col">
                            <select
                                type="text"
                                className="form-select"
                                value={status}
                                onChange={updateStatus}>
                                <option value="all"> {t("viewAll")}</option>
                                <option value="new"> {t("invoice.NewInvoices")}</option>
                                <option value="posted"> {t("invoice.PostedInvoices")}</option>
                                <option value="stuck"> {t("invoice.StuckInvoices")}</option>
                                <option value="reverted"> {t("invoice.revertedInvoices")}</option>
                            </select>
                        </div>
                    </div>


                    


                </div>

                <div className='row mb-3'>
                    <div className='col text-end px-4 mb-2'>
                        <button type='button' className='btn btn-secondary d-print-none' onClick={() => { visiblityChanged(!searchVisible) }}><MdClose /> {t("close")}</button>
                        <button type='button' className='btn btn-primary mx-2 d-print-none' onClick={doSearch}><MdSearch /> {t("search")}</button>
                    </div>
                </div>
            </form>
        </div>

    </div>
    </>

    );
}
export default InvoiceSearch;