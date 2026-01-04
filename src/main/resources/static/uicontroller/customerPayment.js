

//window onload function
window.addEventListener('load', () => {

    refreshCustomerPaymentTable();
    refreshForm1();
    refreshForm2();


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

//JavaScript to toggle collapse  ---> Payment Method collapse(Shop Customer)

const cashRadio2 = document.getElementById('cashRadio2');
const cardRadio2 = document.getElementById('cardRadio2');
const collapseTarget2 = document.getElementById('paymentDetailsCollapse2');
const bsCollapse2 = new bootstrap.Collapse(collapseTarget2, { toggle: false });

cashRadio2.addEventListener('change', () => {
    if (cashRadio2.checked) {
        bsCollapse2.show();
    }
});

cardRadio2.addEventListener('change', () => {
    if (cardRadio2.checked) {
        bsCollapse2.hide();
    }
});




//Validation Of Dynamic dropdown  
const dynamicElementValidator = (element, object, property) => {

    const dynamicElement = element.value;

    customerPayment[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");


}


//Radio Element validator --> Payment method
const radioElementValidator = () => {

    if (cashRadio.checked) {
        customerPayment.customer_payment_method_id = { id: 1, name: "Cash" };

    }

    if (cardRadio.checked) {
        customerPayment.customer_payment_method_id = { id: 2, name: "Card" };

    }

    if (cashRadio2.checked) {
        customerPayment.customer_payment_method_id = { id: 1, name: "Cash" };

    }

    if (cardRadio2.checked) {
        customerPayment.customer_payment_method_id = { id: 2, name: "Card" };

    }

}


//Function to auto select the invoice No when Customer Name get Selected
let customerNameElement1 = document.querySelector("#selectCustomerName1");
customerNameElement1.addEventListener('change', () => {

    let customerName = JSON.parse(customerNameElement1.value);

    console.log(customerName);


    let invoiceNoByCustomerName = getServiceRequest("/invoice/invoicenobycustomername?customerName=" + customerName.name);

    // Convert ['INV001', 'INV002'] → [{invoice_no: 'INV001' }, { invoice_no: 'INV002' }]
    let formattedInvoiceNumbers = invoiceNoByCustomerName.map(invoiceNo => ({ invoice_no: invoiceNo }));

    fillDataIntoSelect(selectInvoiceNo1, "Please select Invoice No..!", formattedInvoiceNumbers, "invoice_no");





})

//Function to auto select the Total Price when Invoice No get Selected
let invoiceNoElement = document.querySelector("#selectInvoiceNo1");
invoiceNoElement.addEventListener('change', () => {

    let invoiceNo = JSON.parse(invoiceNoElement.value);

    console.log(invoiceNo);


    let invoiceNoByCustomerName = getServiceRequest("/invoice/invoicenobycustomername?customerName=" + customerName.name);

    // Convert ['INV001', 'INV002'] → [{invoice_no: 'INV001' }, { invoice_no: 'INV002' }]
    let formattedInvoiceNumbers = invoiceNoByCustomerName.map(invoiceNo => ({ invoice_no: invoiceNo }));

    fillDataIntoSelect(selectInvoiceNo1, "Please select Invoice No..!", formattedInvoiceNumbers, "invoice_no");





})



//refresh Form
const refreshForm1 = () => {

    customerPayment = new Object();

    selectCustomerName1.value = "";
    selectInvoiceNo1.value = "";
    datePaymentDate1.value = "";
    txtTotalPrice1.value = "";
    textPaidAmount.value = "";
    textBalanceAmount.value = "";

    cashRadio.checked = false;
    cardRadio.checked = false;


    selectCustomerName1.classList.remove("is-invalid");
    selectCustomerName1.classList.remove("is-valid");

    selectInvoiceNo1.classList.remove("is-invalid");
    selectInvoiceNo1.classList.remove("is-valid");

    datePaymentDate1.classList.remove("is-invalid");
    datePaymentDate1.classList.remove("is-valid");

    txtTotalPrice1.classList.remove("is-invalid");
    txtTotalPrice1.classList.remove("is-valid");

    textPaidAmount.classList.remove("is-invalid");
    textPaidAmount.classList.remove("is-valid");

    textBalanceAmount.classList.remove("is-invalid");
    textBalanceAmount.classList.remove("is-valid");





    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let customerName = getServiceRequest("/customer/alldataByCustomerTypeIndividual")


    //filling data into dropdown
    fillDataIntoSelect(selectCustomerName1, "Please select Customer Name", customerName, "name");


    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let invoiceNo = getServiceRequest("/invoice/alldata")


    //filling data into dropdown
    fillDataIntoSelect(selectInvoiceNo1, "Please select Invoice No", invoiceNo, "invoice_no");


    //Update button getsdissapeared when Add Customer Payment clicked
    buttonSubmit1.style.display = "block";
    buttonUpdate1.style.display = "none";




}

const refreshForm2 = () => {

    ///Cleaning innerHTML of attributes
    selectCustomerName2.value = "";
    selectInvoiceNo2.value = "";
    txtReturnedItemList2.value = "";
    txtTotalPrice2.value = "";
    textPaidAmount2.value = "";
    textBalanceAmount2.value = "";


    //Radio buttons
    cashRadio2.checked = false;
    cardRadio2.checked = false;

    selectCustomerName2.classList.remove("is-invalid");
    selectCustomerName2.classList.remove("is-valid");

    selectInvoiceNo2.classList.remove("is-invalid");
    selectInvoiceNo2.classList.remove("is-valid");

    txtReturnedItemList2.classList.remove("is-invalid");
    txtReturnedItemList2.classList.remove("is-valid");

    txtTotalPrice2.classList.remove("is-invalid");
    txtTotalPrice2.classList.remove("is-valid");

    textPaidAmount2.classList.remove("is-invalid");
    textPaidAmount2.classList.remove("is-valid");

    textBalanceAmount2.classList.remove("is-invalid");
    textBalanceAmount2.classList.remove("is-valid");





    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let customerName = getServiceRequest("/customer/alldataByCustomerTypeShop")


    //filling data into dropdown
    fillDataIntoSelect(selectCustomerName2, "Please select Customer Name", customerName, "name");


    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let invoiceNo = getServiceRequest("/invoice/alldata")


    //filling data into dropdown
    fillDataIntoSelect(selectInvoiceNo2, "Please select Invoice No", invoiceNo, "invoice_no");

    //Update button getsdissapeared when Add Customer Payment clicked
    buttonSubmit2.style.display = "block";
    buttonUpdate2.style.display = "none";


}




//refresh customer table
const refreshCustomerPaymentTable = () => {


    //string => string/sate/number
    //function => object/array/boolean
    let propertyList = [{ propertyName: getInvoiceNo, dataType: "function" },
    { propertyName: getCustomerName, dataType: "function" },
    { propertyName: getCustomerType, dataType: "function" },
    { propertyName: getTotalPrice, dataType: "function" },
    { propertyName: "paid_amount", dataType: "string" },
    { propertyName: "balance_amount", dataType: "string" },
    { propertyName: getPaymentMethod, dataType: "function" },

    ];

    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let customerPayments = getServiceRequest("/customerpayment/alldata");


    //Calling common function to fill data into table
    fillDataIntoTable1(tableCustomerPaymentBody, customerPayments, propertyList, paymentFormRefill, buttonCustomerPaymentDelete, buttonCustomerPaymentView, true);




    //Jquery function
    $('#customerPaymentTable').DataTable();


}


//defining functions to retrive data from the backend
const getInvoiceNo = (dataOb) => {
    return dataOb.invoice_id.invoice_no;
}

const getCustomerName = (dataOb) => {
    return dataOb.invoice_id.customer_order_id.customer_id.name;
}

const getCustomerType = (dataOb) => {
    return dataOb.invoice_id.customer_order_id.customer_id.customer_type_id.type;
}

const getTotalPrice = (dataOb) => {
    return dataOb.invoice_id.customer_order_id.total_price;
}

const getPaymentMethod = (dataOb) => {
    return dataOb.customer_payment_method_id.name;
}


const checkFormError1 = () => {

    let errors = "";



    if (customerPayment.payment_date == null) {
        errors = errors + "Please Enter a valid payment Date..! \n";

    }

    if (customerPayment.invoice_id == null) {
        errors = errors + "Please Enter a invoice No..! \n";

    }


    if (customerPayment.customer_id == null) {
        errors = errors + "Please Enter a valid Customer Name..! \n";

    }


    if (customerPayment.totalPrice == null) {
        errors = errors + "Please Enter a valid Total Price....! \n";

    }



    // radio buttons

    if (customerPayment.customer_payment_method_id == null) {
        errors = errors + "Please Enter a Payment Method...! \n";

    }

    if (cashRadio.checked) {

        if (customerPayment.paid_amount == null) {
            errors = errors + "Please Enter the Paid Amount..! \n";
        }
        if (customerPayment.balance_amount == null) {
            errors = errors + "Please Enter a valid Balance Amount.! \n";
        }


    }


    return errors;

}

const checkFormError2 = () => {

    let errors = "";


    if (customerPayment.invoice_id == null) {
        errors = errors + "Please Enter a invoice No..! \n";

    }


    if (customerPayment.customer_id == null) {
        errors = errors + "Please Enter a valid Customer Name..! \n";

    }


    if (customerPayment.returned_item_list == null) {
        errors = errors + "Please Enter Returned Item List..! \n";

    }


    if (customerPayment.totalPrice == null) {
        errors = errors + "Please Enter a valid Total Price....! \n";

    }



    // radio buttons

    if (customerPayment.customer_payment_method_id == null) {
        errors = errors + "Please Enter a Payment Method...! \n";

    }

    if (cashRadio2.checked) {

        if (customerPayment.paid_amount == null) {
            errors = errors + "Please Enter the Paid Amount..! \n";
        }
        if (customerPayment.balance_amount == null) {
            errors = errors + "Please Enter a valid Balance Amount.! \n";
        }


    }


    return errors;

}


//form submit event function 
const buttonCustomerPaymentSubmit1 = () => {


    console.log(customerPayment);

    let errors = checkFormError1();
    if (errors == "") {

        let userConfirmMsg1 =

            "\n Payment Date :" + customerPayment.payment_date +
            "\n Invoice No:" + customerPayment.invoice_id.invoice_no +
            "\n Customer Name:" + customerPayment.customer_id.name +
            "\n Total Price:" + customerPayment.totalPrice +
            "\n Payment Method:" + customerPayment.customer_payment_method_id.name;

        if (cashRadio.checked) {
            userConfirmMsg1 +=
                "\n Paid Amount:" + customerPayment.paid_amount +
                "\n Balance Amount:" + customerPayment.balance_amount;
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
                    let postResponce = getHTTPServiceRequest("/customerpayment/insert", "POST", customerPayment);
                    if (postResponce == "OK") {
                        swal("Saved Successfully ....!");


                        refreshCustomerPaymentTable();
                        refreshForm1();
                        $("#customerPaymentForm").modal("hide");



                    } else {
                        swal("Failed to submit..! \n" + postResponce);

                    }


                }





            })


    } else {

        swal("Form has following errors...\n\n" + errors);

    }



}


//form submit event function 
const buttonCustomerPaymentSubmit2 = () => {


    console.log(customerPayment);

    let errors = checkFormError2();
    if (errors == "") {

        let userConfirmMsg1 =

            "\n Invoice No:" + customerPayment.invoice_id.invoice_no +
            "\n Customer Name:" + customerPayment.customer_id.name +
            "\n Returned Items:" + customerPayment.returned_item_list +
            "\n Total Price:" + customerPayment.totalPrice +
            "\n Payment Method:" + customerPayment.customer_payment_method_id.name;

        if (cashRadio2.checked) {
            userConfirmMsg1 +=
                "\n Paid Amount:" + customerPayment.paid_amount +
                "\n Balance Amount:" + customerPayment.balance_amount;
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
                    let postResponce = getHTTPServiceRequest("/customerpayment/insert", "POST", customerPayment);
                    if (postResponce == "OK") {
                        swal("Saved Successfully ....!");


                        refreshCustomerPaymentTable();
                        refreshForm2();
                        $("#customerPaymentForm").modal("hide");



                    } else {
                        swal("Failed to submit..! \n" + postResponce);

                    }


                }





            })

    } else {

        swal("Form has following errors...\n\n" + errors);

    }



}




const paymentFormRefill = (dataOb, index) => {
    $("#customerPaymentForm").modal("show");

    //If dataOb customer type is "Individual"
    if (dataOb.customer_payment_type_id.type == "Individual") {
        $("#tabIndividual").tab("show");


        //Declaring two objects inorder to compare for check form updates
        customerPayment = JSON.parse(JSON.stringify(dataOb));
        oldCustomerPayment = JSON.parse(JSON.stringify(dataOb));


        selectCustomerName1.value = JSON.stringify(dataOb.invoice_id.customer_order_id.customer_id);
        selectInvoiceNo1.value = JSON.stringify(dataOb.invoice_id);
        datePaymentDate1.value = dataOb.payment_date;
        txtTotalPrice1.value = dataOb.invoice_id.customer_order_id.total_price;


        if (dataOb.customer_payment_method_id.name == "Cash") {

            cashRadio.checked = true;
            textPaidAmount.value = dataOb.paid_amount;
            textBalanceAmount.value = dataOb.balance_amount;

        }
        if (dataOb.customer_payment_method_id.name == "Card") {
            cardRadio.checked = true;

        }



        //Assigning values from database to the properties of front end object in order to avoid mismath


        customerPayment.customer_id = dataOb.invoice_id.customer_order_id.customer_id;
        oldCustomerPayment.customer_id = dataOb.invoice_id.customer_order_id.customer_id;

        customerPayment.invoice_id = dataOb.invoice_id.invoice_no;
        oldCustomerPayment.invoice_id = dataOb.invoice_id.invoice_no;

        customerPayment.totalPrice = dataOb.invoice_id.customer_order_id.total_price;
        oldCustomerPayment.totalPrice = dataOb.invoice_id.customer_order_id.total_price;


        //Update button getsdissapeared when Add Customer Payment clicked
        buttonUpdate1.style.display = "block";
        buttonSubmit1.style.display = "none";





    }


    //If dataOb customer type is "Shop"
    if (dataOb.customer_payment_type_id.type == "Shop") {
        $("#tabShop").tab("show");


        //Declaring two objects inorder to compare for check form updates
        customerPayment = JSON.parse(JSON.stringify(dataOb));
        oldCustomerPayment = JSON.parse(JSON.stringify(dataOb));

        selectCustomerName2.value = JSON.stringify(dataOb.invoice_id.customer_order_id.customer_id);
        selectInvoiceNo2.value = JSON.stringify(dataOb.invoice_id);
        txtReturnedItemList2.value = dataOb.returned_item_list;
        txtTotalPrice2.value = dataOb.invoice_id.customer_order_id.total_price;

        if (dataOb.customer_payment_method_id.name == "Cash") {
            cashRadio2.checked = true;
            textPaidAmount2.value = dataOb.paid_amount;
            textBalanceAmount2.value = dataOb.balance_amount;

        }
        if (dataOb.customer_payment_method_id.name == "Card") {
            cardRadio2.checked = true;

        }


        //Assigning values from database to the properties of front end object in order to avoid mismath
        customerPayment.customer_id = dataOb.invoice_id.customer_order_id.customer_id;
        oldCustomerPayment.customer_id = dataOb.invoice_id.customer_order_id.customer_id;

        customerPayment.invoice_id = dataOb.invoice_id.invoice_no;
        oldCustomerPayment.invoice_id = dataOb.invoice_id.invoice_no;

        customerPayment.totalPrice = dataOb.invoice_id.customer_order_id.total_price;
        oldCustomerPayment.totalPrice = dataOb.invoice_id.customer_order_id.total_price;


        //Update button getsdissapeared when Add Customer Payment clicked
        buttonUpdate2.style.display = "block";
        buttonSubmit2.style.display = "none";




    }




}


//Checking Updates
const checkFormUpdates1 = () => {

    let updates = "";

    if (customerPayment != null && oldCustomerPayment != null) {
        if (customerPayment.payment_date != oldCustomerPayment.payment_date) {
            updates = updates + "Payment date has changed..!\n";

        }

        if (customerPayment.invoice_id.invoice_no != oldCustomerPayment.invoice_id.invoice_no) {
            updates = updates + "Invoice No has changed..!\n";

        }


        if (customerPayment.customer_id.name != oldCustomerPayment.customer_id.name) {
            updates = updates + "Customer Name has changed..!\n";

        }


        if (customerPayment.totalPrice != oldCustomerPayment.totalPrice) {
            updates = updates + "Total Price has changed..!\n";

        }



        if (customerPayment.paid_amount != oldCustomerPayment.paid_amount) {
            updates = updates + "Paid amount has changed..!\n";

        }

        if (customerPayment.balance_amount != oldCustomerPayment.balance_amount) {
            updates = updates + "Balance amount has changed..!\n";

        }

        if (customerPayment.customer_payment_method_id.name != oldCustomerPayment.customer_payment_method_id.name) {
            updates = updates + "Payment Method has changed..!\n";

        }


    }


    return updates;

}

//Checking Updates
const checkFormUpdates2 = () => {

    let updates = "";

    if (customerPayment != null && oldCustomerPayment != null) {

        if (customerPayment.invoice_id.invoice_no != oldCustomerPayment.invoice_id.invoice_no) {
            updates = updates + "Invoice No has changed..!\n";

        }


        if (customerPayment.customer_id.name != oldCustomerPayment.customer_id.name) {
            updates = updates + "Customer Name has changed..!\n";

        }

        if (customerPayment.returned_item_list != oldCustomerPayment.returned_item_list) {
            updates = updates + "Returned Item List has changed..!\n";

        }


        if (customerPayment.totalPrice != oldCustomerPayment.totalPrice) {
            updates = updates + "Total Price has changed..!\n";

        }



        if (customerPayment.paid_amount != oldCustomerPayment.paid_amount) {
            updates = updates + "Paid amount has changed..!\n";

        }

        if (customerPayment.balance_amount != oldCustomerPayment.balance_amount) {
            updates = updates + "Balance amount has changed..!\n";

        }

        if (customerPayment.customer_payment_method_id.name != oldCustomerPayment.customer_payment_method_id.name) {
            updates = updates + "Payment Method has changed..!\n";

        }


    }


    return updates;

}

//form update event function
const buttonCustomerPaymentUpdate1 = () => {

    //need to check form errors
    let errors = checkFormError1();


    if (errors == "") {

        let updates = checkFormUpdates1();
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
                .then((putResponce) => {
                    if (putResponce) {
                        swal("Updated successfully....!", {
                            icon: "success",
                        });


                        refreshCustomerPaymentTable();
                        refreshForm1();




                    }



                });





        }

    } else {
        swal("Form has following error..\n" + errors)

    }




}



//form update event function
const buttonCustomerPaymentUpdate2 = () => {

    //need to check form errors
    let errors = checkFormError2();


    if (errors == "") {

        let updates = checkFormUpdates2();
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
                .then((putResponce) => {
                    if (putResponce) {
                        swal("Updated successfully....!", {
                            icon: "success",
                        });


                        refreshCustomerPaymentTable();
                        refreshForm2();




                    }



                });





        }

    } else {
        swal("Form has following error..\n" + errors)

    }




}












//form delete event function 
const buttonCustomerPaymentDelete = (dataOb, index) => {


    //need to get user confirmation
    let userConfirmMsg =
        "\n Invoice No :" + dataOb.invoice_id.invoice_no +
        "\n Customer Name :" + dataOb.invoice_id.customer_order_id.customer_id.name +
        "\n Total Price:" + dataOb.invoice_id.customer_order_id.total_price +
        "\n Paid Amount:" + dataOb.paid_amount +
        "\n Balance Amount:" + dataOb.balance_amount +
        "\n Payment Method:" + dataOb.customer_payment_method_id.name;


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


                let deleteResponce = getHTTPServiceRequest("/customerpayment/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });

                    refreshCustomerPaymentTable();
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

//form View event function 
const buttonCustomerPaymentView = (dataOb, index) => {
    console.log("View", dataOb, index);



    tdInvoiceNo.innerText = dataOb.invoice_id.invoice_no;
    tdCustomerName.innerText = dataOb.invoice_id.customer_order_id.customer_id.name;
    tdCustomerType.innerText = dataOb.invoice_id.customer_order_id.customer_id.customer_type_id.type;
    tdTotalPrice.innerText = dataOb.invoice_id.total_price;
    tdPaidAmount.innerText = dataOb.paid_amount;
    tdBalanceAmount.innerText = dataOb.balance_amount;
    tdPaymentMethod.innerText = dataOb.customer_payment_method_id.name;


    $("#modalCustomerPaymentView").modal("show");


}


const printCustomerPaymentRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-Customer Payments</title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
        "<body>" + tableCustomerPaymentView.outerHTML + "</body>";


    newWindow.document.write(printView);



    //Print window
    setTimeout(() => {

        newWindow.stop();
        newWindow.print();
        newWindow.close();

    }, 500)


    $("#modalCustomerPaymentView").modal("hide");


}















