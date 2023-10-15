import { getSecured, postSecured } from '../../../services/ApiClient'

export const createCategory = (category) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/categories/create", category);
}


export const updateCategory = (category) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/categories/update", category);
}


export const getCategories = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/categories/all");
 }

 export const getCategory = (id) => {
     return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/categories/get/" + id);
}

export const removeCategory = (id) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/categories/remove/" + id);
}


