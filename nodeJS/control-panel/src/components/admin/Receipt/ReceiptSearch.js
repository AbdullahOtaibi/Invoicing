
import { useEffect, useState } from "react";
import react from 'react';
import { useTranslation } from "react-i18next"
import ContactSearchControl from "../Contact/ContactSearchControl";
import ContractSearchControl from "../Contracts/ContractSearchControl";

const ContractSearch = (props) => {

    const { t, i18n } = useTranslation();

    const [seqNumber, setSeqNumber] = useState('');
const [contact, setContact] = useState(null);
const [contract, setContract] = useState(null);
const [contractItem, setContractItem] = useState({});
const [searchFilterChanged , setSearchFilterChanged] = useState({});

    const updateReceiptSeqNumber = (event) => {
        setSeqNumber(event.target.value);
    };


    const updateContact = (item) => {
        if (item) {
            setContact(item._id);
        }else{
            setContact(null);
        }
    };

 const updateContract = (item) => {
        if (item) {
            setContract(item._id);
            setContractItem(item);
        }else{  
            setContract(null);
        }           
    };


    const handleEnter = (e) => {
        if (e.keyCode == 13) {
            doSearch();
        }
    };

        const doSearch=() => {
            console.log("insert do search ....");

            if (props.setSearchFilterChanged) {

                console.log("call searchFilterChanged method from contract search control");
  let filter = {
    seqNumber: seqNumber,
    contactId: contact,
    contractId: contract,
};
console.log("filter:" + JSON.stringify(filter));

                setSearchFilterChanged(filter);
                props.setSearchFilterChanged(filter);
            }   

          

        } 

        useEffect(() => { doSearch(); }, [seqNumber , contact , contract]);


    return (<><div className='invoiceSearch'>
    <div className='card'>
        <form>

            <div className='row mt-3'>
                <div className="mb-3 col ">
                    <div className="col col-auto">
                        {t("receipt.seqNumber")}
                    </div>
                    <div className="col col">
                        <input
                            type="text"
                            className="form-control"
                            onChange={updateReceiptSeqNumber}
                            onKeyUp={handleEnter}
                        />
                    </div>
                </div>


                <div className="mb-3 col ">
                    <div className="col col-auto">
                        {t("receipt.contactName")}
                    </div>
                    <div className="col col">
                        <ContactSearchControl
                            handleSelectContact={updateContact}
                            contactType={["Client", "Vendor","Insurance"]}

                        />
                    </div>
                </div>

               < div className="mb-3 col ">
                    <div className="col col-auto">
                        {t("receipt.contract")}
                    </div>
                    <div className="col col">
                        <ContractSearchControl
                            handleSelectContract={updateContract}
                            value = {contractItem?.seqNumber}
                            clientId={contact} 
                        />
                    </div>
                </div>

        

                


            </div>


      



            {/* <div className='row mb-3'>
                <div className='col text-end px-4 mb-2'>
                    <button type='button' className='btn btn-secondary' onClick={handleCloseSearch}><MdClose /> {t("close")}</button>
                    <button type='button' className='btn btn-primary mx-2' onClick={doSearch}><MdSearch /> {t("search")}</button>
                </div>
            </div> */}


        </form>
    </div>

</div>
</>

);







}
export default ContractSearch
