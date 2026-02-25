
// Window onload function
window.addEventListener('load', () => {
    refreshForm();
    refreshWalkingCustomerTable();


})



// Refresh Form
const refreshForm = () => {

    // Resetting the form
    walkingCustomerForm.reset();


    //Removing Validation Colours using a common function declared in common.js
    setDefault([dateDate, txtTotalIncome, textNote]);


    // Creating a new object for front end data Binding
    walkingCustomer = new Object();

    // Creating a new array for association table
    walkingCustomer.walkingCustomerHasItems = new Array();


    //Update button gets dissapeared when refresh form
    buttonSubmit.style.display = "block";
    buttonUpdate.style.display = "none";


    // Refreshing Inner For and Inner Table
    refreshInnerFormAndTable();

}


// Refresh Table
const refreshWalkingCustomerTable = () => {

    //string => string/sate/number
    //function => object/array/boolean
    let propertyList = [{ propertyName: "date", dataType: "string" },
    { propertyName: "total_price", dataType: "string" }
    ];


    //Calling a common function to retrive data from the database to the table
    let walkingCustomer = getServiceRequest("/walkingcustomer/alldata");
    //Calling common function to fill data into table
    fillDataIntoTable1(walkingCustomerTableBody, walkingCustomer, propertyList, walkingCustomerFormRefill, walkingCustomerDelete, walkingCustomerView, true);

    $('#walkingCustomerTable').DataTable();

}



// Check Form Error
const checkFormError = () => {

    let errors = "";

    if (walkingCustomer.date == null) {
        errors = errors + "Please Enter a valid date..!\n";

    }

    if (walkingCustomer.total_price == null) {
        errors = errors + "Please Enter Total Income..!\n";

    }

    return errors;
}



//Employee form Submit Function
const buttonWalkingCustomerSubmit = () => {


    console.log(walkingCustomer);

    //Check form error for required element
    let errors = checkFormError();

    if (errors == "") {



        let userConfirmMsg1 =

            "\n Date :" + walkingCustomer.date +
            "\n Total Income:" + walkingCustomer.total_price;

        swal({
            title: "Are you sure to Submit Following Details..?",
            text: userConfirmMsg1,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((userResponce) => {

            if (userResponce) {
                //call post service
                let postResponce = getHTTPServiceRequest("/walkingcustomer/insert", "POST", walkingCustomer);
                if (postResponce == "OK") {
                    swal("Saved Successfully ....!");

                    refreshForm();
                    refreshWalkingCustomerTable();
                    $("#modalWalkingCustomerForm").modal("hide");


                } else {
                    swal("Failed to submit..! \n" + postResponce);

                }

            }
        });

    } else {
        swal("Form has following errors...\n\n" + errors);
    }
}



//function define for refill customer form
const walkingCustomerFormRefill = (dataOb, index) => {
    console.log("Edit", dataOb, index);



    //Creating two objects for update function
    walkingCustomer = JSON.parse(JSON.stringify(dataOb));
    oldWalkingCustomer = JSON.parse(JSON.stringify(dataOb));

    dateDate.value = dataOb.date;
    txtTotalIncome.value = dataOb.total_price;

    //Update button getsdissapeared when refresh form
    buttonSubmit.style.display = "none";
    buttonUpdate.style.display = "block";


    $("#modalWalkingCustomerForm").modal("show");

}


//form Update event function 
const checkFormUpdate = () => {

    let updates = "";

    if (walkingCustomer != null && oldWalkingCustomer != null) {

        if (walkingCustomer.date != oldWalkingCustomer.date) {

            updates = updates + "Date changed..!\n";

        }

        if (walkingCustomer.total_price != oldWalkingCustomer.total_price) {

            updates = updates + "Total Income..!\n";

        }

        return updates;

    }

    refreshWalkingCustomerTable();
}



//Update button
const buttonWalkingCustomerUpdate = () => {

    let updates = checkFormUpdate();

    if (updates == "") {
        // No updates found, proceed with the update
        swal("Nothing to update..!", {
            icon: "info",
        });

    } else {

        //Sweet alert function
        swal({
            title: "Are you sure to update following details..?",
            text: updates,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((userResponce) => {

                if (userResponce) {
                    //call post service
                    let putResponce = getHTTPServiceRequest("/walkingcustomer/update", "PUT", walkingCustomer);
                    if (putResponce == "OK") {
                        swal("Updated Successfully ....!");

                        refreshForm();
                        refreshWalkingCustomerTable();
                        $("#modalWalkingCustomerForm").modal("hide");


                    } else {
                        swal("Failed to update..! \n" + postResponce);

                    }

                }

            });

    }

}



//function define for delete customer record
const walkingCustomerDelete = (dataOb, index) => {
    console.log("Delete", dataOb, index);


    //need to get user confirmation
    let userConfirmMsg =
        "\n Date :" + dataOb.date +
        "\n Total Income:" + dataOb.total_price;

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


                let deleteResponce = getHTTPServiceRequest("/walkingcustomer/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });

                    refreshForm();
                    refreshWalkingCustomerTable();


                } else {
                    swal("Delete Not Sccessfull...!", {
                        icon: "error", text: deleteResponce
                    });

                }

            }

        });


}


//function define for view/print  stock record
const walkingCustomerView = (dataOb, index) => {
    console.log("View", dataOb, index);

    tdDate.innerText = dataOb.date;
    tdTotalIncome.innerText = dataOb.total_price;

    $("#modalWalkingCustomerView").modal("show")

    refreshForm();
    refreshWalkingCustomerTable();
}

const printWalkingCustomerRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-user</title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
        "<body>" + TablewalkingCustomerView.outerHTML + "</body>";


    newWindow.document.write(printView);

    //Print window
    setTimeout(() => {

        newWindow.stop();
        newWindow.print();
        newWindow.close();

    }, 500)


    $("#modalWalkingCustomerView").modal("hide");

}



//Refresh Inner Form and Inner Table
const refreshInnerFormAndTable = () =>{

//     Cleaning the attributes
    walkingCustomerInnerForm.reset();

    //Removing Validation Colours using a common function declared in common.js
    setDefault([selectItem, txtUnitPrice, txtItemQuantity ,txtLinePrice]);

//     Creating a new object for data binding
    walkingInnerCustomer = new Object();

    //Filling Dropdowns
    let item = getServiceRequest("/item/alldata");

    //Filling data into dropdowns
    fillDataIntoSelect(selectItem, "Please select Item..!", item, "item_name");


    //Inner Table

    let innerColumns = [{ propertyName: getItem, dataType: "function" },
        { propertyName: "qty", dataType: "string" },
        { propertyName: "line_price", dataType: "decimal" }];

// Calling common function to fill data into table
    fillDataIntoInnerTable(walkingCustomerInnerTableBody, walkingCustomer.walkingCustomerHasItems, innerColumns, buttonInnerCustomerRefill, buttonInnerCustomerDelete, true);

}

// Get Item Name
const getItem = (dataOb) =>{
    return dataOb?.item_id?.item_name;
}


const buttonInnerCustomerRefill = () =>{


}

const buttonInnerCustomerDelete = () =>{

}


const checkInnerFormError = () =>{
    let errors = "";

    if (walkingInnerCustomer.item_id == null) {
        errors = errors + "Please Select an Item...!\n";
    }

    if (walkingInnerCustomer.qty == null) {
        errors = errors + "Please Enter No Of Items...!\n";
    }

    return errors;
}


// InnerForm Submit
const buttonInnerFormSubmit = () =>{

    console.log(walkingInnerCustomer);
    console.log(walkingCustomer);

    //Check form error for required element
    let errors = checkInnerFormError();

    if (errors == "") {

        let userConfirmMsg3 =

            "\n Item Name :" + walkingInnerCustomer.item_id.item_name+
            "\n No Of Items :" +walkingInnerCustomer.qty+
            "\n Line Price :" +walkingInnerCustomer.line_price;

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
                       walkingCustomer.walkingCustomerHasItems.push(walkingInnerCustomer)

                        swal("Added Successfully..!")
                        refreshInnerFormAndTable();
                        generateTotalPrice();

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

    walkingInnerCustomer[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");

}


const unitPriceElement = document.querySelector("#txtUnitPrice");
const itemQuantityElement = document.querySelector("#txtItemQuantity");
const linePriceElement = document.querySelector("#txtLinePrice");

const generateLinePrice = () =>{

    let unitPrice = parseFloat(unitPriceElement.value).toFixed(2);
    let itemQty = itemQuantityElement.value;


    let linePrice = parseFloat(unitPrice * itemQty).toFixed(2);
    linePriceElement.value = linePrice;
    walkingInnerCustomer.line_price = linePriceElement.value;
    linePriceElement.classList.add("is-valid")

}


// Generate Total Price
const generateTotalPrice = () =>{

    let totalPrice = 0;

    walkingCustomer.walkingCustomerHasItems.forEach(dataOb => {

        totalPrice += parseFloat(dataOb.line_price);

    })

    totalPrice = totalPrice.toFixed(2);

    txtTotalIncome.value = totalPrice;
    walkingCustomer.total_price = totalPrice;
    txtTotalIncome.classList.add("is-valid");

}







