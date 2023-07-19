import React, { useState, useEffect } from "react";
import { Link,useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from  'react-loader-spinner';
import {  MdClose, MdCollections, MdContacts, MdReceipt , MdDelete} from "react-icons/md";
import { CSSTransition } from 'react-transition-group';
import  {getReceipt, updateReceipt} from './ReceiptAPI'
import ContactSearchControl from "../Contact/ContactSearchControl";
import PackageSearchControl  from "../Package/PackageSearchControl" ; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { event } from "jquery";
import ConfirmButton from "react-confirmation-button";
import moment from "moment";
const EditReceipt = (props) => {

  const [wasValidated, setWasValidated] = useState(false);
  const [receipt , setReceipt] = useState( {  }) ;  
  const { receiptId } = useParams();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  
  useEffect( () => {
    setLoading(true) ;
    console.log("start") 
  console.log("receiptId:" +receiptId) ; 
  getReceipt(receiptId).then(
    (res) =>{ 
      setReceipt(res)
      console.log("receipt:" )
      console.log( JSON.stringify(res)) ;
    }
  ).catch((error) =>{ console.log(error)}) 
  setLoading(false) ; 
  } , []) ; 

  const [currentEditableItem, setCurrentEditableItem] = useState({
    installmentSequance: receipt.installments? receipt.installments.length +1 : 0,
    installmentAmount: 0,
    installmentDate:new Date(),
    installmentNote: ""
  });

  function numericFormat(val) {

    return !isNaN(val) ? val.toFixed(3) : val;
  }

  const removeItem = (id) => {
    console.log("removeItem id=" +id)
    let cloned = JSON.parse(JSON.stringify(receipt));
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

    setReceipt(cloned);
  };

  const addItem = (event) => {

    if (!checkItemIsValid()) {
      console.log("installment item is not valid...");
      return false;
    }

    let cloned = JSON.parse(JSON.stringify(receipt));
    console.log("before push installment ")
    console.log(receipt) ;
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
    setReceipt(cloned);
    
    console.log("installment added to receipt") ;
    //updateReceiptCalculation();
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
    && parseFloat(currentEditableItem.installmentAmount) > parseFloat(receipt.receiptReminingAmount)  )
     {
      viewItemValidMessage("The max installment amount equals " +receipt.receiptReminingAmount);
      itemIsValid = false;
     }
    return itemIsValid;
  }
  const setConatct = (item) => {
    if (item) {
      let cloned =JSON.parse(JSON.stringify(receipt)) ;
      cloned.contactName = item.contactName;
      cloned.contact = item._id;
      cloned.contactMobile = item.mobile; 
      setReceipt(cloned);
      
    }
  };

 

  const setPackage = (item) => {
    if (item) {
      let cloned =JSON.parse(JSON.stringify(receipt)) ;
      cloned.packageName = item.packageName;
      cloned.package = item._id;
      cloned.packagePrice = item.price; 
      cloned.packageNumberOfSet = item.numberOfSet; 
      if(!receipt.receiptAmount) 
      {
        cloned.receiptAmount =  item.price;
        let totalInstallments =cloned.totalInstallments|| 0 ;
        cloned.receiptReminingAmount = parseFloat(item.price) - totalInstallments ;

      } 
      
        setReceipt(cloned);
      
      
     
      
    }
  };

  
  
  const setPackageName = (event) => {

     let cloned =JSON.parse(JSON.stringify(receipt)) ;
     cloned.packageName = event.target.value; 
     setReceipt(cloned)

  } ;


  const setReceiptAmount = (event)=> {
    console.log( "setReceiptAmount " +event.target.value) ;
    // +  event.target.value
   
   let cloned =JSON.parse(JSON.stringify(receipt)) ;
     cloned.receiptAmount = parseFloat(event.target.value); 
     let totalInstallments =cloned.totalInstallments|| 0 ;
     cloned.receiptReminingAmount = parseFloat(cloned.receiptAmount)  - parseFloat( totalInstallments) ;
    setReceipt(cloned)

  }

  const setReceiptDate = (date) => {
    let cloned = JSON.parse(JSON.stringify(receipt));
    cloned.receiptDate = date;
    setReceipt(cloned);
  };


  const setNote = (event) => {
    let cloned =JSON.parse(JSON.stringify(receipt)) ;
    cloned.note = event.target.value; 
    setReceipt(cloned)
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
      updateReceipt(receipt).then((res)=> {
        toast("success!") ;
         window.location.href = "/admin/Receipt/view/" + res._id;
  
      }).catch((err)=> { console.log(err)}) ;
    }
    setLoading(false) ; 
  }
 

function checkData() 
{
  console.log( "insert checkdata ...") 
  let isValid= true;

 if (isBlank(receipt.contactName)) 
 {
  viewItemValidMessage("Fill the contact name.") 
  isValid = false ; 
 }

 if ( isBlank(receipt.receiptAmount) ||  parseFloat(receipt.receiptAmount) <=0) 
 {
  viewItemValidMessage("Fill the receipt amount.") 
  isValid = false ; 
 }

 

  return isValid; 
};

const viewItemValidMessage = (message) => {
  toast.warning(message, {
    position: toast.POSITION.TOP_RIGHT,
  });
};

function updateReceiptCalculation()  {
  if(!receipt.installments) { return false }
  console.log("updateReceiptCalculation method ....")
  console.log("before fill receipt" ) ;
  console.log(receipt)
let receiptAmount = receipt.receiptAmount || 0 ;
let receiptTotalInvoice = receipt.receiptTotalInvoice || 0;
let totalInstallments=0;
let receiptReminingAmount = 0; 

for( let i= 0 ;  i < receipt.installments.length ; i++)
{

  totalInstallments += parseFloat(receipt.installments[i].installmentAmount )
}

let cloned = JSON.parse(JSON.stringify(receipt));
cloned.receiptTotalInstallments = totalInstallments;
cloned.receiptBalance = totalInstallments - parseFloat(receiptTotalInvoice);
cloned.receiptReminingAmount = parseFloat(receiptAmount) - totalInstallments 
setReceipt(cloned) ;
console.log("after fill receipt:" ) ;
console.log(receipt) ;
} 
useEffect( ()=>{updateReceiptCalculation()} , [currentEditableItem ]) ; 


  return (
    receipt.contactName ?  <>
   <div className="card">
     <div className="card-body">
       <h5 className="card-title"> <MdReceipt size= {20} />   {t("receipt.editReceipt")}</h5>
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
             {t("receipt.contactInformation")}{" "}
           </div>
           <div className="col">
             <hr />
           </div>
         </div>

         <div className="mb-3 row">
             
             <div className="mb-3 col ">
                 <div className="col col-auto">{t("receipt.contactName") }</div>
                 <div className="col col-auto">
                 <ContactSearchControl
                 handleSelectContact={setConatct}
                 wasValidated={wasValidated}
                 value = {receipt.contactName}
                 contactType = {["Client" , "Vendor"]}

               />
                 </div>
               </div>
 
 
               <div className="mb-3 col ">
                 <div className="col col-auto">{t("receipt.contactMobile")}</div>
                 <div className="col col-auto">
       
                 <input
                     type="text"
                     className= {fieldClass(receipt.contactMobile)}
                     id="price"
                     name="price"
                     placeholder={t("receipt.contactMobile")}
                     value={
                       receipt.contactMobile
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
             {t("receipt.packageInformation")}{" "}
           </div>
           <div className="col">
             <hr />
           </div>
         </div>    
         <div className="mb-3 row">
             
         <div className="mb-3 col ">
             <div className="col col-auto">{t("receipt.packageName")}</div>
             <div className="col col-auto">
             <PackageSearchControl
                 handleSelectPackage={setPackage}
                
                 value = {receipt.packageName}
                
               />
             </div>
           </div>


         


           <div className="mb-3 col ">
             <div className="col col-auto">{t("receipt.packagePrice")}</div>
             <div className="col col-auto">
             <input
                 type="text"
                 className= "form-control"
                 id="price"
                 name="packagePrice"
                 placeholder={t("receipt.packagePrice")}
                 
                 value={
                   receipt.packagePrice
                 }
               />
             </div>
           </div>


           <div className="mb-3 col ">
             <div className="col col-auto">{t("receipt.packageNumberOfSet")}</div>
             <div className="col col-auto">
             <input
                 type="text"
                 className= "form-control"
                 id="packageNumberOfSet"
                 name="packageNumberOfSet"
                 placeholder={t("receipt.packageNumberOfSet")}
               
                 value={
                   receipt.packageNumberOfSet
                 }
               />
             </div>
           </div>

           

         </div>
           

         <div className="mb-3 row ">
           <div className="col col-auto text-info">
             {t("receipt.ReceiptInformation")}{" "}
           </div>
           <div className="col">
             <hr />
           </div>
         </div>

         <div className="mb-3 row">
             
             <div className="mb-3 col ">
                 <div className="col col-auto">{t("receipt.receiptDate")}</div>
                 <div className="col">
               <DatePicker
                 className={fieldClass(receipt.receiptDate)}
                 dateFormat="dd/MM/yyyy"
                  selected= {receipt.receiptDate? new Date(receipt.receiptDate) : new Date()}
                  onChange={(date) => setReceiptDate(date)}
               />
             </div>
               </div>
 
 
             
 
 
               <div className="mb-3 col ">
                 <div className="col col-auto">{t("receipt.receiptAmount")}</div>
                 <div className="col col-auto">
                 <input
                     type="number"
                     className= {fieldClass(receipt.receiptAmount,0.01)}
                     id="receiptAmount"
                     name="receiptAmount"
                     placeholder={t("receipt.receiptAmount")}
                     onChange={setReceiptAmount}

                     value={
                       receipt.receiptAmount
                     }
                     min= {0}

                     
                   />
                 </div>
               </div>
 
 
 
               <div className="mb-3 col ">
 <div className="col col-auto">{t("receipt.note")}</div>
 <div className="col col-auto">
  
 <textarea
     className="form-control"
     id="note"
     name="note"
     onChange={setNote}
     placeholder={t("receipt.note")}
   >
     {receipt.note}
   </textarea>

 </div>
</div>
              
 
               
 
             </div>
       
             <div className="mb-3 row">

             <div className="mb-3 col ">
                 <div className="col col-auto">{t("receipt.receiptTotalInstallments")}</div>
                 <div className="col col-auto">
                    JOD {receipt.receiptTotalInstallments? receipt.receiptTotalInstallments.toFixed(2) : receipt.receiptTotalInstallments} 
                 </div>
               </div>
             
             

             <div className="mb-3 col ">
                 <div className="col col-auto">{t("receipt.receiptTotalInvoice")}</div>
                 <div className="col col-auto">
                    JOD {receipt.receiptTotalInvoice?receipt.receiptTotalInvoice.toFixed(2) : receipt.receiptTotalInvoice} 
                 </div>
               </div>

               <div className="mb-3 col ">
                 <div className="col col-auto">{t("receipt.receiptBalance")}</div>
                 <div className="col col-auto">
                    JOD {receipt.receiptBalance?receipt.receiptBalance.toFixed(2):receipt.receiptBalance} 
                 </div>
               </div>
 
             </div>

             <div className="mb-3 row">

<div className="mb-3 col ">
 <div className="col col-auto">{t("receipt.receiptReminingAmount")}</div>
 <div className="col col-auto">
    JOD {receipt.receiptReminingAmount} 
 </div>
</div>
</div>

             
         <div className="mb-3 row ">
           <div className="col col-auto text-info">
             {t("receipt.installments")}{" "}
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
                
                   <th width="20%">{t("receipt.installmentAmount")} </th>
                   <th width="20%">{t("receipt.installmentDate")} </th>
                   <th width="35%">{t("receipt.installmentNote")}</th>
                  
                   <th width="20%"></th>
                 </tr>
               </thead>

               <tbody>
                 { receipt.installments? receipt.installments.map((item) => (
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
                         confirmText={t("receipt.confirm")}
                         cancelText={t("receipt.cancel")}
                         loadingText={t("receipt.deleteingItem")}
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
                   <td>{receipt.installments? receipt.installments.length + 1 : 1}</td>
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
                       {t("receipt.add")}
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

export default EditReceipt;
