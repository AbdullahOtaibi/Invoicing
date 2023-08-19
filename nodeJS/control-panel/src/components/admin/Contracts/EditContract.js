import React, { useState, useEffect } from "react";
import { Link,useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from  'react-loader-spinner';
import {  MdClose, MdCollections, MdContacts, MdReceipt , MdDelete} from "react-icons/md";
import { CSSTransition } from 'react-transition-group';
import  {getContract, updateContract} from './ContractsAPI'
import ContactSearchControl from "../Contact/ContactSearchControl";
import PackageSearchControl  from "../Package/PackageSearchControl" ; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { event } from "jquery";
import ConfirmButton from "react-confirmation-button";
import moment from "moment";
const EditContract = (props) => {

  const [wasValidated, setWasValidated] = useState(false);
  const [contract , setContract] = useState( {  }) ;  
  const { contractId } = useParams();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  
  useEffect( () => {
    setLoading(true) ;
    console.log("start") 
  console.log("contractId:" +contractId) ; 
  getContract(contractId).then(
    (res) =>{ 
      res.contactName = res.contact.contactName;
      res.contactMobile = res.contact.mobile; 
      res.packageName = res.package.packageName;
      setContract(res);

      console.log("contract:" )
      console.log( JSON.stringify(res)) ;
    }
  ).catch((error) =>{ console.log(error)}) 
  setLoading(false) ; 
  } , []) ; 

  const [currentEditableItem, setCurrentEditableItem] = useState({
    receiptSequance: contract.installments? contract.installments.length +1 : 0,
    receiptAmount: 0,
    receiptDate:new Date(),
    receiptNote: ""
  });

  function numericFormat(val) {

    return !isNaN(val) ? val.toFixed(3) : val;
  }

  const removeItem = (id) => {
    console.log("removeItem id=" +id)
    let cloned = JSON.parse(JSON.stringify(contract));
    cloned.receipts = cloned.receipts.filter((item) => item.receiptSequance != id);
     console.log(cloned.receipts )
    for( let i= 0 ;  i < cloned.receipts.length ; i++)
    {
    
      cloned.receipts[i].receiptSequance = i+1;
    }

    setCurrentEditableItem({
      receiptSequance: cloned.receipts.length +1 ,
      receiptAmount: 0,
      receiptNote: "",
      receiptDate: new Date() , 
    });

    setContract(cloned);
  };

  const addItem = (event) => {

    if (!checkItemIsValid()) {
      console.log("receipt item is not valid...");
      return false;
    }

    let cloned = JSON.parse(JSON.stringify(contract));
    console.log("before push receipt ")
    console.log(contract) ;
    cloned.receipts.push(
    {...currentEditableItem}
    );

    for( let i= 0 ;  i < cloned.receipts.length ; i++)
    {
          cloned.receipts[i].receiptSequance = i+1;
    }

    console.log("AFTER push receipt ")
    console.log(cloned) ;

    setCurrentEditableItem({
      receiptSequance: cloned.receipts.length +1 ,
      receiptAmount: 0,
      receiptNote: "",
      receiptDate: new Date() , 
    });
    setContract(cloned);
    
    console.log("receipt added to contract") ;
    //updateContractCalculation();
  };


  const updatereceiptAmount = (event) => {
    let cloned = JSON.parse(JSON.stringify(currentEditableItem));
    cloned.receiptAmount = event.target.value;
    setCurrentEditableItem(cloned);
  };
  

  const updatereceiptNote = (event) => {
    let cloned = JSON.parse(JSON.stringify(currentEditableItem));
    cloned.receiptNote = event.target.value;
    setCurrentEditableItem(cloned);
  };

  const updatereceiptDate = (date) => {
    let cloned = JSON.parse(JSON.stringify(currentEditableItem));
    console.log("updatereceiptDate::" +date)
    cloned.receiptDate = date;
    setCurrentEditableItem(cloned);
    
  };


  function checkItemIsValid() {
    let itemIsValid = true;

    if (isBlank(currentEditableItem.receiptAmount)) {
      viewItemValidMessage("Fill the receipt amount");
      itemIsValid = false;
    }

    if(! isBlank(currentEditableItem.receiptAmount) 
    && parseFloat(currentEditableItem.receiptAmount) > parseFloat(contract.contractReminingAmount)  )
     {
      viewItemValidMessage("The max receipt amount equals " +contract.contractReminingAmount);
      itemIsValid = false;
     }
    return itemIsValid;
  }
  const setConatct = (item) => {
    if (item) {
      let cloned =JSON.parse(JSON.stringify(contract)) ;
      cloned.contactName = item.contactName;
      cloned.contact = item._id;
      cloned.contactMobile = item.mobile; 
      setContract(cloned);
      
    }
  };

 

  const setPackage = (item) => {
    if (item) {
      let cloned =JSON.parse(JSON.stringify(contract)) ;
      cloned.packageName = item.packageName;
      cloned.package = item._id;
      cloned.packagePrice = item.price; 
      cloned.packageNumberOfSet = item.numberOfSet; 
      if(!contract.contractAmount) 
      {
        cloned.contractAmount =  item.price;
        let contractTotalReceipts =cloned.contractTotalReceipts|| 0 ;
        cloned.contractReminingAmount = parseFloat(item.price) - contractTotalReceipts ;

      } 
        setContract(cloned);
    }
  };

  
  
  const setPackageName = (event) => {

     let cloned =JSON.parse(JSON.stringify(contract)) ;
     cloned.packageName = event.target.value; 
     setContract(cloned)

  } ;


  const setContractAmount = (event)=> {
    console.log( "setContractAmount " +event.target.value) ;
    // +  event.target.value
   
   let cloned =JSON.parse(JSON.stringify(contract)) ;
     cloned.contractAmount = parseFloat(event.target.value); 
     let contractTotalReceipts =cloned.contractTotalReceipts|| 0 ;
     cloned.contractReminingAmount = parseFloat(cloned.contractAmount)  - parseFloat( contractTotalReceipts) ;
    setContract(cloned)

  }

  const setContractDate = (date) => {
    let cloned = JSON.parse(JSON.stringify(contract));
    cloned.contractDate = date;
    setContract(cloned);
  };


  const setNote = (event) => {
    let cloned =JSON.parse(JSON.stringify(contract)) ;
    cloned.note = event.target.value; 
    setContract(cloned)
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
     updateContract(contract).then((res)=> {
        toast("success!") ;
         window.location.href = "/admin/Contract/view/" + res._id;
  
      }).catch((err)=> { console.log(err)}) ;
    }
    setLoading(false) ; 
  }
 

function checkData() 
{
  console.log( "insert checkdata ...") 
  let isValid= true;

 if (isBlank(contract.contactName)) 
 {
  viewItemValidMessage("Fill the contact name.") 
  isValid = false ; 
 }

 if ( isBlank(contract.contractAmount) ||  parseFloat(contract.contractAmount) <=0) 
 {
  viewItemValidMessage("Fill the contract amount.") 
  isValid = false ; 
 }

 

  return isValid; 
};

const viewItemValidMessage = (message) => {
  toast.warning(message, {
    position: toast.POSITION.TOP_RIGHT,
  });
};

function updateContractCalculation()  { 
  if(!contract.receipts) return false ;
  
  console.log("updateContractCalculation method ....")
  console.log("before fill contract" ) ;
  console.log(contract)
let contractAmount = contract.contractAmount || 0 ;
let contractTotalInvoiced = contract.contractTotalInvoiced || 0;
let contractTotalReceipts=0;
let contractReminingAmount = 0; 
let cloned = JSON.parse(JSON.stringify(contract));

console.log("contract.receipts.length=" + contract.receipts.length )
for( let i= 0 ;  i < contract.receipts.length ; i++)
{
  console.log("(contract.receipts[i].receiptAmount:" +(contract.receipts[i].receiptAmount)) ;
  contractTotalReceipts += parseFloat(contract.receipts[i].receiptAmount )
}

console.log("contractTotalReceipts:" +contractTotalReceipts)
cloned.contractTotalReceipts = contractTotalReceipts;
cloned.contractBalance = contractTotalReceipts - parseFloat(contractTotalInvoiced);
cloned.contractReminingAmount = parseFloat(contractAmount) - contractTotalReceipts 

setContract(cloned) ;
console.log("after fill contract:" ) ;
console.log(contract) ;
} 

useEffect( ()=>{  updateContractCalculation()} , [currentEditableItem ]) ; 

  return ( contract && contract.contractTotalReceipts && contract.receipts ?
    <>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title"> <MdReceipt size= {20} />   {t("contracts.editContract")} <span className='text-info'>({contract.seqNumber})</span></h5>
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
                {t("contracts.contactInformation")}{" "}
              </div>
              <div className="col">
                <hr />
              </div>
            </div>

            <div className="mb-3 row">
                
                <div className="mb-3 col ">
                    <div className="col col-auto">{t("contracts.contactName")}</div>
                    <div className="col col-auto">
                    <ContactSearchControl
                    handleSelectContact={setConatct}
                    wasValidated={wasValidated}
                    value = {contract.contactName}
                    contactType = {["Client" , "Vendor"]}
                    readOnly= {true}

                  />
                    </div>
                  </div>
    
    
                  <div className="mb-3 col ">
                    <div className="col col-auto">{t("contracts.contactMobile")}</div>
                    <div className="col col-auto">
          
                    <input
                        type="text"
                        className= {fieldClass(contract.contactMobile)}
                        id="price"
                        name="price"
                        placeholder={t("contracts.contactMobile")}
                        value={
                          contract.contactMobile
                        }
                        readOnly="readOnly"
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
                {t("contracts.packageInformation")}{" "}
              </div>
              <div className="col">
                <hr />
              </div>
            </div>    
            <div className="mb-3 row">
                
            <div className="mb-3 col ">
                <div className="col col-auto">{t("contracts.packageName")}</div>
                <div className="col col-auto">
                <PackageSearchControl
                    handleSelectPackage={setPackage}
                    value = {contract.packageName}
                    readOnly= {true}
                  />
                </div>
              </div>


            


              <div className="mb-3 col ">
                <div className="col col-auto">{t("contracts.packagePrice")}</div>
                <div className="col col-auto">
                <input
                    type="text"
                    className= "form-control"
                    id="price"
                    name="packagePrice"
                    placeholder={t("contracts.packagePrice")}
                    
                    value={
                      contract.packageNumberOfSet
                    }
                    readOnly="readonly"
                  />
                </div>
              </div>


              <div className="mb-3 col ">
                <div className="col col-auto">{t("contracts.packageNumberOfSet")}</div>
                <div className="col col-auto">
                <input
                    type="text"
                    className= "form-control"
                    id="packageNumberOfSet"
                    name="packageNumberOfSet"
                    placeholder={t("contracts.packageNumberOfSet")}
                  
                    value={
                      contract.packageNumberOfSet
                    }
                    readOnly="readonly"
                  />
                </div>
              </div>

              

            </div>
              

            <div className="mb-3 row ">
              <div className="col col-auto text-info">
                {t("contracts.ContractInformation")}{" "}
              </div>
              <div className="col">
                <hr />
              </div>
            </div>

            <div className="mb-3 row">
                
                <div className="mb-3 col ">
                    <div className="col col-auto">{t("contracts.contractDate")}</div>
                    <div className="col">
                  <DatePicker
                    className={fieldClass(contract.contractDate)}
                    dateFormat="dd/MM/yyyy"
                     selected={new Date(contract.contractDate)}
                     onChange={(date) => setContractDate(date)}
                     readOnly="readonly"
                  />
                </div>
                  </div>
    
    
                
    
    
                  <div className="mb-3 col ">
                    <div className="col col-auto">{t("contracts.contractAmount")}</div>
                    <div className="col col-auto">
                    <input
                        type="number"
                        className= {fieldClass(contract.contractAmount,0.01)}
                        id="contractAmount"
                        name="contractAmount"
                        placeholder={t("contracts.contractAmount")}
                        onChange={setContractAmount}

                        value={
                          contract.contractAmount
                        }
                        min= {0}
                        readOnly="readonly"
                        
                      />
                    </div>
                  </div>
    
    
    
                  <div className="mb-3 col ">
    <div className="col col-auto">{t("contracts.note")}</div>
    <div className="col col-auto">
     
    <textarea
        className="form-control"
        id="note"
        name="note"
        onChange={setNote}
        placeholder={t("contracts.note")}
      >
        {contract.note}
      </textarea>

    </div>
  </div>
                 
    
                  
    
                </div>
          
                <div className="mb-3 row">

                <div className="mb-3 col ">
                    <div className="col col-auto">{t("contracts.contractTotalReceipts")}</div>
                    <div className="col col-auto">
                       JOD {contract.contractTotalReceipts.toFixed(2)} 
                    </div>
                  </div>
                
                

                <div className="mb-3 col ">
                    <div className="col col-auto">{t("contracts.contractTotalInvoiced")}</div>
                    <div className="col col-auto">
                       JOD {contract.contractTotalInvoiced.toFixed(2)} 
                    </div>
                  </div>

                  <div className="mb-3 col ">
                    <div className="col col-auto">{t("contracts.contractBalance")}</div>
                    <div className="col col-auto">
                       JOD {contract.contractBalance.toFixed(2)} 
                    </div>
                  </div>
    
                </div>

                <div className="mb-3 row">

<div className="mb-3 col ">
    <div className="col col-auto">{t("contracts.contractReminingAmount")}</div>
    <div className="col col-auto">
       JOD {contract.contractReminingAmount} 
    </div>
  </div>
  </div>

                
            <div className="mb-3 row ">
              <div className="col col-auto text-info">
                {t("contracts.receipts")}{" "}
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
                   
                      <th width="20%">{t("contracts.receiptAmount")} </th>
                      <th width="20%">{t("contracts.receiptDate")} </th>
                      <th width="35%">{t("contracts.receiptNote")}</th>
                     
                      <th width="20%"></th>
                    </tr>
                  </thead>

                  <tbody>
                    { 
                    contract.receipts? contract.receipts.map((item) => (
                      <tr key={ item.receiptSequance} >
                        <td> {item.receiptSequance} </td>
                        <td>{item.receiptAmount}</td>
                        { <td>{item.receiptDate ? moment(item.receiptDate).format("DD/MM/yyyy") : "Not Set"} </td> }
                      
                        <td>{item.receiptNote} </td>
    
                        <td>
                          <ConfirmButton
                            onConfirm={() => removeItem(item.receiptSequance)}
                            onCancel={() => console.log("cancel")}
                            buttonText={t("dashboard.delete")}
                            confirmText={t("contracts.confirm")}
                            cancelText={t("contracts.cancel")}
                            loadingText={t("contracts.deleteingItem")}
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
                      <td>{contract.receipts.length + 1}</td>
                      <td>
                        <input
                          type="number"
                          className={fieldClass(currentEditableItem.receiptAmount)}
                          value={currentEditableItem.receiptAmount}
                          onChange={updatereceiptAmount}
                          min={0}
                        
                        />
                      </td>
                      <td>
                         <DatePicker className="form-control"  dateFormat="dd/MM/yyyy" selected = {new Date(currentEditableItem.receiptDate) } 
                         onChange={(date)=> updatereceiptDate(date)}
                         />
                      </td>
                      <td>
                    <textarea className="form-control"  value={currentEditableItem.receiptNote}
                    onChange={updatereceiptNote}
                    ></textarea>
                      </td>
   
        
                      <td>
                        <button
                          type="button"
                          className="btn  btn-success d-print-none "
                          onClick={addItem}
                        >
                          {t("contracts.add")}
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
    </>
    : ""
  );
  
                  
};

export default EditContract;
