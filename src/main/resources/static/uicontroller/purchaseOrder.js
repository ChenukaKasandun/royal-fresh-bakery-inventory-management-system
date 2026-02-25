//Onload event
window.addEventListener('load', () => {

    //unable tooltip
    $('[data-bs-toggle="tooltip" ]').tooltip();

    refreshForm();
    refreshPurchaseOrderTable();

    refreshInnerFormAndInnerTable();


})


//Validation Of Dynamic dropdown  
const dynamicElementValidator = (element, object, property) => {

    const dynamicElement = element.value;

    purchaseOrder[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");

}

//Validation Of Dynamic dropdown   in the inner form
const dynamicElementValidator2 = (element, object, property) => {

    const dynamicElement = element.value;

    purchaseOrderMaterial[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");

}


//Validation Of required date
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


//Refreshing Form
const refreshForm = () => {

    //Cleaning inner HTML of attributes
    poForm.reset();

    //Removing Validation Colours using a common function declared in common.js
    setDefault([selectSupplier,txtTotal,txtRequiredDate,selectPoStatus]);

    //Defining purchaseOrder object for data binding at front end
    purchaseOrder = new Object();


    //Creating a new array to push data from the inner form to the inner table and main form(association link)
    purchaseOrder.purchaseOrderHasMaterialList = new Array();

    //rettrive data from the database by using a common function
    let supplierName = getServiceRequest("/supplier/alldata");

    //Calling function fill data into select
    fillDataIntoSelect(selectSupplier, "Please select Supplier..!", supplierName, "supplier_name");

    //rettrive purchaseorder status except "Delete"
    let poStatus = getServiceRequest("/purchaseorder/statusexceptdelete");

    //Calling function fill data into select
    fillDataIntoSelect(selectPoStatus, "Please select Status..!", poStatus, "name");


    //Update button gets dissapeared when Add new PO clicked
    buttonSubmit.style.display = "block";
    buttonUpdate.style.display = "none";

}



///Refreshing Table
const refreshPurchaseOrderTable = () => {

    //string => string/sate/number
    //function => object/array/boolean
    let propertyList = [{ propertyName: "order_no", dataType: "string" },
    { propertyName: getSupplierName, dataType: "function" },
    { propertyName: "total_price", dataType: "string" },
    { propertyName: "required_date", dataType: "string" },
    { propertyName: getPoStatus, dataType: "function" }];


    //Retriving data from the database using ajax common function defined in the coomonFunctions.js
    let purchaseOrders = getServiceRequest("/purchaseorder/alldata");

    // Calling common function to fill data into table
    fillDataIntoTable1(tablePurchaseOrderBody, purchaseOrders, propertyList, buttonPurchaseOrderRefill, buttonPurchaseOrderDelete, buttonPurchaseOrderView, true);

    //jQuery function
    $('#purchaseOrderTable').DataTable();


}

//Function for getting Supplier name
const getSupplierName = (dataOb) => {

    return dataOb.supplier_id.supplier_name;
}


//Function for getting PO status
const getPoStatus = (dataOb) => {

    //This highlighted deleted PO in red
    if (dataOb.purchase_order_status_id?.name != "Deleted"){
        return dataOb.purchase_order_status_id?.name;
    }else{
        return `<P style='background-color:red'>${dataOb.purchase_order_status_id?.name}</P>`;
    }

}



//Checking Form Error
const checkFormError = () => {

    let errors = "";

    if (purchaseOrder.supplier_id == null) {
        errors += "\n Enter valid supplier name...!";
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

    console.log(purchaseOrder);

    if (errors == "") {

        let userConfirmMsg1 =

            "\n Supplier Name :" + purchaseOrder.supplier_id.supplier_name +
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
                    $("#modalPoForm").modal("hide");

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


//form refill function
const buttonPurchaseOrderRefill = (dataOb, index) => {

    if (dataOb.purchase_order_status_id.name != "Deleted"){

        //Creating two objects to get reference in order to update
        purchaseOrder = JSON.parse(JSON.stringify(dataOb));
        oldpurchaseOrder = JSON.parse(JSON.stringify(dataOb));

        selectSupplier.value = JSON.stringify(dataOb.supplier_id);
        txtTotal.value = dataOb.total_price;
        txtRequiredDate.value = dataOb.required_date;
        selectPoStatus.value = JSON.stringify(dataOb.purchase_order_status_id);

        //Submit button gets dissapeared when edit function executed
        buttonUpdate.style.display = "block";
        buttonSubmit.style.display = "none";


        $("#modalPoForm").modal("show");

        refreshPurchaseOrderTable();

    }


}


const checkFormUpdate = () => {
    let updates = "";

    if (purchaseOrder != null && oldpurchaseOrder != null) {

        if (purchaseOrder.supplier_id.supplier_name != oldpurchaseOrder.supplier_id.supplier_name) {
            updates = updates + "Supplier Name has changed..! \n";
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
                            $("#modalPoForm").modal("hide");

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

    refreshPurchaseOrderTable();

}


//function define for view/print  Po record
const buttonPurchaseOrderView = (dataOb, index) => {
    console.log("View", dataOb, index);

    //filling data into modal
    tdOrderNo.innerText = dataOb.order_no;
    tdSupplierName.innerText = dataOb.supplier_id.supplier_name;
    tdTotalPrice.innerText = dataOb.total_price;
    tdRequiredDate.innerText = dataOb.required_date;
    tdStatus.innerText = dataOb.purchase_order_status_id.name;

    $("#modalPoView").modal("show");



}
//Print command
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



//.......................................Inner Form and Inner Table.............................................




//Function to refresh both inner form and inner table
const refreshInnerFormAndInnerTable = () =>{

    //Cleaning attributes in the inner Form
    materialInnerForm.reset();

    //Removing Validation Colours using a common function declared in common.js
    setDefault([selectMaterial,txtPurchasePrice,txtQuantity,txtLinePrice]);

    //Creating an object for data binding
    purchaseOrderMaterial = new Object();

    let innerColumns = [{ propertyName: getMaterialName, dataType: "function" },
        { propertyName: "purchase_price", dataType: "string" },
        { propertyName: "quantity", dataType: "string" },
        { propertyName: "line_price", dataType: "string" },
    ];

// Calling common function to fill data into table
    fillDataIntoInnerTable(tableInnerMaterialBody, purchaseOrder.purchaseOrderHasMaterialList, innerColumns, buttonPoInnerRefill, buttonPoInnerDelete, true);


    //retrive data from the database by using a common function
    let material = getServiceRequest("/rawmaterial/alldata");

    //Calling function fill data into select
    fillDataIntoSelect(selectMaterial, "Please select Material..!", material, "material_name");
}

//Function for "getMaterialName"
const getMaterialName = (dataOb) =>{

    return dataOb?.material_id?.material_name;
}


//Function for "buttonPoInnerRefill"
const buttonPoInnerRefill = (dataOb) =>{

}


//Function for "buttonPoInnerDelete"
const buttonPoInnerDelete = (dataOb) =>{

}

const buttonInnerFormSubmit = () =>{

    console.log(purchaseOrderMaterial);

     purchaseOrder.purchaseOrderHasMaterialList.push(purchaseOrderMaterial);

    refreshInnerFormAndInnerTable();

}


















