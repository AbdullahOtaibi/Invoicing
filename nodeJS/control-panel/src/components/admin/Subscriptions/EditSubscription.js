import React, { useState, useEffect } from "react";
import { Link,useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from  'react-loader-spinner';
import {  MdClose, MdCollections, MdContacts, MdReceipt , MdDelete} from "react-icons/md";
import { CSSTransition } from 'react-transition-group';
import  {getSubscription, updateSubscription} from './SubscriptionsAPI'
import ContactSearchControl from "../Contact/ContactSearchControl";
import PackageSearchControl  from "../Package/PackageSearchControl" ; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { event } from "jquery";
import ConfirmButton from "react-confirmation-button";
import moment from "moment";
const EditSubscription = (props) => {

  const [wasValidated, setWasValidated] = useState(false);
  const [subscription , setSubscription] = useState( {  }) ;  
  const { subscriptionId } = useParams();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  
  useEffect( () => {
    setLoading(true) ;
    console.log("start") 
  console.log("subscriptionId:" +subscriptionId) ; 
  getSubscription(subscriptionId).then(
    (res) =>{ 
      setSubscription(res)
      console.log("subscription:" )
      console.log( JSON.stringify(res)) ;
    }
  ).catch((error) =>{ console.log(error)}) 
  setLoading(false) ; 
  } , []) ; 

  const [currentEditableItem, setCurrentEditableItem] = useState({
    installmentSequance: subscription.installments? subscription.installments.length +1 : 0,
    installmentAmount: 0,
    installmentDate:new Date(),
    installmentNote: ""
  });

  function numericFormat(val) {

    return !isNaN(val) ? val.toFixed(3) : val;
  }

  const removeItem = (id) => {
    console.log("removeItem id=" +id)
    let cloned = JSON.parse(JSON.stringify(subscription));
    cloned.installments = cloned.installments.filter((item) => item.installmentSequance != id);
     console.log(cloned.installments )
    for( let i= 0 ;  i < cloned.installments.length ; i++)
    {
    
      cloned.installments[i].installmentSequance = i+1;
    }

    setCurrentEditableItem({
      installmentSequance: cloned.installments.length +1 ,
      installmentAmount: 0,
      installmentNote: "",
      installmentDate: new Date() , 
    });

    setSubscription(cloned);
  };

  const addItem = (event) => {

    if (!checkItemIsValid()) {
      console.log("installment item is not valid...");
      return false;
    }

    let cloned = JSON.parse(JSON.stringify(subscription));
    console.log("before push installment ")
    console.log(subscription) ;
    cloned.installments.push(
    {...currentEditableItem}
    );

    for( let i= 0 ;  i < cloned.installments.length ; i++)
    {
          cloned.installments[i].installmentSequance = i+1;
    }

    console.log("AFTER push installment ")
    console.log(cloned) ;

    setCurrentEditableItem({
      installmentSequance: cloned.installments.length +1 ,
      installmentAmount: 0,
      installmentNote: "",
      installmentDate: new Date() , 
    });
    setSubscription(cloned);
    
    console.log("installment added to subscription") ;
    //updateSubscriptionCalculation();
  };


  const updateInstallmentAmount = (event) => {
    let cloned = JSON.parse(JSON.stringify(currentEditableItem));
    cloned.installmentAmount = event.target.value;
    setCurrentEditableItem(cloned);
  };
  

  const updateInstallmentNote = (event) => {
    let cloned = JSON.parse(JSON.stringify(currentEditableItem));
    cloned.installmentNote = event.target.value;
    setCurrentEditableItem(cloned);
  };

  const updateInstallmentDate = (date) => {
    let cloned = JSON.parse(JSON.stringify(currentEditableItem));
    console.log("updateInstallmentDate::" +date)
    cloned.installmentDate = date;
    setCurrentEditableItem(cloned);
    
  };


  function checkItemIsValid() {
    let itemIsValid = true;

    if (isBlank(currentEditableItem.installmentAmount)) {
      viewItemValidMessage("Fill the installment amount");
      itemIsValid = false;
    }

    if(! isBlank(currentEditableItem.installmentAmount) 
    && parseFloat(currentEditableItem.installmentAmount) > parseFloat(subscription.subscriptionReminingAmount)  )
     {
      viewItemValidMessage("The max installment amount equals " +subscription.subscriptionReminingAmount);
      itemIsValid = false;
     }
    return itemIsValid;
  }
  const setConatct = (item) => {
    if (item) {
      let cloned =JSON.parse(JSON.stringify(subscription)) ;
      cloned.contactName = item.contactName;
      cloned.contact = item._id;
      cloned.contactMobile = item.mobile; 
      setSubscription(cloned);
      
    }
  };

 

  const setPackage = (item) => {
    if (item) {
      let cloned =JSON.parse(JSON.stringify(subscription)) ;
      cloned.packageName = item.packageName;
      cloned.package = item._id;
      cloned.packagePrice = item.price; 
      cloned.packageNumberOfSet = item.numberOfSet; 
      if(!subscription.subscriptionAmount) 
      {
        cloned.subscriptionAmount =  item.price;
        let totalInstallments =cloned.totalInstallments|| 0 ;
        cloned.subscriptionReminingAmount = parseFloat(item.price) - totalInstallments ;

      } 
      
        setSubscription(cloned);
      
      
     
      
    }
  };

  
  
  const setPackageName = (event) => {

     let cloned =JSON.parse(JSON.stringify(subscription)) ;
     cloned.packageName = event.target.value; 
     setSubscription(cloned)

  } ;


  const setSubscriptionAmount = (event)=> {
    console.log( "setSubscriptionAmount " +event.target.value) ;
    // +  event.target.value
   
   let cloned =JSON.parse(JSON.stringify(subscription)) ;
     cloned.subscriptionAmount = parseFloat(event.target.value); 
     let totalInstallments =cloned.totalInstallments|| 0 ;
     cloned.subscriptionReminingAmount = parseFloat(cloned.subscriptionAmount)  - parseFloat( totalInstallments) ;
    setSubscription(cloned)

  }

  const setSubscriptionDate = (date) => {
    let cloned = JSON.parse(JSON.stringify(subscription));
    cloned.subscriptionDate = date;
    setSubscription(cloned);
  };


  const setNote = (event) => {
    let cloned =JSON.parse(JSON.stringify(subscription)) ;
    cloned.note = event.target.value; 
    setSubscription(cloned)
  };

  const fieldClass = (value, minQuantity) => {
    if (!wasValidated) return "form-control";
    //console.log("minQuantity:"+ minQuantity) ;
    if (isNaN(minQuantity))
      return value ? "form-control is-valid" : "form-control is-invalid";
    else
      return parseFloat(value) >= parseFloat(minQuantity)
        ? "form-control is-valid"
        : "form-control is-invalid";
  };

  const selectFieldClass = (value, minQuantity) => {
    if (!wasValidated) return "form-select";
    //console.log("minQuantity:"+ minQuantity) ;
    if (isNaN(minQuantity))
      return value ? "form-select is-valid" : "form-select is-invalid";
    else
      return parseFloat(value) >= parseFloat(minQuantity)
        ? "form-select is-valid"
        : "form-select is-invalid";
  };


  function isBlank(str) {
    return !str || /^\s*$/.test(str);
  }

  const doPost = (event) => {
    
    setWasValidated(true) ;
    setLoading(true) ;

    if(checkData()) {
      updateSubscription(subscription).then((res)=> {
        toast("success!") ;
         window.location.href = "/admin/Subscription/view/" + res._id;
  
      }).catch((err)=> { console.log(err)}) ;
    }
    setLoading(false) ; 
  }
 

function checkData() 
{
  console.log( "insert checkdata ...") 
  let isValid= true;

 if (isBlank(subscription.contactName)) 
 {
  viewItemValidMessage("Fill the contact name.") 
  isValid = false ; 
 }

 if ( isBlank(subscription.subscriptionAmount) ||  parseFloat(subscription.subscriptionAmount) <=0) 
 {
  viewItemValidMessage("Fill the subscription amount.") 
  isValid = false ; 
 }

 

  return isValid; 
};

const viewItemValidMessage = (message) => {
  toast.warning(message, {
    position: toast.POSITION.TOP_RIGHT,
  });
};

function updateSubscriptionCalculation()  {
  if(!subscription.installments) { return false }
  console.log("updateSubscriptionCalculation method ....")
  console.log("before fill subscription" ) ;
  console.log(subscription)
let subscriptionAmount = subscription.subscriptionAmount || 0 ;
let subscriptionTotalInvoice = subscription.subscriptionTotalInvoice || 0;
let totalInstallments=0;
let subscriptionReminingAmount = 0; 

for( let i= 0 ;  i < subscription.installments.length ; i++)
{

  totalInstallments += parseFloat(subscription.installments[i].installmentAmount )
}

let cloned = JSON.parse(JSON.stringify(subscription));
cloned.subscriptionTotalInstallments = totalInstallments;
cloned.subscriptionBalance = totalInstallments - parseFloat(subscriptionTotalInvoice);
cloned.subscriptionReminingAmount = parseFloat(subscriptionAmount) - totalInstallments 
setSubscription(cloned) ;
console.log("after fill subscription:" ) ;
console.log(subscription) ;
} 
useEffect( ()=>{updateSubscriptionCalculation()} , [currentEditableItem ]) ; 


  return (
    subscription.contactName ?  <>
   <div className="card">
     <div className="card-body">
       <h5 className="card-title"> <MdReceipt size= {20} />   {t("subscriptions.editSubscription")}</h5>
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
       <form className="needs-validation">
       

       <div className="mb-3 row ">
           <div className="col col-auto text-info">
             {t("subscriptions.contactInformation")}{" "}
           </div>
           <div className="col">
             <hr />
           </div>
         </div>

         <div className="mb-3 row">
             
             <div className="mb-3 col ">
                 <div className="col col-auto">{t("subscriptions.contactName") }</div>
                 <div className="col col-auto">
                 <ContactSearchControl
                 handleSelectContact={setConatct}
                 wasValidated={wasValidated}
                 value = {subscription.contactName}
                 contactType = {["Client" , "Vendor"]}

               />
                 </div>
               </div>
 
 
               <div className="mb-3 col ">
                 <div className="col col-auto">{t("subscriptions.contactMobile")}</div>
                 <div className="col col-auto">
       
                 <input
                     type="text"
                     className= {fieldClass(subscription.contactMobile)}
                     id="price"
                     name="price"
                     placeholder={t("subscriptions.contactMobile")}
                     value={
                       subscription.contactMobile
                     }
                   />
                 
 
                 </div>
               </div>
 
 
               <div className="mb-3 col ">
                 <div className="col col-auto"></div>
                 <div className="col col-auto">
              
                 </div>
               </div>
 
 

               
 
             </div>

            <div className="mb-3 row ">
           <div className="col col-auto text-info">
             {t("subscriptions.packageInformation")}{" "}
           </div>
           <div className="col">
             <hr />
           </div>
         </div>    
         <div className="mb-3 row">
             
         <div className="mb-3 col ">
             <div className="col col-auto">{t("subscriptions.packageName")}</div>
             <div className="col col-auto">
             <PackageSearchControl
                 handleSelectPackage={setPackage}
                
                 value = {subscription.packageName}
                
               />
             </div>
           </div>


         


           <div className="mb-3 col ">
             <div className="col col-auto">{t("subscriptions.packagePrice")}</div>
             <div className="col col-auto">
             <input
                 type="text"
                 className= "form-control"
                 id="price"
                 name="packagePrice"
                 placeholder={t("subscriptions.packagePrice")}
                 
                 value={
                   subscription.packagePrice
                 }
               />
             </div>
           </div>


           <div className="mb-3 col ">
             <div className="col col-auto">{t("subscriptions.packageNumberOfSet")}</div>
             <div className="col col-auto">
             <input
                 type="text"
                 className= "form-control"
                 id="packageNumberOfSet"
                 name="packageNumberOfSet"
                 placeholder={t("subscriptions.packageNumberOfSet")}
               
                 value={
                   subscription.packageNumberOfSet
                 }
               />
             </div>
           </div>

           

         </div>
           

         <div className="mb-3 row ">
           <div className="col col-auto text-info">
             {t("subscriptions.SubscriptionInformation")}{" "}
           </div>
           <div className="col">
             <hr />
           </div>
         </div>

         <div className="mb-3 row">
             
             <div className="mb-3 col ">
                 <div className="col col-auto">{t("subscriptions.subscriptionDate")}</div>
                 <div className="col">
               <DatePicker
                 className={fieldClass(subscription.subscriptionDate)}
                 dateFormat="dd/MM/yyyy"
                  selected= {subscription.subscriptionDate? new Date(subscription.subscriptionDate) : new Date()}
                  onChange={(date) => setSubscriptionDate(date)}
               />
             </div>
               </div>
 
 
             
 
 
               <div className="mb-3 col ">
                 <div className="col col-auto">{t("subscriptions.subscriptionAmount")}</div>
                 <div className="col col-auto">
                 <input
                     type="number"
                     className= {fieldClass(subscription.subscriptionAmount,0.01)}
                     id="subscriptionAmount"
                     name="subscriptionAmount"
                     placeholder={t("subscriptions.subscriptionAmount")}
                     onChange={setSubscriptionAmount}

                     value={
                       subscription.subscriptionAmount
                     }
                     min= {0}

                     
                   />
                 </div>
               </div>
 
 
 
               <div className="mb-3 col ">
 <div className="col col-auto">{t("subscriptions.note")}</div>
 <div className="col col-auto">
  
 <textarea
     className="form-control"
     id="note"
     name="note"
     onChange={setNote}
     placeholder={t("subscriptions.note")}
   >
     {subscription.note}
   </textarea>

 </div>
</div>
              
 
               
 
             </div>
       
             <div className="mb-3 row">

             <div className="mb-3 col ">
                 <div className="col col-auto">{t("subscriptions.subscriptionTotalInstallments")}</div>
                 <div className="col col-auto">
                    JOD {subscription.subscriptionTotalInstallments? subscription.subscriptionTotalInstallments.toFixed(2) : subscription.subscriptionTotalInstallments} 
                 </div>
               </div>
             
             

             <div className="mb-3 col ">
                 <div className="col col-auto">{t("subscriptions.subscriptionTotalInvoice")}</div>
                 <div className="col col-auto">
                    JOD {subscription.subscriptionTotalInvoice?subscription.subscriptionTotalInvoice.toFixed(2) : subscription.subscriptionTotalInvoice} 
                 </div>
               </div>

               <div className="mb-3 col ">
                 <div className="col col-auto">{t("subscriptions.subscriptionBalance")}</div>
                 <div className="col col-auto">
                    JOD {subscription.subscriptionBalance?subscription.subscriptionBalance.toFixed(2):subscription.subscriptionBalance} 
                 </div>
               </div>
 
             </div>

             <div className="mb-3 row">

<div className="mb-3 col ">
 <div className="col col-auto">{t("subscriptions.subscriptionReminingAmount")}</div>
 <div className="col col-auto">
    JOD {subscription.subscriptionReminingAmount} 
 </div>
</div>
</div>

             
         <div className="mb-3 row ">
           <div className="col col-auto text-info">
             {t("subscriptions.installments")}{" "}
           </div>
           <div className="col">
             <hr />
           </div>
         </div>    

         <div className="row">
           <div className="col table-responsive">
             <table className="table table-sm needs-validation " style={{minHeight: '400px'} }>
               <thead>
                 <tr className="table-light">
                   <th width="5%">#</th>
                
                   <th width="20%">{t("subscriptions.installmentAmount")} </th>
                   <th width="20%">{t("subscriptions.installmentDate")} </th>
                   <th width="35%">{t("subscriptions.installmentNote")}</th>
                  
                   <th width="20%"></th>
                 </tr>
               </thead>

               <tbody>
                 { subscription.installments? subscription.installments.map((item) => (
                   <tr>
                     <td> {item.installmentSequance} </td>
                     <td>{item.installmentAmount}</td>
                     { <td>{item.installmentDate ? moment(item.installmentDate).format("DD/MM/yyyy") : "Not Set"} </td> }
                   
                     <td>{item.installmentNote} </td>
 
                     <td>
                       <ConfirmButton
                         onConfirm={() => removeItem(item.installmentSequance)}
                         onCancel={() => console.log("cancel")}
                         buttonText={t("dashboard.delete")}
                         confirmText={t("subscriptions.confirm")}
                         cancelText={t("subscriptions.cancel")}
                         loadingText={t("subscriptions.deleteingItem")}
                         wrapClass=""
                         buttonClass="btn d-print-none"
                         mainClass="btn-danger"
                         confirmClass="btn-warning"
                         cancelClass=" btn-success"
                         loadingClass="visually-hidden"
                         disabledClass=""
                         once
                       >
                         {"Delete "}
                         <MdDelete/>
                       </ConfirmButton>
                     </td>
                   </tr>
                 )) : ""}

                 <tr className="d-print-none">
                   <td>{subscription.installments? subscription.installments.length + 1 : 1}</td>
                   <td>
                     <input
                       type="number"
                       className={fieldClass(currentEditableItem.installmentAmount)}
                       value={currentEditableItem.installmentAmount}
                       onChange={updateInstallmentAmount}
                       min={0}
                     
                     />
                   </td>
                   <td>
                      <DatePicker className="form-control"  dateFormat="dd/MM/yyyy" selected = { currentEditableItem.installmentDate? new Date(currentEditableItem.installmentDate) : new Date() } 
                      onChange={(date)=> updateInstallmentDate(date)}
                      />
                   </td>
                   <td>
                 <textarea className="form-control"  value={currentEditableItem.installmentNote}
                 onChange={updateInstallmentNote}
                 ></textarea>
                   </td>

     
                   <td>
                     <button
                       type="button"
                       className="btn  btn-success d-print-none "
                       onClick={addItem}
                     >
                       {t("subscriptions.add")}
                     </button>
                   </td>
                 </tr>
               </tbody>
               <tfoot></tfoot>
             </table>
           </div>
         </div>

       




         <div class="row text-right">
           <div className="mb-3  col justify-content-end">
             <Link className="btn btn-secondary btn-lg" to="/admin/Package">
               <MdClose size={20} /> &nbsp; {t("Cancel")}
             </Link>{" "}
             &nbsp;
             <button
               type="button"
               className="btn btn-primary btn-lg"
               onClick={doPost}
             >
               {t("dashboard.submit")}
             </button>
           </div>
         </div>
       </form>
     </div>
   </div>
 </> : "Data Not Found"
  );
  
                  
};

export default EditSubscription;
