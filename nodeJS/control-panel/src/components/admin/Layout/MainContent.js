import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../../../assets/css/custom.css'
import '../../../assets/css/new-theme.css'
import Summary from './Summary'
import { Helmet } from "react-helmet";

import CompanyCategories from '../Companies/CompanyCategories'

const ListModules = lazy(() => import(/* webpackChunkName: "ListModules" */'../Modules/ListModules'))
const CreateModule = lazy(() => import(/* webpackChunkName: "CreateModule" */'../Modules/CreateModule'))

const ListArticles = lazy(() => import(/* webpackChunkName: "ListArticles" */ '../Articles/ListArticles'))
const EditArticle = lazy(() => import(/* webpackChunkName: "EditArticle" */'../Articles/EditArticle'))
const CreateArticle = lazy(() => import(/* webpackChunkName: "CreateArticle" */'../Articles/CreateArticle'))
const ListCategories = lazy(() => import(/* webpackChunkName: "ListCategories" */'../Categories/ListCategories'))
const ListCounters = lazy(() => import(/* webpackChunkName: "ListCounters" */'../Counters/ListCounters'))
const Gallery = lazy(() => import(/* webpackChunkName: "Gallery" */'../Gallery/Gallery'))
const ListNews = lazy(() => import(/* webpackChunkName: "ListNews" */'../News/ListNews'))
const ListSubscriptions = lazy(() => import(/* webpackChunkName: "ListSubscriptions" */'../Newsletter/ListSubscriptions'))
const ListPages = lazy(() => import(/* webpackChunkName: "ListPages" */'../Pages/ListPages'))
const ListPartners = lazy(() => import(/* webpackChunkName: "ListPartners" */'../Partners/ListPartners'))
const ListProjects = lazy(() => import(/* webpackChunkName: "ListProjects" */'../Projects/ListProjects'))
const ListSettings = lazy(() => import(/* webpackChunkName: "ListSettings" */'../Settings/ListSettings'))
const ListTeams = lazy(() => import(/* webpackChunkName: "ListTeams" */'../Team/ListTeams'))
const ListTestimonials = lazy(() => import(/* webpackChunkName: "ListTestimonials" */'../Testimonials/ListTestimonials'))
const ListMenus = lazy(() => import(/* webpackChunkName: "ListMenus" */'../Menus/ListMenus'))
const CreateMenu = lazy(() => import(/* webpackChunkName: "CreateMenu" */'../Menus/CreateMenu'))
const EditMenu = lazy(() => import(/* webpackChunkName: "EditMenu" */'../Menus/EditMenu'))
const CreateCategory = lazy(() => import(/* webpackChunkName: "CreateCategory" */'../Categories/CreateCategory'))
const EditCategory = lazy(() => import(/* webpackChunkName: "EditCategory" */'../Categories/EditCategory'))
const CreateProject = lazy(() => import(/* webpackChunkName: "CreateProject" */'../Projects/CreateProject'))
const EditProject = lazy(() => import(/* webpackChunkName: "EditProject" */'../Projects/EditProject'))
const CreatePartner = lazy(() => import(/* webpackChunkName: "CreatePartner" */'../Partners/CreatePartner'))
const EditPartner = lazy(() => import(/* webpackChunkName: "EditPartner" */'../Partners/EditPartner'))
const ListSlides = lazy(() => import(/* webpackChunkName: "ListSlides" */'../Slider/ListSlides'))
const CreateSlide = lazy(() => import(/* webpackChunkName: "CreateSlide" */'../Slider/CreateSlide'))
const EditSlide = lazy(() => import(/* webpackChunkName: "EditSlide" */'../Slider/EditSlide'))
const CreateGalleryItem = lazy(() => import(/* webpackChunkName: "CreateGalleryItem" */'../Gallery/CreateGalleryItem'))
const EditGalleyItem = lazy(() => import(/* webpackChunkName: "EditGalleryItem" */'../Gallery/EditGalleryItem'))

const CreateTestimonial = lazy(() => import(/* webpackChunkName: "CreateTestimonial" */'../Testimonials/CreateTestimonial'))
const EditTestimonial = lazy(() => import(/* webpackChunkName: "EditTestimonial" */'../Testimonials/EditTestimonial'))
const EditMenuItem = lazy(() => import(/* webpackChunkName: "EditMenuItem" */'../Menus/EditMenuItem'))

const ListProductCategories = lazy(() => import(/* webpackChunkName: "ListProductCategories" */'../ProductCategories/ListProductCategories'))
const CreateProductCategory = lazy(() => import(/* webpackChunkName: "CreateProductCategory" */'../ProductCategories/CreateProductCategory'))
const EditProductCategory = lazy(() => import(/* webpackChunkName: "EditProductCategory" */'../ProductCategories/EditProductCategory'))

const ShowProductCategories = lazy(() => import(/* webpackChunkName: "ShowProductCategories" */'../ProductCategories/ShowProductCategories'))

const ListProducts = lazy(() => import(/* webpackChunkName: "ListProducts" */'../Products/ListProducts'))
const CreateProduct = lazy(() => import(/* webpackChunkName: "CreateProduct" */'../Products/CreateProduct'))
const EditProduct = lazy(() => import(/* webpackChunkName: "EditProduct" */'../Products/EditProduct'))

const EditUser = lazy(() => import(/* webpackChunkName: "EditUser" */'../Users/EditUser'))
const CreateUser = lazy(() => import(/* webpackChunkName: "CreateUser" */'../Users/CreateUser'))
const ListUsers = lazy(() => import(/* webpackChunkName: "ListUsers" */'../Users/ListUsers'))

const EditClient = lazy(() => import(/* webpackChunkName: "EditClient" */'../Clients/EditClient'))
const CreateClient = lazy(() => import(/* webpackChunkName: "CreateClient" */'../Clients/CreateClient'))
const ListClients = lazy(() => import(/* webpackChunkName: "ListClients" */'../Clients/ListClients'))

const EditRole = lazy(() => import(/* webpackChunkName: "EditRole" */'../Users/EditRole'))
const CreateRole = lazy(() => import(/* webpackChunkName: "CreateRole" */'../Users/CreateRole'))
const ListRoles = lazy(() => import(/* webpackChunkName: "ListRoles" */'../Users/ListRoles'))


const ListCompanies = lazy(() => import(/* webpackChunkName: "ListCompanies" */'../Companies/ListCompanies'))
const CreateCompany = lazy(() => import(/* webpackChunkName: "CreateCompany" */'../Companies/CreateCompany'))
const EditCompany = lazy(() => import(/* webpackChunkName: "EditCompany" */'../Companies/EditCompany'))

const ListCountries = lazy(() => import(/* webpackChunkName: "ListCountries" */'../Countries/ListCountries'))
const CreateCountry = lazy(() => import(/* webpackChunkName: "CreateCountry" */'../Countries/CreateCountry'))
const ListOrders = lazy(() => import(/* webpackChunkName: "ListOrders" */'../Orders/ListOrders'))
const ViewOrder = lazy(() => import(/* webpackChunkName: "ViewOrder" */'../Orders/ViewOrder'))
const EditOrder = lazy(() => import(/* webpackChunkName: "EditOrder" */'../Orders/EditOrder'))
const ViewQuotation = lazy(() => import(/* webpackChunkName: "ViewQuotation" */'../Quotations/ViewQuotation'))
const ListQuotations = lazy(() => import(/* webpackChunkName: "ListQuotations" */'../Quotations/ListQuotations'))
const EditQuotation = lazy(() => import(/* webpackChunkName: "EditQuotation" */'../Quotations/EditQuotation'))

const ListShippingCompanies = lazy(() => import(/* webpackChunkName: "ListShippingCompanies" */'../ShippingCompanies/ListShippingCompanies'))
const CreateShippingCompany = lazy(() => import(/* webpackChunkName: "CreateShippingCompany" */'../ShippingCompanies/CreateShippingCompany'))
const EditShippingCompany = lazy(() => import(/* webpackChunkName: "EditShippingCompany" */'../ShippingCompanies/EditShippingCompany'))

const ViewShipment = lazy(() => import(/* webpackChunkName: "ViewShipment" */'../Shipments/ViewShipment'))
const ListShipments = lazy(() => import(/* webpackChunkName: "ListShipments" */'../Shipments/ListShipments'))
const EditShipment = lazy(() => import(/* webpackChunkName: "EditShipment" */'../Shipments/EditShipment'))

const ListNavigationMenus = lazy(() => import(/* webpackChunkName: "ListNavigationMenus" */'../NavigationMenus/ListNavigationMenus'))
const CreateNavigationMenu = lazy(() => import(/* webpackChunkName: "CreateNavigationMenu" */'../NavigationMenus/CreateNavigationMenu'))
const EditNavigationMenu = lazy(() => import(/* webpackChunkName: "EditNavigationMenu" */'../NavigationMenus/EditNavigationMenu'))

const ListMailTemplates = lazy(() => import(/* webpackChunkName: "ListMailTemplates" */'../Communications/ListMailTemplates'))
const CreateMailTemplate = lazy(() => import(/* webpackChunkName: "CreateMailTemplate" */'../Communications/CreateMailTemplate'))
const EditMailTemplate = lazy(() => import(/* webpackChunkName: "EditMailTemplate" */'../Communications/EditMailTemplate'))
const MessageQueue = lazy(() => import(/* webpackChunkName: "MessageQueue" */'../Communications/MessageQueue'))
const MessageQueueItem = lazy(() => import(/* webpackChunkName: "MessageQueueItem" */'../Communications/MessageQueueItem'))
const MyMessages = lazy(() => import(/* webpackChunkName: "MyMessages" */'../Communications/MyMessages'))

const ListPayments = lazy(() => import(/* webpackChunkName: "ListPayments" */'../Payments/ListPayments'))
const OutstandingPayments = lazy(() => import(/* webpackChunkName: "OutstandingPayments" */'../Payments/OutstandingPayments'))

const ListTranslations = lazy(() => import(/* webpackChunkName: "ListTranslations" */'../Translations/ListTranslations'))
const EditTranslation = lazy(() => import(/* webpackChunkName: "EditTranslation" */'../Translations/EditTranslation'))


const ListInvoices = lazy(() => import(/* webpackChunkName: "ListInvoices" */'../Invoices/ListInvoices'))
const CreateInvoice = lazy(() => import(/* webpackChunkName: "CreateInvoice" */'../Invoices/CreateInvoice'))
const EditInvoice = lazy(() => import(/* webpackChunkName: "EditInvoice" */'../Invoices/EditInvoice'))
const ViewInvoice = lazy(() => import(/* webpackChunkName: "ViewInvoice" */'../Invoices/ViewInvoice'))


const FullCalendarList = lazy(() => import(/* webpackChunkName: "FullCalendarList" */'../FullCalendar/FullCalendarList'));
const FullCalendarNew = lazy(() => import(/* webpackChunkName: "FullCalendarNew" */'../FullCalendar/FullCalendarNew'));
const FullCalendarEdit = lazy(() => import(/* webpackChunkName: "FullCalendarEdit" */'../FullCalendar/FullCalendarEdit'));
const FullCalendarDelete = lazy(() => import(/* webpackChunkName: "FullCalendarDelete" */'../FullCalendar/FullCalendarDelete'));



const ListContact = lazy(() => import(/* webpackChunkName: "ListContact" */'../Contact/ListContact'))
const CreateContact = lazy(() => import(/* webpackChunkName: "CreateContact" */'../Contact/CreateContact'))
const EditContact = lazy(() => import(/* webpackChunkName: "EditContact" */'../Contact/EditContact'))
const ViewContact = lazy(() => import(/* webpackChunkName: "ViewContact" */'../Contact/ViewContact'))



const ListPackage = lazy(() => import(/* webpackChunkName: "ListPackage" */'../Package/ListPackage'))
const CreatePackage = lazy(() => import(/* webpackChunkName: "CreatePackage" */'../Package/CreatePackage'))
const EditPackage = lazy(() => import(/* webpackChunkName: "EditPackage" */'../Package/EditPackage'))
const ViewPackage = lazy(() => import(/* webpackChunkName: "ViewPackage" */'../Package/ViewPackage'))



const SignIn = lazy(() => import(/* webpackChunkName: "SignIn" */'../../SignIn/SignIn'));




const MainContent = ({notification, onHandleNotification}) => {
    return (<>
        <Helmet>
            <title>{'Invoicing | Admin | '} </title>
            <meta name="robots" content="noindex" />
        </Helmet>
        <main className="content-area"  >
            <Suspense fallback={<div>Loading ...</div>} >
                <Routes>

                
                <Route path="/modules" exact element={<ListModules />}  />
                <Route path="/modules/create" element={<CreateModule />} />
                

                    <Route path="/sign-in" exact element={<SignIn />} />
                    <Route path="/articles" exact element={<ListArticles />} />
                    <Route path="/orders" exact element={<ListOrders notification={notification} onHandleNotification={onHandleNotification}  />} />
                    <Route path="/orders/:orderId" element={<ViewOrder notification={notification} onHandleNotification={onHandleNotification} />}  />
                    <Route path="/orders/edit/:orderId" element={<EditOrder notification={notification} onHandleNotification={onHandleNotification} />}  />

                    <Route path="/translations" exact element={<ListTranslations />} />

                    <Route path="/translations/edit/:id" exact element={<EditTranslation />} />
                    


                    <Route path="/received-payments" exact element={<ListPayments />} />
                    <Route path="/outstanding-payments" exact element={<OutstandingPayments />} />


                    <Route path="/quotations" exact element={<ListQuotations />} />
                    <Route path="/quotations/:quotationId" element={<ViewQuotation />} />
                    <Route path="/quotations/edit/:quotationId" element={<EditQuotation />} />


                    <Route path="/articles/edit/:id" element={<EditArticle />} />
                    <Route path="/articles/create" element={<CreateArticle />} />
                    <Route path="/pages" element={<ListPages />} />
                    <Route path="/settings" element={<ListSettings />} />
                    <Route path="/communications" element={<ListMailTemplates />} />
                    <Route path="/communications/message-queue" exact element={<MessageQueue />} />
                    <Route path="/communications/message-queue/:id" element={<MessageQueueItem />} />
                    <Route path="/messages" element={<MyMessages notification={notification} onHandleNotification={onHandleNotification} />} />
                    


                    <Route path="/communications/create-mail-template" element={<CreateMailTemplate />} />
                    <Route path="/communications/edit-mail-template/:id" element={<EditMailTemplate />} />
                    <Route path="/projects/create" element={<CreateProject />} />
                    <Route path="/projects/edit/:id" element={<EditProject />} />
                    <Route path="/projects" exact element={<ListProjects />} />
                    <Route path="/news" element={<ListNews />} />
                    <Route path="/gallery/create" element={<CreateGalleryItem />} />
                    <Route path="/gallery/edit/:id" element={<EditGalleyItem />} />
                    <Route path="/gallery" exact element={<Gallery />} />
                    <Route path="/slider/create" element={<CreateSlide />} />
                    <Route path="/slider/edit/:slideId" element={<EditSlide />} />
                    <Route path="/slider" exact element={<ListSlides />} />
                    <Route path="/categories" exact element={<ListCategories />} />
                    <Route path="/categories/create" element={<CreateCategory />} />
                    <Route path="/categories/edit/:id" element={<EditCategory />} />


                    <Route path="/testimonials/create" element={<CreateTestimonial />} />
                    <Route path="/testimonials/edit/:id" element={<EditTestimonial />} />
                    <Route path="/testimonials" exact element={<ListTestimonials />} />
                    <Route path="/team" element={<ListTeams />} />
                    <Route path="/partners/create" element={<CreatePartner />} />
                    <Route path="/partners/edit/:id" element={<EditPartner />} />
                    <Route path="/partners" exact element={<ListPartners />} />
                    <Route path="/counters" element={<ListCounters />} />
                    <Route path="/newsletter" element={<ListSubscriptions />} />
                    <Route path="/menus/create" element={<CreateMenu />} />
                    <Route path="/menus/edit/:id" element={<EditMenu />} />
                    <Route path="/menus/editItem/:id" element={<EditMenuItem />} />

                    <Route path="/menus" exact element={<ListMenus />} />

                    <Route path="/navigation-menus" exact element={<ListNavigationMenus />} />
                    <Route path="/navigation-menus/create" element={<CreateNavigationMenu />} />
                    <Route path="/navigation-menus/edit/:menuId" element={<EditNavigationMenu />} />



                    <Route path="/countries" exact element={<ListCountries />} />
                    <Route path="/countries/create" element={<CreateCountry />} />

                    <Route path="/product-categories/create" element={<CreateProductCategory />} />
                    <Route path="/product-categories/show" element={<ShowProductCategories />} />
                    
                    <Route path="/product-categories/edit/:categoryId" element={<EditProductCategory />} />
                    <Route path="/product-categories" exact element={<ListProductCategories />} />

                    <Route path="/products" exact element={<ListProducts />} />


                    <Route path="/products/bycompany/:companyIdParam" exact element={<ListProducts />} />
                    <Route path="/products/byCategory/:categoryIdParam" exact element={<ListProducts />} />
                    <Route path="/products/create" element={<CreateProduct />} />
                    <Route path="/products/edit/:productId" exact element={<EditProduct />} />

                   


                    <Route path="/clients" exact element={<ListClients />} />
                    <Route path="/clients/create" element={<CreateClient />} />
                    <Route path="/clients/edit/:userId" element={<EditClient />} />


                    <Route path="/users/roles/create" element={<CreateRole />} />
                    <Route path="/users/roles/edit/:roleId" element={<EditRole />} />
                    <Route path="/users/roles" exact element={<ListRoles />} />


                    <Route path="/companies" exact element={<ListCompanies />} />
                    <Route path="/companies/create" element={<CreateCompany />} />
                    <Route path="/companies/edit/:companyId" element={<EditCompany />} />
                    <Route path="/companies/categories/:companyId" element={<CompanyCategories />} />

                    <Route path="/users" exact element={<ListUsers />} />
                    <Route path="/users/bycompany/:companyId" exact element={<ListUsers />} />
                    <Route path="/users/create" element={<CreateUser />} />
                    <Route path="/users/edit/:userId" element={<EditUser />} />

                    
                    <Route path="/invoices" exact element={<ListInvoices />} />
                    <Route path="/invoices/create" element={<CreateInvoice />} />
                    <Route path="/invoices/ViewInvoice/:invoiceId" element={<ViewInvoice />} />
                    <Route path="/invoices/edit/:invoiceId" element={<EditInvoice />} />
                   

                    <Route path="/FullCalendar" exact element={<FullCalendarList />} />
                    <Route path="/FullCalendar/New" exact element={<FullCalendarNew />} />
                    <Route path="/FullCalendar/Edit" exact element={<FullCalendarEdit />} />
                    <Route path="/FullCalendar/Delete" exact element={<FullCalendarDelete />} />
                   

                    <Route path="/Contact" exact element={<ListContact/>} />
                    <Route path="/Contact/create" element={<CreateContact/>} />
                    <Route path="/Contact/view/:contactId" element={<ViewContact />} />
                    <Route path="/Contact/edit/:contactId" element={<EditContact/>} />

                    <Route path="/Package" exact element={<ListPackage/>} />
                    <Route path="/Package/create" element={<CreatePackage/>} />
                    <Route path="/Package/view/:packageId" element={<ViewPackage />} />
                    <Route path="/Package/edit/:packageId" element={<EditPackage/>} />



                    <Route path="/shippingCompanies" exact element={<ListShippingCompanies />} />
                    <Route path="/shippingCompanies/create" element={<CreateShippingCompany />} />
                    <Route path="/shippingCompanies/edit/:companyId" element={<EditShippingCompany />} />

                    <Route path="/shipments/:shipmentId" element={<ViewShipment />} />
                    <Route path="/shipments/edit/:shipmentId" element={<EditShipment />} />
                    <Route path="/shipments" exact element={<ListShipments />} />


                    <Route path="" exact element={<Summary notification={notification} onHandleNotification={onHandleNotification} />} />


                </Routes>


            </Suspense>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover

            />
        </main>
    </>
    )
}

export default MainContent
