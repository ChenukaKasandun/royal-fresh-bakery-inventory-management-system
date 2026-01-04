
//Window onload function
window.addEventListener('load', () => {
    refreshForm1();
    refreshForm2();
    refreshOrderTable();

})


//JavaScript to toggle collapse  ---> Delivery Method collapse

const deliveryRadio = document.getElementById('deliveryRadio');
const pickupRadio = document.getElementById('pickupRadio');
const collapseTarget = document.getElementById('deliveryDetails');
const bsCollapse = new bootstrap.Collapse(collapseTarget, { toggle: false });

deliveryRadio.addEventListener('change', () => {
    if (deliveryRadio.checked) {
        bsCollapse.show();
    }
});

pickupRadio.addEventListener('change', () => {
    if (pickupRadio.checked) {
        bsCollapse.hide();
    }
});




//JavaScript to toggle collapse  ---> Order nature(Shop Customer)

const recurentRadio = document.getElementById('recurrentRadio');
const justOnceRadio = document.getElementById('justOnceRadio');
const recurentDetails = document.getElementById('recurentDetails');
const bsCollapse2 = new bootstrap.Collapse(recurentDetails, { toggle: false });

recurentRadio.addEventListener('change', () => {
    if (recurentRadio.checked) {
        bsCollapse2.show();
    }
});

justOnceRadio.addEventListener('change', () => {
    if (justOnceRadio.checked) {
        bsCollapse2.hide();
    }
});





//Validation Of Dynamic dropdown  
const dynamicElementValidator = (element, object, property) => {

    const dynamicElement = element.value;

    customerorder[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");


}

const radioElementValidator = () => {

    if (pickupRadio.checked) {
        customerorder.collection_method_id = { id: 1, name: "To be Collected" };

    }

    if (deliveryRadio.checked) {
        customerorder.collection_method_id = { id: 2, name: "To be Delivered" };

    }

}


const orderNatureRadioValidator = () => {

    if (justOnceRadio.checked) {
        customerorder.customer_order_nature_id = { id: 1, nature: "just once" };

    }

    if (recurrentRadio.checked) {
        customerorder.customer_order_nature_id = { id: 2, nature: "recurrent" };

    }
}
//............................................................
const discountPriceGenerator = (dataOb) => {
    const status = dataOb?.customer_id?.customer_status_id?.status;

    if (status == null) {
        console.log("status is not present");

    }

    const totalPrice = parseFloat(textTotalPrice1.value);
    let discountRatio = 0;

    switch (status) {
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
    textDiscountedPrice.value = discountedPrice.toFixed(2);
    textDiscountedPrice.classList.add("is-valid");
    customerorder.discounted_price = textDiscountedPrice.value;
};

const generateDuePayment = () => {


    let discountedPrice = textDiscountedPrice.value;
    let advancedPayment = textAdvancePayment1.value;

    let duePayment = parseFloat(discountedPrice) - parseFloat(advancedPayment);

    textDuePayment1.value = parseFloat(duePayment).toFixed(2);
    customerorder.due_payment = textDuePayment1.value;
    textDuePayment1.classList.add("is-valid");


}



//refresh order form --> Individual Customer
const refreshForm1 = () => {

    //create a new object for databinding at frontend
    customerorder = new Object();

    //When Individual tab get selected, the value of customer order type of customerorder object is binded
    customerorder.customer_order_type_id = { id: 1, type: "Individual" }

    //Cleaning attributes
    formIndividual.reset();


    //Cleaning Radio buttons (Delivery Method)
    pickupRadio.checked = false;
    deliveryRadio.checked = false;


    //Removing Validation using a common function
    setDefault([selectCustomerName1,
        textTotalPrice1,
        dateRequiredDate1,
        textRequiredTime1,
        textDeliveryAddress1,
        selectDeliveryRoute1,
        textAdvancePayment1,
        textDuePayment1]);





    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let customers = getServiceRequest("/customer/alldataByCustomerTypeIndividual")

    //filling data into dropdown
    fillDataIntoSelect(selectCustomerName1, "Please select Customer Name", customers, "name");


    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let orderStatus = getServiceRequest("/orderstatus/alldata");


    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let vehicleRoute = getServiceRequest("/vehicleroute/alldata");

    //filling data into dropdown
    fillDataIntoSelect(selectDeliveryRoute1, "Please select vehicle Route", vehicleRoute, "name");


    //Update button getsdissapeared when Add Customer Order clicked
    buttonSubmit1.style.display = "block";
    buttonUpdate1.style.display = "none";



}


const refreshForm2 = () => {

    //create a new object for databinding at frontend
    customerorder = new Object();

    //When Individual tab get selected, the value of customer order type of customerorder object is binded
    customerorder.customer_order_type_id = { id: 1, type: "Individual" }

    //Cleaning attributes(Shop Orders)
    formShop.reset();


    //Removing Validation using a common function
    setDefault([selectCustomerName2,
        dateRequiredDateShopCustomer2,
        textTotalPrice2,
        selectSession2,
        dateFromDate,
        dateToDate]);

    //cleaning radio buttons
    justOnceRadio.checked = false;
    recurrentRadio.checked = false;




    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let customers = getServiceRequest("/customer/alldataByCustomerTypeShop")

    //filling data into dropdown
    fillDataIntoSelect(selectCustomerName2, "Please select Customer Name", customers, "name");

    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let session = getServiceRequest("/productionsession/alldata")

    //filling data into dropdown
    fillDataIntoSelect(selectSession2, "Please select Production session..!", session, "name");

    //Update button getsdissapeared when Add Customer Order clicked
    buttonSubmit2.style.display = "block";
    buttonUpdate2.style.display = "none";



}




//refresh table
const refreshOrderTable = () => {


    //string => string/sate/number
    //function => object/array/boolean
    let propertyList = [{ propertyName: "order_no", dataType: "string" },
    { propertyName: getCustomer, dataType: "function" },
    { propertyName: getCustomerType, dataType: "function" },
    { propertyName: "required_date", dataType: "string" },
    { propertyName: getProductionSession, dataType: "function" },
    { propertyName: "total_price", dataType: "string" },
    { propertyName: getOrderStatus, dataType: "function" },
    { propertyName: getVehicleRoute, dataType: "function" }];


    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let orders = getServiceRequest("/customerorder/alldata");


    //Calling common function to fill data into table
    fillDataIntoTable1(tableOrderBody, orders, propertyList, buttonOrderRefill, buttonOrderDelete, buttonOrderView, true);


    //jquery function
    $('#orderTable').DataTable();


}



//Defining Functions For Get Properties
const getOrderStatus = (dataOb) => {

    if (dataOb.customer_order_status_id?.status == "Cancelled") {

        return `<p class='fw-bold' style="background-color: red">${dataOb.customer_order_status_id?.status}</p>`;

    } else {

        return "-";

    }

}

const getProductionSession = (dataOb) => {

    if (dataOb.production_session_id?.name == null) {

        return "-";

    } else {

        return dataOb.production_session_id?.name;

    }

}

const getCustomer = (dataOb) => {

    if (dataOb.customer_id?.name == null) {

        return "-";

    } else {

        return dataOb.customer_id?.name;

    }

}

const getVehicleRoute = (dataOb) => {

    if (dataOb.vehicle_route_id?.name == null) {
        return "-";

    } else {

        return dataOb.vehicle_route_id?.name;

    }

}


const getCustomerType = (dataOb) => {

    if (dataOb.customer_order_type_id.type == null) {

        return "-";

    } else {

        if (dataOb.customer_order_type_id.type == "Individual") {
            return `<p class='fw-bold' style="background-color: pink">${dataOb.customer_order_type_id?.type}</p>`;
        }

        if (dataOb.customer_order_type_id.type == "Shop") {
            return `<p class='fw-bold' style="background-color: yellow">${dataOb.customer_order_type_id?.type}</p>`;
        }

    }

}






//checking errors in the form
const checkFormError1 = () => {

    let errors = "";

    if (customerorder.customer_id == null) {
        errors = errors + "Please Select a valid Customer Name..!\n";
    }

    if (customerorder.total_price == null) {
        errors = errors + "Please Enter a valid Total Price..!\n";
    }

    if (customerorder.required_date == null) {
        errors = errors + "Please Enter the Required Date..!\n";
    }


    if (customerorder.required_time == null) {
        errors = errors + "Please Enter the Required Time..!\n";
    }


    if (customerorder.collection_method_id == null) {
        errors = errors + "Please Select Collection Method..!\n";
    }

    if (deliveryRadio.checked) {

        if (customerorder.required_address == null) {
            errors = errors + "Please Enter Required Address..!\n";
        }
        if (customerorder.vehicle_route_id == null) {
            errors = errors + "Please Select Vehicle Route..!\n";
        }
    }


    return errors;
}


//checking errors in the form
const checkFormError2 = () => {

    let errors = "";

    if (customerorder.customer_id == null) {
        errors = errors + "Please Select a valid Customer Name..!\n";
    }



    if (customerorder.required_date == null) {
        errors = errors + "Please Enter the Required Date..!\n";
    }


    if (customerorder.production_session_id == null) {
        errors = errors + "Please Enter the Order Session..!\n";
    }


    if (customerorder.total_price == null) {
        errors = errors + "Please Enter a valid Total Price..!\n";
    }

    if (customerorder.customer_order_nature_id == null) {
        errors = errors + "Please Enter the Order Nature..!\n";
    }

    if (recurrentRadio.checked) {

        if (customerorder.from_date == null) {
            errors = errors + "Please Enter Starting Date..!\n";
        }
        if (customerorder.to_date == null) {
            errors = errors + "Please Enter End date..!\n";
        }
    }

    return errors;
}





//form submit event function 
const buttonOrderSubmit1 = () => {

    //Check form error for required element
    let errors = checkFormError1();

    if (errors == "") {

        let userConfirmMsg1 =
            "\n Customer name:" + customerorder.customer_id.name +
            "\n Total Price:" + customerorder.total_price +
            "\n Required Date :" + customerorder.required_date +
            "\n Required Time:" + customerorder.required_time +
            "\n Collection Method:" + customerorder.collection_method_id.name +
            "\n Customer Order Type:" + customerorder.customer_order_type_id.type;

        if (deliveryRadio.checked) {
            userConfirmMsg1 +=
                "\n Required Address:" + customerorder.required_address +
                "\n Vehicle Route:" + customerorder.vehicle_route_id.name;
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
                    let postResponce = getHTTPServiceRequest("/customerorder/insert", "POST", customerorder);
                    if (postResponce == "OK") {
                        swal("Saved Successfully ....!");


                        refreshForm1();
                        refreshOrderTable();
                        //$("#orderForm").modal("hide");



                    } else {
                        swal("Failed to submit..! \n" + postResponce);

                    }


                }





            })



    } else {

        swal("Form has following errors...\n" + errors);


    }


    refreshOrderTable();


}


//form submit event function 
const buttonOrderSubmit2 = () => {

    //Check form error for required element
    let errors = checkFormError2();

    if (errors == "") {

        let userConfirmMsg2 =
            "\n Customer name:" + customerorder.customer_id.name +
            "\n Required Date :" + customerorder.required_date +
            "\n Customer Order Session:" + customerorder.production_session_id.name +
            "\n Total Price:" + customerorder.total_price +
            "\n Customer Order Nature:" + customerorder.customer_order_nature_id.nature +
            "\n Customer Order Type:" + customerorder.customer_order_type_id.type;


        if (recurrentRadio.checked) {
            userConfirmMsg2 +=
                "\n From:" + customerorder.from_date +
                "\n To:" + customerorder.to_date;
        }



        swal({
            title: "Are you sure to Submit Following Details..?",
            text: userConfirmMsg2,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((userResponce) => {

                if (userResponce) {
                    //call post service
                    let postResponce = getHTTPServiceRequest("/customerorder/insert", "POST", customerorder);
                    if (postResponce == "OK") {
                        swal("Saved Successfully ....!");


                        refreshForm2();
                        refreshOrderTable();
                        //$("#orderForm").modal("hide");



                    } else {
                        swal("Failed to submit..! \n" + postResponce);

                    }


                }





            })


    } else {

        swal("Form has following errors...\n" + errors);


    }


    refreshOrderTable();


}





//form delete event function 
const buttonOrderRefill = (dataOb, index) => {


    //Jquery function to open the model
    $("#orderForm").modal("show");


    if (dataOb.customer_order_type_id.type === "Individual") {
        //Jquery function to select the tab
        $("#tabIndividual").tab("show");


        //Declaring two objects inorder to compare for check form updates
        customerorder = JSON.parse(JSON.stringify(dataOb));
        oldcustomerorder = JSON.parse(JSON.stringify(dataOb));


        selectCustomerName1.value = JSON.stringify(dataOb.customer_id);
        textTotalPrice1.value = dataOb.total_price;
        dateRequiredDate1.value = dataOb.required_date;
        textRequiredTime1.value = dataOb.required_time;
        textAdvancePayment1.value = dataOb.advanced_payment
        textDuePayment1.value = dataOb.due_payment
        if (dataOb.collection_method_id.name === "To be Collected") {
            pickupRadio.checked = true;

        }

        if (dataOb.collection_method_id.name === "To be Delivered") {
            deliveryRadio.checked = true;

            textDeliveryAddress1.value = dataOb.required_address;
            selectDeliveryRoute1.value = JSON.stringify(dataOb.vehicle_route_id);

        }



        //Assign the values of dataOb properties to the front end dataOb in order to track update function
        customerorder.customer_id = dataOb.customer_id;
        oldcustomerorder.customer_id = dataOb.customer_id;




        customerorder.collection_method_id = dataOb.collection_method_id;
        oldcustomerorder.collection_method_id = dataOb.collection_method_id;

        customerorder.vehicle_route_id = dataOb.vehicle_route_id;
        oldcustomerorder.vehicle_route_id = dataOb.vehicle_route_id;


        //Submit button getsdissapeared when "Edit" Customer Order clicked
        buttonUpdate1.style.display = "block";
        buttonSubmit1.style.display = "none";



    }

    if (dataOb.customer_order_type_id.type === "Shop") {
        //Jquery function to select the tab
        $("#tabShop").tab("show");


        //Declaring two objects inorder to compare for check form updates
        customerorder = JSON.parse(JSON.stringify(dataOb));
        oldcustomerorder = JSON.parse(JSON.stringify(dataOb));


        //Assigning values from data base to the front end object in ordeer to track update function
        selectCustomerName2.value = JSON.stringify(dataOb.customer_id);
        dateRequiredDateShopCustomer2.value = dataOb.required_date;;
        selectSession2.value = JSON.stringify(dataOb.production_session_id);
        textTotalPrice2.value = dataOb.total_price;

        if (dataOb.customer_order_nature_id.nature === "just once") {

            justOnceRadio.checked = true;

        }

        if (dataOb.customer_order_nature_id.nature === "recurrent") {
            recurrentRadio.checked = true;

            dateFromDate.value = dataOb.from_date;
            dateToDate.value = dataOb.to_date;
        }

        //Update button getsdissapeared when Add Customer Order clicked
        buttonUpdate2.style.display = "block";
        buttonSubmit2.style.display = "none";

    }



    refreshOrderTable();


}



const checkFormUpdate1 = () => {

    let updates = "";

    if (customerorder != null && oldcustomerorder != null) {

        if (customerorder.customer_id.name != oldcustomerorder.customer_id.name) {
            updates = updates + "Customer Name has changed...!\n";
        }

        if (customerorder.total_price != oldcustomerorder.total_price) {
            updates = updates + "Total Price Has has changed...!\n";
        }


        if (customerorder.required_date != oldcustomerorder.required_date) {
            updates = updates + "Required Date has changed...!\n";
        }


        if (customerorder.required_time != oldcustomerorder.required_time) {
            updates = updates + "Required Time has changed...!\n";
        }

        if (customerorder.discounted_price != oldcustomerorder.discounted_price) {
            updates = updates + "Discounted Price has changed...!\n";
        }


        if (customerorder.advanced_payment != oldcustomerorder.advanced_payment) {
            updates = updates + "Advanced Payment has changed...!\n";
        }

        if (customerorder.due_payment != oldcustomerorder.due_payment) {
            updates = updates + "Due Payment has changed...!\n";
        }

        if (customerorder.collection_method_id.name != oldcustomerorder.collection_method_id.name) {
            updates = updates + "Order Collection Method has changed...!\n";
        }


        if (deliveryRadio.checked) {

            if (customerorder.required_address != oldcustomerorder.required_address) {
                updates = updates + "Required Address Has Changed..!\n";
            }
            if (customerorder.vehicle_route_id.name != oldcustomerorder.vehicle_route_id.name) {
                updates = updates + "Vehicle Route Has Changed...!\n";
            }
        }



        return updates;

    }




}


const checkFormUpdate2 = () => {

    let updates = "";

    if (customerorder != null && oldcustomerorder != null) {

        if (customerorder.customer_id.name != oldcustomerorder.customer_id.name) {
            updates = updates + "Customer Name has changed...!\n";
        }



        if (customerorder.required_date != oldcustomerorder.required_date) {
            updates = updates + "Required Date has changed...!\n";
        }


        if (customerorder.total_price != oldcustomerorder.total_price) {
            updates = updates + "Total Price has changed...!\n";
        }

        if (customerorder.production_session_id.name != oldcustomerorder.production_session_id.name) {
            updates = updates + "Order Session has changed...!\n";
        }

        if (customerorder.customer_order_nature_id.nature != oldcustomerorder.customer_order_nature_id.nature) {
            updates = updates + "Order Nature has changed...!\n";
        }


        if (recurrentRadio.checked) {

            if (customerorder.from_date != oldcustomerorder.from_date) {
                updates = updates + "From date Has Changed..!\n";
            }
            if (customerorder.to_date != oldcustomerorder.to_date) {
                updates = updates + "To date Has Changed...!\n";
            }
        }



        return updates;

    }




}





//form Update event function 
const buttonOrderUpdate1 = () => {

    let errors = checkFormError1();
    if (errors == "") {
        let updates = checkFormUpdate1();

        if (updates != "") {
            swal({
                title: "Are you sure to update..?",
                text: updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((userResponce) => {

                    if (userResponce) {
                        //call post service
                        let putResponce = getHTTPServiceRequest("/customerorder/update", "PUT", customerorder);
                        if (putResponce == "OK") {
                            swal("Updated Successfully ....!");




                            refreshForm1();
                            refreshOrderTable();
                            $("#customerForm").modal("hide");



                        } else {
                            swal("Failed to Update..! \n" + putResponce);

                        }


                    }

                });


        } else {
            swal({
                title: "No changes detected...!",
                icon: "info",
            });
        }


    } else {
        swal("Form has following error..\n" + errors)

    }


}

//form Update event function 
const buttonOrderUpdate2 = () => {

    let errors = checkFormError2();
    if (errors == "") {
        let updates = checkFormUpdate2();

        if (updates != "") {
            swal({
                title: "Are you sure to update..?",
                text: updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((userResponce) => {
                    if (userResponce) {
                        swal("Updated successfully....!", {
                            icon: "success",
                        });

                        refreshOrderTable();
                        refreshForm2();


                    }

                });
        } else {
            swal({
                title: "No changes detected...!",
                icon: "info",
            });
        }


    } else {
        swal("Form has following error..\n" + errors)

    }


}


//form delete event function 
const buttonOrderDelete = (dataOb, index) => {


    //need to get user confirmation
    let userConfirmMsg3 =
        "\n Order No:" + dataOb.order_no +
        "\n Customer Name:" + dataOb.customer_id?.name +
        "\n Customer Order Type:" + dataOb.customer_order_type_id?.type +
        "\n Required Date:" + dataOb.required_date +
        "\n Total Price :" + dataOb.total_price;


    if (dataOb.customer_order_type_id.type == "Individual") {
        userConfirmMsg3 +=
            "\n Discounted Price:" + dataOb.discounted_price +
            "\n Advanced Payment:" + dataOb.advanced_payment +
            "\n Due Payment:" + dataOb.due_payment;
    }
    if (dataOb.customer_order_type_id.type == "Shop") {
        userConfirmMsg3 +=
            "\n Order Session:" + dataOb.production_session_id?.name;
    }


    if (dataOb.collection_method_id?.name == "To be Delivered") {
        userConfirmMsg3 +=

            "\n Vehicle Route:" + dataOb.vehicle_route_id?.name;
    }



    //Sweet alert function
    swal({
        title: "Are you sure to delete..?",
        text: userConfirmMsg3,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((userResponce) => {
            if (userResponce) {


                let deleteResponce = getHTTPServiceRequest("/customerorder/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });


                    refreshForm1();
                    refreshForm2();
                    refreshOrderTable();


                } else {
                    swal("Delete Not Sccessfull...!", {
                        icon: "error", text: deleteResponce
                    });

                }

            }



        });


}









//function define for view/print  customer record
const buttonOrderView = (dataOb, index) => {
    console.log("View", dataOb, index);

    tdOrderNo.innerText = dataOb.order_no;
    tdCustomerName.innerText = dataOb.customer_id?.name;
    tdCustomerType.innerText = dataOb.customer_order_type_id?.type;
    tdRequiredDate.innerText = dataOb.required_date;
    tdSession.innerText = dataOb.production_session_id?.name;
    tdTotalPrice.innerText = dataOb.total_price;
    tdDiscountedPrice.innerText = dataOb.discounted_price;

    //....................need to be solved......not working.................
    if (dataOb.customer_order_type_id.type == "Individual") {
        tdDadvancedPayment.innerText = dataOb.advanced_payment
        tdDduePayment.innerText = dataOb.due_payment;
        tdVehicleRoute.innerText = dataOb.vehicle_route_id?.name;
    }


    $("#modalOrderView").modal("show");


}




//inner row in view
const printOrderRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-order</title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
        "<body>" + tableOrderView.outerHTML + "</body>";


    newWindow.document.write(printView);



    //Print window
    setTimeout(() => {

        newWindow.stop();
        newWindow.print();
        newWindow.close();

    }, 500)


    $("#modalOrderView").modal("hide");

}














