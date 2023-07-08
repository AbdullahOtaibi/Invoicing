
import { getSecured, postSecured } from '../../../services/ApiClient'

export const removePackage = (contactId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/packages/remove/" + contactId);
}

export const getPackage = (contactId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/packages/get/" + contactId);

}

export const getPackages = (filters) => {
    console.log("url:" +process.env.REACT_APP_API_BASE_URL + "/v1/packages/filter") ;
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/packages/filter", filters);
}


export const getCountPackages = (filter) => {
    
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/packages/count", filter);
    //return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/packages/filter", {deleted:false , page:1});
}



export const createPackage = (packageObj) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/packages/create", packageObj);
}

export const updatePackage = (packageObj) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/packages/update", packageObj);
}


export const searchPackage = (filters) => {
    console.log("insert method searchPackage");
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/packages/search/" , filters);

}















