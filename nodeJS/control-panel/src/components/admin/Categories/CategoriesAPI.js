import axios from 'axios'

export const createCategory = (category) => {
    return axios.post(process.env.REACT_APP_API_BASE_URL + "/v1/categories/create", category,{headers:
        {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}


export const updateCategory = (category) => {
    return axios.post(process.env.REACT_APP_API_BASE_URL + "/v1/categories/update", category,{headers:
        {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}


export const getCategories = () => {
     return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/categories/all", {headers:
     {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
 }

 export const getCategory = (id) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/categories/get/" + id, {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const removeCategory = (id) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/categories/remove/" + id, {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}


