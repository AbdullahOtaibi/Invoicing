import axios from 'axios'
import { getSecured, postSecured } from './ApiClient'

export const getProduct = (productId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/get/"+ productId);
}

export const getProductByCode = (code) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/getByCode/"+ code);
}

export const getLatestProducts = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/latest");
}

export const getProductsWithDiscount = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/offers");
}



export const getProductsByCategoryId = (categoryId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/byCategoryId/"+ categoryId);
}

export const getProductsBycompanyId = (companyId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/bycompany/"+ companyId);
}


export const getCategory = (id) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/productCategories/get/"+ id);
}

export const getCategoryByUrl = (id) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/productCategories/getByUrl/"+ id);
}



export const getAllProducts = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/all");
}

export const getMainCategories = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/productCategories/mainCategories");
}





export const getSubCategories = (parentId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/productCategories/subCategories/" + parentId);
}

export const getSubCategoriesByUrl = (parentId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/productCategories/subCategoriesByUrl/" + parentId);
}



export const getRecentProducts = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/recent");
}


export const getVariants = (id) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/products/getVariants/" + id);
}

export const filterProducts = (filters) => {

    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/products/filter",filters);
}

export const getProductCategories = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/productCategories/all", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}





