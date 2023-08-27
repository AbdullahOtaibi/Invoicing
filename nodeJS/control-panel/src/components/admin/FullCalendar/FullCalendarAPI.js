
import { getSecured, postSecured } from '../../../services/ApiClient'

export const removeFullCalendar = (fullCalendarId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/FullCalendars/remove/" + fullCalendarId);
}

export const getFullCalendar = (fullCalendarId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/FullCalendars/get/" + fullCalendarId);
}


export const getFullCalendars = (filters) => {
    console.log("url:" +process.env.REACT_APP_API_BASE_URL + "/v1/FullCalendars/filter") ;
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/FullCalendars/filter", filters);
}

export const getCountFullCalendars = (filter) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/FullCalendars/count", filter);
    //return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/filter", {deleted:false , page:1});
}

export const deleteFullCalendar = (id) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/FullCalendars/deleteItem/" + id);
}

export const creatFullCalendar = (fullCalendar) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/FullCalendars/create", fullCalendar);
}

export const checkForIntersection = (filters) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/FullCalendars/checkForIntersection", filters);
}

export const updateFullCalendar= (fullCalendar) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/FullCalendars/update", fullCalendar);
}

