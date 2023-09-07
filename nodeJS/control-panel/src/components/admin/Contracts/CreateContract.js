import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from 'react-loader-spinner';
import { MdClose, MdCollections, MdContacts, MdReceipt, MdDelete } from "react-icons/md";
import { CSSTransition } from 'react-transition-group';
import { createContract, updateContract } from './ContractsAPI'
import ContactSearchControl from "../Contact/ContactSearchControl";
import PackageSearchControl from "../Package/PackageSearchControl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { event } from "jquery";
import ConfirmButton from "react-confirmation-button";
import moment from "moment";
const CreateContract = (props) => {

  const [wasValidated, setWasValidated] = useState(false);

  const [contract, setContract] = useState({
    deleted: false,
    companyID: localStorage.getItem("companyId"),
    company: localStorage.getItem("company"),
    status: "Active",
    contractDate: new Date(),
    contractTotalReceipts: 0.00,
    contractBalance: 0.00,
    contractTotalInvoiced: 0.00,
    contractReminingAmount: 0.00,
    contractAmount: 0.00,
    receipts: [
    ]
  });

  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();



  function numericFormat(val) {

    return !isNaN(val) ? val.toFixed(3) : val;
  }


  const setConatct = (item) => {
    if (item) {
      let cloned = JSON.parse(JSON.stringify(contract));
      cloned.contactName = item.contactName;
      cloned.contact = item._id;
      cloned.contactMobile = item.mobile;
      setContract(cloned);

    }
  };


  const setPackage = (item) => {
    if (item) {
      let cloned = JSON.parse(JSON.stringify(contract));
      cloned.packageName = item.packageName;
      cloned.package = item._id;
      cloned.packagePrice = item.price;
      cloned.packageNumberOfSet = item.numberOfSet;
      if (!contract.contractAmount) {
        cloned.contractAmount = item.price;
        let contractTotalReceipts = cloned.contractTotalReceipts || 0;
        cloned.contractReminingAmount = parseFloat(item.price) - contractTotalReceipts;

      }
      setContract(cloned);
    }
  };



  const setPackageName = (event) => {

    let cloned = JSON.parse(JSON.stringify(contract));
    cloned.packageName = event.target.value;
    setContract(cloned)

  };


  const setContractAmount = (event) => {
    console.log("setContractAmount " + event.target.value);

    let cloned = JSON.parse(JSON.stringify(contract));
    cloned.contractAmount = parseFloat(event.target.value);
    let contractTotalReceipts = cloned.contractTotalReceipts || 0;
    cloned.contractReminingAmount = parseFloat(cloned.contractAmount) - parseFloat(contractTotalReceipts);
    setContract(cloned)

  }

  const setContractDate = (date) => {
    let cloned = JSON.parse(JSON.stringify(contract));
    cloned.contractDate = date;
    setContract(cloned);
  };


  const setNote = (event) => {
    let cloned = JSON.parse(JSON.stringify(contract));
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

    setWasValidated(true);
    setLoading(true);

    if (checkData()) {
      createContract(contract).then((res) => {
        toast("success!");
        window.location.href = "/admin/Contract/view/" + res._id;

      }).catch((err) => { console.log(err) });
    }
    setLoading(false);
  }


  function checkData() {
    console.log("insert checkdata ...")
    let isValid = true;

    if (isBlank(contract.contactName)) {
      viewItemValidMessage("Fill the contact name.")
      isValid = false;
    }

    if (isBlank(contract.contractAmount) || parseFloat(contract.contractAmount) <= 0) {
      viewItemValidMessage("Fill the contract amount.")
      isValid = false;
    }



    return isValid;
  };

  const viewItemValidMessage = (message) => {
    toast.warning(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  function updateContractCalculation() {
    console.log("updateContractCalculation method ....")
    console.log("before fill contract");
    console.log(contract)
    let contractAmount = contract.contractAmount || 0;
    let contractTotalInvoiced = contract.contractTotalInvoiced || 0;
    let contractTotalReceipts = 0;
    let contractReminingAmount = 0;

    for (let i = 0; i < contract.receipts.length; i++) {

      contractTotalReceipts += parseFloat(contract.receipts[i].receiptAmount)
    }

    let cloned = JSON.parse(JSON.stringify(contract));
    cloned.contractTotalReceipts = contractTotalReceipts;
    cloned.contractBalance = contractTotalReceipts - parseFloat(contractTotalInvoiced);
    cloned.contractReminingAmount = parseFloat(contractAmount) - contractTotalReceipts
    setContract(cloned);
    console.log("after fill contract:");
    console.log(contract);
  }


  return (
    <>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title"> <MdReceipt size={20} />   {t("contracts.createContract")}</h5>
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
                    value={contract.contactName}
                    contactType={["Client", "Vendor"]}

                  />
                </div>
              </div>


              <div className="mb-3 col ">
                <div className="col col-auto">{t("contracts.contactMobile")}</div>
                <div className="col col-auto">

                  <input
                    type="text"
                    className={fieldClass(contract.contactMobile)}
                    id="price"
                    name="price"
                    placeholder={t("contracts.contactMobile")}
                    value={
                      contract.contactMobile
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
                {t("contracts.packageInformation")}{" "}
              </div>
              <div className="col">
                <hr />
              </div>
            </div>
            <div className="mb-3 row ">

              <div className="mb-3 col ">
                <div className="col col-auto">{t("contracts.packageName")}</div>
                <div className="col col-auto">
                  <PackageSearchControl
                    handleSelectPackage={setPackage}
                    value={contract.packageName}
                  />
                </div>
              </div>





              <div className="mb-3 col ">
                <div className="col col-auto">{t("contracts.packagePrice")}</div>
                <div className="col col-auto">
                  <input
                    type="text"
                    className="form-control"
                    id="price"
                    name="packagePrice"
                    placeholder={t("contracts.packagePrice")}

                    value={
                      contract.packagePrice
                    }
                  />
                </div>
              </div>


              <div className="mb-3 col ">
                <div className="col col-auto">{t("contracts.packageNumberOfSet")}</div>
                <div className="col col-auto">
                  <input
                    type="text"
                    className="form-control"
                    id="packageNumberOfSet"
                    name="packageNumberOfSet"
                    placeholder={t("contracts.packageNumberOfSet")}

                    value={
                      contract.packageNumberOfSet
                    }
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
                  />
                </div>
              </div>





              <div className="mb-3 col ">
                <div className="col col-auto">{t("contracts.contractAmount")}</div>
                <div className="col col-auto">
                  <input
                    type="number"
                    className={fieldClass(contract.contractAmount, 0.01)}
                    id="contractAmount"
                    name="contractAmount"
                    placeholder={t("contracts.contractAmount")}
                    onChange={setContractAmount}

                    value={
                      contract.contractAmount
                    }
                    min={0}


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



      





            <div class="row text-right action-bar">
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
  );


};

export default CreateContract;
