import React, { useEffect, useState } from "react";
import "./ReceiptSearchControl.css";
import { MdSearch, MdPhone, MdContactPage } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { searchReceipt } from "./ReceiptAPI";
import { json } from "react-router-dom";
const ReceiptSearchControl = (props) => {
  const { t } = useTranslation();
  const [selectedReceiptText, setSelectedReceiptText] = useState(props.value);
  const [selectedId, setSelectedId] = useState(null);
  useEffect(() => {
    if (props) {
      setSelectedReceiptText(props.value);
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

  const updateSearchReceiptText = (event) => {
    setSelectedReceiptText(event.target.value);
    if (event.target.value.length >= 3 ) {
      
      let filter = {
        val: event.target.value
      };

      searchReceipt(filter)
        .then((data) => {
          console.log(data.items);
          setReceiptItems(data.items);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setReceiptItems([]);
    }

    setSelectedId(null);
    props.handleSelectReceipt(null);
  };

  
  const onBlurSearchReceipt = (event) => {
     //event.preventDefault();
     // setReceiptItems([]);
     /*if(selectedId)
     {
      setReceiptItems([]);
     }
     */
  };

/*
const onBlurSearchReceipt = (item) => {
  setSelectedId(item);
  if (props.handleSelectReceipt) {
    props.handleSelectReceipt(item);
  }
  setSelectedReceiptText(item.contactName);
  setReceiptItems([]);
};
*/
  const [receiptItems, setReceiptItems] = useState([]);
  const handleSelectReceipt = (item) => {
    setSelectedId(item);
    if (props.handleSelectReceipt) {
      props.handleSelectReceipt(item);
    }
    setSelectedReceiptText(item.seqNumber);
    setReceiptItems([]);
  };

  return (
    <>
      <div class="input-group mb-0">
        <span class="input-group-text" id="basic-addon1">
          <MdSearch size={20} />
        </span>
        <input
          className={fieldClass1(selectedReceiptText)}
          placeholder="Type to search..."
          autoComplete="false"
          onChange={updateSearchReceiptText}
          value={selectedReceiptText}
          onBlur={onBlurSearchReceipt}
          onFocus={updateSearchReceiptText}
        />
      </div>

      {receiptItems && receiptItems.length > 0 ? (
        <ul className="list-group scrollbar p-2" id="style-7">
          {receiptItems
            ? receiptItems.map((item) => (
                <>
               
                  <li
                    className="searchItem  list-group-item list-group-item-light"
                    onClick={() => {
                      handleSelectReceipt(item);
                    }}
                  >
                    {(props.contactType && props.contactType.length == 1)? <div>{ item.seqNumber}</div> :
                    (
                    
                    <div className="row">
                      <div className="mb-3 col ">

                        <div>
                          <MdContactPage size={25} />{" "}
                          <span className="text-secondary">
                            {item.seqNumber}
                          </span>
                        </div>
                       
                      </div>

                      
                    </div>
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
export default ReceiptSearchControl;
