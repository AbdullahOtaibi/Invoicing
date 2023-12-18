import axios from 'axios'

export const httpGet = (relativeUrl) => {
    const promise = new Promise((resolve, reject) => {
        axios.get(process.env.REACT_APP_API_BASE_URL + relativeUrl, {
            withCredentials: false,
            headers:
                { "authorization": "Bearer " + localStorage.getItem("jwt") }, crossdomain: true
        }).then(res => {
            resolve(res.data);
        }).catch(e => {
            reject({ success: false, errorMessage: e.message });
        });
    });
    return promise;
}

export const httpPost = (relativeUrl, payload) => {
    const promise = new Promise((resolve, reject) => {
        axios.post(process.env.REACT_APP_API_BASE_URL + relativeUrl, payload, {
            withCredentials: false,
            headers:
                { "authorization": "Bearer " + localStorage.getItem("jwt") }, crossdomain: true
        })
            .then(res => {
                resolve(res.data);
            }).catch(e => {
                reject({ success: false, errorMessage: e.message });
            });
    });
    return promise;
}




export const postSecured = (relativeUrl, data) => {
    const promise = new Promise((resolve, reject) => {
        axios.post(relativeUrl, data, {
            withCredentials: false,
            headers:
                { "authorization": "Bearer " + localStorage.getItem("jwt") }, crossdomain: true
        }).then(res => resolve(res.data)).catch(e => {
            if (e.response && e.response.status === 403) {
                window.location.href = "/sign-in"
            } else {
                reject(e);
            }

        });
    });
    return promise;
}


export const upload = (relativeUrl, formData, progressUpdateEvent) => {

    const promise = new Promise((resolve, reject) => {
        axios.post(relativeUrl, formData, {
            withCredentials: false,
            headers:
            {
                "authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "multipart/form-data"
            }, onUploadProgress: ProgressEvent => {
                const percentage = parseInt(Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total))
                progressUpdateEvent(percentage);
            }
            ,
            crossdomain: true
        }).then(res => resolve(res.data)).catch(e => {
            if (e.response && e.response.status === 403) {
                window.location.href = "/sign-in"
            } else {
                reject(e);
            }

        });
    });
    return promise;
}



export const getSecured = (relativeUrl) => {

    const promise = new Promise((resolve, reject) => {
        axios.get(relativeUrl, {
            withCredentials: false,
            headers:
                { "authorization": "Bearer " + localStorage.getItem("jwt") }, crossdomain: true
        }).then(res => resolve(res.data)).catch(e => {
            if (e.response && e.response.status === 403) {
                window.location.href = "/sign-in"
            } else {
                reject(e);
            }

        });

    });
    return promise;
}

export const getUnSecured = (relativeUrl) => {

    const promise = new Promise((resolve, reject) => {
        axios.get(relativeUrl, {
            withCredentials: false,
            headers:
                {}, crossdomain: true
        }).then(res => resolve(res.data)).catch(e => {
            if (e.response && e.response.status === 403) {
                window.location.href = "/sign-in"
            } else {
                reject(e);
            }

        });

    });
    return promise;
}



export const downloadXLSFile = async (URL) => {

    // Its important to set the 'Content-Type': 'blob' and responseType:'arraybuffer'.
    const headers = { 'Content-Type': 'blob', "authorization": "Bearer " + localStorage.getItem("jwt") };

    const config = { method: 'POST', url: URL, responseType: 'arraybuffer', headers };


    return new Promise((resolve, reject) => {
        try {
            axios(config).then(response => {
                // const outputFilename = `${Date.now()}.xls`;
                console.log(response)
                // If you want to download file automatically using link attribute.
                const url = window.URL.createObjectURL(new Blob([response.data]));
                resolve(url);
            });
            // OR you can save/write file locally.
            // fs.writeFileSync(outputFilename, response.data);
        } catch (error) {
            console.log(error)

            reject(error);
            //throw Error(error);
        }
    });


}