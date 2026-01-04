
//onload event refresh table
window.addEventListener('load', () => {

    //unable tooltip
    $('[data-bs-toggle="tooltip" ]').tooltip();


    refreshForm();
    refreshUserTable();



})

//Validation Of Dynamic dropdown  
const dynamicElementValidator = (element, object, property) => {

    const dynamicElement = element.value;

    user[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");


}


//Confirm Password validator
const passwordValidator = () => {

    if (txtConfPassword.value === txtPassword.value) {

        user.password = txtPassword.value;
        txtConfPassword.classList.remove("is-invalid");
        txtConfPassword.classList.add("is-valid");


    } else {
        user.password = null;
        txtConfPassword.classList.remove("is-valid");
        txtConfPassword.classList.add("is-invalid");

    }
}




//refresh form
const refreshForm = () => {


    //defining new object for data binding at frontend
    user = new Object();
    user.roles = new Array();
    oldUser = null;

    //clean the properties when refreshing form
    selectEmployeeName.value = "";
    txtUserName.value = "";
    txtEmailAddress.value = "";
    txtPassword.value = "";
    txtConfPassword.value = "";
    checkUserStatus.value = "";
    textNote.value = "";


    //Removing Boostrap validation
    selectEmployeeName.classList.remove("is-invalid");
    selectEmployeeName.classList.remove("is-valid");

    txtUserName.classList.remove("is-invalid");
    txtUserName.classList.remove("is-valid");

    txtEmailAddress.classList.remove("is-invalid");
    txtEmailAddress.classList.remove("is-valid");

    txtPassword.classList.remove("is-invalid");
    txtPassword.classList.remove("is-valid");

    txtConfPassword.classList.remove("is-invalid");
    txtConfPassword.classList.remove("is-valid");

    checkUserStatus.classList.remove("is-invalid");
    checkUserStatus.classList.remove("is-valid");

    textNote.classList.remove("is-invalid");
    textNote.classList.remove("is-valid");



    //Filling the dropdown
    let employees = getServiceRequest("/employee/listWithoutUserAccount");
    fillDataIntoSelect(selectEmployeeName, "Select Employee Name", employees, "fullname")



    //Initially selected checkbox
    checkUserStatus.checked = "checked";
    labelUserStatusLabel.innerText = "User account is Active";

    //Object property initialy true
    user.status = true;


    //Creating Role List from backend data
    let roles = getServiceRequest("role/alldatawithoutadmin");
    let divRole = document.querySelector("#divRole");

    //Cleaning the inner HTML
    divRole.innerHTML = "";

    let RoleLabel = document.createElement("label");
    RoleLabel.className = "form-label fw-bold";
    RoleLabel.innerText = "Role :   ";

    divRole.appendChild(RoleLabel);


    roles.forEach((role, index) => {

        console.log(role);

        //Creating the div element
        let div = document.createElement("div");
        div.className = "form-check form-check-inline";

        divRole.appendChild(div);

        //Creating the input check
        let checkInput = document.createElement("input");
        checkInput.type = "checkbox";
        checkInput.id = role.id;
        checkInput.className = "form-check-input";

        //Roles get selected when they are clicked
        checkInput.onclick = () => {
            console.log(checkInput);

            if (checkInput.checked) {
                //Adding roles to the list
                user.roles.push(role);



            } else {
                //Finding the location of the clicked role and removing it (pop) from the list
                let extIndex = user.roles.map(userrole => userrole.name).indexOf(role.name); // This find that whether thereis a like that and that role
                //is equal to the selected one and if it so, return it....
                //extIndex != -1 ---> this shows  extIndex exists....
                if (extIndex != -1) {
                    user.roles.splice(extIndex, 1);

                }

            }


        }

        div.appendChild(checkInput);

        //Creating Labels

        let roleLabels = document.createElement("label");
        roleLabels.className = "form-label";
        roleLabels.innerText = role.name;

        div.appendChild(roleLabels);


    });



    //Enabling the fileds which get disabled during refill function
    selectEmployeeName.disabled = false;
    txtPassword.disabled = false;
    txtConfPassword.disabled = false;



    //Update button getsdissapeared when refresh function executed
    buttonUpdate.style.display = "none";
    buttonSubmit.style.display = "block";


}




//check errors in the form
const checkFormError = () => {

    //need to check all required properties
    let errors = "";

    if (user.employee_id == null) {
        errors = errors + "Please Select Employee Name..!\n";

    }

    if (user.username == null) {
        errors = errors + "Please Enter a valid User Name..!\n";

    }


    if (user.email == null) {
        errors = errors + "Please Enter a valid Email..!\n";

    }


    if (user.password == null) {
        errors = errors + "Please Enter a valid Password..!\n";

    }


    if (oldUser == null) {
        if (txtConfPassword.value == "") {
            errors = errors + "Please Enter the Confirm Password..!\n";

        }

    }


    if (user.roles.length === 0) {
        errors = errors + "Please Select Role...!\n";

    }

    if (user.status == null) {
        errors = errors + "Please Select Status...!\n";

    }


    return errors;


}



//Employee form Submit Function
const buttonUserSubmit = () => {


    console.log(user);

    //Check form error for required element
    let errors = checkFormError();

    if (errors == "") {



        let userConfirmMsg1 =

            "\n Employee Name :" + user.employee_id.fullname +
            "\n User Name :" + user.username +
            "\n Email:" + user.email +
            "\n Status:" + user.status +
            "\n Roles:" + getRoles(user);



        swal({
            title: "Are you sure to Submit Following Details..?",
            text: userConfirmMsg1,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((userResponce) => {

            if (userResponce) {
                //call post service
                let postResponce = getHTTPServiceRequest("/user/insert", "POST", user);
                if (postResponce == "OK") {
                    swal("Saved Successfully ....!");




                    refreshUserTable();
                    refreshForm();

                    $("#userForm").modal("hide");



                } else {
                    swal("Failed to submit..! \n" + postResponce);

                }


            }

        });




    } else {

        swal("Form has following errors...\n\n" + errors);

    }

}






//refresh table area
const refreshUserTable = () => {


    let users = getServiceRequest("/user/alldata");

    //string => string/sate/number
    //function => object/array/boolean
    let propertyList = [
        { propertyName: getEmployeeName, dataType: "function" },
        { propertyName: "username", dataType: "string" },
        { propertyName: "email", dataType: "string" },
        { propertyName: getRoles, dataType: "function" },
        { propertyName: getUserStatus, dataType: "function" }];


    //Calling common function to fill data into table
    fillDataIntoTable1(tableUserBody, users, propertyList, userFormRefill, userDelete, userView, true);




    $('#userTable').DataTable();



}



// //define function in the aim of geting highlighting statuses
const getUserStatus = (dataOb) => {

    if (dataOb.status) {
        return `<p class ="fw-bold" style="background-color : green">Active</p>`;

    } else {
        return `<p class ="fw-bold" style="background-color : red">Not Active</p>`;

    }

}

const getEmployeeName = (dataOb) => {
    return dataOb.employee_id?.fullname;
}



//Retriving Roles  from Assosiation table
const getRoles = (dataOb) => {
    let roles = "";
    dataOb.roles.forEach((role, index) => {
        if (dataOb.roles.length - 1 == index) {
            roles = roles + role.name; // If its the last item in the array, just add the item and not adda comma at the end
        } else {
            roles = roles + role.name + ","; //If its not the last, continue with commas
        }

    });

    return roles;
}





const userFormRefill = (dataOb, index) => {

    //To get comparison between new and old User data
    user = JSON.parse(JSON.stringify(dataOb));
    oldUser = JSON.parse(JSON.stringify(dataOb));


    //Filling the dropdown
    let employees = getServiceRequest("/employee/alldata");// We need to request employee who already have user account  fron database
    fillDataIntoSelect(selectEmployeeName, "Select Employee Name", employees, "fullname")
    selectEmployeeName.disabled = true; // Disable the drop down bqs,all selected employees have an user account


    selectEmployeeName.value = JSON.stringify(user.employee_id); // refilling the drop down with  employee name


    //User Status refill

    if (user.status) {
        checkUserStatus.checked = "checked";
        labelUserStatusLabel.innerText = "Account is Active";
    } else {
        checkUserStatus.checked = "";
        labelUserStatusLabel.innerText = "Account is Not Active";

    }

    //User Name 
    txtUserName.value = dataOb.username;

    //Email
    txtEmailAddress.value = dataOb.email;

    //Password should be disabled 
    txtPassword.disabled = true;

    //Confirm Password --> Disabled
    txtConfPassword.disabled = true;

    //User Note
    if (user.note = null || user.note != undefined) {

        textNote.value = dataOb.note;
    } else {
        textNote.value = "";
    }

    //Roles
    //Creating Role List from backend data
    let roles = getServiceRequest("role/alldatawithoutadmin");
    let divRole = document.querySelector("#divRole");

    //Cleaning the inner HTML
    divRole.innerHTML = "";

    let RoleLabel = document.createElement("label");
    RoleLabel.className = "form-label fw-bold";
    RoleLabel.innerText = "Role :   ";

    divRole.appendChild(RoleLabel);


    roles.forEach((role, index) => {

        console.log(role);

        //Creating the div element
        let div = document.createElement("div");
        div.className = "form-check form-check-inline";

        divRole.appendChild(div);

        //Creating the input check
        let checkInput = document.createElement("input");
        checkInput.type = "checkbox";
        checkInput.id = role.id;
        checkInput.className = "form-check-input";

        //Roles get selected when they are clicked
        checkInput.onclick = () => {
            console.log(checkInput);

            if (checkInput.checked) {
                //Adding roles to the list
                user.roles.push(role);



            } else {
                //Finding the location of the clicked role and removing it (pop) from the list
                let extIndex = user.roles.map(userrole => userrole.name).indexOf(role.name); // This find that whether thereis a like that and that role
                //is equal to the selected one and if it so, return it....
                //extIndex != -1 ---> this shows  extIndex exists....
                if (extIndex != -1) {
                    user.roles.splice(extIndex, 1);

                }

            }


        }


        let extIndex = user.roles.map(userrole => userrole.name).indexOf(role.name); // This find that whether thereis a like that and that role
        //is equal to the selected one and if it so, return it....
        //extIndex != -1 ---> this shows  extIndex exists in the dataOb relevent to the selected User....
        if (extIndex != -1) {
            user.roles.splice(extIndex, 1);
            //If that its exists in the dataOb,check true for selected roles
            checkInput.checked = true;
        }

        div.appendChild(checkInput);

        //Creating Labels

        let roleLabels = document.createElement("label");
        roleLabels.className = "form-label";
        roleLabels.innerText = role.name;

        div.appendChild(roleLabels);


    });


    //Submit button getsdissapeared when refill/edit function executed
    buttonUpdate.style.display = "block";
    buttonSubmit.style.display = "none";


    $("#userForm").modal("show");


}




const checkFormUpdate = () => {


    let updates = "";


    if (user != null && oldUser != null) {

        if (user.employee_id.name != oldUser.employee_id.name) {
            updates = updates + "Employee Name has changed..!\n";
        }

        if (user.username != oldUser.username) {
            updates = updates + "User Name has changed..!\n";
        }


        if (user.email != oldUser.email) {
            updates = updates + "Email Address has changed..!\n";
        }

        if (user.status != oldUser.status) {
            updates = updates + "User Status has changed..!\n";
        }


        if (user.note != oldUser.note) {
            updates = updates + "Note has changed..!\n";
        } //...............................................................Already updatedalways?.............................


        if (user.roles.length != oldUser.roles.length) {
            updates = updates + "User Role has changed..!\n";
        }
        //User Role update will be more deeply implemented on supplier  module


    }


    return updates;

}


//form Update event function
const userUpdate = () => {

    let errors = checkFormError();

    if (errors == "") {

        let updates = checkFormUpdate();
        if (updates == "") {
            swal("Nothing to update..!");

        } else {

            let userConfirmMsg2 = " Are you want to update following..?";

            //Sweet alert function
            swal({
                title: userConfirmMsg2,
                text: updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((userResponce) => {
                    if (userResponce) {


                        //call put service
                        let putResponce = getHTTPServiceRequest("/user/update", "PUT", user);
                        if (putResponce == "OK") {
                            swal("Updated successfully....!", {
                                icon: "success",
                            });



                            refreshForm();
                            refreshUserTable();
                            $("#userForm").modal("hide");


                        } else {
                            swal("Failed to Update ..!Form has following error..\n" + putResponce);


                        }


                    }



                });



        };




    } else {
        swal("Form has following errors..!\n" + errors);

    }



}



//form view event function
const userView = (dataOb, index) => {




}


const printUserRow = () => {

}









// //form delete event function
const userDelete = (dataOb, index) => {

    //need to get user confirmation
    let userConfirmMsg =
        "\n Employee Name :" + dataOb.employee_id.fullname +
        "\n  User Name :" + dataOb.username +
        "\n Email:" + dataOb.email +
        "\n Role:" + dataOb.roles.role +
        "\n Status:" + dataOb.status;



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


                let deleteResponce = getHTTPServiceRequest("/user/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });

                    refreshUserTable();
                    refreshForm();


                } else {
                    swal("Delete Not Sccessfull...!", {
                        icon: "error", text: deleteResponce
                    });

                }

            }



        });




}


const clearUserForm = () => {


    //Sweet alert function
    swal({
        title: "Are you sure to Clear The User Form..?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((userResponce) => {
            if (userResponce) {
                swal("User Form has been cleared....!", {
                    icon: "success",
                });


                refreshForm();
                refreshUserTable();

            }



        });







}



















