import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'

//axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt');

export const createArticle = (article) => {
    
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/articles/create", article);
    
}

export const updateArticle = (article) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/articles/update", article);
    
}


export const getArticles = () => {
  
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/articles/all", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const getArticle = (articleId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/articles/get/" + articleId);
}

export const removeArticle = (articleId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/articles/remove/" + articleId);
}
