

export const hasPermission = permissionCode =>{
    return (localStorage.getItem("permissions") != null && localStorage.getItem("permissions").indexOf(permissionCode) > -1);
}