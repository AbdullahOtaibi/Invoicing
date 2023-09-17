
import { getSumReceiptByContractId } from './ReceiptAPI'
import { updateContract  } from '../Contracts/ContractsAPI'


export function updateContractCalculation( contractObj ) {

    
let contract = contractObj || {}; 
    console.log("updateContractCalculation method ....")
    console.log("before fill contract");
    console.log(contract)
    let contractAmount = contract.contractAmount || 0;
    let contractTotalInvoiced = contract.contractTotalInvoiced || 0;
    let contractTotalReceipts = 0;
    let contractReminingAmount = 0;

    let filter = {}
    filter.contractId = contract._id;
    if (!filter.contractId) return; 

    console.log("filter:" + JSON.stringify(filter));
    
    getSumReceiptByContractId({
        filter

    }).then(data => {
        //etLoading(false);
        console.log("getSumReceiptByContractId:" + JSON.stringify(data));
        if(data.length == 0)  return false;

        contractTotalReceipts = data[0].total || 0;
        console.log("contractTotalReceipts:" + contractTotalReceipts); 

        //***************** */

        let cloned = JSON.parse(JSON.stringify(contract));
        cloned.contractTotalReceipts = parseFloat(contractTotalReceipts);
        cloned.contractBalance = parseFloat(contractTotalReceipts) - parseFloat(contractTotalInvoiced);
        console.log("contractBalance:" + cloned.contractBalance); 
        cloned.contractReminingAmount = parseFloat(contractAmount) - parseFloat(contractTotalReceipts)

         console.log("contractReminingAmount:" + contractReminingAmount);

        updateContract(cloned).then((res) => {
            //  toast("success!");
            // window.location.href = "/admin/Contract/view/" + res._id;
            return cloned;

        }).catch((err) => { console.log(err) });

        //****************** */

        //setLoading(true);
    }).catch(e => {
        //setLoading(false);
        console.log(e);
    });
  


    console.log("after fill contract:");
   // console.log(contract);
}

