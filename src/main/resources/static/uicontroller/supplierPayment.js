


window.addEventListener('load', () => {

    paymentRefreshTable();
    refreshForm();


})






//JavaScript to toggle collapse  ---> Payment Method collapse (Individual Customer)

const cashRadio = document.getElementById('cashRadio');
const cardRadio = document.getElementById('cardRadio');
const collapseTarget = document.getElementById('paymentDetailsCollapse');
const bsCollapse = new bootstrap.Collapse(collapseTarget, { toggle: false });

cashRadio.addEventListener('change', () => {
    if (cashRadio.checked) {
        bsCollapse.show();
    }
});

cardRadio.addEventListener('change', () => {
    if (cardRadio.checked) {
        bsCollapse.hide();
    }
});

//Validation Of Dynamic dropdown  
const dynamicElementValidator = (element, object, property) => {

    const dynamicElement = element.value;

    supplierPayment[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");


}


const paymentMethodValidator = () => {

    if (cashRadio.checked) {
        supplierPayment.supplier_payment_method_id = { id: 1, name: "Cash" };

    }

    if (cardRadio.checked) {
        supplierPayment.supplier_payment_method_id = { id: 2, name: "Card" };

    }
}


//Payment Status Validator
const paymentStatusValidator = () => {

    if (paidRadio.checked) {
        supplierPayment.supplier_payment_status_id = { id: 1, status: "Paid" };

    }

    if (notPaidRadio.checked) {
        supplierPayment.supplier_payment_status_id = { id: 2, status: "Not Paid" };

    }
}


const paymentRefreshTable = () => {



    //string => string/sate/number
    //function => object/array/boolean

    let propertyList = [{ propertyName: getSupplierBillNo, dataType: "function" },
    { propertyName: getSupplierGrnNo, dataType: "function" },
    { propertyName: getSupplierName, dataType: "function" },
    { propertyName: "total_price", dataType: "string" },
    { propertyName: getSupplierPaymentStatus, dataType: "function" },
    { propertyName: getSupplierPaymentMethod, dataType: "function" }
    ];



    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let supplierPayments = getServiceRequest("/supplierpayment/alldata");

    //Calling common function to fill data into table
    fillDataIntoTable1(tablePaymentBody, supplierPayments, propertyList, paymentFormRefill, buttonPaymentDelete, buttonPaymentView, true);


    $('#payementTable').DataTable();


}

//Decalring functions to retrive data from the database to the table at fontend

const getSupplierGrnNo = (dataOb) => {
    return dataOb.grn_id.grn_no;
}

const getSupplierName = (dataOb) => {

    return dataOb.grn_id.supplier_id.supplier_name;
}

const getSupplierPaymentStatus = (dataOb) => {

    return dataOb.supplier_payment_status_id.status;
}

const getSupplierPaymentMethod = (dataOb) => {

    return dataOb.supplier_payment_method_id.name;
}


const getSupplierBillNo = (dataOb) => {

    return dataOb.grn_id.bill_no;
}



const refreshForm = () => {


    //Defining a new data object to data bind at front end
    supplierPayment = new Object();


    //clean the properties when refreshing form
    selectSupplierBillNo.value = "";
    selectGRNNo.value = "";
    selectSupplierName.value = "";
    txtTotalPrice.value = "";
    textPaidAmount.value = "";
    textBalanceAmount.value = "";

    cashRadio.checked = false;
    cardRadio.checked = false;

    paidRadio.checked = false;
    notPaidRadio.checked = false;

    //set initial validation colour when refreshing form
    selectSupplierBillNo.classList.remove("is-valid");
    selectSupplierBillNo.classList.remove("is-invalid");

    selectGRNNo.classList.remove("is-valid");
    selectGRNNo.classList.remove("is-invalid");

    selectSupplierName.classList.remove("is-valid");
    selectSupplierName.classList.remove("is-invalid");

    txtTotalPrice.classList.remove("is-valid");
    txtTotalPrice.classList.remove("is-invalid");


    textPaidAmount.classList.remove("is-valid");
    textPaidAmount.classList.remove("is-invalid");


    textBalanceAmount.classList.remove("is-valid");
    textBalanceAmount.classList.remove("is-invalid");




    let billNo = getServiceRequest("grn/alldata");
    //Filling GRN No dropdown
    fillDataIntoSelect(selectSupplierBillNo, "Please select Supplier Bill No..!", billNo, "bill_no");


    let grnNo = getServiceRequest("grn/alldata");
    //Filling GRN No dropdown
    fillDataIntoSelect(selectGRNNo, "Please select Supplier Status..!", grnNo, "grn_no");



    let supplierName = getServiceRequest("/supplier/alldata");
    //Filling supplier Name dropdown
    fillDataIntoSelect(selectSupplierName, "Please select Supplier Name..!", supplierName, "supplier_name");



    //Update button getsdissapeared when Add Customer Order clicked
    buttonSubmit.style.display = "block";
    buttonUpdate.style.display = "none";


}

const checkFormError = () => {

    let errors = "";

    if (supplierPayment.bill_no == null) {
        errors = errors + "\n PLease Enter a valid Bill No..!";

    }

    if (supplierPayment.grn_id == null) {
        errors = errors + "\n PLease Select a GRN No..!";

    }

    if (supplierPayment.supplier_id == null) {
        errors = errors + "\n PLease Select a valid Supplier Name..!";

    }

    if (supplierPayment.total_price == null) {
        errors = errors + "\n PLease Entera valid Total Price..!";

    }

    if (supplierPayment.supplier_payment_method_id == null) {
        errors = errors + "\n PLease Enter a Payment Method..!";

    }

    if (supplierPayment.supplier_payment_status_id == null) {
        errors = errors + "\n PLease Enter the Payment Status.!";

    }

    if (cashRadio.checked) {
        if (supplierPayment.paid_amount == null) {
            errors = errors + "\n PLease Enter a valid paid amount.!";

        }

        if (supplierPayment.balance_amount == null) {
            errors = errors + "\n PLease Enter a valid balance amount.!";

        }

    }



    return errors;



}


//form refill/Edit
const paymentFormRefill = (dataOb, index) => {


    //Declaring two objects inorder to compare for check form updates
    supplierPayment = JSON.parse(JSON.stringify(dataOb));
    oldSupplierPayment = JSON.parse(JSON.stringify(dataOb));


    selectSupplierBillNo.value = JSON.stringify(dataOb.grn_id);
    selectGRNNo.value = JSON.stringify(dataOb.grn_id);
    selectSupplierName.value = JSON.stringify(dataOb.grn_id.supplier_id);
    txtTotalPrice.value = dataOb.total_price;


    if (dataOb.supplier_payment_method_id.name == "Cash") {

        cashRadio.checked = true;

        textPaidAmount.value = dataOb.paid_amount;
        textBalanceAmount.value = dataOb.balance_amount;

    }
    if (dataOb.supplier_payment_method_id.name == "Card") {
        cardRadio.checked = true;

    }


    if (dataOb.supplier_payment_status_id.status == "Paid") {
        paidRadio.checked = true;

    }

    if (dataOb.supplier_payment_status_id.status == "Not Paid") {
        notPaidRadio.checked = true;

    }

    //Assigning values from data base  to the proprties of front end object inorder to comparison whedn updating

    supplierPayment.bill_no = dataOb.grn_id.bill_no;
    oldSupplierPayment.bill_no = dataOb.grn_id.bill_no;


    supplierPayment.supplier_id = dataOb.grn_id.supplier_id.supplier_name;
    oldSupplierPayment.supplier_id = dataOb.grn_id.supplier_id.supplier_name;

    supplierPayment.grn_id = dataOb.grn_id.grn_no;
    oldSupplierPayment.grn_id = dataOb.grn_id.grn_no;

    supplierPayment.supplier_payment_method_id
    oldSupplierPayment.supplier_payment_method_id

    supplierPayment.supplier_payment_method_id = dataOb.supplier_payment_method_id.name;
    oldSupplierPayment.supplier_payment_method_id = dataOb.supplier_payment_method_id.name;

    supplierPayment.supplier_payment_status_id = dataOb.supplier_payment_status_id.status;
    oldSupplierPayment.supplier_payment_status_id = dataOb.supplier_payment_status_id.status;

    $("#supplierPayment").modal("show");

    //submit button getsdissapeared when Edit function executed
    buttonUpdate.style.display = "block";
    buttonSubmit.style.display = "none";



}



//form submit event function 
const buttonSupplierPaymentSubmit = () => {


    console.log(supplierPayment);

    //Check form error for required element
    let errors = checkFormError();

    if (errors == "") {
        let userConfirm =

            "\n Supplier Bill No :" + supplierPayment.bill_no.bill_no +
            "\n GRN No :" + supplierPayment.grn_id.grn_no +
            "\n Supplier Name:" + supplierPayment.supplier_id.supplier_name +
            "\n Total Price:" + supplierPayment.total_price +
            "\n Payment Method:" + supplierPayment.supplier_payment_method_id.name +
            "\n Payment Status:" + supplierPayment.supplier_payment_status_id.status;


        if (cashRadio.checked) {
            userConfirm +=
                "\n Paid Amount:" + supplierPayment.paid_amount +
                "\n Balance Amount:" + supplierPayment.balance_amount;
        }


        swal({
            title: "Are you sure to Submit Following Details..?",
            text: userConfirm,
            icon: "warning",
            buttons: true,
            dangerMode: true,

        }).then((userResponce) => {

            if (userResponce) {
                //call post service
                let postResponce = getHTTPServiceRequest("/supplierpayment/insert", "POST", supplierPayment);
                if (postResponce == "OK") {
                    swal("Saved Successfully ....!");


                    paymentRefreshTable();
                    refreshForm();
                    $("#supplierPayment").modal("hide");



                } else {
                    swal("Failed to submit..! \n" + postResponce);

                }


            }





        })









    } else {
        swal("Form has following errors...\n" + errors);

    }



}



const checkFormUpdate = () => {


    let updates = "";
    if (supplierPayment != null && oldSupplierPayment != null) {

        if (supplierPayment.bill_no.bill_no != oldSupplierPayment.bill_no.bill_no) {
            updates = updates + "Supplier Bill No has changed..!\n";

        }

        if (supplierPayment.grn_id.grn_no != oldSupplierPayment.grn_id.grn_no) {
            updates = updates + "GRN No has changed..!\n";

        }


        if (supplierPayment.supplier_id.supplier_name != oldSupplierPayment.supplier_id.supplier_name) {
            updates = updates + "Supplier name has changed..!\n";

        }

        if (supplierPayment.total_price != oldSupplierPayment.total_price) {
            updates = updates + "Total Price has changed..!\n";

        }

        if (supplierPayment.supplier_payment_method_id.name != oldSupplierPayment.supplier_payment_method_id.name) {
            updates = updates + "Payment Method  has changed..!\n";

        }

        if (supplierPayment.supplier_payment_status_id.status != oldSupplierPayment.supplier_payment_status_id.status) {
            updates = updates + "Payment Status  has changed..!\n";

        }



        if (cashRadio.checked) {

            if (supplierPayment.paid_amount != oldSupplierPayment.paid_amount) {
                updates = updates + "Paid Amount has changed..!\n";

            }

            if (supplierPayment.balance_amount != oldSupplierPayment.balance_amount) {
                updates = updates + "Balance Amount has changed..!\n";

            }

        }




    }


    console.log(supplierPayment);
    console.log(oldSupplierPayment);

    return updates;


}

//form Update event function 
const buttonSupplierPaymentUpdate = () => {

    //need to check form errors
    let errors = checkFormError();


    if (errors == "") {

        let updates = checkFormUpdate();
        if (updates == "") {
            swal("Nothing to update..!");

        } else {
            let userConfirmMsg = "Are you sure to update Supplier Payment...?";

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
                        let putResponce = getHTTPServiceRequest("supplierpayment/update", "PUT", supplierPayment);
                        if (putResponce == "OK") {
                            swal("Updated Successfully ....!");




                            paymentRefreshTable();
                            refreshForm();
                            $("#supplierPaymentForm").modal("hide");



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
const buttonPaymentDelete = (dataOb, index) => {


    //need to get user confirmation
    let userConfirmMsg =

        "\n Supplier Bill No :" + dataOb.grn_id.bill_no +
        "\n GRN No :" + dataOb.grn_id.grn_no +
        "\n Supplier Name :" + dataOb.grn_id.supplier_id.supplier_name +
        "\n Total Price:" + dataOb.total_price +
        "\n Payment Status:" + dataOb.supplier_payment_status_id.status +
        "\n Payment Method:" + dataOb.supplier_payment_method_id.name;



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


                let deleteResponce = getHTTPServiceRequest("/supplierpayment/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });


                    paymentRefreshTable();
                    refreshForm();


                } else {
                    swal("Delete Not Sccessfull...!", {
                        icon: "error", text: deleteResponce
                    });

                }

            }



        });




}

//form View event function 
const buttonPaymentView = (dataOb, index) => {
    console.log("View", dataOb, index);

    tdBillNo.innerText = dataOb.grn_id?.bill_no;
    tdGRNNo.innerText = dataOb.grn_id.grn_no;
    tdSupplierName.innerText = dataOb.grn_id.supplier_id.supplier_name;
    tdTotalPrice.innerText = dataOb.total_price;
    tdPaymentStatus.innerText = dataOb.supplier_payment_status_id.status;
    tdPaymentMethod.innerText = dataOb.supplier_payment_method_id.name;


    $("#modalSupplierPaymentView").modal("show");


}


const printSupplerPaymentRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-Supplier Pyments</title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
        "<body>" + tableSupplierTableView.outerHTML + "</body>";


    newWindow.document.write(printView);



    //Print window
    setTimeout(() => {

        newWindow.stop();
        newWindow.print();
        newWindow.close();

    }, 500)


    $("#modalSupplierView").modal("hide");


}















