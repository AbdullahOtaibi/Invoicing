import React, { useEffect, useState } from "react";
import "./Search.css";
import { MdSearch, MdPhone, MdContactPage } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { searchContact } from "./ContactAPI";
import { json } from "react-router-dom";
const ContactSearchControl = (props) => {
  const { t } = useTranslation();
  const [selectedContactText, setSelectedContactText] = useState(props.value);
  const [selectedId, setSelectedId] = useState(null);
  useEffect(() => {
    if (props) {
      console.log("search contact props.value =" + props.value);
      setSelectedContactText(props.value);
    }
  }, [props]);

  const fieldClass1 = (value) => {
    let wasValidated = false;
    if (props.wasValidated) {
      wasValidated = props.wasValidated;
    }
    if (!wasValidated) return "form-control";
    return selectedId ? "form-control is-valid" : "form-control is-invalid";
  };

  const updateSearchContactText = (event) => {
    setSelectedContactText(event.target.value);
    if (event.target.value.length >= 3 || props.contactType[0] == "Employee" || props.contactType[0] == "Insurance") {
      let contactType = ["Client"];
      if (props.contactType) {
        contactType = props.contactType;
      }
      let filter = {
        val: event.target.value,
        contactType: contactType, // ["Client" , "Vendor"]
      };

      searchContact(filter)
        .then((data) => {
          console.log(data.items);
          setContactItems(data.items);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setContactItems([]);
    }

    setSelectedId(null);
    props.handleSelectContact(null);
  };


  const onBlurSearchContact = (event) => {
    //event.preventDefault();
    // setContactItems([]);
    /*if(selectedId)
    {
     setContactItems([]);
    }
    */
  };

  /*
  const onBlurSearchContact = (item) => {
    setSelectedId(item);
    if (props.handleSelectContact) {
      props.handleSelectContact(item);
    }
    setSelectedContactText(item.contactName);
    setContactItems([]);
  };
  */
  const [contactItems, setContactItems] = useState([]);
  const handleSelectContact = (item) => {
    setSelectedId(item);
    if (props.handleSelectContact) {
      props.handleSelectContact(item);
    }
    setSelectedContactText(item.contactName);
    setContactItems([]);
  };

  return (
    <>
      <div class="input-group mb-0">
        <span class="input-group-text" id="basic-addon1">
          <MdSearch size={20} />
        </span>
        <input
          readOnly={props.readOnly ? "readnoly" : ""}
          className={fieldClass1(selectedContactText)}
          placeholder="Type to search..."
          autoComplete="false"
          onChange={updateSearchContactText}
          value={selectedContactText}
          onBlur={onBlurSearchContact}
          onFocus={updateSearchContactText}
        />
      </div>

      {contactItems && contactItems.length > 0 && !props.readOnly ? (
        <div className="scrollbar p-2" style={{ maxHeight: '376px', overflowY: 'auto', position: 'absolute', width: '420px', zIndex: 99 }}>
          <div className="row  mb-2">
            <div className="col text-end">
              <button type='button' className="btn btn-sm btn-outline-danger w-100" onClick={() => setContactItems([])}>CLOSE</button>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <ul className="list-group scrollbar" id="style-7">
                {contactItems
                  ? contactItems.map((item) => (
                    <>

                      <li
                        className="searchItem  list-group-item list-group-item-light"
                        onClick={() => {
                          if (!props.readOnly)
                            handleSelectContact(item);
                        }}
                      >
                        {(props.contactType && props.contactType.length == 1 && (props.contactType[0] == "Employee" || props.contactType[0] == "Insurance")) ? <div>{item.contactName}</div> :
                          (

                            <div className="row">
                              <div className="mb-3 col ">
                                <h5 className="mt-2 text-info">
                                  {" "}
                                  {t("contact.searchContactInfo")}
                                </h5>

                                <div>
                                  <MdContactPage size={25} />{" "}
                                  <span className="text-secondary">
                                    {item.contactName}
                                  </span>
                                </div>
                                <div>
                                  <MdPhone size={25} />{" "}
                                  <span className="text-secondary"> {item.mobile}</span>
                                </div>
                              </div>

                              <div className="mb-3 col ">
                                <h5 className="mt-2 text-info">
                                  {" "}
                                  {t("contact.searchSubContactInfo")}
                                </h5>

                                <div>
                                  <MdContactPage size={25} />{" "}
                                  <span className="text-secondary">
                                    {item.subContactName
                                      ? item.subContactName
                                      : t("contact.searchContactEmpty")}
                                  </span>
                                </div>
                                <div>
                                  <MdPhone size={25} />{" "}
                                  {item.subContactMobile ? item.subContactMobile : t("contact.searchContactEmpty")}
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
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
export default ContactSearchControl;
