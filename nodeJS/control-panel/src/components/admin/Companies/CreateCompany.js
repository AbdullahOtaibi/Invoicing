import React,{ useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { createcompany } from './CompaniesAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import { ThreeDots } from  'react-loader-spinner'
import LocalizedTextEditor from '../Shared/LocalizedTextEditor'
import { getCountries } from '../../../services/CountriesService'
import UploadImage from '../Images/UploadImage';
import { MdSave, MdClose } from "react-icons/md";
import { hasPermission } from '../utils/auth';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// addedd by abdullah

//import React, { Component } from 'react';
//import { Edit, SimpleForm, ReferenceInput, SelectInput, TextInput, required } from 'react-admin';

const CreateCompany = (props) => {

    let navigate = useNavigate();
    if(!hasPermission('vendors.modify')){
        navigate("/admin/companies", { replace: true });
    }

    const [company, setcompany] = useState({ name: { arabic: "", english: "" }, address: { country:{code:''},location: { lng: 1.212, lat: 21.323232 } }, contactDetails: {phone:''} });
    const [countries, setCountries] = useState([]);
    const [contentLocale, setContentLocale] = useState('ar');
    const [loading, setLoading] = useState(false);
    const [wasValidated, setValidated] = useState(false);
    const { t } = useTranslation();
    const setLocalTextValue = (textObject, newValue) => {
        let result = '';
        if (contentLocale == 'en') {
            textObject.english = newValue;
        } else if (contentLocale == 'ar') {
            textObject.arabic = newValue;
        } else if (contentLocale == 'tr') {
            textObject.turkish = newValue;
        }



    }

    const changeLocale = (newLocale) => {
        setContentLocale(newLocale);

    }

    const updateCompanyName = (newValue, locale) => {
        setContentLocale(locale);
        console.log("EditProduct - newValue: " + newValue + ", locale: " + locale);
        let cloned = JSON.parse(JSON.stringify(company));
        setLocalTextValue(cloned.name, newValue);
        setcompany(cloned);
    }

 
    	
    const updateCompanyInvoiceID = (event) => {
        let cloned = JSON.parse(JSON.stringify(company));
        cloned.companyInvoiceID = event.target.value;
        setcompany(cloned);
    }


    const updateIncomeSourceSequence = (event) => {
        let cloned = JSON.parse(JSON.stringify(company));
        cloned.incomeSourceSequence = event.target.value;
        setcompany(cloned);
    }




    const updateInvoiceCategory = (event) => {
        let cloned = JSON.parse(JSON.stringify(company));
        cloned.invoiceCategory = event.target.value;
        setcompany(cloned);
    }

    const updateClientId = (event) => {
        let cloned = JSON.parse(JSON.stringify(company));
        cloned.clientId = event.target.value;
        setcompany(cloned);
    }

    const updateClientSecret = (event) => {
        let cloned = JSON.parse(JSON.stringify(company));
        cloned.clientSecret = event.target.value;
        setcompany(cloned);
    }

    const updateCountry = (event) => {
        let cloned = JSON.parse(JSON.stringify(company));
        cloned.country = event.target.value;
        setcompany(cloned);
    }

    

    const updateExpiryDate = (date) => {
        let cloned = JSON.parse(JSON.stringify(company));
        cloned.subscriptionExpiryDate = date;
        setcompany(cloned);
    }


    



    


    const updatePhoneNumber = (event) => {
        let cloned = JSON.parse(JSON.stringify(company));
        cloned.contactDetails.phone = event.target.value;
        setcompany(cloned);
    }

    const updateFax = (event) => {
        let cloned = JSON.parse(JSON.stringify(company));
        cloned.contactDetails.fax = event.target.value;
        setcompany(cloned);
    }

    const updateWebsite = (event) => {
        let cloned = JSON.parse(JSON.stringify(company));
        cloned.contactDetails.website = event.target.value;
        setcompany(cloned);
    }




    const updateInfoEmail = (event) => {
        let cloned = JSON.parse(JSON.stringify(company));
        cloned.contactDetails.infoEmail = event.target.value;
        setcompany(cloned);
    }

    //abd 

    
   



    const updatePublished = (event) => {
        let cloned = JSON.parse(JSON.stringify(company));
        cloned.published = event.target.checked;
        setcompany(cloned);
    }




    const updateBrief = (event) => {
        let cloned = JSON.parse(JSON.stringify(company));
        cloned.brief = event.target.value;
        setcompany(cloned);
    }


    const updateBriefArabic = (event) => {
        let cloned = JSON.parse(JSON.stringify(company));
        cloned.briefArabic = event.target.value;
        setcompany(cloned);
    }



    const doPost = data => {
        if(!isFormValid()){
            return;
        }
        setLoading(true);
        createcompany(company).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            //setArticle(res.data);
            window.location.href = "/admin/companies";
        }).catch(e => {
            setLoading(false);
        })
        console.log(company);
        console.log(data);
    }

    useEffect(() => {
        getCountries().then(res => {
            console.log(res.data);
            setCountries(res.data);
        });

    }, []);

    // const imageUploaded = uploadedImage => {
    //     let cloned = JSON.parse(JSON.stringify(company));
    //     cloned.logoUrl = uploadedImage.url;
    //     setcompany(cloned);

    // }


    const isFormValid = () =>{
        setValidated(true);
        return company.name && company.name.arabic &&
        company.companyInvoiceID && 
        company.incomeSourceSequence && 
        company.clientId && 
        company.clientSecret &&
        company.contactDetails.phone; 
    }

    const fieldClass = (value) => {
        //console.log("phone value:" + value) ;
        if(!wasValidated)
        return 'form-control';
        return value?'form-control is-valid':'form-control is-invalid';
    }

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{t("companies.createCompany")}</h5>
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

                <form>

                    {/* <div className="mb-3">
                    <img src={company.logoUrl?"/uploads/" + company.logoUrl:"/images/no-image.png"} style={{ width: '200px', hwight: '200px' }} />
                       
                        <br /><br />
                        <UploadImage handleUpload={imageUploaded} />
                    </div> */}

                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">{t("companies.name")}</label>
                        <LocalizedTextEditor placeholder={t("companies.name")} 
                        locale={contentLocale} textObject={company.name} 
                            onLocalChanged={changeLocale} onChange={updateCompanyName}  className={fieldClass(company.name.arabic)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">{t("companies.phone")} </label>
                        <input type="number" className={fieldClass(company.contactDetails.phone)} placeholder={t("companies.phone")} id="phone" name="phone" value={company.contactDetails.phone} onChange={updatePhoneNumber} />

                    </div>
           

                    <div className="mb-3">
                        <label htmlFor="infoEmail" className="form-label">{t("companies.infoEmail")} </label>
                        <input type="email" className="form-control" placeholder={t("companies.infoEmail")} id="infoEmail" name="infoEmail" value={company.contactDetails.infoEmail} onChange={updateInfoEmail} />

                    </div>

                    <div className="mb-3">
                        <label htmlFor="website" className="form-label">{t("companies.website")} </label>
                        <input type="text" className="form-control" placeholder={t("companies.website")} id="website" name="website" value={company.contactDetails.website} onChange={updateWebsite} />
                    </div>

                    
                    <div className="mb-3">
                        <label htmlFor="companyInvoiceID" className="form-label">{t("companies.companyInvoiceID")} </label>
                        <input type="number" className={fieldClass(company.companyInvoiceID)} placeholder={t("companies.companyInvoiceID")} id="companyInvoiceID" name="companyInvoiceID" value={company.companyInvoiceID} onChange={updateCompanyInvoiceID} />
                    </div>


                    <div className="mb-3">
                        <label htmlFor="incomeSourceSequence" className="form-label">{t("companies.incomeSourceSequence")} </label>
                        <input type="number" className={fieldClass(company.incomeSourceSequence)} placeholder={t("companies.incomeSourceSequence")} id="incomeSourceSequence" name="incomeSourceSequence" value={company.incomeSourceSequence} onChange={updateIncomeSourceSequence} />
                    </div>


                    <div className="mb-3">
                        <label htmlFor="invoiceCategory" className="form-label">{t("companies.invoiceCategory")} </label>
          
                   
                        <select type="text" className={fieldClass(company.invoiceCategory)} id="invoiceCategory" name="title"  onChange={updateInvoiceCategory}   >
                                <option value =""> Select  </option>
                                <option value="Income"> Income </option>
                                <option value="TAX"> TAX </option>
                                <option value="Income-Tax"> Income & TAX </option>
                               
                            </select>
                       

                    </div>


                    <div className="mb-3">
                        <label htmlFor="clientId" className="form-label">{t("companies.clientId")} </label>
                        <input type="text" className={fieldClass(company.clientId)} placeholder={t("companies.clientId")} id="clientId" name="clientId" value={company.clientId} onChange={updateClientId} />
                    </div>


                    <div className="mb-3">
                        <label htmlFor="clientSecret" className="form-label">{t("companies.clientSecret")} </label>
                        <input type="text" className={fieldClass(company.clientSecret)} placeholder={t("companies.clientSecret")} id="clientSecret" name="clientSecret" value={company.clientSecret} onChange={updateClientSecret} />
                    </div>







                    <div className="mb-3">
                        <label htmlFor="alias" className="form-label">{t("countries.country")} </label>
                        <select type="text" className="form-select" id="countryCode" value={company.country} onChange={updateCountry}  >
                            <option>SELECT COUNTRY</option>
                            {countries.map(country => (
                                <option key={country._id} value={country._id}>{country.name.english}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="subscriptionExpiryDate" className="form-label">{t("companies.subscriptionExpiryDate")} </label>

                        <DatePicker
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            selected={company && company.subscriptionExpiryDate ?new Date(company.subscriptionExpiryDate): Date.now()}
                            onChange={(date) => {
                                updateExpiryDate(date);
                            }}
                        />


                        {/* <input type="text" className={fieldClass(company.subscriptionExpiryDate)} placeholder={t("companies.subscriptionExpiryDate")} id="subscriptionExpiryDate" name="clientSecret" value={company.subscriptionExpiryDate} onChange={updateExpiryDate} /> */}
                    </div>

                    <div className="mb-3 form-check">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={company.published} onChange={updatePublished} />
                            <label className="custom-control-label" htmlFor="publishedCheck">{t("dashboard.published")}</label>
                        </div>
                    </div>

                    <div className="mb-3 text-end col justify-content-end" >
                        <Link className="add-btn btn-danger" to='/admin/companies' >
                            <MdClose size={20} /> &nbsp; 
                            {t("dashboard.cancel")}</Link> &nbsp;
                        <button type="button" className="add-btn btn-primary" onClick={doPost}>
                        <MdSave size={20} /> &nbsp; &nbsp;
                            {t("dashboard.save")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default CreateCompany;