import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'

export const getMailTemplates = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/mail-templates/all");
}

export const getMailTemplate = (id) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/mail-templates/get/" + id);
}

export const removeMailTemplate = (id) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/mail-templates/delete/" + id);
}

export const createMailTemplate = (mailTemplate) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/mail-templates/create", mailTemplate);
}

export const updateMailTemplate = (mailTemplate) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/mail-templates/update", mailTemplate);
}


export const getQueuedMessages = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/message-queue/all");
}

export const getQueuedMessage = (id) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/message-queue/get/" + id);
}

export const deleteQueuedMessageItem = (id) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/message-queue/delete/" + id);
}

export const getMyMessages = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/message-queue/userMessages");
}

export const markMessageAsRead = (messageId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/message-queue/markMessageAsRead/" + messageId);
}







