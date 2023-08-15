import React, { useEffect, useState } from "react";
import "./ContractsSearchControl.css";
import { MdSearch, MdPhone, MdContactPage, MdEditDocument, MdDocumentScanner, MdOutlineDocumentScanner, MdBalance, MdMoney, MdReceipt, MdMoneyOff } from "react-icons/md";
import { LiaBalanceScaleSolid, LiaFileContractSolid } from 'react-icons/lia'
import { useTranslation } from "react-i18next";
import { searchContract } from "./ContractsAPI";
import { json } from "react-router-dom";
const ContractSearchControl = (props) => {
  const { t } = useTranslation();
  const [selectedContractText, setSelectedContractText] = useState(props.value);
  const [selectedId, setSelectedId] = useState(null);
  const [clientId, setClientId] = useState(props.clientId);
  useEffect(() => {
    if (props) {
      setSelectedContractText(props.value);
    }
  }, []);

  const fieldClass1 = (value) => {
    let wasValidated = false;
    if (props.wasValidated) {
      wasValidated = props.wasValidated;
    }
    if (!wasValidated) return "form-control";
    return selectedId ? "form-control is-valid" : "form-control is-invalid";
  };

  const updateSearchContractText = (event) => {
    setSelectedContractText(event.target.value);
    if (event.target.value.length >= 0) {

      let filter = {
        val: event.target.value,
        clientId: props.clientId
      };

      searchContract(filter)
        .then((data) => {
          console.log(data.items);
          setContractItems(data.items);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setContractItems([]);
    }

    setSelectedId(null);
    if(props.handleSelectContract){
      props.handleSelectContract(null);
    }
   
  };


  const onBlurSearchContract = (event) => {
    //event.preventDefault();
    // setContractItems([]);
    /*if(selectedId)
    {
     setContractItems([]);
    }
    */
  };

  const [contractItems, setContractItems] = useState([]);
  const handleSelectContract = (item) => {
    setSelectedId(item);
    if (props.handleSelectContract) {
      props.handleSelectContract(item);
    }
    setSelectedContractText(item.seqNumber);
    setContractItems([]);
  };

  return (
    <>
      <div class="input-group mb-0">
        <span class="input-group-text" id="basic-addon1">
          <MdSearch size={20} />
        </span>
        <input
          className={fieldClass1(selectedContractText)}
          placeholder="Type to search..."
          autoComplete="false"
          onChange={updateSearchContractText}
          value={selectedContractText}
          onBlur={onBlurSearchContract}
          onFocus={updateSearchContractText}
        />
      </div>

      {contractItems && contractItems.length > 0 ? (
        <ul className="list-group scrollbar p-2" id="style-7">
          {contractItems
            ? contractItems.map((item) => (
              <>

                <li
                  className="searchItem  list-group-item list-group-item-light"
                  onClick={() => {
                    handleSelectContract(item);
                  }}
                >
                  {
                    (
                      <>
                        <div className="row">
                          <div className="mb-3 col ">

                            <div>
                            
                              <span className="text-secondary">
                              <LiaFileContractSolid size={25} className="text-info" />{" "}
                                {item.seqNumber} {" "}
                             
                              <MdContactPage size={25}  className="text-info"  />{" "}
                                {item.contact.contactName} {" "}
                         
                              <MdMoney size={25}  className="text-info" />{" "}
                                {item.contractBalance} JOD
                              </span>

                            </div>

                     

                          </div>


                        </div>
                       
                      </>
                    )
                  }
                </li>
              </>
            ))
            : null}
        </ul>
      ) : null}
    </>
  );
};
export default ContractSearchControl;
