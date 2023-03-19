
function myFileBrowser(field_name, url, type, win) {

    // alert("Field_Name: " + field_name + "nURL: " + url + "nType: " + type + "nWin: " + win); // debug/testing

    /* If you work with sessions in PHP and your client doesn't accept cookies you might need to carry
       the session name and session ID in the request string (can look like this: "?PHPSESSID=88p0n70s9dsknra96qhuk6etm5").
       These lines of code extract the necessary parameters and add them back to the filebrowser URL again. */

    var cmsURL = "/MediaManager";// window.location.toString();    // script URL - use an absolute path!
    if (cmsURL.indexOf("?") < 0) {
        //add the type as the only query parameter
        cmsURL = cmsURL + "?type=" + type;
    }
    else {
        //add the type as an additional query parameter
        // (PHP session ID is now included if there is one at all)
        cmsURL = cmsURL + "&type=" + type;
    }

     tinyMCE.activeEditor.windowManager.open({
        file: cmsURL,
        title: 'AWW File Browser',
        width: 700,  // Your dimensions may differ - toy around with them!
        height: 600,
        resizable: "yes",
        inline: "yes",  // This parameter only has an effect if you use the inlinepopups plugin!
        close_previous: "no"
    }, {
        window: win,
        input: 'selected_file'
    });
    

   // tinyMCEPopup.onInit.add(FileBrowserDialogue.init, FileBrowserDialogue);
    return false;
}






function fileSelected(filePath) {
    window.document.getElementById(my_field).value = filePath;
    //$(".mce-textbox:first").val(filePath);
}


function uploadPhoto() {
    // alert('File Uploading...');
    var formData = new FormData();
    //jQuery.each(jQuery('#FilePath')[0].files, function (i, file) {
    //    formData.append('files', file);
    //});
    //var formData = new FormData(document.getElementById("FilePath"));
    
    formData.append('files', $('#fileUpload').get(0).files[0]);
    $.ajax({
        type: "POST",
        url: "/MediaManager/UploadPhoto",
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        dataType: 'json',

        success: function (msg) {
            console.log(msg);
            fileSelected(msg);
            location.reload();
        },
        error: function (er) {
            console.log(er);
            console.log(er.responseText);
           // fileSelected(er.responseText);
            // alert(er);
            location.reload();
        }
    });

}