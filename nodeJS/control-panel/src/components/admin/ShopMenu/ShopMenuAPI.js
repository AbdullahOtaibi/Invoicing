import axios from 'axios'


export const createShopMenu = (shopMenu) => {
    return axios.post(process.env.REACT_APP_API_BASE_URL + "/v1/shop-menu/create", shopMenu, {
        headers:
            { "authorization": "Bearer " + localStorage.getItem("jwt") }, crossdomain: true
    });
}

export const updateShopMenu = (shopMenu) => {
    return axios.post(process.env.REACT_APP_API_BASE_URL + "/v1/shop-menu/update", shopMenu, {
        headers:
            { "authorization": "Bearer " + localStorage.getItem("jwt") }, crossdomain: true
    });
}

export const getShopMenu = (id) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/shop-menu/" + id, {
        headers:
            { "authorization": "Bearer " + localStorage.getItem("jwt") }, crossdomain: true
    });
    
}

export const getShopMenuByShopId = (id) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/shop-menu/byShopId/" + id, {
        headers:
            { "authorization": "Bearer " + localStorage.getItem("jwt") }, crossdomain: true
    });
    
}

