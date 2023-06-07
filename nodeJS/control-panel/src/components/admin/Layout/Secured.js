import React from 'react'

 const Secured = () => {
    if(!localStorage.getItem("jwt")){
        window.location.href = "/admin/sign-in"
    }
    return (<></>)
}

export default Secured;
