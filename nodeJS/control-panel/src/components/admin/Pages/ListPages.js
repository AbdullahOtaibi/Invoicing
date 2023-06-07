import React from 'react'
import {  useTranslation } from "react-i18next"
import {MdPages} from "react-icons/md";

const ListPages = () => {
    const { t } = useTranslation();

    return (
        <div className="conatiner">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title"><MdPages /> {t("sidebar.pages")}</h5>
                    <br />
                </div>
            </div>
        </div>
    )
}

export default ListPages;