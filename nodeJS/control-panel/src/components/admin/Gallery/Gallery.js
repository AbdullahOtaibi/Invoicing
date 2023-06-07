import React,{ useState, useEffect } from 'react'
import { getGalleryItems, removeGalleryItem } from './GalleryAPI'
import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import { MdCollections, MdEdit, MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from  'react-loader-spinner';

const Gallery = () => {

    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        setLoading(true);
        getGalleryItems().then(res => {

            setGalleryItems(res.data);
            setLoading(false);
        }).catch(e => {
            setLoading(false);
            if (e.response && e.response.status === 403) {
                window.location.href = "/admin/sign-in"
            }
            //console.log("Error : " + e.response.status);
            toast.error(e.message);
        })
    }, []);

    const deleteGalleryItem = (id) => {
        removeGalleryItem(id).then(res => {
            setGalleryItems(galleryItems.filter(a => a.id != id));
        });
    }


    return (
        <div className="conatiner">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title"><MdCollections /> {t("sidebar.gallery")}  <Link className="btn btn-outline-primary btn-sm" to={"/admin/gallery/create"}>+</Link>
                    </h5>
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
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>
                                        #
                                    </th>
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
                                    galleryItems.map(item => (
                                        <tr key={item.id}>
                                            <td> {item.id}</td>
                                            <td>
                                                {i18n.language === "en" ? item.title : item.titleArabic}
                                            </td>
                                            <td className="text-center">
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" id="customCheck1" checked={item.published} onChange={() => { }} />
                                                    <label className="custom-control-label" htmlFor="customCheck1"></label>
                                                </div>
                                            </td>
                                            <td className="text-end">
                                                <Link className="btn btn-primary" to={"/admin/gallery/edit/" + item.id} title={t("dashboard.edit")}> <MdEdit /> </Link> &nbsp;
                                                <Link className="btn btn-danger" to="#" title={t("dashboard.delete")} onClick={e => deleteGalleryItem(item.id)}> <MdDelete /> </Link>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>




        </div>
    )
}


export default Gallery;