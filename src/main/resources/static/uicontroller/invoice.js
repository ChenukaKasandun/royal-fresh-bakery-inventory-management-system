
//Window onload function
window.addEventListener('load', () => {

    refreshInvoiceTable();
    refreshForm();

})




//Validation Of Dynamic dropdown  
const dynamicElementValidator = (element, object, property) => {

    const dynamicElement = element.value;

    invoice[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");


}


let selectCustomerNameElement = document.querySelector("#selectCustomerName");

selectCustomerNameElement.addEventListener("change", () => {

    let customerName = JSON.parse(selectCustomerNameElement.value);

    console.log(customerName);

    selectCustomerNameElement.classList.add("is-valid");

    //URL request for getting Customer  Order No relevent to the Customer Name from Back end using queries
    let customerOrderByCustomerName = getServiceRequest("/customerorder/orderByCustomerName?customerName=" + customerName.name);

    // Convert ['ODR004', 'ODR005'] → [{ order_no: 'ODR004' }, { order_no: 'ODR005' }]
    let formattedOrders = customerOrderByCustomerName.map(order => ({ order_no: order }));

    fillDataIntoSelect(selectOrderNo, "Please select Customer Order No..!", formattedOrders, "order_no");


})



let selectOrderNoElement = document.querySelector("#selectOrderNo");

selectOrderNoElement.addEventListener('change', () => {

    let orderNo = JSON.parse(selectOrderNoElement.value);

    console.log(orderNo);

    let totalPriceByOrderNo = getServiceRequest("/customerorder/totalPriceByCustomerOrder?customerOrderNo=" + orderNo.order_no)

    txtTotalPrice.value = totalPriceByOrderNo;

    invoice.totalPrice = txtTotalPrice.value;
    txtTotalPrice.classList.add("is-valid");


    let discountedPriceByOrderNo = getServiceRequest("/customerorder/discountedPriceByCustomerOrder?customerOrderNo=" + orderNo.order_no)
    console.log(discountedPriceByOrderNo);

    txtDiscountedPrice.value = discountedPriceByOrderNo;
    invoice.discountedPrice = txtDiscountedPrice.value;

    if (invoice.discountedPrice != null) {
        txtDiscountedPrice.classList.add("is-valid");


    }


})



//refresh form
const refreshForm = () => {

    invoice = new Object();


    txtDate.value = "";
    selectCustomerName.value = "";
    selectOrderNo.value = "";
    txtTotalPrice.value = "";
    txtDiscountedPrice.value = "";
    selectStatus.value = "";
    textNote.value = "";

    txtDate.classList.remove("is-invalid");
    txtDate.classList.remove("is-valid");

    selectCustomerName.classList.remove("is-invalid");
    selectCustomerName.classList.remove("is-valid");


    selectOrderNo.classList.remove("is-invalid");
    selectOrderNo.classList.remove("is-valid");


    txtTotalPrice.classList.remove("is-invalid");
    txtTotalPrice.classList.remove("is-valid");

    txtDiscountedPrice.classList.remove("is-invalid");
    txtDiscountedPrice.classList.remove("is-valid");


    selectStatus.classList.remove("is-invalid");
    selectStatus.classList.remove("is-valid");



    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let customers = getServiceRequest("/customer/alldata");

    //Filling data to the dyanamic dropdowns
    fillDataIntoSelect(selectCustomerName, "Please select Customer..!", customers, "name");


    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let invoiceStatus = getServiceRequest("/invoicestatus/alldata");

    //Filling data to the dyanamic dropdowns
    fillDataIntoSelect(selectStatus, "Please select Invoice Status..!", invoiceStatus, "status");




    //Update button getsdissapeared when Add Invoice clicked
    buttonSubmit.style.display = "block";
    buttonUpdate.style.display = "none";



}




//referesh table
const refreshInvoiceTable = () => {


    let invoices = getServiceRequest("/invoice/alldata");


    //string => string/sate/number
    //function => object/array/boolean
    let propertyList = [{ propertyName: "invoice_no", dataType: "string" },
    { propertyName: "date", dataType: "string" },
    { propertyName: getCustomerName, dataType: "function" },
    { propertyName: getCustomerOrderNo, dataType: "function" },
    { propertyName: getTotalPrice, dataType: "function" },
    { propertyName: getDiscountedPrice, dataType: "function" },
    { propertyName: getInvoiceStatus, dataType: "function" },
    ];


    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js


    // Calling common function to fill data into table
    fillDataIntoTable1(tableInvoiceBody, invoices, propertyList, buttonInvoiceRefill, buttonInvoiceDelete, buttonInvoiceView, true);





    $('#invoiceTable').DataTable();





}


//define functions to fill drop downs
const getCustomerName = (dataOb) => {
    return dataOb.customer_order_id.customer_id.name;
}


const getCustomerOrderNo = (dataOb) => {
    return dataOb.customer_order_id.order_no;
}


const getInvoiceStatus = (dataOb) => {

    if (dataOb.invoice_status_id.status == "Cancelled") {
        return `<p class='fw-bold' style="background-color: red">${dataOb.invoice_status_id?.status}</p>`;

    } else {
        return dataOb.invoice_status_id.status;

    }

}


const getTotalPrice = (dataOb) => {
    return dataOb.customer_order_id.total_price;
}

const getDiscountedPrice = (dataOb) => {
    return dataOb.customer_order_id.discounted_price;
}



const checkFormError = () => {

    let errors = "";

    if (invoice.date == null) {
        errors = errors + "Please Enter a valid date..!\n";

    }

    if (invoice.customer_id == null) {
        errors = errors + "Please Enter Customer Name..!\n";

    }

    if (invoice.customer_order_id == null) {
        errors = errors + "Please Enter Order No..!\n";

    }

    if (invoice.totalPrice == null) {
        errors = errors + "Please Enter the total price..!\n";

    }

    if (invoice.discountedPrice == null) {
        errors = errors + "Please Enter the discounted price..\n";

    }

    if (invoice.invoice_status_id == null) {
        errors = errors + "Please Enter the status..!\n";

    }

    return errors;
}



//form submit event function 
const buttonInvoiceSubmit = () => {

    let errors = checkFormError();
    console.log(invoice);
    console.log("invoice");




    if (errors == "") {

        let userConfirmMsg1 =

            "\n Invoice Date :" + invoice.date +
            "\n Order No:" + invoice.customer_order_id.order_no +
            "\n Customer Name:" + invoice.customer_id.name +
            "\n Total Price:" + invoice.totalPrice +
            "\n Discounted Price:" + invoice.discountedPrice +
            "\n Status:" + invoice.invoice_status_id.status;



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
                        refreshForm();

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
    buttonUpdate.style.display = "block";
    buttonSubmit.style.display = "none";


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




const buttonInvoiceUpdate = () => {


    //need to check form errors
    let errors = checkFormError();


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


















