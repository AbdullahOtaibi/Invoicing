import { getSecured, postSecured } from '../../../services/ApiClient'

export const removeReceipt = (id) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/receipt/remove/" + id);
}

export const getReceipt = (id) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/receipt/get/" + id);

}

export const getReceipts = (filters) => {
    console.log("url:" +process.env.REACT_APP_API_BASE_URL + "/v1/receipt/filter") ;
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/receipt/filter", filters);
}
export const getIncomeReport = (filters) => {
    console.log("url:" +process.env.REACT_APP_API_BASE_URL + "/v1/receipt/generateReport") ;
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/receipt/generateReport", filters);
}


export const getCountReceipts = (filter) => {
    
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/receipt/count", filter);
    //return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/receipt/filter", {deleted:false , page:1});
}



export const createReceipt = (ReceiptObj) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/receipt/create", ReceiptObj);
}

export const updateReceipt = (ReceiptObj) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/receipt/update", ReceiptObj);
}

export const searchReceipt = (filters) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/receipt/search/" , filters);

}

export const getSumReceiptByContractId = (params) => {
    console.log("url:" +process.env.REACT_APP_API_BASE_URL + "/v1/receipt/getSumReceiptByContractId") ;
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/receipt/getSumReceiptByContractId", params);
}












