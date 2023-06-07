import React from 'react'
import { useTranslation } from "react-i18next"
import {MdGroup} from "react-icons/md"

const ListTeams = () => {
    const { t } = useTranslation();
    return (
        <div className="conatiner">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title"><MdGroup /> {t("sidebar.team")}</h5>
                    <br />
                </div>
            </div>
        </div>
    )
}

export default ListTeams;
