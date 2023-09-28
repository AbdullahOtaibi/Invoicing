
import { getSecured, postSecured } from '../../../services/ApiClient'
export const removeExpenseCategory = (contactId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/ExpensesCategory/remove/" + contactId);
}
export const getExpenseCategory = (id) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/ExpensesCategory/get/" + id);

}
export const getExpensesCategory = (filters) => {
    console.log("url:" +process.env.REACT_APP_API_BASE_URL + "/v1/ExpensesCategory/filter") ;
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/ExpensesCategory/filter", filters);
}

export const getCountExpensesCategory = (filter) => {
    
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/ExpensesCategory/count", filter);
    //return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/packages/filter", {deleted:false , page:1});
}

export const createExpenseCategory = (expensCategoryObj) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/ExpensesCategory/create", expensCategoryObj);
}

export const updateExpenseCategory = (expensCategoryObj) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/ExpensesCategory/update", expensCategoryObj);
}

export const searchExpensesCategory = (filters) => {
    console.log("insert method searchPackage");
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/ExpensesCategory/search/" , filters);

}















