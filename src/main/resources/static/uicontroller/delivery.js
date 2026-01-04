


window.addEventListener('load', () => {

    refreshForm();
    refreshDeliveryTable();


})


//Validation Of Dynamic dropdown  
const dynamicElementValidator = (element, object, property) => {

    const dynamicElement = element.value;

    delivery[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");


}


const refreshForm = () => {


    delivery = new Object();

    //Cleaning the inner HTML
    deliveryForm.reset();

    //Removing Validation Colours using a common function declared in common.js

    setDefault([selectInvoiceNo,
        selectCustomerName,
        selectOrderNo,
        txtDeliveryDate,
        txtDeliveryTime,
        txtDeliveryAddress,
        selectDeliveryVehicle,
        selectDeliveryStatus,
        textNote]);

    //Define Customer Order No
    let invoiceNo = getServiceRequest("/invoice/alldata");
    //Calling function fill data into select
    fillDataIntoSelect(selectInvoiceNo, "Please select Invoice No..!", invoiceNo, "invoice_no");

    //Define Customer Order No
    let OrderNo = getServiceRequest("/customerorder/alldata");
    //Calling function fill data into select
    fillDataIntoSelect(selectOrderNo, "Please selectOrder No..!", OrderNo, "order_no");


    //Define Customer Name
    let customerName = getServiceRequest("/customer/alldata");
    //Calling function fill data into select
    fillDataIntoSelect(selectCustomerName, "Please select Customer Name..!", customerName, "name");

    //Define Delivery Route
    let vehicle = getServiceRequest("/vehicle/alldata");
    //Calling function fill data into select
    fillDataIntoSelect(selectDeliveryVehicle, "Please select Delivery Vehicle..!", vehicle, "name");

    //Define Delivery Status
    let deliveryStatus = getServiceRequest("/deliverystatus/alldata");
    //Calling function fill data into select
    fillDataIntoSelect(selectDeliveryStatus, "Please select Deliver Status..!", deliveryStatus, "status");

    //Update button getsdissapeared when refreshForm executed
    buttonSubmit.style.display = "block";
    buttonUpdate.style.display = "none";


}



const refreshDeliveryTable = () => {

    //string => string/sate/number
    //function => object/array/boolean
    let propertyList = [{ propertyName: "deliver_no", dataType: "string" },
    { propertyName: getInvoiceNo, dataType: "function" },
    { propertyName: getCustomerName, dataType: "function" },
    { propertyName: "delivery_date", dataType: "string" },
    { propertyName: "delivery_address", dataType: "string" },
    { propertyName: getDeliveryStatus, dataType: "function" },
    ];


    //Calling a common function to retrive data from the database to the table
    let deliveryData = getServiceRequest("/delivery/alldata");
    //Calling common function to fill data into table
    fillDataIntoTable1(tablelDeliveryBody, deliveryData, propertyList, deliveryFormRefill, deliveryDelete, deliveryView, true);


    $('#deliveryTable').DataTable();

}

const getInvoiceNo = (dataOb) => {

    return dataOb.invoice_id.invoice_no;
}

const getCustomerName = (dataOb) => {

    return dataOb.invoice_id?.customer_order_id?.customer_id?.name;
}


const getDeliveryStatus = (dataOb) => {

    return dataOb.delivery_status_id.status;
}


//check errors in the form
const checkFormError = () => {

    //need to check all required properties

    let errors = "";

    if (delivery.customer_id == null) {
        errors = errors + "Please Select a customer name..!\n";

    }

    if (delivery.invoice_id == null) {
        errors = errors + "Please Select a Invoice No..!\n";

    }

    if (delivery.customer_order_id == null) {
        errors = errors + "Please Select a customer order no..!\n";

    }

    if (delivery.delivery_date == null) {
        errors = errors + "Please Enter Delivery date..!\n";

    }

    if (delivery.delivery_time == null) {
        errors = errors + "Please Enter Delivery Time..!\n";

    }


    if (delivery.delivery_address == null) {
        errors = errors + "Please Enter Delivery Address..!\n";

    }


    if (delivery.vehicle_id == null) {
        errors = errors + "Please Select Vehicle..!\n";

    }


    if (delivery.delivery_status_id == null) {
        errors = errors + "Please Select  Delivery Status..!\n";

    }


    return errors;



}


//Employee form Submit Function
const buttonDeliverySubmit = () => {


    console.log(delivery);

    //Check form error for required element
    let errors = checkFormError();

    if (errors == "") {
        let userConfirmMsg1 =

            "\n Customer Name :" + delivery.customer_id.name +
            "\n Invoice No :" + delivery.invoice_id.invoice_no +
            "\n Customer Order No:" + delivery.customer_order_id.order_no +
            "\n Delivery Date:" + delivery.delivery_date +
            "\n Delivery Time:" + delivery.delivery_time +
            "\n Delivery Address:" + delivery.delivery_address +
            "\n Vehicle Name:" + delivery.vehicle_id.name +
            "\n Delivery Status:" + delivery.delivery_status_id.status;



        swal({
            title: "Are you sure to Submit Following Details..?",
            text: userConfirmMsg1,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((userResponce) => {

            if (userResponce) {
                //call post service
                let postResponce = getHTTPServiceRequest("/delivery/insert", "POST", delivery);
                if (postResponce == "OK") {
                    swal("Saved Successfully ....!");


                    refreshDeliveryTable();
                    refreshForm();

                    $("#deliveryForm").modal("hide");



                } else {
                    swal("Failed to submit..! \n" + postResponce);

                }

            }

        })


    } else {

        swal("Form has following errors...\n\n" + errors);

    }


}




//function define for refill customer form
const deliveryFormRefill = (dataOb, index) => {
    console.log("Edit", dataOb, index);

    // //Creating two objects for update function
    delivery = JSON.parse(JSON.stringify(dataOb));
    oldDelivery = JSON.parse(JSON.stringify(dataOb));


    //Refilling fields..
    selectInvoiceNo.value = JSON.stringify(dataOb.invoice_id);
    selectCustomerName.value = JSON.stringify(dataOb.invoice_id.customer_order_id.customer_id);
    selectOrderNo.value = JSON.stringify(dataOb.invoice_id.customer_order_id);
    txtDeliveryDate.value = dataOb.delivery_date;
    txtDeliveryTime.value = dataOb.delivery_time;
    txtDeliveryAddress.value = dataOb.delivery_address;
    selectDeliveryVehicle.value = JSON.stringify(dataOb.vehicle_id);
    selectDeliveryStatus.value = JSON.stringify(dataOb.delivery_status_id);

    //Assigning values in order to avoid mismatches during update


    //delivery Object
    delivery.customer_id == dataOb.invoice_id?.customer_order_id?.customer_id.name;
    delivery.invoice_id == dataOb.invoice_id?.invoice_no;
    delivery.customer_order_id == dataOb.invoice_id?.customer_order_id?.order_no;
    delivery.vehicle_id == dataOb.vehicle_id?.name;
    delivery.delivery_status_id == dataOb.delivery_status_id?.status;

    //Old Delivery Object
    oldDelivery.customer_id == dataOb.invoice_id?.customer_order_id?.customer_id.name;
    oldDelivery.invoice_id == dataOb.invoice_id?.invoice_no;
    oldDelivery.customer_order_id == dataOb.invoice_id?.customer_order_id?.order_no;
    oldDelivery.vehicle_id == dataOb.vehicle_id?.name;
    oldDelivery.delivery_status_id == dataOb.delivery_status_id?.status;



    //Update button getsdissapeared when refreshForm executed
    buttonSubmit.style.display = "none";
    buttonUpdate.style.display = "block";

    $("#modalDeliveryForm").modal("show");


}


//function define for delete customer record
const deliveryDelete = (dataOb, index) => {
    console.log("Delete", dataOb, index);


    //need to get user confirmation
    let userConfirmMsg =
        "\n Delivery No :" + dataOb.deliver_no +
        "\n Delivery Date :" + dataOb.delivery_date +
        "\n Delivery Address:" + dataOb.delivery_address +
        "\n Invoice No:" + dataOb.invoice_id.invoice_no +
        "\n Customer No:" + dataOb.invoice_id?.customer_order_id?.customer_id?.name +
        "\n Delivery Status:" + dataOb.delivery_status_id.status;


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


                let deleteResponce = getHTTPServiceRequest("/delivery/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });

                    refreshForm();
                    refreshDeliveryTable();

                } else {
                    swal("Delete Not Sccessfull...!", {
                        icon: "error", text: deleteResponce
                    });

                }

            }



        });


}


//form Update event function 
const checkFormUpdate = () => {

    let updates = "";

    if (delivery != null && oldDelivery != null) {

        if (delivery.customer_id?.name != oldDelivery.customer_id?.name) {

            updates = updates + "Customer Name has changed..!\n";

        }

        if (delivery.invoice_id?.invoice_no != oldDelivery.invoice_id?.invoice_no) {

            updates = updates + "Innvoice No has changed..!\n";

        }

        if (delivery.customer_order_id?.order_no != oldDelivery.customer_order_id?.order_no) {

            updates = updates + "Customer Order No has changed..!\n";

        }


        if (delivery.delivery_date != oldDelivery.delivery_date) {

            updates = updates + "Delivery Date has changed..!\n";

        }

        if (delivery.delivery_time != oldDelivery.delivery_time) {

            updates = updates + "Delivery Time has changed..!\n";

        }

        if (delivery.delivery_address != oldDelivery.delivery_address) {

            updates = updates + "Delivery Address has changed..!\n";

        }


        if (delivery.vehicle_id?.name != oldDelivery.vehicle_id?.name) {

            updates = updates + "Vehicle has changed..!\n";

        }


        if (delivery.delivery_status_id?.status != oldDelivery.delivery_status_id?.status) {

            updates = updates + "Delivery Status has changed..!\n";

        }

        return updates;


    }
}



//form Update event function 
const buttonDeliveryUpdate = () => {

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
                    let putResponce = getHTTPServiceRequest("/delivery/update", "PUT", delivery);
                    if (putResponce == "OK") {
                        swal("Updated Successfully ....!");

                        refreshForm();
                        refreshDeliveryTable();
                        $("##modalDeliveryForm").modal("hide");

                    } else {
                        swal("Failed to Update..! \n" + putResponce);

                    }


                }


            });

    }




}



//function define for view/print  stock record
const deliveryView = (dataOb, index) => {
    console.log("View", dataOb, index);

    tdDeliveryNo.innerText = dataOb.deliver_no;
    tdInvoiceNo.innerText = dataOb.invoice_id.invoice_no;
    tdCustomerName.innerText = dataOb.invoice_id.customer_order_id.customer_id.name;
    tdDeliveryDate.innerText = dataOb.delivery_date;
    tdAddress.innerText = dataOb.delivery_address;
    tdDeliveryStatus.innerText = dataOb.delivery_status_id.status;


    $("#modalDeliveryView").modal("show")


    refreshForm();
    refreshDeliveryTable();



}

const printDeliveryRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-user</title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
        "<body>" + tablelDeliveryView.outerHTML + "</body>";


    newWindow.document.write(printView);



    //Print window
    setTimeout(() => {

        newWindow.stop();
        newWindow.print();
        newWindow.close();

    }, 500)


    $("#modalDeliveryView").modal("hide");


}





