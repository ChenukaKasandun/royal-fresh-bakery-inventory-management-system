

//Onload event
window.addEventListener('load', () => {

    //unable tooltip
    $('[data-bs-toggle="tooltip" ]').tooltip();

    refreshForm2();
    refreshForm1();


    // Refreshing inner form and table
    refreshInnerFormAndTable();
    refreshCustomerTable();
})


//Validation Of Dynamic dropdown  
const dynamicElementValidator = (element, object, property) => {

    const dynamicElement = element.value;

    customer[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");

}


//Refresh Customer Form
const refreshForm1 = () => {

    //Resetting the customer form
    formIndividual.reset();

    //Removing Validation Colours using a common function declared in common.js
    setDefault([txtCustomerName_tab1, selectCustomerStatus_tab1, txtMobileNo_tab1,txtEmailAddress_tab1,
        txtaddress_tab1,textNote_tab1,txtaddress_tab1]);

    //Customer Form Record(For Data Binding)
    customer = new Object();

    // Creating a new array for transmitting inner form data into the main object
    customer.customerHasItemList = new Array();

    //Initially setting the customer type as "Individual" while refreshing the form
    customer.customer_type_id = { id: 1, type: "Individual" };

    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    //Requesting customer status other than "Deleted"
    let statuses = getServiceRequest("/customerstatus/getbycustomerstatus");

    //Filling data into dropdowns
    fillDataIntoSelect(selectCustomerStatus_tab1, "Please select Customer Status..!", statuses, "status");

    //Update button gets dissapeared when edit function executed
    buttonSubmit1.style.display = "block";
    buttonUpdate1.style.display = "none";

}



const refreshForm2 = () => {

    //Cleaning the fields oif the form
    formShop.reset();

    //Removing Validation Colours using a common function declared in common.js
    setDefault([txtCustomerName_tab2, txtMobileNo_tab2, txtEmailAddress_tab2,txtaddress_tab2,textNote_tab2,selectVehicleRoute_tab2,
      ]);

    //Customer Form Record(For Data Binding)
    customer = new Object();

    // Creating a new array for transmitting inner form data into the main object
    customer.customerHasItemList = new Array();

    //Initially setting the customer type as "Shop " after refreshing the form
    customer.customer_type_id = { id: 2, type: "Shop" };

    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let vehicleRoute = getServiceRequest("vehicleroute/alldata");

    //Filling Data into the dropdown
    fillDataIntoSelect(selectVehicleRoute_tab2, "Please select Vehicle Route", vehicleRoute, "name");

    //Update button getsdissapeared when edit function executed
    buttonSubmit2.style.display = "block";
    buttonUpdate2.style.display = "none";

}


//check errors in the form1 
const checkFormError1 = () => {

    //need to check all required properties
    let errors = "";

    if (customer.name == null) {
        errors = errors + "Please Enter a valid Customer Name..!\n";

    }

    if (customer.customer_status_id == null) {
        errors = errors + "Please Select Customer Status..!\n";

    }

    if (customer.mobileno == null) {
        errors = errors + "Please Enter a  valid Mobile Number..!\n";

    }

    if (customer.email == null) {
        errors = errors + "Please Enter a valid Email..!\n";

    }

    if (customer.address == null) {
        errors = errors + "Please Enter a valid Address..!\n";

    }

    return errors;

}


//check errors in the form1 
const checkFormError2 = () => {

    //need to check all required properties
    let errors = "";

    if (customer.name == null) {
        errors = errors + "Please Enter a valid Customer Name..!\n";

    }

    if (customer.mobileno == null) {
        errors = errors + "Please Enter a  valid Mobile Number..!\n";

    }

    if (customer.email == null) {
        errors = errors + "Please Enter a valid Email..!\n";

    }

    if (customer.address == null) {
        errors = errors + "Please Enter a valid Address..!\n";

    }

    if (customer.vehicle_route_id == null) {
        errors = errors + "Please Enter a Vehicle Route...!\n";

    }

    return errors;

}


//form submit event function
const buttonCustomerSubmit1 = () => {
    console.log(customer);

    let errors = checkFormError1();
    if (errors == "") {
        let userConfirmMsg1 =
            "\n Customer Full Name :" + customer.name +
            "\n Customer Type :" + customer.customer_type_id.type +
            "\n Customer  Status:" + customer.customer_status_id.status +
            "\n Customer Mobile No:" + customer.mobileno +
            "\n Customer Email Address:" + customer.email +
            "\n Customer Address:" + customer.address;


        //Sweet alert function
        swal({
            title: "Are you sure to Submit Folllowing Changes..?",
            text: userConfirmMsg1,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((userResponce) => {

                if (userResponce) {
                    //call post service
                    let postResponce = getHTTPServiceRequest("/customer/insert", "POST", customer);
                    if (postResponce == "OK") {
                        swal("Saved Successfully ....!");

                        refreshCustomerTable();
                        refreshForm1();
                        $("#customerForm").modal("hide");

                    } else {
                        swal("Failed to submit..! \n" + postResponce);

                    }


                }

            })


    } else {
        swal("Form has following errors...\n" + errors);

    }
}


//form submit event function
const buttonCustomerSubmit2 = () => {

    let errors = checkFormError2();
    if (errors == "") {
        let userConfirmMsg2 =
            "\n Customer Full Name :" + customer.name +
            "\n Customer  Status:" + customer.customer_type_id.type +
            "\n Customer Mobile No:" + customer.mobileno +
            "\n Customer Email Address:" + customer.email +
            "\n Customer Address:" + customer.address +
            "\n Customer Route:" + customer.vehicle_route_id.name;

        //Sweet alert function
        swal({
            title: "Are you sure to Submit Folllowing Changes..?",
            text: userConfirmMsg2,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((userResponce) => {

                if (userResponce) {
                    //call post service
                    let postResponce = getHTTPServiceRequest("/customer/insert", "POST", customer);
                    if (postResponce == "OK") {
                        swal("Saved Successfully ....!");


                        refreshCustomerTable();
                        refreshForm2();
                        $("#customerForm").modal("hide");

                    } else {
                        swal("Failed to submit..! \n" + postResponce);

                    }

                }

            })


    } else {
        swal("Form has following errors...\n" + errors);

    }
}



//Refresh Customer Table
const refreshCustomerTable = () => {

    //string => string/sate/number
    //function => object/array/boolean
    let propertyList = [
        { propertyName: "reg_no", dataType: "string" },
        { propertyName: "name", dataType: "string" },
        { propertyName: getCustomerType, dataType: "function" },
        { propertyName: "address", dataType: "string" },
        { propertyName: "mobileno", dataType: "string" },
        { propertyName: "email", dataType: "string" },
        { propertyName: getCustomerStatus, dataType: "function" },
        { propertyName: getVehicleRoute, dataType: "function" }
    ];

    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let customers = getServiceRequest("/customer/alldata");


    //Calling common function to fill data into table
    fillDataIntoTable1(tableCustomerBody, customers, propertyList, customerFormRefill, customerDelete, customerView, true);

    //Jquery function to load table
    $('#customerTable').DataTable();

}



//Function to get customer status
const getCustomerStatus = (dataOb) => {

    //If Customer status is null return nothing
    if (dataOb?.customer_status_id?.status == null){

        return "";
    }

    //If customer status is "Deleted" it should be coloured in red
    if (dataOb?.customer_status_id?.status == "Deleted") {
        return `<p class='fw-bold' style='color:red';>${dataOb.customer_status_id.status}</p>`;

    } else {
        return dataOb?.customer_status_id?.status;

    }

}



//Function to get customer type
const getCustomerType = (dataOb) => {

    if (dataOb.customer_type_id.type == "Individual") {
        return `<p class='fw-bold' style="color: brown;">${dataOb.customer_type_id.type}</p>`;

    }

    if (dataOb.customer_type_id.type == "Shop") {
        return `<p class='fw-bold' style="color: orange;">${dataOb.customer_type_id.type}</p>`;

    }
}


//Function to get vehicle route
const getVehicleRoute = (dataOb) => {
    if (dataOb.vehicle_route_id == null) {
        return "-";
    } else {
        return dataOb.vehicle_route_id?.name;
    }

}



//function define for refill customer form
const customerFormRefill = (dataOb, index) => {

    //Deleted Customer details cannot edit
if (dataOb?.customer_status_id?.status != "Deleted"){

    console.log("Edit", dataOb, index);
    $("#customerForm").modal("show");

    //If the Customer Type is Individual
    if (dataOb.customer_type_id.type === "Individual") {

        //jQuery function to  show selected tab
        $("#tabIndividual").tab("show");


        //creating two objects in order to updte
        customer = JSON.parse(JSON.stringify(dataOb));
        oldCustomer = JSON.parse(JSON.stringify(dataOb));


        //clean the attributes of the other tab
        txtCustomerName_tab2.value = "";
        txtMobileNo_tab2.value = "";
        txtEmailAddress_tab2.value = "";
        txtaddress_tab2.value = "";
        selectVehicleRoute_tab2.value = "";


        //assigning values to the attributes
        txtCustomerName_tab1.value = dataOb.name;
        selectCustomerStatus_tab1.value = JSON.stringify(dataOb.customer_status_id);
        txtMobileNo_tab1.value = dataOb.mobileno;
        txtEmailAddress_tab1.value = dataOb.email;
        txtaddress_tab1.value = dataOb.address;

        //Submit button getsdissapeared when edit function executed
        buttonUpdate1.style.display = "block";
        buttonSubmit1.style.display = "none";


    }


    //If the customer Type is Shop
    if (dataOb.customer_type_id.type === "Shop") {

        //jQuery function to  show selected tab
        $("#tabShop").tab("show");

        //creating two objects in order to updte
        customer = JSON.parse(JSON.stringify(dataOb));
        oldCustomer = JSON.parse(JSON.stringify(dataOb));

        //clean the attributes of the other tab
        txtCustomerName_tab1.value = "";
        selectCustomerStatus_tab1.value = "";
        txtMobileNo_tab1.value = "";
        txtEmailAddress_tab1.value = "";
        txtaddress_tab1.value = "";

        //assigning values to the attributes
        txtCustomerName_tab2.value = dataOb.name;
        txtMobileNo_tab2.value = dataOb.mobileno;
        txtEmailAddress_tab2.value = dataOb.email;
        txtaddress_tab2.value = dataOb.address;
        selectVehicleRoute_tab2.value = JSON.stringify(dataOb.vehicle_route_id);

        //Submit button getsdissapeared when edit function executed
        buttonUpdate2.style.display = "block";
        buttonSubmit2.style.display = "none";


    }


}

}

//Checking Updates in form1
const checkFormUpdate1 = () => {

    let updates = "";
    if (customer != null && oldCustomer != null) {

        if (customer.name != oldCustomer.name) {
            updates = updates + "Customer name has changed..!\n";

        }

        if (customer.customer_status_id.status != oldCustomer.customer_status_id.status) {
            updates = updates + "Customer status has changed..!\n";

        }

        if (customer.mobileno != oldCustomer.mobileno) {
            updates = updates + "Customer Mobile No has changed..!\n";

        }

        if (customer.email != oldCustomer.email) {
            updates = updates + "Customer email has changed..!\n";

        }

        if (customer.address != oldCustomer.address) {
            updates = updates + "Customer Address has changed..!\n";

        }

    }

    console.log(customer);
    console.log(oldCustomer);

    return updates;

}


//form Update event function
const buttonCustomerUpdate1 = () => {

    let errors = checkFormError1();
    if (errors == "") {

        let updates = checkFormUpdate1();

        if (updates == "") {
            swal("Nothing to update..!");

        } else {

            let userConfirmMsg3 = "Are you sure to update following changes?";
            //Sweet alert function
            swal({
                title: userConfirmMsg3,
                text: updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((userResponce) => {

                    if (userResponce) {
                        //call post service
                        let putResponce = getHTTPServiceRequest("customer/update", "PUT", customer);
                        if (putResponce == "OK") {
                            swal("Updated Successfully ....!");

                            refreshCustomerTable();
                            refreshForm1();
                            $("#customerForm").modal("hide");

                        } else {
                            swal("Failed to Update..! \n" + putResponce);

                        }

                    }

                });

        }
    } else {

        swal("cannot update..! form has following errors..!\n" + errors);

    }

}

//Checking updates in form 2
const checkFormUpdate2 = () => {

    let updates = "";
    if (customer != null && oldCustomer != null) {

        if (customer.name != oldCustomer.name) {
            updates = updates + "Customer name has changed..!\n";

        }

        if (customer.mobileno != oldCustomer.mobileno) {
            updates = updates + "Customer Mobile No has changed..!\n";

        }

        if (customer.email != oldCustomer.email) {
            updates = updates + "Customer email has changed..!\n";

        }

        if (customer.address != oldCustomer.address) {
            updates = updates + "Customer Address has changed..!\n";

        }

        if (customer.vehicle_route_id.name != oldCustomer.vehicle_route_id.name) {
            updates = updates + "Customer Route has changed..!\n";

        }

    }

    console.log(customer);
    console.log(oldCustomer);

    return updates;

}

//form Update event function
const buttonCustomerUpdate2 = () => {

    let errors = checkFormError2();
    if (errors == "") {

        let updates = checkFormUpdate2();

        if (updates == "") {
            swal("Nothing to update..!");

        } else {

            let userConfirmMsg4 = "Are you sure to update following changes?";
            //Sweet alert function
            swal({
                title: userConfirmMsg4,
                text: updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((userResponce) => {

                    if (userResponce) {
                        //call post service
                        let putResponce = getHTTPServiceRequest("customer/update", "PUT", customer);
                        if (putResponce == "OK") {
                            swal("Updated Successfully ....!");

                            refreshCustomerTable();
                            refreshForm2();
                            $("#customerForm").modal("hide");

                        } else {
                            swal("Failed to Update..! \n" + putResponce);

                        }

                    }

                });

        }
    } else {

        swal("cannot update..! form has following errors..!\n" + errors);

    }

}



//function define for delete customer record
const customerDelete = (dataOb, index) => {
    console.log("Delete", dataOb, index);

    //need to get user confirmation
    let userConfirmMsg5 =

        "\n Customer Reg No :" + dataOb.reg_no +
        "\n Customer  Name :" + dataOb.name +
        "\n Customer  Type:" + dataOb.customer_type_id?.type +
        "\n Customer Address:" + dataOb.address +
        "\n Customer Mobile No:" + dataOb.mobileno +
        "\n Customer Email:" + dataOb.email +
        "\n Customer Status:" + dataOb.customer_status_id?.status;


    if (dataOb.customer_type_id.type == "Shop") {
        userConfirmMsg5 +=
            "\n Vehicle Route:" + dataOb.vehicle_route_id?.name;

    }

    //Sweet alert function
    swal({
        title: "Are you sure to delete..?",
        text: userConfirmMsg5,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((userResponce) => {
            if (userResponce) {


                let deleteResponce = getHTTPServiceRequest("/customer/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });


                    refreshCustomerTable();
                    refreshForm1();
                    refreshForm2();


                } else {
                    swal("Delete Not Sccessfull...!", {
                        icon: "error", text: deleteResponce
                    });

                }

            }

        });

}




//function define for view/print  customer record
const customerView = (dataOb, index) => {
    console.log("View", dataOb, index);

    tdCustomerRegNo.innerText = dataOb.reg_no;
    tdCustomerName.innerText = dataOb.name;
    tdCustomerType.innerText = dataOb.customer_type_id.type;
    tdCustomerAddress.innerText = dataOb.address;
    tdCustomerMobileNo.innerText = dataOb.mobileno;
    tdCustomerEmail.innerText = dataOb.email;
    if (dataOb?.customer_status_id?.status == null){
        tdCustomerStatus.innerText = "";
    }else{
        tdCustomerStatus.innerText = dataOb?.customer_status_id?.status;
    }

    $("#modalCustomerView").modal("show");

}

//Print command
const printCustomerRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-customer</title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
        "<body>" + tableCustomerView.outerHTML + "</body>";

    newWindow.document.write(printView);

    //Print window
    setTimeout(() => {

        newWindow.stop();
        newWindow.print();
        newWindow.close();

    }, 500)


    $("#modalCustomerView").modal("hide");


}

const refreshInnerFormAndTable = () => {


    //Cleaning attributes of inner form
    customerInnerForm.reset();

    //Removing Validation Colours using a common function declared in common.js
    setDefault([selectItem, txtItemQuantity,selectSession]);


//    Creating an object for data binding
    customerItem = new Object();

    //Filling Dropdowns

    let item = getServiceRequest("/item/alldata");

    //Filling data into dropdowns
    fillDataIntoSelect(selectItem, "Please select Item..!", item, "item_name");


    let session = getServiceRequest("/productionsession/alldata");

    //Filling data into dropdowns
    fillDataIntoSelect(selectSession, "Please select Session..!", session, "name");

    //Inner Table

    let innerColumns = [{ propertyName: getItem, dataType: "function" },
        { propertyName: "qty", dataType: "string" },
        { propertyName: getSession, dataType: "function" }];

// Calling common function to fill data into table
    fillDataIntoInnerTable(tableInnerCustomerBody, customer.customerHasItemList, innerColumns, buttonInnerCustomerRefill, buttonInnerCustomerDelete, true);

}

// Getting Item Name
const getItem = (dataOb) =>{
    return dataOb?.item_id?.item_name;
}

// Getting Session
const getSession = (dataOb) =>{
    return dataOb?.production_session_id?.name;
}

// Refill Function
const buttonInnerCustomerRefill = () =>{

}


// Delete Function
const buttonInnerCustomerDelete = () =>{

}


const checkInnerFormError = () =>{
    let errors = "";

    if (customerItem.item_id == null) {
        errors = errors + "Please Select an Item...!\n";
    }

    if (customerItem.qty == null) {
        errors = errors + "Please Enter No Of Items...!\n";
    }

    if (customerItem.production_session_id == null) {
        errors = errors + "Please Select Session..!\n";
    }

    return errors;
}

// InnerForm Submit
const buttonInnerFormSubmit = () =>{

    console.log(customerItem);

    //Check form error for required element
    let errors = checkInnerFormError();

    if (errors == "") {

        let userConfirmMsg3 =

            "\n Item Name :" + customerItem.item_id.item_name+
            "\n No Of Items :" +customerItem.qty+
            "\n Session :" +customerItem.production_session_id.name;

        swal({
            title: "Are you sure to add following details..?",
            text: userConfirmMsg3,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((userResponce) => {

                if (userResponce) {
                    //call post service
                    let postResponce = "OK";
                    if (postResponce == "OK") {
                        // Pushing the object of inner form "customerItem"
                        customer.customerHasItemList.push(customerItem);

                        swal("Added Successfully..!")
                        refreshInnerFormAndTable();

                    }

                }

            });

    } else {

        swal(errors);
    }
}

//Validation Of Dynamic dropdown
const dynamicElementValidator2 = (element, object, property) => {

    const dynamicElement = element.value;

    customerItem[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");

}



























