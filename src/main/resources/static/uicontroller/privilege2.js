
//browser load event handler
window.addEventListener("load", () => {


    //call refresh form function
    refreshPrivilegeForm();
    //call refresh table function
    refreshPrivilegeTable();


});



//Validation Of Dynamic dropdown  
const dynamicElementValidator = (element, object, property) => {

    const dynamicElement = element.value;

    privilege[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");


}



//refresh privilege form
const refreshPrivilegeForm = () => {


    //for data binding
    privilege = new Object();


    checkSelect.checked = false;
    privilege.privi_select = false;
    labelSelect.innerText = "Select privilege Not Granted";

    checkInsert.checked = false;
    privilege.privi_insert = false;
    labelInsert.innerText = "Insert privilege Not Granted";


    checkUpdate.checked = false;
    privilege.privi_update = false;
    labelUpdate.innerText = "Update privilege Not Granted";


    checkDelete.checked = false;
    privilege.privi_delete = false;
    labelDelete.innerText = "Delete privilege Not Granted";




    //remove boostrap classes
    selectRole.classList.remove("is-valid");
    selectRole.classList.remove("is-invalid");

    selectModule.classList.remove("is-valid");
    selectModule.classList.remove("is-invalid");




    let roles = getServiceRequest("/role/alldata");
    let modules = getServiceRequest("/employeemodule/alldata");

    fillDataIntoSelect(selectRole, "Please Select  Role", roles, "name");
    fillDataIntoSelect(selectModule, "Please Select Module", modules, "name");



}




//Checking form error
const checkFormError = () => {

    let errors = "";

    if (privilege.role_id == null) {
        errors = errors + "Please Select Role..!\n";

    }

    if (privilege.module_id == null) {
        errors = errors + "Please Select Module..!\n";

    }


    return errors;
}

//


const getSelect1 = (ob) => {
    if (ob.privi_select) {

        return "Granted";


    } else {
        return "Not Granted";

    }
}

const getInsert1 = (ob) => {
    if (ob.privi_insert) {
        return "Granted";

    } else {
        return "Not Granted";

    }
}

const getUpdate1 = (ob) => {
    if (ob.privi_update) {
        return "Granted";


    } else {
        return "Not Granted";
    }
}

const getDelete1 = (ob) => {
    if (ob.privi_delete) {
        return "Granted";


    } else {
        return "Not Granted";

    }
}




//Submit Function
const buttonPrivilegeSubmit = () => {


    let errors = checkFormError();
    if (errors == "") {

        let userConfirm =
            "\n Role is : " + privilege.role_id.name +
            "\n Module is : " + privilege.module_id.name +
            "\n Select is : " + getSelect1(privilege) +
            "\n Insert is : " + getInsert1(privilege) +
            "\n Update is : " + getUpdate1(privilege) +
            "\n Delete is : " + getDelete1(privilege);


        //Sweet alert function
        swal({
            title: "Are you sure to Submit Folllowing Changes..?",
            text: userConfirm,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((userResponse) => {

                if (userResponse) {
                    let postResponse = getHTTPServiceRequest("/privilege/insert", "POST", privilege);
                    if (postResponse === "OK") {
                        swal("Saved successfully....!", {
                            icon: "success",
                        });

                        refreshPrivilegeTable();
                        refreshPrivilegeForm();

                        $("#userForm").modal("hide");


                    } else {
                        swal("Failed to submit..! \n" + postResponse);

                    }

                }



            });



    } else {

        swal("form has following errors..\n" + errors);

    }


}



const getRole = (ob) => { return ob.role_id.name; }
const getModule = (ob) => { return ob.module_id.name; }


const getSelect = (ob) => {
    if (ob.privi_select) {

        return `<p class='text-success fw-bold' >Granted</p>`;


    } else {
        return `<p class='text-danger fw-bold'>Not Granted</p>`;

    }
}

const getInsert = (ob) => {
    if (ob.privi_insert) {
        return `<p class='text-success fw-bold' >Granted</p>`;



    } else {
        return `<p class='text-danger fw-bold'>Not Granted</p>`;

    }
}

const getUpdate = (ob) => {
    if (ob.privi_update) {
        return `<p class='text-success fw-bold' >Granted</p>`;



    } else {
        return `<p class='text-danger fw-bold'>Not Granted</p>`;
    }
}

const getDelete = (ob) => {
    if (ob.privi_delete) {
        return `<p class='text-success fw-bold' >Granted</p>`;


    } else {
        return `<p class='text-danger fw-bold'>Not Granted</p>`;

    }
}





//Refresh privilege Table 
const refreshPrivilegeTable = () => {

    //retrive data from the database using common ajax function defined in common.js
    let privileges = getServiceRequest("/privilege/alldata");


    let columns = [


        { propertyName: getRole, dataType: "function" },
        { propertyName: getModule, dataType: "function" },
        { propertyName: getSelect, dataType: "function" },
        { propertyName: getInsert, dataType: "function" },
        { propertyName: getUpdate, dataType: "function" },
        { propertyName: getDelete, dataType: "function" }
    ];


    //call fillDataIntoTable function(tableBodyId,dataList,propertyList,refillFunction,deleteFunction,printFunction,buttonVisibility)
    fillDataIntoTable1(tablePrivilegeBody, privileges, columns, privilegeFormRefill, privilegeDelete, privilegeView, true);


    $('#tablePrivilege').DataTable();



}



//Refill/edit Function
const privilegeFormRefill = (ob, rowindex) => {


    //To identify the updates in the dataOb and privilege object
    privilege = JSON.parse(JSON.stringify(ob));
    oldprivilege = JSON.parse(JSON.stringify(ob));

    selectRole.value = JSON.stringify(ob.role_id);
    selectModule.value = JSON.stringify(ob.module_id);

    if (ob.privi_select) {
        checkSelect.checked = true;
        labelSelect.innerText = "Select privilege  Granted";


    } else {
        checkSelect.checked = false;
        labelSelect.innerText = "Select privilege Not Granted";


    }

    if (ob.privi_insert) {
        checkInsert.checked = true;
        labelInsert.innerText = "Insert privilege Granted";


    } else {
        checkInsert.checked = false;
        labelInsert.innerText = "Insert privilege Not Granted";

    }

    if (ob.privi_update) {
        checkUpdate.checked = true;
        labelUpdate.innerText = "Update privilege  Granted";


    } else {
        checkUpdate.checked = false;
        labelUpdate.innerText = "Update privilege Not Granted";

    }

    if (ob.privi_delete) {

        checkDelete.checked = true;
        labelDelete.innerText = "Delete privilege Granted";

    } else {

        checkDelete.checked = false;
        labelDelete.innerText = "Delete privilege Not Granted";

    }

    $("#userForm").modal("show");


}




//Check Form Updates
const checkFormUpdate = () => {

    let updates = "";
    if (privilege != null && oldprivilege != null) {
        if (privilege.role_id.name != oldprivilege.role_id.name) {
            updates = updates + "Role is Changed...! \n"

        }

        if (privilege.module_id.name != oldprivilege.module_id.name) {
            updates = updates + "Module is Changed...!\n"

        }


        if (privilege.privi_select != oldprivilege.privi_select) {
            updates = updates + "Select Privilege is Changed...!\n"

        }

        if (privilege.privi_insert != oldprivilege.privi_insert) {
            updates = updates + "Insert Privilege is Changed...!\n"

        }

        if (privilege.privi_update != oldprivilege.privi_update) {
            updates = updates + "Update privilege is Changed...!\n"

        }

        if (privilege.privi_delete != oldprivilege.privi_delete) {
            updates = updates + "Delete privilege is Changed...!\n"

        }

        return updates;



    }
}


//Update Function
const buttonPrivilegeUpdate = () => {
    let errors = checkFormError();

    if (errors == "") {

        let updates = checkFormUpdate();
        if (updates == "") {
            swal("Nothing to update..!");

        } else {
            let userConfirmMsg = "Are you sure to update Privilege...?";

            //Sweet alert function
            swal({
                title: userConfirmMsg,
                text: updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((userResponce) => {
                    if (userResponce) {


                        //call put service
                        let putResponce = getHTTPServiceRequest("/privilege/update", "PUT", privilege);
                        if (putResponce == "OK") {
                            swal("Updated successfully....!", {
                                icon: "success",
                            });


                            refreshPrivilegeForm();
                            refreshPrivilegeTable();
                            $("#userForm").modal("hide");


                        } else {
                            swal("Failed to Update ..!Form has following error..\n" + putResponce);


                        }


                    }



                });





        }

    } else {
        swal("Form has following error..\n" + errors)

    }




}


//define functions to get crud opertion values from daOb to delete function
const privi_selectStatus = (dataOb) => {
    if (dataOb.privi_select) {
        return "Granted";

    } else {
        return "Not granted";
    }
}


const privi_insertStatus = (dataOb) => {
    if (dataOb.privi_insert) {
        return "Granted";

    } else {
        return "Not granted";
    }
}


const privi_updateStatus = (dataOb) => {
    if (dataOb.privi_update) {
        return "Granted";

    } else {
        return "Not granted";
    }
}


const privi_deleteStatus = (dataOb) => {
    if (dataOb.privi_delete) {
        return "Granted";

    } else {
        return "Not granted";
    }
}


//Delete Function
const privilegeDelete = (dataOb, index) => {



    let userConfirmMsg =
        "\n Role : " + dataOb.role_id.name +
        "\n Module : " + dataOb.module_id.name +
        "\n Select : " + privi_selectStatus(dataOb) +
        "\n Insert : " + privi_insertStatus(dataOb) +
        "\n Update : " + privi_updateStatus(dataOb) +
        "\n Delete : " + privi_deleteStatus(dataOb);



    //Sweet alert function
    swal({
        title: "Are you sure to delete..?",
        text: userConfirmMsg,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((userResponce) => {
            if (userResponce) {


                let deleteResponce = getHTTPServiceRequest("/privilege/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });

                    refreshPrivilegeForm();
                    refreshPrivilegeTable();


                } else {
                    swal("Delete Not Sccessfull...!", {
                        icon: "error", text: deleteResponce
                    });

                }

            }



        });





}





//function define for print privilege record
const privilegeView = (ob, index) => {



    tdRole.innerText = ob.role_id.name;
    tdModule.innerText = ob.module_id.name;
    tdSelect.innerHTML = getSelect(ob);
    tdInsert.innerHTML = getInsert(ob);
    tdUpdate.innerHTML = getUpdate(ob);
    tdDelete.innerHTML = getDelete(ob);

    $("#modalPrivilegeView").modal("show");



}

const printPrivilegeRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-Privilege</title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
        "<body>" + tablePrivilegeView.outerHTML + "</body>";


    newWindow.document.write(printView);



    //Print window
    setTimeout(() => {

        newWindow.stop();
        newWindow.print();
        newWindow.close();

    }, 500)


    $("#modalPrivilegeView").modal("hide");


}


