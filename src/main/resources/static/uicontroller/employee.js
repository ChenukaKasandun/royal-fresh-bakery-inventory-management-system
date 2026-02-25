// //Vallidation- Customer Full Name and Calling Name
const employeeNameElement = document.querySelector("#txtEmployeeName");
const employeeCallingNameElement = document.querySelector("#txtEmployeeCallingName");


employeeNameElement.addEventListener("keyup", () => {
    const employeeNameValue = employeeNameElement.value;
    //Reg Exp pattern ---> First name  starts with a capital letter followed by simpleletters and ends with a space , 
    // + ---> says 1 or more, second medium name part ex= "de"(Dananjya de Siava)followed by a space is optional "?". last name should
    //start with a capital letter folloed by simple letters and no tail space is there......
    const regPattern = new RegExp("^([A-Z][a-z]{1,10}[ ])+([a-z]{2}[ ])?([A-Z][a-z]{1,10})$");

    if (regPattern.test(employeeNameValue)) {

        //valid full name
        employee.fullname = employeeNameValue;

        employeeNameElement.classList.remove("is-invalid");
        employeeNameElement.classList.add("is-valid");

        //generate calling name
        const employeeNameParts = employeeNameValue.split(" ");
        employeeCallingNameElement.innerHTML = " ";
        let optionMsg = document.createElement("option");
        optionMsg.disabled = "disabled";
        optionMsg.selected = "selected";
        optionMsg.value = "";
        optionMsg.innerText = "Select  Calling Name";
        employeeCallingNameElement.appendChild(optionMsg);

        employeeNameParts.forEach(namePart => {
            let option = document.createElement("option");
            option.value = namePart;
            option.innerText = namePart;

            employeeCallingNameElement.appendChild(option);
        });

        //validation of calling name
        employeeCallingNameElement.addEventListener('change', () => {

            employeeCallingNameElement.classList.add("is-valid");
            employee.employee_callingname = employeeCallingNameElement.value;


        })

    }

    else {


        //invalid Employee name
        employeeNameElement.classList.remove("is-valid");
        employeeNameElement.classList.add("is-invalid");
        employee.fullname = null;

    }



})





//validation of NIC
const nicValidator = (nicElement, object, property) => {

    const nicValue = nicElement.value;
    if (nicValue != "") {

        if (new RegExp("^(([0-9]{9}[VvXx])|([0-9]){12})$").test(nicValue)) {
            //Valid NIC
            txtNicNo.classList.remove("is-invalid");
            txtNicNo.classList.add("is-valid");
            employee.nic = nicValue;


        } else {

            //Invalid NIC
            txtNicNo.classList.remove("is-valid");
            txtNicNo.classList.add("is-invalid");
            employee.nic = null;

        }

    } else {

        //Invalid NIC
        txtNicNo.classList.remove("is-valid");
        txtNicNo.classList.add("is-invalid");
        employee.nic = null;
    }


}





//Validation Of DOB
const dateValidator = (dateElement, object, property) => {

    const dateElementValue = dateElement.value;

    if (dateElementValue != "") {

        dateElement.classList.add("is-valid");
        employee.dob = dateElementValue;

    } else {

        dateElement.classList.add("is-invalid");
        employee.dob = null;

    }
}




//Validation Of Dynamic dropdown  
const dynamicElementValidator = (element, object, property) => {

    const dynamicElement = element.value;

    employee[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");


}




//Validation Of Static dropdown  
const staticElementValidator = (element, object, property) => {

    const staticElement = element.value;
    employee[property] = JSON.parse(staticElement);

    element.classList.add("is-valid");

}





//Validation of Gender
const genderValidator = (element, object, property) => {

    let genderElement = element.value;


    if (genderElement != "") {

        if (genderElement.value = "Male") {
            employee.gender = "Male";

        } else {
            employee.gender = "Female";


        }

    } else {
        employee.gender = null;

    }


}





//Onload event
window.addEventListener('load', () => {


    //unable tooltip
    $('[data-bs-toggle="tooltip" ]').tooltip();

    refreshEmployeeTable();

    refreshForm();

})



//Refresh Form function
const refreshForm = () => {

    employee = new Object();

    //clean the properties when refreshing form
    txtEmployeeName.value = "";
    txtEmployeeCallingName.value = "";
    txtMobileNo.value = "";
    textLandNo.value = "";
    txtAddress.value = "";
    txtEmail.value = "";
    txtDob.value = "";
    txtNicNo.value = "";
    selectEmployeeCivilStatus.value = "";
    selectDesignationType.value = "";
    selectEmployeeStatus.value = "";



    radioMale.checked = false;
    radioFemale.checked = false;



    //set initial validation colour when refreshing form
    txtEmployeeName.classList.remove("is-valid");
    txtEmployeeName.classList.remove("is-invalid");

    txtEmployeeCallingName.classList.remove("is-valid");
    txtEmployeeCallingName.classList.remove("is-invalid");

    txtMobileNo.classList.remove("is-valid");
    txtMobileNo.classList.remove("is-invalid");

    textLandNo.classList.remove("is-valid");
    textLandNo.classList.remove("is-invalid");


    txtAddress.classList.remove("is-valid");
    txtAddress.classList.remove("is-invalid");


    txtEmail.classList.remove("is-valid");
    txtEmail.classList.remove("is-invalid");


    txtDob.classList.remove("is-valid");
    txtDob.classList.remove("is-invalid");


    txtNicNo.classList.remove("is-valid");
    txtNicNo.classList.remove("is-invalid");


    selectDesignationType.classList.remove("is-valid");
    selectDesignationType.classList.remove("is-invalid");


    selectEmployeeStatus.classList.remove("is-valid");
    selectEmployeeStatus.classList.remove("is-invalid");

    selectEmployeeCivilStatus.classList.remove("is-valid");
    selectEmployeeCivilStatus.classList.remove("is-invalid");



    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let designations = getServiceRequest("/designation/alldata");

    let employeeStatus = getServiceRequest("/employeestatus/alldata");

    let employeeCivilStatus = getServiceRequest("/emplyeecivilstatus/alldata");





    //Calling function fill data into select
    fillDataIntoSelect(selectDesignationType, "Please select Designation..!", designations, "name");
    fillDataIntoSelect(selectEmployeeStatus, "Please select Employee Status..!", employeeStatus, "name");
    fillDataIntoSelect(selectEmployeeCivilStatus, "Please select Civil Status..!", employeeCivilStatus, "status");

//Update button getsdissapeared when refresh form
    buttonUpdate.style.display = "none";
    buttonSubmit.style.display = "block";

}



//Refresh Employee Table
const refreshEmployeeTable = () => {


    //string => string/sate/number
    //function => object/array/boolean
    let propertyList = [
        { propertyName: "emp_no", dataType: "string" },
        { propertyName: "fullname", dataType: "string" },
        { propertyName: "employee_callingname", dataType: "string" },
        { propertyName: "nic", dataType: "string" },
        { propertyName: "mobileno", dataType: "string" },
        { propertyName: getDesignation, dataType: "function" },
        { propertyName: getEmployeeStatus, dataType: "function" }]


    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let employees = getServiceRequest("/employee/alldata");



    //Calling common function to fill data into table
    fillDataIntoTable1(tableEmployeeBody, employees, propertyList, employeeFormRefill, employeeDelete, employeeView, true);


    $('#employeeTable').DataTable();



}



//get Employee Status
const getEmployeeStatus = (dataOb) => {
    if (dataOb.employeestatus_id.name == "Working") {
        return `<p class='text-success fw-bold'> ${dataOb.employeestatus_id.name}</p>`;

    }

    if (dataOb.employeestatus_id.name == "Resigned") {
        return `<p class='fw-bold' style="color: orange;">${dataOb.employeestatus_id.name}</p>`;
    }

    if (dataOb.employeestatus_id.name == "Removed") {
        return `<p class='text-danger fw-bold'>${dataOb.employeestatus_id.name}</p>`;

    }

}


//Get Employee Designation
const getDesignation = (dataOb) => {
    return dataOb.designation_id.name;

}




//function define for refill customer form
const employeeFormRefill = (ob, index) => {
    console.log("Edit", ob, index);
    //tableCustomerBody.children[index].style.backgroundColor = "orange";

    txtEmployeeName.value = ob.fullname

    let employeeDbNameValue = ob.fullname;

    //Splitting the employee name into parts to fill the calling name dropdown  => to refill the calling name
    let employeeDbNameParts = employeeDbNameValue.split(" ");
    txtEmployeeCallingName.innerHTML = " ";
    let optionMsg1 = document.createElement("option");
    optionMsg1.disabled = "disabled";
    optionMsg1.selected = "selected";
    optionMsg1.value = "";
    optionMsg1.innerText = "Select  Calling Name";
    txtEmployeeCallingName.appendChild(optionMsg1);

    employeeDbNameParts.forEach(namePart => {
        let option = document.createElement("option");
        option.value = namePart;
        option.innerText = namePart;

        txtEmployeeCallingName.appendChild(option);
    });




    //This fills selected calling name element from DB
    txtEmployeeCallingName.value = ob.employee_callingname

    txtMobileNo.value = ob.mobileno
    textLandNo.value = ob.landno
    txtAddress.value = ob.address
    txtEmail.value = ob.email

    txtDob.value = ob.dob;
    txtNicNo.value = ob.nic;


    //gender
    if (ob.gender == "Male") {

        radioMale.checked = true;

    } else {

        radioFemale.checked = true;
    }


    //land no
    if (ob.landno == undefined) {

        textLandNo.value = "";

    } else {

        textLandNo.value = ob.landno;

    }


    employee = JSON.parse(JSON.stringify(ob));
    oldEmployee = JSON.parse(JSON.stringify(ob));


    //Refilling Dynamic dropdowns 
    selectDesignationType.value = JSON.stringify(ob.designation_id);
    selectEmployeeStatus.value = JSON.stringify(ob.employeestatus_id);
    selectEmployeeCivilStatus.value = JSON.stringify(ob.employee_civil_status_id);



    //old employee object vs new employee object(for update function)

    //what actually happened=> actually when object or array is saved in the memory
    //it saved in the heap not in the RAM.In the RAM,only a reference will be saved.
    //when the object or array is changed in to a string, then it is saved in the RAM.
    //Then the new and old saved objects are different.


    $("#modalEmployeeForm").modal("show");

//Add button getsdissapeared when refill form
    buttonUpdate.style.display = "block";
    buttonSubmit.style.display = "none";


}






//function define for delete customer record
const employeeDelete = (dataOb, index) => {

    //need to get user confirmation
    let userConfirmMsg =
        "\n Employee Full Name :" + dataOb.fullname +
        "\n Employee Calling Name :" + dataOb.employee_callingname +
        "\n Employee  Mobile No:" + dataOb.mobileno +
        "\n Employee Email Address:" + dataOb.email +
        "\n Employee NIC:" + dataOb.nic;



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


                let deleteResponce = getHTTPServiceRequest("/employee/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });

                    refreshEmployeeTable();
                    //window.location.reload();
                    refreshForm();


                } else {
                    swal("Delete Not Sccessfull...!", {
                        icon: "error", text: deleteResponce
                    });

                }

            }



        });


}





//function define for view/print  customer record
const employeeView = (ob, index) => {
    console.log("View", ob, index);


    //option 2
    tdEmployeeName.innerText = ob.fullname;
    tdEmployeeCallingName.innerText = ob.employee_callingname;
    tdEmployeeMobileNo.innerText = ob.mobileno;
    tdEmployeeAddress.innerText = ob.address;
    tdEmployeeEmailAddress.innerText = ob.email;
    tdEmployeeNicNo.innerText = ob.nic;

    $("#modalEmployeeView").modal("show");

}


//inner row in view
const printEmployeeRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-employee</title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
        "<body>" + tableEmployeeView.outerHTML + "</body>";


    newWindow.document.write(printView);



    //Print window
    setTimeout(() => {

        newWindow.stop();
        newWindow.print();
        newWindow.close();

    }, 500)


    $("#modalEmployeeView").modal("hide");


}




//check errors in the form
const checkFormError = () => {

    //need to check all required properties

    let errors = "";

    if (employee.fullname == null) {
        errors = errors + "Please Enter a valid Full Name..!\n";

    }


    if (employee.employee_callingname == null) {
        errors = errors + "Please Enter a valid Calling Name..!\n";

    }

    if (employee.mobileno == null) {
        errors = errors + "Please Enter a valid Mobile Number..!\n";

    }

    if (employee.landno == null) {
        errors = errors + "Please Enter a valid land  number..!\n";

    }

    if (employee.email == null) {
        errors = errors + "Please Enter a  valid Email..!\n";

    }

    if (employee.dob == null) {
        errors = errors + "Please Enter valid DOB ...!\n";

    }


    if (employee.nic == null) {
        errors = errors + "Please Enter valid NIC ...!\n";

    }



    if (employee.designation_id == null) {
        errors = errors + "Please Enter the designation ...!\n";

    }


    if (employee.employee_civil_status_id == null) {
        errors = errors + "Please Enter civilstatus ...!\n";

    }


    if (employee.address == null) {
        errors = errors + "Please Enter a  valid Address..!\n";//.................Difference Between Null and Empty String..Passan value even feild isempty.........................

    }


    if (employee.employeestatus_id == null) {
        errors = errors + "Please Enter employee status ...!\n";

    }

    if (employee.gender == null) {
        errors = errors + "Please Enter the gender ...!\n";

    }


    return errors;



}





//Employee form Submit Function
const buttonEmployeeSubmit = () => {


    console.log(employee);

    //Check form error for required element
    let errors = checkFormError();

    if (errors == "") {



        let userConfirmMsg1 =

            "\n Employee Full Name :" + employee.fullname +
            "\n Employee Calling Name :" + employee.employee_callingname +
            "\n Employee  Mobile No:" + employee.mobileno +
            "\n Employee Land No:" + employee.landno +
            "\n Employee Email Address:" + employee.email +
            "\n Employee DOB:" + employee.dob +
            "\n Employee NIC:" + employee.nic +
            "\n Employee Designation:" + employee.designation_id.name +
            "\n Employee Status:" + employee.employeestatus_id.name +
            "\n Employee Civil Status:" + employee.employee_civil_status_id.status +
            "\n Gender:" + employee.gender +
            "\n Address:" + employee.address;


        swal({
            title: "Are you sure to Submit Following Details..?",
            text: userConfirmMsg1,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((userResponce) => {

            if (userResponce) {
                //call post service
                let postResponce = getHTTPServiceRequest("/employee/insert", "POST", employee);
                if (postResponce == "OK") {
                    swal("Saved Successfully ....!");



                    //to reload Table only
                    refreshEmployeeTable();

                    //to reload Form only
                    refreshForm();
                    $("#modalEmployeeForm").modal("hide");



                } else {
                    swal("Failed to submit..! \n" + postResponce);

                }


            }





        });






    } else {

        swal("Form has following errors!...\n\n" + errors);

    }


    console.log(employee);




}




//define  check updates function
const checkFormUpdates = () => {

    let updates = "";

    if (employee != null && oldEmployee != null) {
        if (employee.fullname != oldEmployee.fullname) {
            updates = updates + "Full name has changed..! \n";
        }

        if (employee.employee_callingname != oldEmployee.employee_callingname) {
            updates = updates + "Calling name has changed..! \n";
        }


        if (employee.nic != oldEmployee.nic) {
            updates = updates + "NIC has changed..! \n";
        }


        if (employee.mobileno != oldEmployee.mobileno) {
            updates = updates + "Mobile No has changed..! \n";
        }

        if (employee.landno != oldEmployee.landno) {
            updates = updates + "Land No No has changed..! \n";
        }



        if (employee.address != oldEmployee.address) {
            updates = updates + "Address has changed..! \n";
        }


        if (employee.email != oldEmployee.email) {
            updates = updates + "Email has changed..! \n";
        }

        if (employee.dob != oldEmployee.dob) {
            updates = updates + "DOB has changed..! \n";
        }

        if (employee.designation_id.name != oldEmployee.designation_id.name) {
            updates = updates + "Designation has changed..! \n";
        }

        if (employee.employeestatus_id.name != oldEmployee.employeestatus_id.name) {
            updates = updates + "Employee Status has changed..! \n";
        }

        if (employee.employee_civil_status_id.status != oldEmployee.employee_civil_status_id.status) {
            updates = updates + "Civil has changed..! \n";
        }

    }

    console.log(employee);
    console.log(oldEmployee);



    return updates;




}



//form update event function
const buttonEmployeeUpdate = () => {

    //need to check form errors
    let errors = checkFormError();


    if (errors == "") {

        let updates = checkFormUpdates();
        if (updates == "") {
            swal("Nothing to update..!");

        } else {
            let userConfirmMsg = "Are you sure to update Employee...?";

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
                        let putResponce = getHTTPServiceRequest("/employee/update", "PUT", employee);
                        if (putResponce == "OK") {
                            swal("Updated successfully....!", {
                                icon: "success",
                            });


                            refreshForm();
                            refreshEmployeeTable();
                            $("#modalEmployeeForm").modal("hide");


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



