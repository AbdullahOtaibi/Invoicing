import { CSSTransition } from 'react-transition-group';
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { hasPermission } from "../utils/auth";

import { Helmet } from "react-helmet";
import {
  MdOutlineReceiptLong,
  MdEdit,
  MdClose,
  MdHistoryToggleOff,
  MdPayment,
  MdLocalShipping,
  MdOutlineCancel,
  MdContacts,
  MdPhone,
  MdCollections,
  MdMoney
} from "react-icons/md";
import { ThreeDots } from 'react-loader-spinner';
import { useTranslation } from "react-i18next";
import ConfirmButton from "react-confirmation-button";
import { MdAdd, MdDelete, MdReceipt } from "react-icons/md";
import { RiRefund2Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getContract, removeContract } from "./ContractsAPI"
import moment from "moment";

const ViewContract = (props) => {

  let navigate = useNavigate();
  const { contractId } = useParams();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [contract, setContract] = useState({});
  useEffect(() => {
    setLoading(true);
    console.log("contractId:" + contractId);
    getContract(contractId).then(
      (res) => {
        setContract(res)
        console.log("contract:")
        console.log(JSON.stringify(res));
      }
    ).catch((error) => { console.log(error) })
    setLoading(false);
  }, []);

const getTotalInstallments = () =>{
  let total = 0;
  contract.installments.forEach((installment) => {
    total += parseFloat(installment.installmentAmount);
  });
  return total;
}



  moment.locale("en-GB");
  return (
    (contract ? (
      <>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title"> <MdReceipt size={20} />   {t("contracts.ContractInformation")} ({contract.seqNumber})</h5>
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
                    {contract.contact?.contactName}
                  </div>
                </div>


                <div className="mb-3 col ">
                  <div className="col col-auto">{t("contracts.contactMobile")}</div>
                  <div className="col col-auto">
                    {contract.contact?.mobile}


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
                    {contract.package?.packageName}
                  </div>
                </div>





                <div className="mb-3 col ">
                  <div className="col col-auto">{t("contracts.packagePrice")}</div>
                  <div className="col col-auto">
                    {
                      contract.packagePrice ? contract.packagePrice.toFixed(2) : contract.packagePrice
                    }
                  </div>
                </div>


                <div className="mb-3 col ">
                  <div className="col col-auto">{t("contracts.packageNumberOfSet")}</div>
                  <div className="col col-auto">
                    {contract.numberOfSet}
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
                    {contract.contractDate ? moment(contract.contractDate).format("DD/MM/yyyy") : "Not Set"}
                  </div>
                </div>





                <div className="mb-3 col   ">
                  <div className="col col-auto">{t("contracts.contractAmount")}</div>
                  <div className="col col-auto">
                    {contract.contractAmount ? contract.contractAmount.toFixed(2) : contract.contractAmount}
                  </div>
                </div>



                <div className="mb-3 col ">
                  <div className="col col-auto">{t("contracts.note")}</div>
                  <div className="col col-auto">

                    {contract.note}

                  </div>
                </div>




              </div>

              <div className="mb-3 row">

                <div className="mb-3 col   ">
                  <div className="col col-auto">{t("contracts.contractTotalReceipts")}</div>
                  <div className="col col-auto">
                    JOD {contract.installments ? getTotalInstallments().toFixed(2) : '0.00'}
                  </div>
                </div>



                <div className="mb-3 col   ">
                  <div className="col col-auto">{t("contracts.contractTotalInvoiced")}</div>
                  <div className="col col-auto">
                    JOD {contract.packagePrice ? contract.packagePrice.toFixed(2) : contract.packagePrice}
                  </div>
                </div>

                <div className="mb-3 col    ">
                  <div className="col col-auto">{t("contracts.contractBalance")}</div>
                  <div className="col col-auto">
                    JOD {contract.contractBalance ? contract.contractBalance.toFixed(2) : '0.00'}
                  </div>
                </div>

              </div>

              <div className="mb-3 row">

                <div className="mb-3 col   ">
                  <div className="col col-auto">{t("contracts.contractReminingAmount")}</div>
                  <div className="col col-auto">
                    JOD {contract.contractReminingAmount ? contract.contractReminingAmount.toFixed(2) : '0.00'}
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
                  <table className="table table-sm needs-validation ">
                  

                    <thead>
                    <tr className="table-light">
                      <th width="5%">#</th>
                   
                      <th width="20%">{t("contracts.receiptAmount")} </th>
                      <th width="20%">{t("contracts.receiptDate")} </th>
                      <th width="35%">{t("contracts.receiptNote")}</th>
                     
                     
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
    
                      
                      </tr>
                    )) : <tr></tr>}


                    </tbody>
                    <tfoot></tfoot>
                  </table>

                </div>
              </div>






              <div class="row text-right">
                <div className="mb-3  col justify-content-end">
                  <Link className="btn btn-secondary btn-lg" to="/admin/Contract">
                    <MdClose size={20} /> &nbsp; {t("Cancel")}
                  </Link>{" "}
                  &nbsp;

                  <Link className="btn btn-primary btn-lg mx-1" to={"/invoices/createForContract/" + contract._id}>
                    <MdEdit size={20} />
                    &nbsp; {t("invoice.createInvoice")}
                  </Link>

                  <Link className="btn btn-primary btn-lg" to={"/admin/Contract/edit/" + contract._id}>
                    <MdEdit size={20} />
                    &nbsp; {t("dashboard.edit")}
                  </Link>

                  


                 
                </div>
              </div>
            </form>
          </div>
        </div>
      </>


    ) : "No Data Found"));


};

export default ViewContract