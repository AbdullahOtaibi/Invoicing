import { Link } from 'react-router-dom'
import {
  MdDashboard, MdSettings, MdDescription, MdPages, MdBuild, MdImportContacts,
  MdCollections, MdBurstMode, MdCollectionsBookmark, MdEventNote, MdFormatQuote, MdGroup
  , MdBusinessCenter, MdPoll, MdNotificationsActive, MdInsertLink, MdPerson, MdLocalShipping
} from "react-icons/md";

import { useTranslation } from "react-i18next";


const Sidebar = () => {
  const { t } = useTranslation();

  return (
    <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-primary navbar-dark bg-primary sidebar collapse" style={{ overflow: 'scroll' }}>
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link active" aria-current="page" to="/admin" >
              <MdDashboard size={18} /> {t("sidebar.dashboard")}
            </Link >
          </li>
          {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("settings.view") > -1 ? (<li className="nav-item">
            <Link className="nav-link" to="/admin/settings" >
              <MdSettings size={18} /> {t("sidebar.settings")}
            </Link >
          </li>) : null}

          {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("menus.view") > -1 ? (<li className="nav-item">
            <Link className="nav-link" to="/admin/menus" >
              <MdInsertLink size={18} /> {t("sidebar.menus")}
            </Link >
          </li>) : null}

          {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("contentCategories.view") > -1 ? (<li className="nav-item">
            <Link className="nav-link" to="/admin/categories" >
              <MdCollectionsBookmark size={18} /> {t("sidebar.categories")}
            </Link >
          </li>) : null}

          {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("articles.view") > -1 ? (<li className="nav-item">
            <Link className="nav-link" to="/admin/articles" >
              <MdDescription size={18} /> {t("sidebar.articles")}
            </Link >
          </li>) : null}
          {/* <li className="nav-item">
            <Link className="nav-link" to="/admin/pages" >
              <MdPages size={18} /> {t("sidebar.pages")} 
              
              </Link >
          </li> */}
          {/* <li className="nav-item">
            <Link className="nav-link" to="/admin/projects" >
              <MdBuild size={18} />  {t("sidebar.projects")}
            </Link >
          </li> */}
          {/* <li className="nav-item">
            <Link className="nav-link" to="/admin/news" >
              <MdImportContacts size={18} /> {t("sidebar.news")} 
              </Link >
          </li> */}

          {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("gallery.view") > -1 ? (<li className="nav-item">
            <Link className="nav-link" to="/admin/gallery" >
              <MdCollections size={18} /> {t("sidebar.gallery")}
            </Link >
          </li>) : null}
          {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("productCategories.view") > -1 ? (<li className="nav-item">
            <Link className="nav-link" to="/admin/product-categories" >
              <MdBurstMode size={18} /> {t("sidebar.productCategories")}
            </Link >
          </li>) : null}

          {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("products.view") > -1 ? (<li className="nav-item">
            <Link className="nav-link" to="/admin/products" >
              <MdBurstMode size={18} /> {t("sidebar.products")}
            </Link >
          </li>) : null}


          <li className="nav-item">
            <Link className="nav-link" to="/admin/slider" >
              <MdBurstMode size={18} /> {t("sidebar.slider")}
            </Link >
          </li>


          {/* <li className="nav-item">
            <Link className="nav-link" to="/admin/calendar" >
              <MdEventNote size={18} /> {t("sidebar.calendar")}
            </Link >
          </li> */}

          {/* <li className="nav-item">
            <Link className="nav-link" to="/admin/testimonials" >
              <MdFormatQuote size={18} /> {t("sidebar.testimonials")}
            </Link >
          </li> */}


          {/* <li className="nav-item">
            <Link className="nav-link" to="/admin/team" >
              <MdGroup size={18} /> {t("sidebar.team")}
            </Link >
          </li> */}

          {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("partners.view") > -1 ? (<li className="nav-item">
            <Link className="nav-link" to="/admin/partners" >
              <MdBusinessCenter size={18} /> {t("sidebar.partners")}
            </Link >
          </li>) : null}

          {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("orders.view") > -1 ? (<li className="nav-item">
            <Link className="nav-link" to="/admin/quotations" >
              <MdBusinessCenter size={18} /> {t("dashboard.quotations")}
            </Link >
          </li>) : null}

          {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("orders.view") > -1 ? (<li className="nav-item">
            <Link className="nav-link" to="/admin/orders" >
              <MdBusinessCenter size={18} /> {t("sidebar.orders")}
            </Link >
          </li>) : null}

          {/* <li className="nav-item">
            <Link className="nav-link" to="/admin/counters" >
              <MdPoll size={18} /> {t("sidebar.counters")}
            </Link >
          </li> */}

          {/* <li className="nav-item">
            <Link className="nav-link" to="/admin/newsletter" >
              <MdNotificationsActive size={18} /> {t("sidebar.newsletter")}
            </Link >
          </li> */}


          {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("users.view") > -1 ? (<li className="nav-item">
            <Link className="nav-link" to="/admin/users" >
              <MdPerson size={18} /> {t("sidebar.users")}
            </Link >
          </li>) : null}

          {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("users.view") > -1 ? (<li className="nav-item">
            <Link className="nav-link" to="/admin/clients" >
              <MdPerson size={18} /> {t("sidebar.clients")}
            </Link >
          </li>) : null}


          {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("companies.view") > -1 ? (<li className="nav-item">
            <Link className="nav-link" to="/admin/companies" >
              <MdPerson size={18} /> {t("sidebar.companies")}
            </Link >
          </li>) : null}

          {localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf("shippingCompanies.view") > -1 ? (<li className="nav-item">
            <Link className="nav-link" to="/admin/shippingCompanies" >
              <MdLocalShipping size={18} /> {t("sidebar.shippingCompanies")}
            </Link >
          </li>) : null}









        </ul>



      </div>
    </nav>
  )
}

export default Sidebar
