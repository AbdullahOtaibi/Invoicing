import { getSecured, postSecured } from '../../../services/ApiClient'

export const removeContract = (contactId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/contracts/remove/" + contactId);
}

export const getContract = (contractId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/contracts/get/" + contractId);

}

export const getContracts = (filters) => {
    console.log("url:" +process.env.REACT_APP_API_BASE_URL + "/v1/contracts/filter") ;
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/contracts/filter", filters);
}


export const getCountContracts = (filter) => {
    
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/contracts/count", filter);
    //return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/contract/filter", {deleted:false , page:1});
}



export const createContract = (ContractObj) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/contracts/create", ContractObj);
}

export const updateContract = (ContractObj) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/contracts/update", ContractObj);
}

export const searchContract = (filters) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/contracts/search/" , filters);

}














