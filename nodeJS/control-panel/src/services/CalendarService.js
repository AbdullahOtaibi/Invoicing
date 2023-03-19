import axios from 'axios'


export const getCalendarEvent = (eventId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/calendar/get/"+ eventId);
}


export const getCalendarEvents = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/calendar/all");
}


