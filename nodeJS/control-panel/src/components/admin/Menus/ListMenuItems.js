import React,{ useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { Link } from 'react-router-dom'

export const ListMenuItems = (props) => {
    const [menuItems, setMenuItems] = useState([]);
    const { t, i18n } = useTranslation();


    useEffect(() => {
        setMenuItems(props.items);
    }, []);

    if (menuItems == null) return (<></>)
    return (
        <div className="table-responsive">
            <table className="table   table-hover">
                <thead>
                    <tr>
                        <th>
                            {t("dashboard.title")}
                        </th>
                        <th className="text-center">
                            {t("dashboard.published")}
                        </th>
                        <th></th>

                    </tr>
                </thead>
                <tbody>
                    {
                        menuItems.map(item => (
                            <tr key={item.title}>
                                <td>
                                    {i18n.language === "en" ? item.title : item.titleArabic}
                                </td>
                                <td className="text-center">
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="custom-control-input" id="customCheck1" checked={item.published} onChange={() => { }} />
                                        <label className="custom-control-label" htmlFor="customCheck1"></label>
                                    </div>
                                </td>
                                <td className="row justify-content-end">
                                    <Link className="btn btn-primary" to={"/admin/menus/edit/" + item.id}>{t("dashboard.edit")}</Link>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}
