
import { getSecured, postSecured } from '../../../services/ApiClient'
export const removeExpense = (contactId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/Expenses/remove/" + contactId);
}
export const getExpense = (contactId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/Expenses/get/" + contactId);

}
export const getExpenses = (filters) => {
    console.log("url:" +process.env.REACT_APP_API_BASE_URL + "/v1/Expenses/filter") ;
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/Expenses/filter", filters);
}

export const getCountExpenses = (filter) => {
    
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/Expenses/count", filter);
    //return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/packages/filter", {deleted:false , page:1});
}

export const createExpense = (expensObj) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/Expenses/create", expensObj);
}

export const updateExpense = (expensObj) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/Expenses/update", expensObj);
}

export const searchExpenses = (filters) => {
    console.log("insert method searchPackage");
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/Expenses/search/" , filters);

}















