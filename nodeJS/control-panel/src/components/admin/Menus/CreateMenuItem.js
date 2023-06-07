import React,{ useState } from 'react'
import { useTranslation } from "react-i18next"


export const CreateMenuItem = (props) => {
    const { t } = useTranslation();

    const [menuItem, setMenuItem] = useState({});

    const updateTitle = (event) => {
        let cloned = JSON.parse(JSON.stringify(menuItem));
        cloned.title = event.target.value;
        setMenuItem(cloned);
    }
    const updateTitleArabic = (event) => {
        let cloned = JSON.parse(JSON.stringify(menuItem));
        cloned.titleArabic = event.target.value;
        setMenuItem(cloned);
    }
    const updateLink = (event) => {
        let cloned = JSON.parse(JSON.stringify(menuItem));
        cloned.link = event.target.value;
        setMenuItem(cloned);
    }
    const updateItemPublished = (event) => {
        let cloned = JSON.parse(JSON.stringify(menuItem));
        cloned.published = event.target.checked;
        setMenuItem(cloned);
    }

    const addItem = () => {
        console.log("add menu item clicked");
        if (props.onItemAdded) {
            props.onItemAdded(menuItem);
        }
    }


    const hideMe = () => {
        if(props.closeHandler != null){
            props.closeHandler();
        }
    }


    return (
        <div>
            <div className="mb-3">
                <label htmlFor="title" className="form-label">{t("dashboard.title")} ({t("dashboard.english")})</label>
                <input type="text" className="form-control" id="title" name="title" value={menuItem.title} onChange={updateTitle} />
            </div>
            <div className="mb-3">
                <label htmlFor="titleArabic" className="form-label">{t("dashboard.title")} ({t("dashboard.arabic")})</label>
                <input type="text" className="form-control" id="titleArabic" name="titleArabic" value={menuItem.titleArabic} onChange={updateTitleArabic} />
            </div>
            <div className="mb-3">
                <label htmlFor="link" className="form-label">{t("dashboard.link")} </label>
                <input type="text" className="form-control" id="link" value={menuItem.link} onChange={updateLink} />
            </div>
            <div className="mb-3 form-check">
                <div className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input" id="itemPublishedCheck" checked={menuItem.published} onChange={updateItemPublished} />
                    <label className="custom-control-label" htmlFor="itemPublishedCheck">{t("dashboard.published")}</label>
                </div>
            </div>
            <div className="mb-3 row col justify-content-end" >
                <button type="button" className="btn btn-danger" onClick={hideMe}>{t("close")}</button> &nbsp;
                <button type="button" className="btn btn-primary" onClick={addItem}>{t("dashboard.add")}</button>
            </div>



        </div>
    )
}
