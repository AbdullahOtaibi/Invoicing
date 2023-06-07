import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'


export const createGalleryItem = (galleryItem) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/gallery/create", galleryItem);
}

export const updateGalleryItem = (galleryItem) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/gallery/update", galleryItem);
}


export const getGalleryItems = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/gallery/all", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const getGalleryItem = (galleryItemId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/gallery/get/" + galleryItemId);
}

export const removeGalleryItem = (galleryItemId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/gallery/remove/" + galleryItemId);
}
