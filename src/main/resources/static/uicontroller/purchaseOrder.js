//Onload event
window.addEventListener('load', () => {


    //unable tooltip
    $('[data-bs-toggle="tooltip" ]').tooltip();
    refreshPurchaseOrderTable();
    refreshForm();


})



//Validation Of Dynamic dropdown  
const dynamicElementValidator = (element, object, property) => {

    const dynamicElement = element.value;

    purchaseOrder[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");


}


const PurchaseOrderStatusValidator = () => {

    if (confirmRadio.checked) {
        purchaseOrder.purchase_order_status_id = { id: 1, name: "Confirmed" }

    }

    if (cancelRadio.checked) {
        purchaseOrder.purchase_order_status_id = { id: 1, name: "Cancelled" }

    }
}


//Validation Of DOB
const dateValidator = (dateElement, object, property) => {

    const dateElementValue = dateElement.value;

    if (dateElementValue != "") {

        dateElement.classList.add("is-valid");
        purchaseOrder.required_date = dateElementValue;

    } else {

        dateElement.classList.add("is-invalid");
        purchaseOrder.required_date = null;


    }


}



const refreshForm = () => {


    //Defining purchaseOrder object for data binding at front end
    purchaseOrder = new Object();


    //Cleaning inner HTML of attributes
    selectMaterial.value = "";
    selectSupplier.value = "";
    txtUnit.value = "";
    txtQty.value = "";
    txtTotal.value = "";
    txtRequiredDate.value = "";


    //Radio buttons
    confirmRadio.checked = false;
    cancelRadio.checked = false;


    //Removing validation
    selectMaterial.classList.remove("is-invalid");
    selectMaterial.classList.remove("is-valid");

    selectSupplier.classList.remove("is-invalid");
    selectSupplier.classList.remove("is-valid");

    txtUnit.classList.remove("is-invalid");
    txtUnit.classList.remove("is-valid");

    txtQty.classList.remove("is-invalid");
    txtQty.classList.remove("is-valid");

    txtTotal.classList.remove("is-invalid");
    txtTotal.classList.remove("is-valid");

    txtRequiredDate.classList.remove("is-invalid");
    txtRequiredDate.classList.remove("is-valid");




    //rettrive data from the database by using a common function
    let materials = getServiceRequest("/rawmaterial/alldata");

    //Calling function fill data into select
    fillDataIntoSelect(selectMaterial, "Please select Material..!", materials, "material_name");

    //rettrive data from the database by using a common function
    let supplierName = getServiceRequest("/supplier/alldata");

    //Calling function fill data into select
    fillDataIntoSelect(selectSupplier, "Please select Supplier..!", supplierName, "supplier_name");



    //Update button getsdissapeared when Add new PO clicked
    buttonSubmit.style.display = "block";
    buttonUpdate.style.display = "none";

}





const refreshPurchaseOrderTable = () => {

    //string => string/sate/number
    //function => object/array/boolean
    let propertyList = [{ propertyName: "order_no", dataType: "string" },
    { propertyName: getSupplierName, dataType: "function" },
    { propertyName: getMaterialName, dataType: "function" },
    { propertyName: "unit_price", dataType: "string" },
    { propertyName: "order_qty", dataType: "string" },
    { propertyName: "total_price", dataType: "string" },
    { propertyName: "required_date", dataType: "string" },
    { propertyName: getPoStatus, dataType: "function" }];




    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let purchaseOrders = getServiceRequest("/purchaseorder/alldata");


    // Calling common function to fill data into table
    fillDataIntoTable1(tablePurchaseOrderBody, purchaseOrders, propertyList, buttonPurchaseOrderRefill, buttonPurchaseOrderDelete, buttonPurchaseOrderView, true);


    $('#purchaseOrderTable').DataTable();



}


const getSupplierName = (dataOb) => {

    return dataOb.supplier_id.supplier_name;
}


const getMaterialName = (dataOb) => {

    return dataOb.material_id.material_name;
}


const getPoStatus = (dataOb) => {

    return dataOb.purchase_order_status_id?.name;
}





const checkFormError = () => {

    let errors = "";

    if (purchaseOrder.material_id == null) {
        errors += "\n Material is required...!";
    }

    if (purchaseOrder.supplier_id == null) {
        errors += "\n Enter valid supplier name...!";
    }



    if (purchaseOrder.unit_price == null) {
        errors += "\n Enter valid unit price...!";
    }

    if (purchaseOrder.order_qty == null) {
        errors += "\n Enter valid order quantity...!";
    }

    if (purchaseOrder.total_price == null) {
        errors += "\n Enter valid total price...!";
    }

    if (purchaseOrder.required_date == null) {
        errors += "\n Enter valid required date...!";
    }


    if (purchaseOrder.purchase_order_status_id == null) {
        errors += "\n Enter Purchase Order Status..!";
    }


    return errors;
}




//form submit event function 
const buttonPurchaseOrderSubmit = () => {

    //Check form error for required element
    let errors = checkFormError();

    if (errors == "") {

        let userConfirmMsg1 =


            "\n Material Name:" + purchaseOrder.material_id.material_name +
            "\n Supplier Name :" + purchaseOrder.supplier_id.supplier_name +
            "\n Unit Price :" + purchaseOrder.unit_price +
            "\n Order Qty :" + purchaseOrder.order_qty +
            "\n Unit Price:" + purchaseOrder.unit_price +
            "\n Order Qty:" + purchaseOrder.order_qty +
            "\n Total Price:" + purchaseOrder.total_price +
            "\n Required Date:" + purchaseOrder.required_date +
            "\n Status:" + purchaseOrder.purchase_order_status_id.name;


        swal({
            title: "Are you sure to Submit Following Details..?",
            text: userConfirmMsg1,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((userResponce) => {

            if (userResponce) {
                //call post service
                let postResponce = getHTTPServiceRequest("/purchaseorder/insert", "POST", purchaseOrder);
                if (postResponce == "OK") {
                    swal("Saved Successfully ....!");

                    refreshPurchaseOrderTable();
                    refreshForm();
                    $("#poForm").modal("hide");



                } else {
                    swal("Failed to submit..! \n" + postResponce);

                }


            }





        });



    } else {

        swal("Form has following errors...\n" + errors);


    }

    refreshPurchaseOrderTable();


}

//form Update event function 
const buttonPurchaseOrderRefill = (dataOb, index) => {

    //Creating two objects to get reference in order to update
    purchaseOrder = JSON.parse(JSON.stringify(dataOb));
    oldpurchaseOrder = JSON.parse(JSON.stringify(dataOb));

    selectMaterial.value = JSON.stringify(dataOb.material_id);
    selectSupplier.value = JSON.stringify(dataOb.supplier_id);
    txtUnit.value = dataOb.unit_price;
    txtQty.value = dataOb.order_qty;
    txtTotal.value = dataOb.total_price;
    txtRequiredDate.value = dataOb.required_date;

    //Refilling radio buttons ---> status
    if (dataOb.purchase_order_status_id.name == "Confirmed") {
        confirmRadio.checked = true;
    }

    if (dataOb.purchase_order_status_id.name == "Cancelled") {
        confirmRadio.checked = true;
    }


    //Submit button getsdissapeared when edit function executed
    buttonUpdate.style.display = "block";
    buttonSubmit.style.display = "none";


    $("#poForm").modal("show");

    refreshPurchaseOrderTable();




}


const checkFormUpdate = () => {
    let updates = "";

    if (purchaseOrder != null && oldpurchaseOrder != null) {
        if (purchaseOrder.material_id.material_name != oldpurchaseOrder.material_id.material_name) {
            updates = updates + "Material has changed..! \n";
        }

        if (purchaseOrder.supplier_id.supplier_name != oldpurchaseOrder.supplier_id.supplier_name) {
            updates = updates + "Supplier Name has changed..! \n";
        }

        if (purchaseOrder.unit_price != oldpurchaseOrder.unit_price) {
            updates = updates + "Unit Price has changed..! \n";
        }

        if (purchaseOrder.order_qty != oldpurchaseOrder.order_qty) {
            updates = updates + "Order Qty has changed..! \n";
        }

        if (purchaseOrder.total_price != oldpurchaseOrder.total_price) {
            updates = updates + "Total Price has changed..! \n";
        }

        if (purchaseOrder.required_date != oldpurchaseOrder.required_date) {
            updates = updates + "Required Date has changed..! \n";
        }

        if (purchaseOrder.purchase_order_status_id.name != oldpurchaseOrder.purchase_order_status_id.name) {
            updates = updates + "Status has changed..! \n";
        }





    }

    console.log(purchaseOrder);
    console.log(oldpurchaseOrder);



    return updates;


}


//form Update event function 
const buttonPurchaseOrderUpdate = () => {

    let errors = checkFormError();

    if (errors == "") {

        let updates = checkFormUpdate();
        if (updates == "") {
            swal("Nothing to update..!");

        } else {

            let userConfirmMsg2 = " Are you want to update following..?";

            //Sweet alert function
            swal({
                title: userConfirmMsg2,
                text: updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((userResponce) => {

                    if (userResponce) {
                        //call post service
                        let putResponce = getHTTPServiceRequest("purchaseorder/update", "PUT", purchaseOrder);
                        if (putResponce == "OK") {
                            swal("Updated Successfully ....!");




                            refreshPurchaseOrderTable();
                            refreshForm();
                            $("#poForm").modal("hide");



                        } else {
                            swal("Failed to Update..! \n" + putResponce);

                        }


                    }





                });


        }

    } else {
        swal("Form has following errors..!\n" + errors);

    }


    refreshPurchaseOrderTable();




}










//form delete event function 
const buttonPurchaseOrderDelete = (dataOb, index) => {



    //need to get user confirmation
    let userConfirmMsg =
        "\n Purchase Order No :" + dataOb.order_no +
        "\n Supplier Name :" + dataOb.supplier_id.supplier_name +
        "\n Material Name :" + dataOb.material_id.material_name +
        "\n Unit Price:" + dataOb.unit_price +
        "\n  Order Qty:" + dataOb.order_qty +
        "\n  Total Price:" + dataOb.total_price +
        "\n Required Date:" + dataOb.required_date +
        "\n Status:" + dataOb.purchase_order_status_id.name;


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


                let deleteResponce = getHTTPServiceRequest("/purchaseorder/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });

                    refreshPurchaseOrderTable();
                    refreshForm();



                } else {
                    swal("Delete Not Sccessfull...!", {
                        icon: "error", text: deleteResponce
                    });

                }

            }



        });

    refreshPurchaseOrderForm();
    refreshPurchaseOrderTable();







}


//function define for view/print  Po record
const buttonPurchaseOrderView = (dataOb, index) => {
    console.log("View", dataOb, index);


    //filling data into modal
    tdOrderNo.innerText = dataOb.order_no;
    tdSupplierName.innerText = dataOb.supplier_id.supplier_name;
    tdMaterial.innerText = dataOb.material_id.material_name;
    tdUnitPrice.innerText = dataOb.unit_price;
    tdOrderQty.innerText = dataOb.order_qty;
    tdTotalPrice.innerText = dataOb.total_price;
    tdRequiredDate.innerText = dataOb.required_date;
    tdStatus.innerText = dataOb.purchase_order_status_id.name;

    $("#modalPoView").modal("show");



}


const printPoRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-purchase-order</title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
        "<body>" + tablePoView.outerHTML + "</body>";


    newWindow.document.write(printView);



    //Print window
    setTimeout(() => {

        newWindow.stop();
        newWindow.print();
        newWindow.close();

    }, 500)


    $("#modalPoView").modal("hide");


}
























