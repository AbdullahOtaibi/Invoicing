import { getSecured } from '../../../services/ApiClient'

export const getCalendarEvent = (eventId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/calendar/get/"+ eventId);
}


export const getCalendarEvents = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/calendar/all");
}


