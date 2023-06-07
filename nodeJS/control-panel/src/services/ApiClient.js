import axios from 'axios'

export const postSecured = (relativeUrl, data) => {
    const promise = new Promise((resolve, reject) => {
        axios.post(relativeUrl, data, {
            headers:
                { "authorization": "Bearer " + localStorage.getItem("jwt") }, crossdomain: true
        }).then(res => resolve(res.data)).catch(e => {
            if (e.response && e.response.status === 403) {
                window.location.href = "/admin/sign-in"
            }else{
                reject(e);
            }
            
        });
    });
    return promise;
}


export const upload = (relativeUrl, formData, progressUpdateEvent) => {

    const promise = new Promise((resolve, reject) => {
        axios.post(relativeUrl, formData, {
            headers:
                { "authorization": "Bearer " + localStorage.getItem("jwt"),
                    "Content-Type": "multipart/form-data"
            },onUploadProgress: ProgressEvent => {
                const percentage = parseInt(Math.round((ProgressEvent.loaded * 100)/ ProgressEvent.total))
                progressUpdateEvent(percentage);
            }
            ,
             crossdomain: true
        }).then(res => resolve(res.data)).catch(e => {
            if (e.response && e.response.status === 403) {
                window.location.href = "/admin/sign-in"
            }else{
                reject(e);
            }
            
        });
    });
    return promise;
}



export const getSecured = (relativeUrl) => {

    const promise = new Promise((resolve, reject) => {
        axios.get(relativeUrl, {
            headers:
                { "authorization": "Bearer " + localStorage.getItem("jwt") }, crossdomain: true
        }).then(res => resolve(res.data)).catch(e => {
            if (e.response && e.response.status === 403) {
                window.location.href = "/admin/sign-in"
            }else{
                reject(e);
            }
            
        });

    });
    return promise;
}

export const getUnSecured = (relativeUrl) => {

    const promise = new Promise((resolve, reject) => {
        axios.get(relativeUrl, {
            headers:
                {  }, crossdomain: true
        }).then(res => resolve(res.data)).catch(e => {
            if (e.response && e.response.status === 403) {
                window.location.href = "/admin/sign-in"
            }else{
                reject(e);
            }
            
        });

    });
    return promise;
}



