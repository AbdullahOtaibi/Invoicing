import React, { useEffect, useState } from "react";
import "./SubscriptionsSearchControl.css";
import { MdSearch, MdPhone, MdContactPage } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { searchSubscription } from "./SubscriptionsAPI";
import { json } from "react-router-dom";
const SubscriptionSearchControl = (props) => {
  const { t } = useTranslation();
  const [selectedSubscriptionText, setSelectedSubscriptionText] = useState(props.value);
  const [selectedId, setSelectedId] = useState(null);
  const [clientId, setClientId] = useState(props.clientId);
  useEffect(() => {
    if (props) {
      setSelectedSubscriptionText(props.value);
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

  const updateSearchSubscriptionText = (event) => {
    setSelectedSubscriptionText(event.target.value);
    if (event.target.value.length >= 0) {

      let filter = {
        val: event.target.value,
        clientId: props.clientId
      };

      searchSubscription(filter)
        .then((data) => {
          console.log(data.items);
          setSubscriptionItems(data.items);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setSubscriptionItems([]);
    }

    setSelectedId(null);
    if(props.handleSelectSubscription){
      props.handleSelectSubscription(null);
    }
   
  };


  const onBlurSearchSubscription = (event) => {
    //event.preventDefault();
    // setSubscriptionItems([]);
    /*if(selectedId)
    {
     setSubscriptionItems([]);
    }
    */
  };

  /*
  const onBlurSearchSubscription = (item) => {
    setSelectedId(item);
    if (props.handleSelectSubscription) {
      props.handleSelectSubscription(item);
    }
    setSelectedSubscriptionText(item.contactName);
    setSubscriptionItems([]);
  };
  */
  const [subscriptionItems, setSubscriptionItems] = useState([]);
  const handleSelectSubscription = (item) => {
    setSelectedId(item);
    if (props.handleSelectSubscription) {
      props.handleSelectSubscription(item);
    }
    setSelectedSubscriptionText(item.seqNumber);
    setSubscriptionItems([]);
  };

  return (
    <>
      <div class="input-group mb-0">
        <span class="input-group-text" id="basic-addon1">
          <MdSearch size={20} />
        </span>
        <input
          className={fieldClass1(selectedSubscriptionText)}
          placeholder="Type to search..."
          autoComplete="false"
          onChange={updateSearchSubscriptionText}
          value={selectedSubscriptionText}
          onBlur={onBlurSearchSubscription}
          onFocus={updateSearchSubscriptionText}
        />
      </div>

      {subscriptionItems && subscriptionItems.length > 0 ? (
        <ul className="list-group scrollbar p-2" id="style-7">
          {subscriptionItems
            ? subscriptionItems.map((item) => (
              <>

                <li
                  className="searchItem  list-group-item list-group-item-light"
                  onClick={() => {
                    handleSelectSubscription(item);
                  }}
                >
                  {(props.contactType && props.contactType.length == 1) ? <div>{item.seqNumber}</div> :
                    (
                      <>
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
                        <div className="row">
                          <div className="mb-3 col ">
                            aaa
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
export default SubscriptionSearchControl;
