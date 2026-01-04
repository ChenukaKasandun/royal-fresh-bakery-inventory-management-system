
window.addEventListener('load', () => {


    refreshForm1();
    refreshForm2();
    refreshProductionOrderTable();
})

//JavaScript to toggle collapse  --->Order Nature collapse

const justOnceRadio = document.getElementById('justOnceRadio');
const recurentRadio = document.getElementById('recurrentRadio');
const recurentDetails = document.getElementById('recurentDetails');
const bsCollapse = new bootstrap.Collapse(recurentDetails, { toggle: false });

justOnceRadio.addEventListener('change', () => {
    if (justOnceRadio.checked) {
        bsCollapse.hide();

    }
});

recurentRadio.addEventListener('change', () => {
    if (recurentRadio.checked) {
        bsCollapse.show();
    }
});

const orderNatureValidator = () => {

    if (justOnceRadio.checked) {
        productionOrder.production_order_nature_id = { id: 1, nature: "Just once" }

    }

    if (recurrentRadio.checked) {
        productionOrder.production_order_nature_id = { id: 2, nature: "Recurrent" }


    }
}



const refreshForm1 = () => {

    //defining a new object for data binding at front end
    productionOrder = new Object();

    productionOrder.production_order_type = { id: 1, type: 'Individual' }

    //Cleaning attributes 

    dateProductionOrder1.value = "";
    selectOrderNo1.value = "";
    selectProductionSession1.value = "";
    selectProductionOrderStatus1.value = "";
    textNote1.value = "";


    //Removing validation 

    dateProductionOrder1.classList.remove("is-invalid");
    dateProductionOrder1.classList.remove("is-valid");


    selectOrderNo1.classList.remove("is-invalid");
    selectOrderNo1.classList.remove("is-valid");


    selectProductionSession1.classList.remove("is-invalid");
    selectProductionSession1.classList.remove("is-valid");


    selectProductionOrderStatus1.classList.remove("is-invalid");
    selectProductionOrderStatus1.classList.remove("is-valid");


    textNote1.classList.remove("is-invalid");
    textNote1.classList.remove("is-valid");


    //defining drop downs 

    let orderNo = getServiceRequest("/customerorder/alldata");

    let productionSession = getServiceRequest("/productionsession/alldata");

    let productionOrderStatus = getServiceRequest("/productionOrderStatus/alldata");

    //Calling function to fill data into select
    fillDataIntoSelect(selectOrderNo1, "Select Order No ", orderNo, "order_no");

    fillDataIntoSelect(selectProductionSession1, "Select Production Session..! ", productionSession, "name");

    fillDataIntoSelect(selectProductionOrderStatus1, "Select Production Order Status..! ", productionOrderStatus, "status");


    //Update button get dissapeared when adding a production order

    buttonSubmit1.style.display = "block";
    buttonUpdate1.style.display = "none";


}

const refreshForm2 = () => {


    selectCustomerName2.value = "";
    selectSession2.value = "";
    selectOrderNo2.value = "";
    dateFromDate.value = "";
    dateToDate.value = "";


    justOnceRadio.checked = false;
    recurrentRadio.checked = false;

    selectCustomerName2.classList.remove("is-invalid");
    selectCustomerName2.classList.remove("is-valid");

    selectSession2.classList.remove("is-invalid");
    selectSession2.classList.remove("is-valid");

    selectOrderNo2.classList.remove("is-invalid");
    selectOrderNo2.classList.remove("is-valid");

    dateFromDate.classList.remove("is-invalid");
    dateFromDate.classList.remove("is-valid");

    dateToDate.classList.remove("is-invalid");
    dateToDate.classList.remove("is-valid");




    //defining drop downs 
    let CustomerName = getServiceRequest("/customer/alldata");

    let orderNo = getServiceRequest("/customerorder/alldata");

    let productionSession = getServiceRequest("/productionsession/alldata");


    //Calling function to fill data into select

    fillDataIntoSelect(selectCustomerName2, "Select Customer Name..! ", CustomerName, "name");

    fillDataIntoSelect(selectOrderNo2, "Select Order No..!", orderNo, "order_no");

    fillDataIntoSelect(selectSession2, "Select Production Session..! ", productionSession, "name");

    //Update button get dissapeared when adding a production order
    buttonUpdate2.style.display = "none";
    buttonSubmit2.style.display = "block";



}



//Validation Of Dynamic dropdown  
const dynamicElementValidator = (element, object, property) => {

    const dynamicElement = element.value;

    productionOrder[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");


}


//Filling data into the table
const refreshProductionOrderTable = () => {

    let propertyList = [
        { propertyName: "production_order_no", dataType: "string" },
        { propertyName: "production_date", dataType: "string" },
        { propertyName: getOrderNo, dataType: "function" },
        { propertyName: getProductionSession, dataType: "function" },
        { propertyName: GetProductionOrderStatus, dataType: "function" }
    ]


    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let productionOrder = getServiceRequest("/productionorder/alldata");

    //Calling common function to fill data into table
    fillDataIntoTable1(tableItemProductionOrderBody, productionOrder, propertyList, itemProductionOrderRefill, itemProductionOrderDelete, buttonItemProductionOrderView, true);



    //Jquery table function
    $('#itemProductionOrderTable').DataTable();



}


//function to get Order no to table
const getOrderNo = (dataOb) => {

    return dataOb.customer_order_id?.order_no;
}


//function to get Production Session to table
const getProductionSession = (dataOb) => {

    return dataOb.production_session_id?.name;
}


//function to get production order status to table
const GetProductionOrderStatus = (dataOb) => {

    return dataOb.item_production_order_status_id?.status;
}



const checkFormError1 = () => {

    let errors = "";

    if (productionOrder.production_date == null) {
        errors = errors + "Enter a valid production date..!\n";

    }

    if (productionOrder.customer_order_id == null) {
        errors = errors + "Enter the customer Order No..!\n";

    }

    if (productionOrder.production_session_id == null) {
        errors = errors + "Enter a  production session..!\n"

    }

    if (productionOrder.item_production_order_status_id == null) {
        errors = errors + "Enter a production Order Status..!\n"

    }

    return errors;

}



const checkFormError2 = () => {

    let errors = "";

    if (productionOrder.customer_id == null) {
        errors = errors + "Select customer name..!\n";

    }

    if (productionOrder.customer_order_id == null) {
        errors = errors + "Enter the customer Order No..!\n";

    }

    if (productionOrder.production_session_id == null) {
        errors = errors + "Enter a  production session..!\n"

    }

    if (productionOrder.production_order_nature_id == null) {
        errors = errors + "Enter a  production order nature.!\n"

    }

    if (recurrentRadio.checked) {
        if (productionOrder.from_date == null) {
            errors = errors + "Enter the From Date...!\n"

        }

        if (productionOrder.to_date == null) {
            errors = errors + "Enter the To date...!\n"

        }

    }




    return errors;

}


const productionOrderSubmit1 = () => {

    console.log(productionOrder);

    //Check form error for required element
    let errors = checkFormError1();

    if (errors == "") {

        let userConfirm =


            "\n Production Order Type :" + productionOrder.production_order_type.type +
            "\n Production Date :" + productionOrder.production_date +
            "\n Customer Order No :" + productionOrder.customer_order_id.order_no +
            "\n Production Session :" + productionOrder.production_session_id.name +
            "\n Status :" + productionOrder.item_production_order_status_id.status;

        swal({
            title: "Are you sure to Submit Following Details..?",
            text: userConfirm,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((userResponce) => {

                if (userResponce) {
                    //call post service
                    let postResponce = getHTTPServiceRequest("/productionorder/insert", "POST", productionOrder);
                    if (postResponce == "OK") {
                        swal("Saved Successfully ....!");



                        refreshForm1();
                        refreshProductionOrderTable();
                        $("#itemForm").modal("hide");



                    } else {
                        swal("Failed to submit..! \n" + postResponce);

                    }


                }





            });


    } else {

        swal("Form has following errors...\n\n" + errors);

    }


    console.log(productionOrder);




}

const productionOrderSubmit2 = () => {

    console.log(productionOrder);

    //Check form error for required element
    let errors = checkFormError2();

    if (errors == "") {

        let userConfirm =

            "\n Production Order Type :" + productionOrder.production_order_type.type +
            "\n Customer Name:" + productionOrder.customer_id.name +
            "\n Production Session:" + productionOrder.production_session_id.name +
            "\n Production Order Nature :" + productionOrder.production_order_nature_id.nature;


        if (recurrentRadio.checked) {
            userConfirm +=
                "\n From:" + productionOrder.from_date +
                "\n To:" + productionOrder.to_date;
        }

        swal({
            title: "Are you sure to Submit Following Details..?",
            text: userConfirm,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((userResponce) => {

                if (userResponce) {
                    //call post service
                    let postResponce = getHTTPServiceRequest("/productionorder/insert", "POST", productionOrder);
                    if (postResponce == "OK") {
                        swal("Saved Successfully ....!");




                        refreshForm2();
                        refreshProductionOrderTable();
                        $("#itemForm").modal("hide");



                    } else {
                        swal("Failed to submit..! \n" + postResponce);

                    }


                }





            });

    } else {

        swal("Form has following errors...\n\n" + errors);

    }


    console.log(productionOrder);




}


const itemProductionOrderRefill = (dataOb, index) => {

    $("#itemProductionOrderForm").modal("show");

    if (dataOb.production_order_type_id.type == "Individual") {

        $("#tabIndividual").tab("show");

        //Creating two objects for comparison --> Update Production Order
        productionOrder = JSON.parse(JSON.stringify(dataOb));
        oldProductionOrder = JSON.parse(JSON.stringify(dataOb));


        dateProductionOrder1.value = dataOb.production_date;
        selectOrderNo1.value = JSON.stringify(dataOb.customer_order_id);
        selectProductionSession1.value = JSON.stringify(dataOb.production_session_id);
        selectProductionOrderStatus1.value = JSON.stringify(dataOb.item_production_order_status_id);


        //Assigning values of database to the properties of object at front end
        productionOrder.customer_order_id = dataOb.customer_order_id.order_no;
        oldProductionOrder.customer_order_id = dataOb.customer_order_id.order_no;

        productionOrder.production_session_id = dataOb.production_session_id.name;
        oldProductionOrder.production_session_id = dataOb.production_session_id.name;

        productionOrder.item_production_order_status_id = dataOb.item_production_order_status_id.status;
        oldProductionOrder.item_production_order_status_id = dataOb.item_production_order_status_id.status;

        //Submit button get dissapeared when Edit function get executed
        buttonUpdate1.style.display = "block";
        buttonSubmit1.style.display = "none";

    }

    if (dataOb.production_order_type_id.type == "Shop") {
        $("#tabShop").tab("show");

        //Creating two objects for comparison --> Update Production Order
        productionOrder = JSON.parse(JSON.stringify(dataOb));
        oldProductionOrder = JSON.parse(JSON.stringify(dataOb));


        selectCustomerName2.value = JSON.stringify(dataOb.customer_order_id.customer_id);
        selectOrderNo2.value = JSON.stringify(dataOb.customer_order_id);
        selectSession2.value = JSON.stringify(dataOb.production_session_id);
        if (dataOb.production_order_nature_id.nature == "Just once") {
            justOnceRadio.checked = true;

        }
        if (dataOb.production_order_nature_id.nature == "Recurrent") {
            recurrentRadio.checked = true;
            dateFromDate.value = dataOb.from_date;
            dateToDate.value = dataOb.to_date;


        }


        //Assigning values of database to the properties of object at front end

        productionOrder.customer_id = dataOb.customer_order_id.customer_id.name;
        oldProductionOrder.customer_id = dataOb.customer_order_id.customer_id.name;

        productionOrder.customer_order_id = dataOb.customer_order_id.order_no;
        oldProductionOrder.customer_order_id = dataOb.customer_order_id.order_no;

        productionOrder.production_session_id = dataOb.production_session_id.name;
        oldProductionOrder.production_session_id = dataOb.production_session_id.name;

        //Submit button get dissapeared when Edit function get executed
        buttonUpdate2.style.display = "block";
        buttonSubmit2.style.display = "none";



    }




}



//form Update event function 
const checkFormUpdate1 = () => {

    let updates = "";

    if (productionOrder != null && oldProductionOrder != null) {

        if (productionOrder.production_date != oldProductionOrder.production_date) {

            updates = updates + "Production Date  has changed..!\n";

        }

        if (productionOrder.customer_order_id.order_no != oldProductionOrder.customer_order_id.order_no) {

            updates = updates + "Customer Order has changed..!\n";

        }

        if (productionOrder.production_session_id.name != oldProductionOrder.production_session_id.name) {

            updates = updates + "Production Session has changed..!\n";

        }

        if (productionOrder.item_production_order_status_id.status != oldProductionOrder.item_production_order_status_id.status) {

            updates = updates + "Production Order Status has changed..!\n";

        }



        return updates;



        refreshProductionOrderTable();


    }
}


//form Update event function 
const checkFormUpdate2 = () => {

    let updates = "";

    if (productionOrder != null && oldProductionOrder != null) {

        if (productionOrder.customer_id.name != oldProductionOrder.customer_id.name) {

            updates = updates + "Customer Name  has changed..!\n";

        }

        if (productionOrder.customer_order_id.order_no != oldProductionOrder.customer_order_id.order_no) {

            updates = updates + "Customer Order No has changed..!\n";

        }

        if (productionOrder.production_session_id.name != oldProductionOrder.production_session_id.name) {

            updates = updates + "Production Session has changed..!\n";

        }

        if (productionOrder.production_order_nature_id.nature != oldProductionOrder.production_order_nature_id.nature) {

            updates = updates + "Production Order Natue has changed..!\n";

        }


        if (recurrentRadio.checked) {

            if (productionOrder.from_date != oldProductionOrder.from_date) {

                updates = updates + "Production Order From Date Has Changed..!\n";

            }

            if (productionOrder.to_date != oldProductionOrder.to_date) {

                updates = updates + "Production Order To Date has changed..!\n";

            }

        }


        return updates;



        refreshProductionOrderTable();


    }
}



//Update button
const buttonProductionOrderUpdate1 = () => {

    let updates = checkFormUpdate1();



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
                    let putResponce = getHTTPServiceRequest("productionorder/update", "PUT", productionOrder);
                    if (putResponce == "OK") {
                        swal("Updated Successfully ....!");

                        refreshForm1();
                        refreshProductionOrderTable();
                        $("#itemForm").modal("hide");

                    } else {
                        swal("Failed to Update..! \n" + putResponce);

                    }


                }


            });

    }




}

//Update button
const buttonProductionOrderUpdate2 = () => {

    let updates = checkFormUpdate2();



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
                    let putResponce = getHTTPServiceRequest("productionorder/update", "PUT", productionOrder);
                    if (putResponce == "OK") {
                        swal("Updated Successfully ....!");

                        refreshForm2();
                        refreshProductionOrderTable();
                        $("#itemForm").modal("hide");

                    } else {
                        swal("Failed to Update..! \n" + putResponce);

                    }


                }


            });

    }




}

const itemProductionOrderDelete = (dataOb, index) => {

    //need to get user confirmation
    let userConfirmMsg =
        "\n Production Date :" + dataOb.production_date +
        "\n Order No :" + dataOb.customer_order_id?.order_no +
        "\n Production Session:" + dataOb.production_session_id?.name +
        "\n Production Order  Status:" + dataOb.item_production_order_status_id?.status;




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


                let deleteResponce = getHTTPServiceRequest("/productionorder/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });
                    refreshForm1();
                    refreshForm2();
                    refreshProductionOrderTable();


                } else {
                    swal("Delete Not Sccessfull...!", {
                        icon: "error", text: deleteResponce
                    });

                }

            }



        });


}


//form delete event function 
const buttonItemProductionOrderView = (dataOb, index) => {

    console.log("View", dataOb, index);


    tdProductionDate.innerText = dataOb.production_date;
    tdOrderNo.innerText = dataOb.customer_order_id.order_no;
    tdProductionSession.innerText = dataOb.production_session_id.name;
    tdProductionOrderStatus.innerText = dataOb.item_production_order_status_id?.status;


    $("#modalProductionOrderView").modal("show");


    refreshProductionOrderTable();

}


//inner row in view
const printProductionOrderRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-item</title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
        "<body>" + tableItemProductionOrderView.outerHTML + "</body>";


    newWindow.document.write(printView);



    //Print window
    setTimeout(() => {

        newWindow.stop();
        newWindow.print();
        newWindow.close();

    }, 500)


    $("#modalProductionOrderView").modal("hide");


}

















