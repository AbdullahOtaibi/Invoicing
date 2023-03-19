import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'

//axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt');

export const createNavigationMenu = (menu) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/navigation-menus/create", menu);
}

export const updateNavigationMenu = (menu) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/navigation-menus/update", menu);
}


export const getNavigationMenus = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/navigation-menus/all", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const getNavigationMenu = (menuId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/navigation-menus/get/" + menuId);
}

export const removeNavigationMenu = (menuId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/navigation-menus/remove/" + menuId);
}

export const createNavigationMenuItem = (menuItem) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/navigation-menus/addItem",  menuItem);
}

export const getNavigationMenuItem = (menuItemId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/navigation-menus/getItem/" + menuItemId);
}

export const removeNavigationMenuSubItem = (menuItemId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/navigation-menus/removeSubItem/" + menuItemId);
}

export const removeNavigationMenuItem = (menuItemId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/navigation-menus/removeItem/" + menuItemId);
}



export const updateNavigationMenuItem = (menuItem) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/navigation-menus/updateItem",  menuItem);
}

export const reorderMenuItems = (data) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/navigation-menus/reorder-items",  data);
}



export const getArticles = () => {
  
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/articles/all", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}