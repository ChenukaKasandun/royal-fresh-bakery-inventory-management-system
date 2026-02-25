
//load event
window.addEventListener('load', () => {

    refreshForm();
    refreshReturnItemTable();

})


//Refreshing Form
const refreshForm = () => {

    //Reset Item Form
    returnItemForm.reset();

    //Defining new item object to data binding at front end
    returnItem = new Object();

    //Removing Validation Colours using a common function declared in common.js
    setDefault([txtDate, selectCustomerName, selectInvoiceNo,textNote]);

    //Creating a new array to push data from the inner form to the inner table and main form(association link)
    returnItem.returnItemHasItemList = new Array();


    //Filling inner Drop down
    let session = getServiceRequest("/productionsession/alldata");
    //Calling function to fill data into select
    fillDataIntoSelect(selectSession, "Please select Session..! ", session, "name");



    //Item Category
    let shopCustomer = getServiceRequest("/customer/alldataByShopCustomerAndHaveInvoice");

    //Calling function to fill data into select
    fillDataIntoSelect(selectCustomerName, "Please select Customer...! ", shopCustomer, "name");


    //Update button getsdissapeared when refreshForm function executed
    buttonSubmit.style.display = "block";
    buttonUpdate.style.display = "none";


    // Refresh Inner Form and Inner Table
    refreshInnerFormAndInnerTable();

}

// Auto selects invoices relevant to the customer and session
let customerNameElement = document.querySelector("#selectCustomerName")
let sessionElement = document.querySelector("#selectSession");
customerNameElement.addEventListener('change' , () =>{

    let customer = JSON.parse(customerNameElement.value);
    let session =JSON.parse(sessionElement.value);


    let invoices = getServiceRequest("/invoice/getinvoicebycustomeridandsessionid?customerId="+customer.id+"&sessionId="+session.id);

    //Calling function to fill data into select
    fillDataIntoSelect(selectInvoiceNo, "Please select Invoice No...! ", invoices, "invoice_no");

    returnItem.invoice_id = selectInvoiceNo.value;
    selectInvoiceNo.classList.add("is-valid");
    refreshInnerInvoiceTable();

})


const invoiceElement = document.querySelector("#selectInvoiceNo");
// Refreshing Inner Invoice Item Table when an invoice No gets selected
const refreshInnerInvoiceTable = () =>{

    let invoice = JSON.parse(invoiceElement.value);
    console.log("....invoice....")
    console.log(invoice);

    //Requesting CustomerOrderHasItem object by invoice no
    let invoiceHasItem = getServiceRequest("/invoicehasitem/byinvoiceid?invoiceid="+invoice.id);


    // Inner Table Columns
    let innerColumns = [{ propertyName: getItemName, dataType: "function" },
        { propertyName: "qty", dataType: "string" },
        { propertyName: "line_price", dataType: "string" }
    ];

    // Calling common function to fill data into inner table
    fillDataIntoInnerTable(tableInnerInvoiceBody, invoiceHasItem, innerColumns, buttonInvoiceInnerRefill, buttonInvoiceInnerDelete, true);

}

const getItemName = (dataOb) =>{
    return dataOb?.item_id?.item_name;
}

const getSession = (dataOb) =>{
    return dataOb?.production_session_id?.name;
}

const buttonInvoiceInnerRefill = () =>{

}

const buttonInvoiceInnerDelete = () =>{

}


//dynamic element validator
const dynamicElementValidator = (element, object, property) => {

    //creating a dynamic element variable to pic the element value
    const dynamicElement = element.value;

    //assigning the value to the property  of the data object
    returnItem[property] = JSON.parse(dynamicElement);

    //Adding validation
    element.classList.add("is-valid");

}


//Validation Of date
const dateValidator = (dateElement, object, property) => {

    const dateElementValue = dateElement.value;

    if (dateElementValue != "") {

        dateElement.classList.add("is-valid");
        returnItem.date = dateElementValue;

    } else {

        dateElement.classList.add("is-invalid");
        returnItem.date = null;

    }
}


//check errors in the form
const checkFormError = () => {

    //need to check all required properties

    let errors = "";

    if (returnItem.date == null) {
        errors = errors + "Please Select a valid date..!\n";
    }

    if (returnItem.customer_id == null) {
        errors = errors + "Please Select a customer..!\n";
    }
    if (returnItem.invoice_id == null) {
        errors = errors + "Please Select a Invoice ..!\n";
    }

    return errors;

}


//form submit event function
const buttonReturnItemSubmit = () => {

    //Check form error for required element
    let errors = checkFormError();
    console.log(returnItem);

    if (errors == "") {

        let userConfirmMsg1 =

            "\n Customer Name :" + returnItem.date+
            "\n Customer Name :" + returnItem.customer_id.name +
            "\n Invoice No :" + returnItem.invoice_id.invoice_no +
            "\n Total Returning Price :" + returnItem.total_returning_price;

        swal({
            title: "Are you sure to Submit Following Details..?",
            text: userConfirmMsg1,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((userResponce) => {

                if (userResponce) {
                    //call post service
                    let postResponce = getHTTPServiceRequest("/returnitem/insert", "POST", returnItem);
                    if (postResponce == "OK") {
                        swal("Saved Successfully ....!");

                        refreshForm();
                        refreshReturnItemTable();

                        $("#modalItemForm").modal("hide");

                    } else {
                        swal("Failed to submit..! \n" + postResponce);

                    }

                }

            });
    } else {

        swal("Form has following errors...\n" + errors);
    }
}


//form Update event function
const checkFormUpdate = () => {

    let updates = "";

    if (returnItem != null && oldReturnItem != null) {

        if (returnItem.customer_id != oldReturnItem.customer_id) {

            updates = updates + "Customer Name  has changed..!\n";

        }

        if (returnItem.invoice_id!= oldReturnItem.invoice_id) {

            updates = updates + "Invoice No has changed..!\n";

        }

        if (returnItem.total_returning_price != returnItem.total_returning_price) {

            updates = updates + "Total Returning Price has changed..!\n";
        }

        return updates;

    }
}


//Update button
const buttonReturnItemUpdate = () => {

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
                    let putResponce = getHTTPServiceRequest("/returnitem/update", "PUT", returnItem);
                    if (putResponce == "OK") {
                        swal("Updated Successfully ....!");

                        refreshForm();
                        refreshReturnItemTable();
                        $("#modalReturnItemForm").modal("hide");

                    } else {
                        swal("Failed to Update..! \n" + putResponce);
                    }
                }
            });
    }
}



//Refresh Table
const refreshReturnItemTable = () => {

    //string => string/sate/number
    //function => object/array/boolean
    //Decimal => price
    let propertyList = [
        {propertyName: "date", dataType: "string"},
        {propertyName: getCustomerName, dataType: "function"},
        {propertyName: getInvoiceNo, dataType: "function"},
        {propertyName: "total_returning_price", dataType: "string"},

    ];
    //Defining table
    let returnItems = getServiceRequest("/returnitems/alldata");

    //Calling common function to fill data into table
    fillDataIntoTable1(returnItemTableBody, returnItems, propertyList, returnItemFormRefill, buttonReturnItemDelete, buttonReturnItemView, true);

    $('#returnItemTable').DataTable();

}


//Get Customer Name
const getCustomerName = (dataOb) => {
    return dataOb?.invoice_id?.customer_order_id?.customer_id.name;
}


//GetInvoice Npo
const getInvoiceNo = (dataOb) => {
    return dataOb?.invoice_id?.invoice_no;
}


//form refill function
const returnItemFormRefill = (dataOb, index) => {

    console.log(dataOb);

        //Creating two objects for comparison --> Update Item
        returnItem = JSON.parse(JSON.stringify(dataOb));
        oldReturnItem = JSON.parse(JSON.stringify(dataOb));


        txtDate.value = dataOb?.date;
        selectCustomerName.value = JSON.stringify(dataOb?.invoice_id?.customer_order_id?.customer_id);
        selectInvoiceNo.value = JSON.stringify(dataOb.invoice_id);
        txtTotalReturningPrice.value = dataOb?.total_returning_price;


        // Equalizing the objects at frontend and tge dataBase in order to trigger update
        returnItem.customer_id = dataOb?.invoice_id?.customer_order_id?.customer_id;
        oldReturnItem.customer_id = dataOb?.invoice_id?.customer_order_id?.customer_id;

        returnItem.invoice_id = dataOb?.invoice_id;
        oldReturnItem.invoice_id = dataOb.invoice_id;


        //Submit button get dissapeared when Edit Function executed
        buttonUpdate.style.display = "block";
        buttonSubmit.style.display = "none";

        $("#modalReturnItemForm").modal("show");

}



//form delete event function
const buttonReturnItemDelete = (dataOb, index) => {

    console.log("Delete", dataOb, index);

    //need to get user confirmation
    let userConfirmMsg =

        "\n Item Code:" + dataOb.item_code +
        "\n Item Name :" + dataOb.item_name +
        "\n Item Status:" + dataOb.item_status_id.name +
        "\n Item Category:" + dataOb.item_category_id.name;

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


                let deleteResponce = getHTTPServiceRequest("/item/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });

                    refreshItemTable();
                    refreshForm();


                } else {
                    swal("Delete Not Sccessfull...!", {
                        icon: "error", text: deleteResponce
                    });

                }
            }

        });
}

//Table View  function
const buttonReturnItemView = (dataOb, index) => {

    console.log("View", dataOb, index);

    tdItemCode.innerText = dataOb.item_code;
    tdItemName.innerText = dataOb.item_name;
    tdItemCategory.innerText = dataOb.item_category_id.name;
    tdItemStatus.innerText = dataOb.item_status_id.name;


    $("#modalItemView").modal("show");

    refreshItemTable();

}


//inner row in view
const printItemRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-item</title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
        "<body>" + tableItemView.outerHTML + "</body>";


    newWindow.document.write(printView);


    //Print window
    setTimeout(() => {

        newWindow.stop();
        newWindow.print();
        newWindow.close();

    }, 500)


    $("#modalItemView").modal("hide");

}


// .......................Inner Form  and Inner Table.............................

const refreshInnerFormAndInnerTable = () =>{

    //Inner Form.
    //Cleaning the attributes of inner form
    returnItemInnerForm.reset();

    //Removing Validation Colours using a common function declared in common.js
    setDefault([selectItemName,txtReturningPrice,txtItemQuantity,txtLinePrice]);

    //Creating an object for data binding
    returnItemHasItem = new Object();

    //Filling inner Drop down
    let item = getServiceRequest("/item/returningbyitemstatus");
    //Calling function to fill data into select
    fillDataIntoSelect(selectItemName, "Please select Item ", item, "item_name");

    // Inner Table...
    let innerColumns = [
        { propertyName: getReturningItemName, dataType: "function" },
        { propertyName: getReturningPrice, dataType: "function" },
        { propertyName: "qty", dataType: "string" },
        { propertyName: "line_price", dataType: "string" },
    ];

// Calling common function to fill data into table
    fillDataIntoInnerTable(returnItemInnerTableBody, returnItem.returnItemHasItemList, innerColumns, buttonReturningItemInnerRefill, buttonReturningItemInnerDelete, true);

}

const getReturningItemName = (dataOb) =>{
    return dataOb?.item_id?.item_name;
}

const getReturningPrice = (dataOb) =>{
  return "";
}


const buttonReturningItemInnerRefill = () =>{

}

const buttonReturningItemInnerDelete = () =>{

}


// Generate Line Price in Individual Customer
const returningPriceElement = document.querySelector("#txtReturningPrice");
const qtyElement = document.querySelector("#txtItemQuantity");
const linePriceGenerator = () =>{

    let returningPrice = parseFloat(returningPriceElement.value);
    let qty = qtyElement.value;

    let linePrice = (returningPrice * qty);

    txtLinePrice.value = linePrice.toFixed(2);
    returnItemHasItem.line_price = txtLinePrice.value;
    txtLinePrice.classList.add("is-valid");


}


const checkReturnItemInnerFormError = () =>{
    //need to check all required properties

    let errors = "";

    if (returnItemHasItem.item_id == null) {
        errors = errors + "Please Select an Item...!\n";
    }

    if (returnItemHasItem.qty == null) {
        errors = errors + "Please Enter Quantity..!\n";
    }

    return errors;
}

// Submit inner form data
const buttonReturnItemInnerFormSubmit = () =>{

    console.log(returnItem);
    console.log(returnItemHasItem);

    //Check form error for required element
    let errors = checkReturnItemInnerFormError();

    if (errors == "") {

        let userConfirmMsg2 =
            "\n Item Name :" +returnItemHasItem.item_id.item_name +
            "\n Quantity :" +returnItemHasItem.qty +
            "\n Line Price :" +returnItemHasItem.line_price;

        swal({
            title: "Are you sure to add following details..?",
            text: userConfirmMsg2,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((userResponce) => {

                if (userResponce) {
                    //call post service
                    let postResponce = "OK";
                    if (postResponce == "OK") {
                        //Pushing inner object to the association table
                        returnItem.returnItemHasItemList.push(returnItemHasItem)

                        swal("Added Successfully ....!");
                        refreshInnerFormAndInnerTable();
                        generateTotalReturningPrice();

                    }

                }


            });
    } else {

        swal(errors);
    }
}


//dynamic element validator for inner form
const dyanamicElementValidator1 = (element, object, property) => {

    //creating a dynamic element variable to pic the element value
    const dynamicElement = element.value;

    //assigning the value to the property  of the data object
    returnItemHasItem[property] = JSON.parse(dynamicElement);

    //Adding validation
    element.classList.add("is-valid");

}


// Generate Total Price in Individual Customer Form
const generateTotalReturningPrice = () => {
    let totalReturningPrice = 0;

    returnItem.returnItemHasItemList.forEach(itemOb => {

        totalReturningPrice += parseFloat(itemOb.line_price);

    })

    txtTotalReturningPrice.value = totalReturningPrice;
    returnItem.total_returning_price = totalReturningPrice;
    txtTotalReturningPrice.classList.add("is-valid");


}



