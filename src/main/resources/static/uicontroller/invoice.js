
//Window onload function
window.addEventListener('load', () => {

    // Refresh Order Forms
    refreshForm1();
    refreshForm2();

//     Refresh Table
    refreshInvoiceTable();

})

//refresh form
const refreshForm1 = () => {

    // Cleaning attributes of the form
    invoiceForm1.reset();

    //Removing Validation Colours using a common function declared in common.js
    setDefault([txtDate1,selectCustomerName1, selectCustomerOrderNo1, textTotalPrice1,selectStatus1,textNote1]);

    // Creating a new object for data binding at the front end
    invoice = new Object();

    // Create a link to association table
    invoice.invoiceHasItemList = new Array();

    //Retrieving data from the database using ajax common function defined in the commonFunctions.js
    let customers = getServiceRequest("/customer/alldataByIndividualCustomerAndHaveOrder");

    //Filling data to the dynamic dropdowns
    fillDataIntoSelect(selectCustomerName1, "Please select Customer..!", customers, "name");

    console.log(selectCustomerName1.value);

    //Retrieving data from the database using ajax common function defined in the coomonFunctions.js
    let invoiceStatus = getServiceRequest("/invoicestatus/alldata");

    //Filling data to the dyanamic dropdowns
    fillDataIntoSelect(selectStatus1, "Please select Invoice Status..!", invoiceStatus, "status");

    //Update button gets dissapeared when Add Invoice clicked
    buttonInvoiceSubmitId1.style.display = "block";
    buttonInvoiceUpdateId1.style.display = "none";

//     Refreshing Inner Invoice form and Table
    refreshInnerFormAndInnerTable1();

}


// Check form error
const checkFormError1 = () => {

    let errors = "";

    if (invoice.date == null) {
        errors = errors + "Please Enter a valid date..!\n";

    }

    if (invoice.customer_id == null) {
        errors = errors + "Please Select a customer..!\n";

    }

    if (invoice.customer_order_id == null) {
        errors = errors + "Please Select a customer Order No..!\n";

    }

    if (invoice.invoice_status_id == null) {
        errors = errors + "Please Select a Status..!\n";

    }
    return errors;
}


//form submit event function
const buttonInvoiceSubmit1 = () => {

    let errors = checkFormError1();
    console.log(invoice);
    console.log("invoice");

    if (errors == "") {

        let userConfirmMsg1 =

            "\n Invoice Date :" + invoice.date+
            "\n Customer Name:" + invoice?.customer_id?.name+
            "\n Customer Name:" + invoice?.customer_order_id?.order_no+
            "\n Total Price:" + invoice?.total_price +
            "\n Status:" + invoice?.invoice_status_id?.status;

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
                    let postResponce = getHTTPServiceRequest("/invoice/insert", "POST", invoice);
                    if (postResponce == "OK") {
                        swal("Saved Successfully ....!");

                        //refreshInvoiceTable();
                        refreshForm1();
                        refreshInnerFormAndInnerTable1();
                        refreshInvoiceTable();

                        $("#modalInvoiceForm").modal("hide");

                    } else {
                        swal("Failed to submit..! \n" + postResponce);

                    }
                }

            })

    } else {

        swal("Form has following errors...\n" + errors);

    }
    refreshInvoiceTable();

}


// Auto selects customer orders when the customer name selected
const customerName1 = document.querySelector("#selectCustomerName1");
customerName1.addEventListener('change' , () =>{

    let customers = JSON.parse(customerName1.value);
    //Retrieving data from the database using ajax common function defined in the commonFunctions.js
    //Auto filling the customer Order when Selecting the customer Name
    let customerOrder = getServiceRequest("/customerorder/customerorderbycustomerid?customerId="+JSON.parse(customers.id));
    fillDataIntoSelect(selectCustomerOrderNo1, "Please select Customer Order..!", customerOrder, "order_no");

    selectCustomerOrderNo1.classList.add("is-valid");
    invoice.customer_id = selectCustomerOrderNo1.value;

})

// Refills the customerOrderInnerTable1 when Customer Order get Selected
const customerOrderElement1 = document.querySelector("#selectCustomerOrderNo1")
customerOrderElement1.addEventListener('change' , () =>{

    let customerOrder = JSON.parse(customerOrderElement1.value);
    console.log(customerOrder);

    //Retrieving data from the database using ajax common function defined in the commonFunctions.js
    let customerOrderItem1 = getServiceRequest("/customerorderhasitem/bycustomerorderid?customerorderid="+customerOrder.id);

    let innerColumns = [{ propertyName: getItemName, dataType: "function" },
        { propertyName: "qty", dataType: "string" },
        { propertyName: getAvailableQty, dataType: "function" },
        { propertyName: "line_price", dataType: "decimal" },
        { propertyName: getAbility, dataType: "function" }];


    // Calling common function to fill data into table
    fillDataIntoInnerTable(customerOrderInnerTable1Body1, customerOrderItem1, innerColumns, buttonInnerInvoiceDelete1, buttonInnerInvoiceView1, true);

})

const buttonInnerInvoiceDelete1 = () =>{
}

const buttonInnerInvoiceView1 = () =>{

}

// Refresh Inner Form and Inner Table
const refreshInnerFormAndInnerTable1 =  () =>{

//     Cleaning the attributes
    invoiceInnerForm1.reset();

    //Removing Validation Colours using a common function declared in common.js
    setDefault([selectItem1,txtUnitPrice1, txtItemQuantity1, txtLinePrice1]);

    // Creating an object for databind at front end
    invoiceHasItem = new Object();

    //Filling Dropdowns

    let item = getServiceRequest("/item/alldata");

    //Filling data into dropdowns
    fillDataIntoSelect(selectItem1, "Please select Item..!", item, "item_name");

    let innerColumns = [{ propertyName: getItemName, dataType: "function" },
        { propertyName: "qty", dataType: "string" },
        { propertyName: "line_price", dataType: "decimal" }];

    // Calling common function to fill data into table
    fillDataIntoInnerTable(tableInnerInvoiceBody1, invoice.invoiceHasItemList, innerColumns,buttonInnerInvoiceDelete, buttonInnerInvoiceView, true);

}


// Checking Errors in the inner Form
const checkInnerFormError1 = () =>{
    let errors = "";

    if (invoiceHasItem.item_id == null) {
        errors = errors + "Please Select an Item...!\n";
    }

    if (invoiceHasItem.qty == null) {
        errors = errors + "Please Enter No Of Items...!\n";
    }

    return errors;
}


// InnerForm Submit
const buttonInnerFormSubmit1 = () =>{

    console.log(invoiceHasItem);

    //Check form error for required element
    let errors = checkInnerFormError1();

    if (errors == "") {

        let userConfirmMsg3 =

            "\n Item Name :" + invoiceHasItem.item_id.item_name+
            "\n No Of Items :" +invoiceHasItem.qty+
            "\n Line Price :" +invoiceHasItem.line_price;

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
                        // Pushing the object of inner form "invoiceHasItem"
                        invoice.invoiceHasItemList.push(invoiceHasItem);

                        swal("Added Successfully..!")
                        refreshInnerFormAndInnerTable1();
                        generateTotalPrice1();
                    }

                }

            });

    } else {

        swal(errors);
    }
}

// Generate Line Price
const generateLinePrice1 = (dataOb) =>{

    let unitPrice = parseFloat(txtUnitPrice1.value);
    let itemQty = parseFloat(txtItemQuantity1.value);

    let linePrice = (unitPrice * itemQty);
    txtLinePrice1.value = linePrice.toFixed(2);
    txtLinePrice1.classList.add("is-valid");
    invoiceHasItem.line_price = txtLinePrice1.value;

}

// Generate Total Price
const generateTotalPrice1 = () => {

    let totalPrice = 0;

    invoice.invoiceHasItemList.forEach(itemOb => {

        totalPrice += parseFloat(itemOb.line_price);

    })

    textTotalPrice1.value = totalPrice;
    invoice.total_price = textTotalPrice1.value;
    textTotalPrice1.classList.add("is-valid");
    discountPriceGenerator();

}


//Discount Price Generator
const discountPriceGenerator = () => {

    const customer = JSON.parse(customerName1.value);
    const customerStatus = customer.customer_status_id.status;


    console.log("Customer Status")
    console.log(customerStatus);

    if (customerStatus == null) {
        console.log("status is not present");
        return;

    }

    const totalPrice = parseFloat(textTotalPrice1.value);

    let discountRatio = 0;

    switch (customerStatus) {
        case "Friend":
            discountRatio = 3;
            break;
        case "Family/Relation":
            discountRatio = 5;
            break;
        case "Charity":
            discountRatio = 4;
            break;
        case "Social Service":
            discountRatio = 2;
            break;
        case "Normal":
        default:
            discountRatio = 0;
    }

    const discountedPrice = totalPrice - (totalPrice * discountRatio / 100);
    textDiscountedPrice1.value = parseFloat(discountedPrice).toFixed(2);
    textDiscountedPrice1.classList.add("is-valid");
    invoice.discount_price = textDiscountedPrice1.value;
};


//refresh table
const refreshInvoiceTable = () => {

    //string => string/sate/number
    //function => object/array/boolean
    let propertyList = [{ propertyName: "invoice_no", dataType: "string" },
    { propertyName: "date", dataType: "string" },
    { propertyName: getCustomerName, dataType: "function" },
    { propertyName: getCustomerOrderNo, dataType: "function" },
    { propertyName: "total_price", dataType: "string" },
    { propertyName: getInvoiceStatus, dataType: "function" },
    ];


    //Retrieving data from the database using ajax common function defined in the coomonFunctions.js
    let invoices = getServiceRequest("/invoice/alldata");

    // Calling common function to fill data into table
    fillDataIntoTable1(tableInvoiceBody, invoices, propertyList, buttonInvoiceRefill, buttonInvoiceDelete, buttonInvoiceView, true);


    // Jquery function
    $('#invoiceTable').DataTable();

}


//define functions to fill Table
const getCustomerName = (dataOb) => {
        return dataOb?.customer_order_id?.customer_id?.name;

}


const getCustomerOrderNo = (dataOb) => {

    if (dataOb?.customer_order_id == null){
        return "None";
    }else{
        return dataOb?.customer_order_id?.order_no;
    }

}

const getInvoiceStatus = (dataOb) => {

    if (dataOb?.invoice_status_id?.status == "Cancelled") {
        return `<p class='fw-bold' style="background-color: red">${dataOb?.invoice_status_id?.status}</p>`;

    } else {
        return dataOb?.invoice_status_id?.status;

    }

}


//form Refill event function 
const buttonInvoiceRefill = (dataOb, index) => {


    txtDate.value = dataOb.date;
    selectOrderNo.value = JSON.stringify(dataOb.customer_order_id); //..................Need to solved................
    selectCustomerName.value = JSON.stringify(dataOb.customer_order_id.customer_id);
    txtTotalPrice.value = dataOb.customer_order_id.total_price;
    txtDiscountedPrice.value = dataOb.customer_order_id.discounted_price;
    selectStatus.value = JSON.stringify(dataOb.invoice_status_id);


    //Formation of two objects to identify updates
    invoice = JSON.parse(JSON.stringify(dataOb));
    oldInvoice = JSON.parse(JSON.stringify(dataOb));


    //Assigning the values of attributes from data base to the properties of front end object in ordor to compare for update function
    invoice.totalPrice = dataOb.customer_order_id.total_price;
    oldInvoice.totalPrice = dataOb.customer_order_id.total_price;

    invoice.discountedPrice = dataOb.customer_order_id.discounted_price;
    oldInvoice.discountedPrice = dataOb.customer_order_id.discounted_price;

    invoice.customer_id = dataOb.customer_order_id.customer_id.name;
    oldInvoice.customer_id = dataOb.customer_order_id.customer_id.name;

    refreshInvoiceTable();

    $("#modalInvoiceForm").modal("show");

    //Submit button getsdissapeared when Edit Invoice clicked
    buttonInvoiceUpdateId.style.display = "block";
    buttonInvoiceSubmitId.style.display = "none";


}


//form Update event function 
const checkFormUpdates = () => {

    let updates = "";

    if (invoice != null && oldInvoice != null) {
        if (invoice.date != oldInvoice.date) {
            updates = updates + "Invoice Date has changed..!\n"

        }

        if (invoice.customer_order_id.order_no != oldInvoice.customer_order_id.order_no) {
            updates = updates + "Order No has changed..!\n"

        }


        if (invoice.customer_id != oldInvoice.customer_id) {
            updates = updates + "Customer name has changed..!\n"

        }


        if (invoice.totalPrice != oldInvoice.totalPrice) {
            updates = updates + "Total Price has changed..!\n"

        }


        if (invoice.discountedPrice != oldInvoice.discountedPrice) {
            updates = updates + "Discounted Price has changed..!\n"

        }


        if (invoice.invoice_status_id.status != oldInvoice.invoice_status_id.status) {
            updates = updates + "Invoice Status has changed..!\n"

        }

        return updates;

    }
    refreshInvoiceTable();

}


const buttonInvoiceUpdate2 = () => {

    //need to check form errors
    let errors = checkFormError2();


    if (errors == "") {

        let updates = checkFormUpdates();
        if (updates == "") {
            swal("Nothing to update..!");

        } else {
            let userConfirmMsg = "Are you sure to update Following...?";

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
                        //call post service
                        let putResponce = getHTTPServiceRequest("/invoice/update", "PUT", invoice);
                        if (putResponce == "OK") {
                            swal("Updated Successfully ....!");

                            refreshForm();
                            $("#modalInvoiceForm").modal("hide");

                        } else {
                            swal("Failed to Update..! \n" + putResponce);

                        }

                    }
                });

        }

    } else {
        swal("Form has following error..\n" + errors)

    }

}


//form delete event function 
const buttonInvoiceDelete = (dataOb, index) => {

    //need to get user confirmation
    let userConfirmMsg =
        "\n Invoice No:" + dataOb.invoice_no +
        "\n Invoice Date :" + dataOb.date +
        "\n Total Price:" + dataOb.customer_order_id.total_price +
        "\n Discounted Price:" + dataOb.customer_order_id.discounted_price +
        "\n Customer Customer Name:" + dataOb.customer_order_id.customer_id.name +
        "\n Order No:" + dataOb.customer_order_id.order_no +
        "\n Invoice Status:" + dataOb.invoice_status_id.status;

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


                let deleteResponce = getHTTPServiceRequest("/invoice/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });

                    refreshInvoiceTable();
                    refreshForm();


                } else {
                    swal("Delete Not Sccessfull...!", {
                        icon: "error", text: deleteResponce
                    });

                }

            }

        });

}


//function define for view/print  Po record
const buttonInvoiceView = (dataOb, index) => {
    console.log("View", dataOb, index);


    //filling data into modal
    tdInvoiceNo.innerText = dataOb.invoice_no;
    tdInvoiceDate.innerText = dataOb.date;
    tdCustomerName.innerText = dataOb.customer_order_id?.customer_id?.name;
    tdOrderNo.innerText = dataOb.customer_order_id?.order_no;
    tdTotalPrice.innerText = dataOb.customer_order_id?.total_price;
    tdDiscountedPrice.innerText = dataOb.customer_order_id?.discounted_price;
    tdInvoiceStatus.innerText = dataOb.invoice_status_id?.status;


    $("#modalInvoice").modal("show");

}


const printInvoiceRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-invoice</title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
        "<body>" + tableInvoiceView.outerHTML + "</body>";


    newWindow.document.write(printView);
    //Print window
    setTimeout(() => {

        newWindow.stop();
        newWindow.print();
        newWindow.close();

    }, 500)


    $("#modalInvoice").modal("hide");

}


// .........................Shop Customer Invoice........................................................


//refresh form
const refreshForm2 = () => {

    // Cleaning attributes of the form
    invoiceForm2.reset();

    //Removing Validation Colours using a common function declared in common.js
    setDefault([txtDate2,selectSession2, selectCustomerName2, selectOrderNo2,txtTotalPrice2,selectStatus2,textNote2]);

    // Creating a new object for data binding at the front end
    invoice = new Object();

    // Create a link to association table
    invoice.invoiceHasItemList = new Array();

    //Retrieving data from the database using ajax common function defined in the commonFunctions.js
    let session = getServiceRequest("/productionsession/alldata");

    //Filling data to the dynamic dropdowns
    fillDataIntoSelect(selectSession2, "Please select Customer..!", session, "name");

    //Retrieving data from the database using ajax common function defined in the commonFunctions.js
    let customers = getServiceRequest("/customer/alldataByShopCustomerAndHaveOrder");

    //Filling data to the dynamic dropdowns
    fillDataIntoSelect(selectCustomerName2, "Please select Customer..!", customers, "name");

    console.log(selectCustomerName2.value);

    //Retrieving data from the database using ajax common function defined in the coomonFunctions.js
    let invoiceStatus = getServiceRequest("/invoicestatus/alldata");

    //Filling data to the dyanamic dropdowns
    fillDataIntoSelect(selectStatus2, "Please select Invoice Status..!", invoiceStatus, "status");


    //Update button gets dissapeared when Add Invoice clicked
    buttonInvoiceSubmitId2.style.display = "block";
    buttonInvoiceUpdateId2.style.display = "none";

    // Refreshing Inner Form and table
    refreshInnerFormAndInnerTable2();

}


// Check form error
const checkFormError2 = () => {

    let errors = "";

    if (invoice.date == null) {
        errors = errors + "Please Enter a valid date..!\n";

    }

    if (invoice.invoice_status_id == null) {
        errors = errors + "Please Enter the status..!\n";

    }

    return errors;
}


//form submit event function
const buttonInvoiceSubmit2 = () => {

    let errors = checkFormError2();
    console.log(invoice);
    console.log("invoice");

    if (errors == "") {

        let userConfirmMsg1 =

            "\n Invoice Date :" + invoice.date;
        if(invoice?.customer_id?.name != null){
            userConfirmMsg1 +=
                "\n Order No:" + invoice?.customer_order_id?.order_no +
                "\n Customer Name:" + invoice?.customer_id?.name+
                "\n Total Price:" + invoice?.total_price +
                "\n Status:" + invoice?.invoice_status_id?.status;
        }

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
                    let postResponce = getHTTPServiceRequest("/invoice/insert", "POST", invoice);
                    if (postResponce == "OK") {
                        swal("Saved Successfully ....!");

                        refreshInvoiceTable();
                        refreshForm2();
                        refreshInnerFormAndInnerTable2();

                        $("#modalInvoiceForm").modal("hide");



                    } else {
                        swal("Failed to submit..! \n" + postResponce);

                    }
                }

            })

    } else {

        swal("Form has following errors...\n" + errors);

    }
    refreshInvoiceTable();

}


//Validation Of Dynamic dropdown in Shop Invoice
const dynamicElementValidator = (element, object, property) => {

    const dynamicElement = element.value;

    invoice[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");

}


// Auto select Customer Order No relevant to the customer name
let selectCustomerNameElement = document.querySelector("#selectCustomerName2");

selectCustomerNameElement.addEventListener("change", () => {

    let customer = JSON.parse(selectCustomerNameElement.value);

    console.log("..........CustomerName...........")
    console.log(customer);
    selectCustomerNameElement.classList.add("is-valid");

    //URL request for getting Customer  Order List relevant to the Customer Name from Back end using queries
    let customerOrderByCustomerName = getServiceRequest("/customerorder/customerorderbycustomerid?customerId="+customer.id);

    fillDataIntoSelect(selectOrderNo2, "Please select Customer Order No..!", customerOrderByCustomerName, "order_no");

})


// Filling inner customer Order Table when the order no and Session get selected
const selectOrderNo2Element = document.querySelector("#selectOrderNo2");
const selectSession2Element = document.querySelector("#selectSession2");
selectOrderNo2Element.addEventListener('change', () =>{

    customerOrder2 = JSON.parse(selectOrderNo2Element.value);
    console.log(customerOrder2);

    session2 = JSON.parse(selectSession2Element.value);
    console.log(session2);


    //Retrieving data from the database using ajax common function defined in the commonFunctions.js
    let customerOrderItem2 = getServiceRequest("/customerorderhasitem/byorderidandsessionid?sessionId="+session2.id+"&customerOrderId="+customerOrder2.id);

    let innerColumns = [{ propertyName: getItemName, dataType: "function" },
        { propertyName: "qty", dataType: "string" },
        { propertyName: getAvailableQty, dataType: "function" },
        { propertyName: "line_price", dataType: "decimal" },
        { propertyName: getSession, dataType: "function" },
        { propertyName: getAbility, dataType: "function" }];


    // Calling common function to fill data into table
    fillDataIntoInnerTable(ordeItemListInnerTableBody, customerOrderItem2, innerColumns,buttonInnerInvoiceDelete, buttonInnerInvoiceView, true);

})

const getItemName = (dataOb) =>{
    return dataOb?.item_id?.item_name;
}

const getAvailableQty = () =>{
    return "";

}

const getAbility = () =>{
    return "";

}

const getSession = (dataOb) =>{
    return dataOb?.production_session_id.name;

}


// inner table refresh Function
const refreshInnerFormAndInnerTable2 = () =>{

    // Cleaning the attributes
    invoiceInnerForm2.reset();

    //Removing Validation Colours using a common function declared in common.js
    setDefault([selectItemInner2,, txtUnitPriceInner2,,txtItemQuantityInner2,txtLinePriceInner2]);

    // Creating an object for databind at front end
    invoiceHasItem = new Object();

    //Filling Dropdowns

    let item = getServiceRequest("/item/alldata");

    //Filling data into dropdowns
    fillDataIntoSelect(selectItemInner2, "Please select Item..!", item, "item_name");

    let innerColumns = [{ propertyName: getItemName, dataType: "function" },
        { propertyName: "qty", dataType: "string" },
        { propertyName: "line_price", dataType: "decimal" }];

    // Calling common function to fill data into table
    fillDataIntoInnerTable(tableInnerInvoiceBody2, invoice.invoiceHasItemList, innerColumns,buttonInnerInvoiceDelete, buttonInnerInvoiceView, true);

}

const buttonInnerInvoiceDelete = () =>{


}

const buttonInnerInvoiceView = () =>{

}

const checkInnerFormError2 = () =>{
    let errors = "";

    if (invoiceHasItem.item_id == null) {
        errors = errors + "Please Select an Item...!\n";
    }

    if (invoiceHasItem.qty == null) {
        errors = errors + "Please Enter No Of Items...!\n";
    }

    return errors;
}


// InnerForm Submit
const buttonInnerFormSubmit2 = () =>{

    console.log(invoiceHasItem);

    //Check form error for required element
    let errors = checkInnerFormError2();

    if (errors == "") {

        let userConfirmMsg3 =

            "\n Item Name :" + invoiceHasItem.item_id.item_name+
            "\n No Of Items :" +invoiceHasItem.qty+
            "\n Line Price :" +invoiceHasItem.line_price;

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
                        // Pushing the object of inner form "invoiceHasItem"
                        invoice.invoiceHasItemList.push(invoiceHasItem);

                        swal("Added Successfully..!")
                        refreshInnerFormAndInnerTable2();
                        generateTotalPrice2();
                    }

                }

            });

    } else {

        swal(errors);
    }
}



//Validation Of Dynamic dropdown
const dynamicElementValidatorInner = (element, object, property) => {

    const dynamicElement = element.value;

    invoiceHasItem[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");

}

// Generate Line Price in Shop Customer Inner Invoice Form
const generateLinePrice2 = (dataOb) =>{

    let unitPrice = parseFloat(txtUnitPriceInner2.value);
    let itemQty = parseFloat(txtItemQuantityInner2.value);

    let linePrice = (unitPrice * itemQty);
    txtLinePriceInner2.value = linePrice.toFixed(2);
    txtLinePriceInner2.classList.add("is-valid");
    invoiceHasItem.line_price = txtLinePriceInner2.value;

}

// Generate Total Price in Shop Customer
const generateTotalPrice2 = () => {

    let totalPrice = 0;

    invoice.invoiceHasItemList.forEach(itemOb => {

        totalPrice += parseFloat(itemOb.line_price);

    })

    txtTotalPrice2.value = totalPrice;
    invoice.total_price = txtTotalPrice2.value;
    txtTotalPrice2.classList.add("is-valid");

}









