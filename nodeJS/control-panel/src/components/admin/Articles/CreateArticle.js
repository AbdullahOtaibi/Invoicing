import React,{ useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createArticle } from './ArticlesAPI'
import { getCategories } from '../Categories/CategoriesAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import { ThreeDots } from  'react-loader-spinner'
import LocalizedTextEditor from '../Shared/LocalizedTextEditor'
import { hasPermission } from '../utils/auth';
import { Helmet } from 'react-helmet'


const CreateArticle = (props) => {

    let navigate = useNavigate();
    if(!hasPermission('articles.modify')){
        navigate("/admin/articles", { replace: true });
    }
    const [article, setArticle] = useState({title:{}});
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [contentLocale, setContentLocale] = useState('en');

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
    }


    useEffect(() => {
        setLoading(true);
        getCategories().then(res => {
            setCategories(res.data);

            setLoading(false);

            let cloned = JSON.parse(JSON.stringify(article));
            cloned.category = res.data.filter(cat => cat.id === 0)[0];
            console.log(cloned.category);
            setArticle(cloned);


        }).catch(e => {
            setLoading(false);
        });
    }, []);



   

    const updateAlias = (event) => {
        let cloned = JSON.parse(JSON.stringify(article));
        cloned.alias = event.target.value;
        setArticle(cloned);
    }



    const updatePublished = (event) => {
        let cloned = JSON.parse(JSON.stringify(article));
        cloned.published = event.target.checked;
        setArticle(cloned);
    }




    const updateCategory = (event) => {
        let cloned = JSON.parse(JSON.stringify(article));
        console.log("category Id :" + event.target.value);
        cloned.category = categories.filter(cat => cat.id === event.target.value)[0];
        setArticle(cloned);
    }

   
 

    const updateTitle = (newValue, locale) => {
        setContentLocale(locale);
        console.log("EditProduct - newValue: " + newValue + ", locale: " + locale);
        let cloned = JSON.parse(JSON.stringify(article));
        setLocalTextValue(cloned.title, newValue);
        setArticle(cloned);
    }



    const doPost = data => {
        setLoading(true);
        createArticle(article).then(res => {
            setLoading(false);
            toast.success(t("succeed"));
            //setArticle(res.data);
            window.location.href = "/admin/articles/edit/" + res._id;
        }).catch(e => {
            setLoading(false);
        })
        console.log(article);
        console.log(data);
    }


    return (
        <div className="card">
            <Helmet>
                <title> Invoicing | Admin | {t("dashboard.createArticle")}</title>
            </Helmet>

            <div className="card-body">
                <h5 className="card-title">{t("dashboard.createArticle")}</h5>
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
                    <div className="mb-3">
                        <label htmlFor="categoryId" className="form-label">{t("dashboard.category")} </label>
                        <select className="form-control" id="categoryId" value={article.category ? article.category.id : 0} onChange={updateCategory}>
                            {
                                categories.map(item => <option key={item.id} value={item.id}>{item.title}</option>)
                            }
                        </select>
                    </div>



                    <div className="mb-3">
                        <label htmlFor="alias" className="form-label">{t("dashboard.alias")} </label>
                        <input type="text" className="form-control" id="alias" value={article.alias} onChange={updateAlias} />

                    </div>

                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">{t("dashboard.title")} </label>

                        <LocalizedTextEditor placeholder={t("dashboard.title")} locale={contentLocale} textObject={article.title}
                            onLocalChanged={changeLocale} onChange={updateTitle} />
                    </div>


                  

                  

                    <div className="mb-3 form-check">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={article.published} onChange={updatePublished} />
                            <label className="custom-control-label" htmlFor="publishedCheck">{t("dashboard.published")}</label>
                        </div>
                    </div>
                    

                 

                    <div className="mb-3 row col justify-content-end" >
                        <Link className="btn btn-warning" to='/admin/articles' >{t("dashboard.cancel")}</Link> &nbsp;
                        <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.submit")}</button>
                    </div>
                </form>
            </div>


        </div>
    )
}


export default CreateArticle;