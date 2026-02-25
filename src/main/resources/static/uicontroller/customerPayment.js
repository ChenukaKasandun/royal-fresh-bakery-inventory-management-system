

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

//Function to auto select the invoice No when Customer Name get Selected ---> Individual Customer
let customerNameElement1 = document.querySelector("#selectCustomerName1");
customerNameElement1.addEventListener('change', () => {

    let customerName = JSON.parse(customerNameElement1.value);

    console.log(customerName);

    let invoiceByCustomerId = getServiceRequest("/invoice/getinvoicebycustomerid?customerId=" + customerName.id);

    fillDataIntoSelect(selectInvoiceNo1, "Please select Invoice No..!", invoiceByCustomerId, "invoice_no");

})


//Function to autofill the Total Price,Discounted Price and Advanced Amount when Invoice No get Selected
let invoiceNoElement = document.querySelector("#selectInvoiceNo1");
invoiceNoElement.addEventListener('change', () => {

    let invoiceNo = JSON.parse(invoiceNoElement.value);
    console.log(invoiceNo);

    // Total Price
    let totalPriceByInvoiceNo = getServiceRequest("/invoice/gettotalpricebyinvoiceno?invoiceno="+invoiceNo.invoice_no);
    txtTotalPrice1.value = parseFloat(totalPriceByInvoiceNo).toFixed(2);
    customerPayment.totalPrice = txtTotalPrice1.value;
    txtTotalPrice1.classList.add("is-valid");


    //Discounted Value
    let discountedPriceByInvoiceNo = getServiceRequest("/getdiscountedpricebyinvoiceno?invoiceno="+invoiceNo.invoice_no);
    txtDiscountedPrice1.value = parseFloat(discountedPriceByInvoiceNo).toFixed(2);
    generateDueAmount();
    customerPayment.discountedPrice = txtDiscountedPrice1.value;
    txtDiscountedPrice1.classList.add("is-valid");

    //Advanced Payment
    let AdvancedPaymentByInvoiceNo = getServiceRequest("/customerorder/advancedpaymentbyinvoiceno?invoiceno="+invoiceNo.invoice_no);
    txtAdvancdAmount1.value = parseFloat(AdvancedPaymentByInvoiceNo).toFixed(2);
    generateDueAmount();
    customerPayment.advancedPayment = txtAdvancdAmount1.value;
    txtAdvancdAmount1.classList.add("is-valid");

})



// Function to autofill total price and total return price when invoice No get Selected ----> Shop Customer
let invoiceNoElement2 = document.querySelector("#selectInvoiceNo2");
invoiceNoElement2.addEventListener('change', () => {

    let invoiceNo = JSON.parse(invoiceNoElement2.value);
    console.log(invoiceNo);

    // Total Price
    let totalPriceByInvoiceNo = getServiceRequest("/customerorder/totalpricebyinvoiceno?invoiceno="+invoiceNo.invoice_no);
    txtTotalPrice2.value = parseFloat(totalPriceByInvoiceNo).toFixed(2);
    customerPayment.totalPrice = txtTotalPrice2.value;
    txtTotalPrice2.classList.add("is-valid");

    // Return Price
    let returnPriceByInvoiceNo = getServiceRequest("/returnitems/totalreturningpricebyinvoiceid?invoiceid="+invoiceNo.id);
    console.log("returnPriceByInvoiceNo");
    console.log(returnPriceByInvoiceNo);

    txtReturnedItemPrice2.value = parseFloat(returnPriceByInvoiceNo).toFixed(2);
    txtReturnedItemPrice2.classList.add("is-valid");

})



// Generate Due Amount ..........................
const generateDueAmount = () =>{

    let discountValue = parseFloat(txtDiscountedPrice1.value);
    let advancedValue = parseFloat(txtAdvancdAmount1.value);

    console.log("---------------------")
    console.log(discountValue);
    console.log(advancedValue)

    let dueAmount = (discountValue - advancedValue);

    txtDueAmount1.value = dueAmount.toFixed(2);
    txtDueAmount1.classList.add("is-valid");
    generateBalanceAmount();

    console.log(txtDueAmount1.value);
}



// Generate Balance amount
const generateBalanceAmount = () =>{

    let dueAmount = parseFloat(txtDueAmount1.value);
    let paidAmount = parseFloat(textPaidAmount.value);

    let balanceAmount = (paidAmount - dueAmount);

    textBalanceAmount.value = balanceAmount.toFixed(2);
    customerPayment.balance_amount = textBalanceAmount.value;
    textBalanceAmount.classList.add("is-valid");

}


//refresh Form 1
const refreshForm1 = () => {

    // Clean attributes of form
    formIndividual.reset();

    //Removing Validation Colours using a common function declared in common.js
    setDefault([selectCustomerName1, selectInvoiceNo1, datePaymentDate1,txtTotalPrice1,
        textPaidAmount,textBalanceAmount,]);


    // Cleaning Radio Elements
    cashRadio.checked = false;
    cardRadio.checked = false;

    // Creating a new object for data Binding at front end
    customerPayment = new Object();


    //Retriving data from the data base using ajax common function defined in the commonFunctions.js
    let customerName = getServiceRequest("/customer/alldataByIndividualCustomerAndHaveInvoice")

    //filling data into dropdown
    fillDataIntoSelect(selectCustomerName1, "Please select Customer Name", customerName, "name");

    //Update button getsdissapeared when Add Customer Payment clicked
    buttonSubmit1.style.display = "block";
    buttonUpdate1.style.display = "none";


}

const refreshForm2 = () => {

    ///Cleaning innerHTML of attributes
    formShopPayment.reset();

    //Radio buttons
    cashRadio2.checked = false;
    cardRadio2.checked = false;

    //Removing Validation Colours using a common function declared in common.js
    setDefault([selectCustomerName2, selectInvoiceNo2, txtTotalPrice2,textPaidAmount2,
        textBalanceAmount2]);

    //Retrieving data from the database using ajax common function defined in the commonFunctions.js
    let customerName = getServiceRequest("/customer/alldataByShopCustomerAndHaveInvoice")

    //filling data into dropdown
    fillDataIntoSelect(selectCustomerName2, "Please select Customer Name", customerName, "name");

    //Update button getsdissapeared when Add Customer Payment clicked
    buttonSubmit2.style.display = "block";
    buttonUpdate2.style.display = "none";

}

//Function to auto select the invoice No when Customer Name get Selected ---> Shop Customer
let customerNameElement2 = document.querySelector("#selectCustomerName2");
customerNameElement2.addEventListener('change', () => {

    let customerName = JSON.parse(customerNameElement2.value);

    console.log(customerName);

    let invoiceByCustomerId = getServiceRequest("/invoice/getinvoicebycustomerid?customerId=" + customerName.id);

    fillDataIntoSelect(selectInvoiceNo2, "Please select Invoice No..!", invoiceByCustomerId, "invoice_no");

})



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

    //Retrieving data from the database using ajax common function defined in the coomonFunctions.js
    let customerPayments = getServiceRequest("/customerpayment/alldata");


    //Calling common function to fill data into table
    fillDataIntoTable1(tableCustomerPaymentBody, customerPayments, propertyList, paymentFormRefill, buttonCustomerPaymentDelete, buttonCustomerPaymentView, true);

    //Jquery function
    $('#customerPaymentTable').DataTable();

}


//defining functions to retrieve data from the backend
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



// Check form Error1
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


// Check form Error2
const checkFormError2 = () => {

    let errors = "";

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
            "\n Discounted Price:" + customerPayment.discountedPrice +
            "\n Advanced Payment:" + customerPayment.advancedPayment +
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
                        console.log(postResponce)

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



// Refill Function
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


        //Assigning values from database to the properties of front end object in order to avoid mismatch

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















