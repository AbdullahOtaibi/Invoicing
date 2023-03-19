import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'

//axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt');

export const createMenu = (menu) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/menus/create", menu);
}

export const updateMenu = (menu) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/menus/update", menu);
}


export const getMenus = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/menus/all", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const getMenu = (menuId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/menus/get/" + menuId);
}

export const removeMenu = (menuId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/menus/remove/" + menuId);
}


export const getMenuItem = (menuItemId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/menus/getItem/" + menuItemId);
}

export const updateMenuItem = (menuItem) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/menus/updateItem",  menuItem);
}
