import React, { useEffect, useState } from "react";
import "./Search.css";
import { MdSearch} from "react-icons/md";
import { useTranslation } from "react-i18next";
import { searchPackage} from "./PackageAPI";
import { json } from "react-router-dom";
const PackageSearchControl = (props) => {
  const { t } = useTranslation();
  const [selectedPackageText, setSelectedPackageText] = useState(props.value);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (props) {
      setSelectedPackageText(props.value);
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

  const updateSearchPackageText = (event) => {
    setSelectedPackageText(event.target.value);
   // if (event.target.value.length >= 3 ||  props.contactType[0] == "Employee" ) {
    
   let filter = {
    val: event.target.value,
    //contactType: contactType, 
  };

   searchPackage(filter)
        .then((data) => {
          console.log(data.items);
          setPackageItems(data.items);
        })
        .catch((e) => {
          console.log(e);
        });
    
    /*  } else {
      setPackageItems([]);
    }
*/
    setSelectedId(null);
    props.handleSelectPackage(null);
  };

  
  const onBlurSearchPackage = (event) => {
     //event.preventDefault();
     // setPackageItems([]);
     /*if(selectedId)
     {
      setPackageItems([]);
     }
     */
  };


  const [packageItems, setPackageItems] = useState([]);
  const handleSelectPackage = (item) => {
    setSelectedId(item);
    if (props.handleSelectPackage) {
      props.handleSelectPackage(item);
    }
    setSelectedPackageText(item.packageName);
    setPackageItems([]);
  };

  return (
    <>
      <div class="input-group mb-0">
        <span class="input-group-text" id="basic-addon1">
          <MdSearch size={20} />
        </span>
        <input
         readOnly= { props.readOnly? "readnoly" : ""}
          className={fieldClass1(selectedPackageText)}
          placeholder="Type to search..."
          autoComplete="false"
          onChange={updateSearchPackageText}
          value={selectedPackageText}
          onBlur={onBlurSearchPackage}
          onFocus={updateSearchPackageText}
        />
      </div>

      {packageItems && packageItems.length > 0  &&  ! props.readOnly ? (
        <ul className="list-group scrollbar p-2" id="style-7">

          {packageItems
            ? packageItems.map((item) => (
                <>
               
                  <li
                    className="searchItem  list-group-item list-group-item-light"
                    onClick={() => {
                      if( ! props.readOnly)  
                      handleSelectPackage(item);
                    }}
                  >
                    {
                    (
                    
                    <div className="row">
                      <div className="mb-3 col ">
                      
                 
                        <div>
                        <span class= "text-info">{ "Package: "}</span>    
                        <span className="text-secondary"> {item.packageName}  </span>
                        </div>
                        <div>
                        <span class= "text-info">{ "Price: "}</span> 
                        <span className="text-secondary"> </span>{item.price} 
                        </div>
                        <div>
                        <span class= "text-info">{ "Number Of Set: "}</span> 
                        <span className="text-secondary"> {item.numberOfSet} </span>
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
export default PackageSearchControl;
