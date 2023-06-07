import axios from 'axios'

export const createProduct = (product) => {
    return axios.post(process.env.REACT_APP_API_BASE_URL + "/v1/products/create", product,{headers:
        {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}


export const updateProduct = (product) => {
    return axios.post(process.env.REACT_APP_API_BASE_URL + "/v1/products/update", product,{headers:
        {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const searchRelatedProduct = (searchText) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/autoComplete/" + searchText, {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}


export const getProducts = () => {
     return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/all", {headers:
     {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
 }

 export const applyToAll = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/applyToAll", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

 

 export const getMyProducts = (page) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/myProducts/" + page, {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

 

 export const getProductsBycompanyId = (companyId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/bycompany/" + companyId, {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const getProductsByCategoryId = (categoryId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/byCategory/" + categoryId, {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

 export const getProduct = (id) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/get/" + id, {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const removeProduct = (id) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/remove/" + id, {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const cloneProduct = (id) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/clone/" + id, {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const createVariant = (id) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/createVariant/" + id, {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const getVariants = (id) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/getVariants/" + id, {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const unlinkVariant = (id) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/removeVariant/" + id, {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}



export const getAdminProducts = (filters) => {
    return axios.post(process.env.REACT_APP_API_BASE_URL + "/v1/products/adminProducts", filters,{headers:
        {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const fixCategories = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/fixCategories", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const updateApproved = (id, approved) => {
    return axios.post(process.env.REACT_APP_API_BASE_URL + "/v1/products/setApproved", {id: id, approved: approved},{headers:
        {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const updatePublished = (id, published) => {
    return axios.post(process.env.REACT_APP_API_BASE_URL + "/v1/products/setpublished", {id: id, published: published},{headers:
        {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}


export const getCompanies = () => {
  
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/companies/all", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}



