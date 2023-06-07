import React,{ useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { updatecompany, getcompany } from './CompaniesAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import { ThreeDots } from  'react-loader-spinner'
import { getProductCategories } from '../ProductCategories/ProductCategoriesAPI';
import { getLocalizedText } from '../utils/utils'
import { hasPermission } from '../utils/auth';


const CompanyCategories = ({onPrev}) => {

    let navigate = useNavigate();
    if(!hasPermission('vendors.modify')){
        navigate("/admin/companies", { replace: true });
    }

    const [company, setcompany] = useState({ logoUrl: "/images/no-image.png", name: { arabic: "", english: "" }, description: { arabic: "", english: "" }, contactDetails: {}, address: { country: {}, location: {} }, categories:[] });
    const [contentLocale, setContentLocale] = useState('en');
    const [loading, setLoading] = useState(false);
    const { companyId } = useParams();
    const { t, i18n } = useTranslation();
    const [categories, setCategories] = useState([]);



    const setLocalTextValue = (textObject, newValue) => {
        if (contentLocale == 'en') {
            textObject.english = newValue;
        } else if (contentLocale == 'ar') {
            textObject.arabic = newValue;
        } else if (contentLocale == 'tr') {
            textObject.turkish = newValue;
        }
    }





    useEffect(() => {
        getcompany(companyId).then(res => {
            if(!res.data.categories){
                res.data.categories = [];
            }
            setcompany(res.data);

        });
        getProductCategories().then(res => {
            setCategories(res.data);
        }).catch(e => {

        });

    }, []);

  
  



    const subCategories = (catId) => {

        if (categories) {
            console.log("catID => " + catId);
            return categories.filter(c => c.parent && c.parent == catId);
        } else {
            return [];
        }
    }

    const mainCategories = () => {
        if (categories) {
            return categories.filter(c => c.parent == null);
        } else {
            return [];
        }
    }




    const doPost = data => {
        setLoading(true);
        updatecompany(company).then(res => {
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

    const companyHasCategory = categoryId => {
        return company.categories.filter(vc => vc._id == categoryId).length > 0;
    }

    const togglecompanyCategory = categoryId => {
        let cloned = JSON.parse(JSON.stringify(company));
        if(!cloned.categories){
            cloned.categories = [];
        }
        let hasCategory = cloned.categories.filter(vc => vc._id == categoryId).length > 0;
        if(hasCategory){
           
            cloned.categories = cloned.categories.filter(vc => vc._id != categoryId);
            setcompany(cloned);
        }else{
           
            cloned.categories.push({_id:categoryId});
            setcompany(cloned);
        }
        
    }





    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">  {t("companies.CompanyCategories")}</h5>
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
                    <h4>{getLocalizedText(company.name, i18n)}</h4>

                    <hr />

                    {mainCategories().map(c => (
                        <div className='row'>
                            <div className='col'>
                                <div className='row p-2' style={{backgroundColor:'#2c3e50', color:'#fff'}}>
                                    <h5 style={{color:'#fff'}}>{getLocalizedText(c.name, i18n)}  {c._id}</h5>
                                </div>
                                <div className='row p-2' >
                                    {subCategories(c._id).map(sc => (
                                       
                                         <div className='col col-12'>
                                             <div className='col-12 p-2' style={{backgroundColor:'#888', color:'#fff'}}>
                                                 <h5 style={{color:'#fff'}}>{getLocalizedText(sc.name, i18n)}   {sc._id}</h5>
                                             </div>
                                             <div className='row p-2' >

                                             {subCategories(sc._id).map(ssc => (
                                        <div className='col-4 p-1' >
                                            <input type='checkbox' id={"cat" + ssc._id} checked={companyHasCategory(ssc._id)}
                                            onChange={() => togglecompanyCategory(ssc._id)}
                                            />
                                            <label htmlFor={"cat" + ssc._id} className="form-label" style={{ cursor: 'pointer' }}>
                                                &nbsp;
                                                {getLocalizedText(ssc.name, i18n)}  {ssc._id}
                                            </label>

                                        </div>
                                    ))}
                                    </div>
                                   
                                    </div>
                                     ))}
                                </div>
                            </div>
                        </div>
                    ))}





                    <div className="mb-3 row col justify-content-end" >
                        <Link className="btn btn-warning" to='/admin/companies' >{t("dashboard.cancel")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.submit")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default CompanyCategories;