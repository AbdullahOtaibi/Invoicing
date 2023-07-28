import { getSecured, postSecured } from '../../../services/ApiClient'

export const removeReceipt = (contactId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/receipt/remove/" + contactId);
}

export const getReceipt = (contactId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/receipt/get/" + contactId);

}

export const getReceipts = (filters) => {
    console.log("url:" +process.env.REACT_APP_API_BASE_URL + "/v1/receipt/filter") ;
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/receipt/filter", filters);
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














