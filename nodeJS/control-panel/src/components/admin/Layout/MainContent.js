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


const ListCategories = lazy(() => import(/* webpackChunkName: "ListCategories" */'../Categories/ListCategories'))
const ListCounters = lazy(() => import(/* webpackChunkName: "ListCounters" */'../Counters/ListCounters'))
const ListPages = lazy(() => import(/* webpackChunkName: "ListPages" */'../Pages/ListPages'))
const ListSettings = lazy(() => import(/* webpackChunkName: "ListSettings" */'../Settings/ListSettings'))
const ListMenus = lazy(() => import(/* webpackChunkName: "ListMenus" */'../Menus/ListMenus'))
const CreateMenu = lazy(() => import(/* webpackChunkName: "CreateMenu" */'../Menus/CreateMenu'))
const EditMenu = lazy(() => import(/* webpackChunkName: "EditMenu" */'../Menus/EditMenu'))
const CreateCategory = lazy(() => import(/* webpackChunkName: "CreateCategory" */'../Categories/CreateCategory'))
const EditCategory = lazy(() => import(/* webpackChunkName: "EditCategory" */'../Categories/EditCategory'))

const EditMenuItem = lazy(() => import(/* webpackChunkName: "EditMenuItem" */'../Menus/EditMenuItem'))




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




const ListNavigationMenus = lazy(() => import(/* webpackChunkName: "ListNavigationMenus" */'../NavigationMenus/ListNavigationMenus'))
const CreateNavigationMenu = lazy(() => import(/* webpackChunkName: "CreateNavigationMenu" */'../NavigationMenus/CreateNavigationMenu'))
const EditNavigationMenu = lazy(() => import(/* webpackChunkName: "EditNavigationMenu" */'../NavigationMenus/EditNavigationMenu'))

const ListMailTemplates = lazy(() => import(/* webpackChunkName: "ListMailTemplates" */'../Communications/ListMailTemplates'))
const CreateMailTemplate = lazy(() => import(/* webpackChunkName: "CreateMailTemplate" */'../Communications/CreateMailTemplate'))
const EditMailTemplate = lazy(() => import(/* webpackChunkName: "EditMailTemplate" */'../Communications/EditMailTemplate'))
const MessageQueue = lazy(() => import(/* webpackChunkName: "MessageQueue" */'../Communications/MessageQueue'))
const MessageQueueItem = lazy(() => import(/* webpackChunkName: "MessageQueueItem" */'../Communications/MessageQueueItem'))
const MyMessages = lazy(() => import(/* webpackChunkName: "MyMessages" */'../Communications/MyMessages'))

const ReportsList = lazy(() => import(/* webpackChunkName: "MyMessages" */'../reports/ReportsList'))
const IncomeReport = lazy(() => import(/* webpackChunkName: "MyMessages" */'../reports/IncomeReport'))
const ExpansesReport = lazy(() => import(/* webpackChunkName: "MyMessages" */'../reports/ExpansesReport'))
const ContractReport = lazy(() => import(/* webpackChunkName: "MyMessages" */'../reports/ContractReport'))

const InvoiceReport = lazy(() => import(/* webpackChunkName: "MyMessages" */'../reports/InvoiceReport'))

const ListTranslations = lazy(() => import(/* webpackChunkName: "ListTranslations" */'../Translations/ListTranslations'))
const EditTranslation = lazy(() => import(/* webpackChunkName: "EditTranslation" */'../Translations/EditTranslation'))


const ListInvoices = lazy(() => import(/* webpackChunkName: "ListInvoices" */'../Invoices/ListInvoices'))
const CreateInvoice = lazy(() => import(/* webpackChunkName: "CreateInvoice" */'../Invoices/CreateInvoice'))
const EditInvoice = lazy(() => import(/* webpackChunkName: "EditInvoice" */'../Invoices/EditInvoice'))
const ViewInvoice = lazy(() => import(/* webpackChunkName: "ViewInvoice" */'../Invoices/ViewInvoice'))
const PdfInvoice = lazy(() => import(/* webpackChunkName: "PdfInvoice" */'../Invoices/PdfInvoice'))


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


const ListReceipt = lazy(() => import(/* webpackChunkName: "ListReceipt" */'../Receipt/ListReceipt'))
const CreateReceipt = lazy(() => import(/* webpackChunkName: "CreateReceipt" */'../Receipt/CreateReceipt'))
const EditReceipt = lazy(() => import(/* webpackChunkName: "EditReceipt" */'../Receipt/EditReceipt'))
const ViewReceipt = lazy(() => import(/* webpackChunkName: "ViewReceipt" */'../Receipt/ViewReceipt'))

const ListContract = lazy(() => import(/* webpackChunkName: "ListContract" */'../Contracts/ListContracts'))
const CreateContract = lazy(() => import(/* webpackChunkName: "CreateContract" */'../Contracts/CreateContract'))
const EditContract = lazy(() => import(/* webpackChunkName: "EditContract" */'../Contracts/EditContract'))
const ViewContract = lazy(() => import(/* webpackChunkName: "ViewContract" */'../Contracts/ViewContract'))


const ListExpenses = lazy(() => import(/* webpackChunkName: "ListExpenses" */'../Expenses/ListExpenses'))
const CreateExpenses = lazy(() => import(/* webpackChunkName: "CreateExpenses" */'../Expenses/CreateExpenses'))
const EditExpenses = lazy(() => import(/* webpackChunkName: "EditExpenses" */'../Expenses/EditExpenses'))
const ViewExpenses = lazy(() => import(/* webpackChunkName: "ViewExpenses" */'../Expenses/ViewExpenses'))



const ListExpensesCategory = lazy(() => import(/* webpackChunkName: "ListExpensesCategory" */'../ExpensesCategory/ListExpensesCategory'))
const CreateExpensesCategory = lazy(() => import(/* webpackChunkName: "CreateExpensesCategory" */'../ExpensesCategory/CreateExpensesCategory'))
const EditExpensesCategory = lazy(() => import(/* webpackChunkName: "EditExpensesCategory" */'../ExpensesCategory/EditExpensesCategory'))
const ViewExpensesCategory = lazy(() => import(/* webpackChunkName: "ViewExpensesCategory" */'../ExpensesCategory/ViewExpensesCategory'))





const SignIn = lazy(() => import(/* webpackChunkName: "SignIn" */'../../SignIn/SignIn'));
const ForgotPassword = lazy(() => import(/* webpackChunkName: "ForgotPassword" */'../../SignIn/ForgotPassword'));
const ResetPassword = lazy(() => import(/* webpackChunkName: "ResetPassword" */'../../SignIn/ResetPassword'));


const MainContent = ({notification, onHandleNotification}) => {
    return (<>
        <Helmet>
            <title>{'Invoicing | Admin | '} </title>
            <meta name="robots" content="noindex" />
        </Helmet>
        <main className="content-area" style={{paddingBottom:'90px'}} >
            <Suspense fallback={<div>Loading ...</div>} >
                <Routes>

                
                <Route path="/modules" exact element={<ListModules />}  />
                <Route path="/modules/create" element={<CreateModule />} />
                

                    <Route path="/sign-in" exact element={<SignIn />} />
                    <Route path="/forgot-password" exact element={<ForgotPassword />} />
                    <Route path="/reset-password/:token"  element={<ResetPassword />} />
                    
                  
                    <Route path="/translations" exact element={<ListTranslations />} />

                    <Route path="/translations/edit/:id" exact element={<EditTranslation />} />
                    


          


                    <Route path="/pages" element={<ListPages />} />
                    <Route path="/settings" element={<ListSettings />} />
                    <Route path="/communications" element={<ListMailTemplates />} />
                    <Route path="/communications/message-queue" exact element={<MessageQueue />} />
                    <Route path="/communications/message-queue/:id" element={<MessageQueueItem />} />
                    <Route path="/messages" element={<MyMessages notification={notification} onHandleNotification={onHandleNotification} />} />
                    


                    <Route path="/communications/create-mail-template" element={<CreateMailTemplate />} />
                    <Route path="/communications/edit-mail-template/:id" element={<EditMailTemplate />} />


                    <Route path="/categories" exact element={<ListCategories />} />
                    <Route path="/categories/create" element={<CreateCategory />} />
                    <Route path="/categories/edit/:id" element={<EditCategory />} />



                    <Route path="/counters" element={<ListCounters />} />
                   
                    <Route path="/menus/create" element={<CreateMenu />} />
                    <Route path="/menus/edit/:id" element={<EditMenu />} />
                    <Route path="/menus/editItem/:id" element={<EditMenuItem />} />

                    <Route path="/menus" exact element={<ListMenus />} />

                    <Route path="/navigation-menus" exact element={<ListNavigationMenus />} />
                    <Route path="/navigation-menus/create" element={<CreateNavigationMenu />} />
                    <Route path="/navigation-menus/edit/:menuId" element={<EditNavigationMenu />} />



                    <Route path="/countries" exact element={<ListCountries />} />
                    <Route path="/countries/create" element={<CreateCountry />} />


                    




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
                    
                    <Route path="/reports" exact element={<ReportsList/>} />
                    <Route path="/reports/incomereport" exact element={<IncomeReport/>} />
                    <Route path="/reports/ExpansesReport" exact element={<ExpansesReport/>} />
                    <Route path="/reports/InvoiceReport" exact element={<InvoiceReport/>} />
                    <Route path="/reports/ContractReport" exact element={<ContractReport/>} />


                    <Route path="/users" exact element={<ListUsers />} />
                    <Route path="/users/bycompany/:companyId" exact element={<ListUsers />} />
                    <Route path="/users/create" element={<CreateUser />} />
                    <Route path="/users/edit/:userId" element={<EditUser />} />

                    
                    <Route path="/invoices" exact element={<ListInvoices />} />
                    <Route path="/invoices/create" element={<CreateInvoice />} />
                    <Route path="/invoices/ViewInvoice/:invoiceId" element={<ViewInvoice />} />
                    <Route path="/invoices/PdfInvoice/:invoiceId" element={<PdfInvoice />} />
                    <Route path="/invoices/edit/:invoiceId" element={<EditInvoice />} />
                    <Route path="/invoices/createForContract/:contractId" element={<CreateInvoice />} />
                   

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

                    <Route path="/Receipt" exact element={<ListReceipt/>} />
                    <Route path="/Receipt/create" element={<CreateReceipt/>} />
                    <Route path="/Receipt/view/:receiptId" element={<ViewReceipt />} />
                    <Route path="/Receipt/edit/:receiptId" element={<EditReceipt/>} />

                    <Route path="/Contract" exact element={<ListContract/>} />
                    <Route path="/Contract/create" element={<CreateContract/>} />
                    <Route path="/Contract/view/:contractId" element={<ViewContract />} />
                    <Route path="/Contract/edit/:contractId" element={<EditContract/>} />

                    <Route path="/expenses" exact element={<ListExpenses/>} />
                    <Route path="/expenses/create" element={<CreateExpenses/>} />
                    <Route path="/expenses/view/:expenseId" element={<ViewExpenses />} />
                    <Route path="/expenses/edit/:expenseId" element={<EditExpenses/>} />


                    <Route path="/expenseCategories" exact element={<ListExpensesCategory/>} />
                    <Route path="/expenseCategories/create" element={<CreateExpensesCategory/>} />
                    <Route path="/expenseCategories/view/:expenseCategoryId" element={<ViewExpensesCategory />} />
                    <Route path="/expenseCategories/edit/:expenseCategoryId" element={<EditExpensesCategory/>} />




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
