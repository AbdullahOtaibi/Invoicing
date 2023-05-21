import React,{ useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { updatecompany, getcompany } from './CompaniesAPI'
import { getCountries } from '../../../services/CountriesService'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import { ThreeDots } from  'react-loader-spinner'
import LocalizedTextEditor from '../Shared/LocalizedTextEditor'
import UploadImage from '../Images/UploadImage';
import { getLocalizedTextByLocale } from '../utils/utils'
import { Editor } from '@tinymce/tinymce-react'
import { MdSave, MdClose } from "react-icons/md";
import { hasPermission } from '../utils/auth';

const EditCompany = (props) => {

    let navigate = useNavigate();
    if(!hasPermission('vendors.modify')){
        navigate("/admin/companies", { replace: true });
    }

    const editorRef = useRef(null);
    const [contentLocale, setContentLocale] = useState('ar');
    
    const [company, setcompany] = useState({ logoUrl: "/images/no-image.png", name: { arabic: "", english: "" }, description: { arabic: "", english: "" }, contactDetails: {}, address: { country: {}, location: {} } });
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const { companyId } = useParams();
    const { t } = useTranslation();
    const [editorReady, setEditorReady] = useState(false);
    const [contentReady, setContentReady] = useState(false);
    let contentNeesUpdate = true;
    const[wasValidated, setValidated] = useState(false); 



    const conentChanged = (newText, editor) => {
        if (contentNeesUpdate) {
            console.log('New Text :' + newText);

            let cloned = JSON.parse(JSON.stringify(company));
            var bm = editor.selection.getBookmark();
            console.log(bm);


            setLocalTextValue(cloned.description, newText);
            setcompany(cloned);
            editor.selection.moveToBookmark(bm);


        } else {
            contentNeesUpdate = true;
        }

    }

    const setLocalTextValue = (textObject, newValue) => {
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
        contentNeesUpdate = false;
        editorRef.current.setContent(getLocalizedTextByLocale(company.description, newLocale));
    }


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
        if(!wasValidated)
        return 'form-control';
        return value?'form-control is-valid':'form-control is-invalid';
    }


    useEffect(() => {
        getcompany(companyId).then(res => {
            if(!res.data.description){
                res.data.description = {};
            }
            if(!res.data.name){
                res.data.name = {};
            }
            if(!res.data.contactDetails){
                res.data.contactDetails = {};
            }
            if(!res.data.address){
                res.data.address = {country: {}, location: {}};
            }
            

            setcompany(res.data);
            setContentReady(true);

        });
        getCountries().then(res => {
            console.log(res.data);
            setCountries(res.data);
        });

    }, []);


    useEffect(() => {

        if (editorRef && editorRef.current) {
            editorRef.current.setContent(getLocalizedTextByLocale(company.description, contentLocale));
        }

    }, [editorReady, contentReady]);

    const updatecompanyName = (newValue, locale) => {
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

    const updateProfitPercentage = (event) => {
        let cloned = JSON.parse(JSON.stringify(company));
        cloned.profitPercentage = event.target.value;
        setcompany(cloned);
    }

    const updateCode = (event) => {
        let cloned = JSON.parse(JSON.stringify(company));
        cloned.code = event.target.value;
        setcompany(cloned);
    }





    const updatePublished = (event) => {
        let cloned = JSON.parse(JSON.stringify(company));
        cloned.published = event.target.checked;
        setcompany(cloned);
    }

    const updatePartner = (event) => {
        let cloned = JSON.parse(JSON.stringify(company));
        cloned.showAsPartner = event.target.checked;
        setcompany(cloned);
    }




    const updateCountry = (event) => {
        let cloned = JSON.parse(JSON.stringify(company));
        if (!cloned.address) {
            cloned.address = { country: {}, location: {} }
        }
        if (!cloned.address.country) {
            cloned.address.country = {}
        }
        cloned.address.country = { code: event.target.value, name: {} };
        setcompany(cloned);
    }


    const doPost = data => {

        if(!isFormValid()){
            return;
        }
        setLoading(true);
        let cloned = JSON.parse(JSON.stringify(company));
        

        updatecompany(cloned).then(res => {
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

    // const imageUploaded = uploadedImage => {
    //     let cloned = JSON.parse(JSON.stringify(company));
    //     cloned.logoUrl = uploadedImage.url;
    //     setcompany(cloned);

    // }



    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{t("companies.editCompany")}</h5>
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
{/* 
                    <div className="mb-3">
                        <img src={company.logoUrl ? "/uploads/" + company.logoUrl : "/images/no-image.png"} 
                        style={{ width: '200px', hwight: '200px' }}
                        alt="Logo"
                        />
                        <br /><br />
                        <UploadImage handleUpload={imageUploaded} />
                    </div> */}

                  

                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">{t("companies.name")}</label>
                        <LocalizedTextEditor placeholder={t("companies.name")} locale={contentLocale} textObject={company.name}
                            onLocalChanged={changeLocale} onChange={updatecompanyName} />
                    </div>

   



                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">{t("companies.phone")} </label>
                        <input type="number"  className={fieldClass(company.contactDetails.phone)}  placeholder={t("companies.phone")} id="phone" name="phone" value={company.contactDetails.phone} onChange={updatePhoneNumber} />

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
                        <input type="number" className={fieldClass(company.incomeSourceSequence)}  placeholder={t("companies.incomeSourceSequence")} id="incomeSourceSequence" name="incomeSourceSequence" value={company.incomeSourceSequence} onChange={updateIncomeSourceSequence} />
                    </div>



                    <div className="mb-3">
                        <label htmlFor="invoiceCategory"  className={fieldClass(company.invoiceCategory)}>{t("companies.invoiceCategory")} </label>
          
                   
                        <select type="text" className="form-control" id="invoiceCategory" name="title"  value = {company.invoiceCategory} onChange={updateInvoiceCategory}   >
                                <option value =""> Select  </option>
                                <option value="Income"> Income </option>
                                <option value="TAX"> TAX </option>
                                <option value="Income-Tax"> Income & TAX </option>
                                v
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


                    {/* <div className="mb-3">
                        <label htmlFor="alias" className="form-label">{t("countries.country")} </label>
                        <select type="text" className="form-control" id="countryCode" value={company.address.country.code} onChange={updateCountry}  >
                            <option>SELECT COUNTRY</option>
                            {countries.map(country => (
                                <option key={country._id} value={country.code}>{country.name.english}</option>
                            ))}
                        </select>
                    </div> */}

                   

                   

                    <div className="mb-3 form-check">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={company.published} onChange={updatePublished} />
                            <label className="custom-control-label" htmlFor="publishedCheck">{t("dashboard.published")}</label>
                        </div>
                    </div>




                    <div className="mb-3 row col justify-content-end" >
                        <Link className="add-btn btn-danger" to='/admin/companies' >
                            <MdClose size={20} />&nbsp;&nbsp;
                            {t("dashboard.cancel")}</Link> &nbsp;
                        <button type="button" className="add-btn btn-primary" onClick={doPost}>
                            <MdSave size={20} />&nbsp;&nbsp;
                            {t("dashboard.save")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default EditCompany;