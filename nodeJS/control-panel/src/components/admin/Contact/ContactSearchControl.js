import React, {useEffect, useState } from 'react'
import "./Search.css";
import {MdSearch,MdPhone,MdContactPage} from "react-icons/md";
import { useTranslation } from "react-i18next";
import { searchContact } from './ContactAPI';
const ContactSearchControl = (props) => {


  

    const fieldClass1 = (value) => {
        let wasValidated = false ;
        if( props.wasValidated) 
        {
            wasValidated = props.wasValidated ;
        }
        if (!wasValidated ) return "form-control";
        return selectedId ? "form-control is-valid" : "form-control is-invalid";
      };

    const { t } = useTranslation();
    const [selectedContactText, setSelectedContactText] = useState("");
    const [selectedId, setSelectedId] = useState(null);
   
    useEffect( ()=>{
      console.log("before check props.value");
      if(props.value)
    {
      setSelectedContactText(props.value);
      console.log("(props.value:" +props.value);
    }
    } , [])
    const updateSearchContactText = (event) => {
    setSelectedContactText(event.target.value);
      if(event.target.value.length >=3) 
      {
        searchContact(event.target.value)
          .then((data) => {
            console.log(data.items);
            setContactItems(data.items);
          })
          .catch((e) => {
            console.log(e);
          });
      }
      else
      {
        setContactItems([])
      }

      setSelectedId(null);
      props.handleSelectContact(null);

       
    };
  
   
    const onBlurSearchContact =  (event) =>{
       // event.preventDefault();
     // setContactItems([]);
    } ;
  
    const [contactItems, setContactItems] = useState([]);
    const handleSelectContact = (item) => {
        setSelectedId(item);
        if(props.handleSelectContact){
            props.handleSelectContact(item);

        }
      setSelectedContactText(item.contactName);
      setContactItems([]);
    };

   

    return (<>
     <div class="input-group mb-0">
                    <span class="input-group-text" id="basic-addon1">
                      <MdSearch size={20} />
                    </span>
                    <input
                      //className="form-control"
                    className= {fieldClass1(selectedContactText)}
                      placeholder="Type to search..."
                      autoComplete="false"
                      onChange={updateSearchContactText}
                      value={selectedContactText}
                     onBlur={onBlurSearchContact}
                     onFocus={updateSearchContactText}
                    />
                  </div>

                  {contactItems && contactItems.length > 0 ? (
                    <ul className="list-group scrollbar p-2" id= "style-7" >
                      {contactItems
                        ? contactItems.map((item) => (<>
                          
                            <li className="searchItem  list-group-item list-group-item-light"  onClick={() => {
                                handleSelectContact(item);
                              }}>
                        <ul class="list-unstyled text-smoke text-smoke">
                          <li class="d-flex">
                            {" "}
                            <h5
                              className="contactInfo"
                            >
                              {" "}
                             { t("contact.searchContactInfo")}
                            </h5>
                          </li>
                          <li class="d-flex pl-2">
                            {" "}
                            <MdContactPage size={25} />{" "}
                            <span className="text-secondary">
                              {" "}
                              {item.contactName}
                            </span>
                          </li>
                          <li class="d-flex pl-2">
                            {" "}
                            <MdPhone size={25} />{" "}
                            <span className="text-secondary"> {item.mobile}</span>
                          </li>
                          <li class="d-flex">
                            {" "}
                            <h5 className="mt-2 subContactInfo" >
                              {" "}
                             { t("contact.searchSubContactInfo")}
                            </h5>
                          </li>
                          <li class="d-flex pl-2">
                            {" "}
                            <MdContactPage size={25} />{" "}
                            <span className="text-secondary">
                            {item.subContactName? item.subContactName: t("contact.searchContactEmpty")}
                            </span>
                          </li>
                          <li class="d-flex pl-2">
                            {" "}
                            <MdPhone size={25} />{" "}
                            <span className="text-secondary">
                            {item.subContactMobile?item.subContactMobile:  t("contact.searchContactEmpty")}
                            </span>
                          </li>
                        </ul>
                      </li>
                            </>
                          ))
                        : null}
                     
                    </ul>
                  ) : null}
    </>);
}
export default ContactSearchControl;