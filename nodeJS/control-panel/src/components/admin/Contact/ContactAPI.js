
import { getSecured, postSecured } from '../../../services/ApiClient'

export const removeContact = (contactId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/contacts/remove/" + contactId);
}

export const getContact = (contactId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/contacts/get/" + contactId);

}


export const getContractsByContactId = (contactId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/contracts/getContractsByContactId/" + contactId);

}

export const getContacts = (filters) => {
    console.log("url:" +process.env.REACT_APP_API_BASE_URL + "/v1/contacts/filter") ;
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/contacts/filter", filters);
}


export const getCountContacts = (filter) => {
    
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/contacts/count", filter);
    //return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/contacts/filter", {deleted:false , page:1});
}



export const createContact = (invoice) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/contacts/create", invoice);
}

export const updateContact = (invoice) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/contacts/update", invoice);
}


export const getContactInvoices = (filters) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/invoices/filter", filters);
}
export const getContactAppointments = (filters) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/FullCalendars/filter", filters);
}


export const searchContact = (filters) => {
    console.log("insert method searchContact");
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/contacts/search/" , filters);

}










