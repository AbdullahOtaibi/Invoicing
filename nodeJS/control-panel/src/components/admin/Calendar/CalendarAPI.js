import { getSecured, postSecured, httpGet } from '../../../services/ApiClient'

export const createCalendarEvent = (calendarEvent) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/calendar/create", calendarEvent);
}

export const updateCalendarEvent = (calendarEvent) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/calendar/update", calendarEvent);
}


export const getCalendarEvents = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/calendar/all");
}

export const getCalendarEvent = (eventId) => {
    return httpGet(process.env.REACT_APP_API_BASE_URL + "/v1/calendar/get/" + eventId);
}

export const removeCalendarEvent = (eventId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/calendar/remove/" + eventId);
}
