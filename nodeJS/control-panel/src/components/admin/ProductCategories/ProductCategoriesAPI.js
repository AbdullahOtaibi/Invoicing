import axios from 'axios'

export const createProductCategory = (category) => {
    return axios.post(process.env.REACT_APP_API_BASE_URL + "/v1/productCategories/create", category,{headers:
        {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}


export const updateProductCategory = (category) => {
    return axios.post(process.env.REACT_APP_API_BASE_URL + "/v1/productCategories/update", category,{headers:
        {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}


export const getProductCategories = () => {
     return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/productCategories/all", {headers:
     {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
 }

 export const getAllProductCategoriesWithCounts = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/productCategories/mainWithProductsCount", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

 export const applyToAllCategories = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/productCategories/applyToAll", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

 

 export const updateUrls = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/productCategories/updateUrls", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

 

 export const getMainCategories = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/productCategories/main", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const getMainCategoriesWithCounts = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/productCategories/mainWithCounts", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}



export const getSubCategories = (parentId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/productCategories/sub/" + parentId, {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const getSubCategoriesWithCounts = (parentId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/productCategories/subWithCounts/" + parentId, {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}



 export const getCompanyCategories = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/productCategories/CompanyCategories", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const getMyCategories = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/productCategories/cp/forProduct", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

 export const getProductCategory = (id) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/productCategories/get/" + id, {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const removeProductCategory = (id) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/productCategories/remove/" + id, {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}


