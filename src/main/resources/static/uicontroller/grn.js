


window.addEventListener('load', () => {

    refreshGRNTable();
    refreshForm();


})

//Validation Of Dynamic dropdown  
const dynamicElementValidator = (element, object, property) => {

    const dynamicElement = element.value;

    grn[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");


}


const refreshForm = () => {

    //defining a new object for data binding
    grn = new Object();



    //Clean the atrributes
    txtSupplierBillNo.value = "";
    txtReceivedDate.value = "";
    selectSupplierName.value = "";
    selectPoNumber.value = "";
    selectMaterial.value = "";
    txtMaterialQty.value = "";
    selectGrnStatus.value = "";
    textNote.value = "";



    txtSupplierBillNo.classList.remove("is-invalid");
    txtSupplierBillNo.classList.remove("is-valid");

    txtReceivedDate.classList.remove("is-invalid");
    txtReceivedDate.classList.remove("is-valid");

    selectSupplierName.classList.remove("is-invalid");
    selectSupplierName.classList.remove("is-valid");

    selectPoNumber.classList.remove("is-invalid");
    selectPoNumber.classList.remove("is-valid");

    selectMaterial.classList.remove("is-invalid");
    selectMaterial.classList.remove("is-valid");

    txtMaterialQty.classList.remove("is-invalid");
    txtMaterialQty.classList.remove("is-valid");

    selectGrnStatus.classList.remove("is-invalid");
    selectGrnStatus.classList.remove("is-valid");

    textNote.classList.remove("is-invalid");
    textNote.classList.remove("is-valid");



    //Define Supplier Name
    let supplierName = getServiceRequest("/supplier/alldata");
    //Calling function fill data into select
    fillDataIntoSelect(selectSupplierName, "Please select Supplier Name", supplierName, "supplier_name");


    //Define PO No
    let poNumber = getServiceRequest("/purchaseorder/alldata");
    //Calling function fill data into select
    fillDataIntoSelect(selectPoNumber, "Please select Purchase Order No", poNumber, "order_no");

    //Define GRNstatus
    let grnStatus = getServiceRequest("/grnstatus/alldata");
    //Calling function fill data into select
    fillDataIntoSelect(selectGrnStatus, "Please select Purchase Order No", grnStatus, "status");

    //Define Material
    let material = getServiceRequest("/rawmaterial/alldata");
    //Calling function fill data into select
    fillDataIntoSelect(selectMaterial, "Please select Material", material, "material_name");


    //Update button getsdissapeared when refreshForm executed
    buttonSubmit.style.display = "block";
    buttonUpdate.style.display = "none";



}



const refreshGRNTable = () => {

    //string => string/sate/number
    //function => object/array/boolean
    let propertyList = [{ propertyName: "bill_no", dataType: "string" },
    { propertyName: "grn_no", dataType: "string" },
    { propertyName: "received_date", dataType: "string" },
    { propertyName: getSupplierName, dataType: "function" },
    { propertyName: getPurchaseOrderNo, dataType: "function" },
    { propertyName: getGrnStatus, dataType: "function" }
    ];


    //Calling a common function to retrive data from the database to the table
    let grnData = getServiceRequest("/grn/alldata");
    //Calling common function to fill data into table
    fillDataIntoTable1(grnTableBody, grnData, propertyList, grnFormRefill, buttongrnDelete, grnView, true);


    $('#grnTable').DataTable();

}

const getSupplierName = (dataOb) => {

    return dataOb.supplier_id.supplier_name;
}

const getPurchaseOrderNo = (dataOb) => {

    return dataOb.purchase_order_id.order_no;
}


const getGrnStatus = (dataOb) => {

    return dataOb.grn_status_id.status;
}



//check errors in the form
const checkFormError = () => {

    //need to check all required properties

    let errors = "";

    if (grn.bill_no == null) {
        errors = errors + "Please Enter a valid Bill No..!\n";

    }


    if (grn.received_date == null) {
        errors = errors + "Please Enter the received date..!\n";

    }

    if (grn.supplier_id == null) {
        errors = errors + "Please Select the Supplier..!\n";

    }

    if (grn.purchase_order_id == null) {
        errors = errors + "Please Select the PO number..!\n";

    }

    if (grn.material_id == null) {
        errors = errors + "Please Enter the material..!\n";

    }

    if (grn.qty == null) {
        errors = errors + "Please Enter the Material Quantity ...!\n";

    }


    if (grn.grn_status_id == null) {
        errors = errors + "Please Select GRN Status...!\n";

    }

    return errors;



}

//Employee form Submit Function
const buttonGrnSubmit = () => {


    console.log(grn);

    //Check form error for required element
    let errors = checkFormError();

    if (errors == "") {



        let userConfirmMsg1 =

            "\n Supplier Bill No :" + grn.bill_no +
            "\n Item Received Date :" + grn.received_date +
            "\n Supplier Name:" + grn.supplier_id.supplier_name +
            "\n Purchase Order No:" + grn.purchase_order_id.order_no +
            "\n Material Name:" + grn.material_id.material_name +
            "\n Material Quantity:" + grn.qty +
            "\n GRN Status:" + grn.grn_status_id.status;



        swal({
            title: "Are you sure to Submit Following Details..?",
            text: userConfirmMsg1,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((userResponce) => {

            if (userResponce) {
                //call post service
                let postResponce = getHTTPServiceRequest("/grn/insert", "POST", grn);
                if (postResponce == "OK") {
                    swal("Saved Successfully ....!");


                    refreshGRNTable();
                    refreshForm();

                    $("#grnForm").modal("hide");



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
const grnFormRefill = (dataOb, index) => {
    console.log("Edit", dataOb, index);

    //Creating two objects for update function
    grn = JSON.parse(JSON.stringify(dataOb));
    oldGrn = JSON.parse(JSON.stringify(dataOb));

    txtSupplierBillNo.value = dataOb.bill_no;
    txtReceivedDate.value = dataOb.received_date;
    selectSupplierName.value = JSON.stringify(dataOb.supplier_id);
    selectPoNumber.value = JSON.stringify(dataOb.purchase_order_id);
    selectMaterial.value = JSON.stringify(dataOb.material_id);
    txtMaterialQty.value = dataOb.qty;
    selectGrnStatus.value = JSON.stringify(dataOb.grn_status_id);



    //Assigning values from DB to the properties of front end object in order to avoid mismatches


    grn.supplier_id = dataOb.supplier_id.supplier_name;
    oldGrn.supplier_id = dataOb.supplier_id.supplier_name;

    grn.purchase_order_id = dataOb.purchase_order_id.order_no;
    oldGrn.purchase_order_id = dataOb.purchase_order_id.order_no;

    grn.material_id = dataOb.material_id.material_name;
    oldGrn.material_id = dataOb.material_id.material_name;

    grn.grn_status_id = dataOb.grn_status_id.status;
    oldGrn.grn_status_id = dataOb.grn_status_id.status;


    //Submit button getsdissapeared when edit function executed
    buttonUpdate.style.display = "block";
    buttonSubmit.style.display = "none";



    $("#grnForm").modal("show");




}






//form Update event function 
const checkFormUpdate = () => {

    let updates = "";

    if (grn != null && oldGrn != null) {

        if (grn.bill_no != oldGrn.bill_no) {

            updates = updates + "Supplier Bill No has changed..!\n";

        }

        if (grn.received_date != oldGrn.received_date) {

            updates = updates + "Received Date has changed..!\n";

        }

        if (grn.supplier_id.supplier_name != oldGrn.supplier_id.supplier_name) {

            updates = updates + "Supplier Name has changed..!\n";

        }

        if (grn.purchase_order_id.order_no != oldGrn.purchase_order_id.order_no) {

            updates = updates + "PO Number has changed..!\n";

        }


        if (grn.material_id.material_name != oldGrn.material_id.material_name) {

            updates = updates + "Material has changed..!\n";

        }

        if (grn.qty != oldGrn.qty) {

            updates = updates + "Received Qty has changed..!\n";

        }


        if (grn.grn_status_id.status != oldGrn.grn_status_id.status) {

            updates = updates + "GRN Status has changed..!\n";

        }



        return updates;



        refreshGRNTable();


    }
}











//Update button
const buttonGrnUpdate = () => {

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
                    let putResponce = getHTTPServiceRequest("/grn/update", "PUT", grn);
                    if (putResponce == "OK") {
                        swal("Updated Successfully ....!");

                        refreshGRNTable();
                        refreshForm();
                        $("##grnForm").modal("hide");

                    } else {
                        swal("Failed to Update..! \n" + putResponce);

                    }


                }


            });

    }




}



//form delete event function 
const buttongrnDelete = (dataOb, index) => {

    console.log("Delete", dataOb, index);


    //need to get user confirmation
    let userConfirmMsg =

        "\n Bill No:" + dataOb.bill_no +
        "\n GRN No :" + dataOb.grn_no +
        "\n Received Date:" + dataOb.received_date +
        "\n Supplier Name:" + dataOb.supplier_id.supplier_name +
        "\n PO No:" + dataOb.purchase_order_id.order_no +
        "\n Item List:" + dataOb.received_item_list +
        "\n GRN Status:" + dataOb.grn_status_id.status;




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


                let deleteResponce = getHTTPServiceRequest("/grn/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });

                    refreshGRNTable();
                    refreshForm();

                } else {
                    swal("Delete Not Sccessfull...!", {
                        icon: "error", text: deleteResponce
                    });

                }

            }



        });





}



//function define for view/print  stock record
const grnView = (dataOb, index) => {
    console.log("View", dataOb, index);

    tdReceivedDate.innerText = dataOb.received_date;
    tdSupplierName.innerText = dataOb.supplier_id.supplier_name;
    tdPONumber.innerText = dataOb.purchase_order_id.order_no;
    tdBillNo.innerText = dataOb.bill_no;
    tdItemList.innerText = dataOb.received_item_list;
    tdGRNStatus.innerText = dataOb.grn_status_id.status;


    $("#modalGrnView").modal("show")


    refreshGRNTable();
    refreshForm();


}

const printGrnRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-user</title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
        "<body>" + tableStockView.outerHTML + "</body>";


    newWindow.document.write(printView);



    //Print window
    setTimeout(() => {

        newWindow.stop();
        newWindow.print();
        newWindow.close();

    }, 500)


    $("#modalGrnView").modal("hide");


}









