import React from 'react'
import {  useTranslation } from "react-i18next"
import {MdImportContacts} from "react-icons/md"

const ListNews = () => {
    const { t } = useTranslation();

    return (
        <div className="conatiner">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title"><MdImportContacts /> {t("sidebar.news")}</h5>
                    <br />
                </div>
            </div>
        </div>
    )
}

export default ListNews;