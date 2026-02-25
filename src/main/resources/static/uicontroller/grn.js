

// window onload event
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


    // Introducing Array for linking association table
    grn.grnHasMaterialList = new Array();

    // Cleaning the attributes
    grnForm.reset();

    //Removing Validation Colours using a common function declared in common.js
    setDefault([txtSupplierBillNo,
        txtReceivedDate,
        selectSupplierName,
        selectPoNumber,
        selectGrnStatus,
        txtTotalPrice,
        textNote]);




    //Define PO No
    let poNumber = getServiceRequest("/purchaseorder/alldata");
    //Calling function fill data into select
    fillDataIntoSelect(selectPoNumber, "Please select Purchase Order No", poNumber, "order_no");


    //Define GRNstatus
    let grnStatus = getServiceRequest("/grnstatus/alldata");
    //Calling function fill data into select
    fillDataIntoSelect(selectGrnStatus, "Please select Purchase Order No", grnStatus, "status");

    //Update button getsdissapeared when refreshForm executed
    buttonSubmit.style.display = "block";
    buttonUpdate.style.display = "none";



//     Refreshing Inner Form and inner table
    refreshInnerFormAndTable();
}



// filter suppliername according to the PO No

const filterSupplierName = () =>{

    let supplierName = getServiceRequest("/supplier/getsuppliernamebypono/"+JSON.parse(selectPoNumber.value).id);
    //Calling function fill data into select
    fillDataIntoSelect(selectSupplierName, "Please select Supplier Name", supplierName, "supplier_name");

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
            "\n Total Price:" + grn.total_price+
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

                    $("#modalGrnForm").modal("hide");



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
    txtTotalPrice.value = dataOb.total_price;
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



    $("#modalGrnForm").modal("show");




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
                        $("#modalGrnForm").modal("hide");

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
    tdTotalPrice.innerText = dataOb.total_price;
    tdBillNo.innerText = dataOb.bill_no;
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


// Refresh Inner Form and Inner  Table
const refreshInnerFormAndTable = () =>{

//     Clean the attributes
    grnInnerForm.reset();

    //Removing Validation Colours using a common function declared in common.js
    setDefault([selectMaterial,
        txtItemQuantity,
        txtUnitPrice,
        txtLinePrice]);


    // Creating a new object for data binding at front end
    grnHasMaterial = new Object();

    //Filling Dropdowns

    let material = getServiceRequest("/rawmaterial/alldata");

    //Filling data into dropdowns
    fillDataIntoSelect(selectMaterial, "Please select Material.!", material, "material_name");

    //Filling  inner Table

    let innerColumns = [{ propertyName: getMaterial, dataType: "function" },
        { propertyName: "unit_price", dataType: "string" },
        { propertyName: "qty" , dataType: "string" },
        { propertyName: "line_price" , dataType: "decimal" }];

// Calling common function to fill data into table
    fillDataIntoInnerTable(tableInnerGrnBody, grn.grnHasMaterialList, innerColumns, buttonInnerGrnRefill, buttonInnerGrnDelete, true);

}


// Function to get material
const getMaterial = (dataOb) =>{
    return dataOb?.material_id?.material_name;

}


const buttonInnerGrnRefill= () =>{

}

const buttonInnerGrnDelete = () =>{

}


// function for generation of Line Price
const itemQty = document.querySelector("#txtItemQuantity");
const unitPrice = document.querySelector("#txtUnitPrice");
const txtLinePrice = document.querySelector("#txtLinePrice");

const generateLinePrice = () => {
    // Always parse the full current values
    const qty = parseFloat(itemQty.value) || 0;
    const price = parseFloat(unitPrice.value) || 0;

    // Recalculate line price fresh each time
    const linePrice = qty * price;

    txtLinePrice.value = linePrice.toFixed(2); // keep 2 decimals
    grnHasMaterial.line_price = txtLinePrice.value;
    txtLinePrice.classList.add("is-valid");
};

// Update dynamically as user types if either of the fields do not have onchange functions
// [itemQty, unitPrice].forEach(input => {
//     input.addEventListener("input", generateLinePrice);
// });

//  Function For Generating Total Price
const totalPriceGenerator = () =>{

    let totalPrice = 0;
    grn.grnHasMaterialList.forEach(material =>{
        totalPrice += parseFloat(material.line_price);
    });

    txtTotalPrice.value = totalPrice;
    grn.total_price = txtTotalPrice.value;
    txtTotalPrice.classList.add("is-valid");
}


const innerFormSubmit = () =>{


    console.log(grn);
    console.log(grnHasMaterial);

    //Adding inner form data into the association table and to the whole object
    grn.grnHasMaterialList.push(grnHasMaterial);

    refreshInnerFormAndTable();
    totalPriceGenerator();

}



//Validation Of Dynamic dropdown
const dynamicElementValidator1 = (element, object, property) => {

    const dynamicElement = element.value;

    grnHasMaterial[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");


}