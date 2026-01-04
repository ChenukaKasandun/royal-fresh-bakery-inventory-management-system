


window.addEventListener('load', () => {

    refreshStockTable();
    refreshForm();


})

//Validation Of Dynamic dropdown  
const dynamicElementValidator = (element, object, property) => {

    const dynamicElement = element.value;

    stock[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");


}

const refreshForm = () => {

    stock = new Object();


    //Clean the inner HTML of attributes
    selectRawMaterial.value = "";
    selectGRN.value = "";
    selectSupplier.value = "";
    textReceivedDate.value = "";
    textManufactureDate.value = "";
    textExpiryDate.value = "";
    textTotalQty.value = "";
    textUsableQty.value = "";
    textNotUsableQty.value = "";
    textNote.value = "";

    // remove boostrap validation

    selectRawMaterial.classList.remove("is-invalid");
    selectRawMaterial.classList.remove("is-valid");

    selectGRN.classList.remove("is-invalid");
    selectGRN.classList.remove("is-valid");

    selectSupplier.classList.remove("is-invalid");
    selectSupplier.classList.remove("is-valid");

    textReceivedDate.classList.remove("is-invalid");
    textReceivedDate.classList.remove("is-valid");

    textManufactureDate.classList.remove("is-invalid");
    textManufactureDate.classList.remove("is-valid");

    textExpiryDate.classList.remove("is-invalid");
    textExpiryDate.classList.remove("is-valid");

    textTotalQty.classList.remove("is-invalid");
    textTotalQty.classList.remove("is-valid");

    textUsableQty.classList.remove("is-invalid");
    textUsableQty.classList.remove("is-valid");

    textNotUsableQty.classList.remove("is-invalid");
    textNotUsableQty.classList.remove("is-valid");

    textNote.classList.remove("is-valid");
    textNote.classList.remove("is-invalid");




    //Define Material Name
    let material = getServiceRequest("/rawmaterial/alldata");
    //Calling function fill data into select
    fillDataIntoSelect(selectRawMaterial, "Please select Material", material, "material_name");


    //Define GRN No Name
    let grnNo = getServiceRequest("/grn/alldata");
    //Calling function fill data into select
    fillDataIntoSelect(selectGRN, "Please select GRN No..!", grnNo, "grn_no");



    //Define Supplier Name
    let supplierName = getServiceRequest("/supplier/alldata");
    //Calling function fill data into select
    fillDataIntoSelect(selectSupplier, "Please select Supplier Name..!", supplierName, "supplier_name");

    //Update button getsdissapeared when refreshForm function executed
    buttonSubmit.style.display = "block";
    buttonUpdate.style.display = "none";



}



const refreshStockTable = () => {



    //string => string/sate/number
    //function => object/array/boolean
    let propertyList = [
        { propertyName: getMaterialName, dataType: "function" },
        { propertyName: getGrnNo, dataType: "function" },
        { propertyName: getSupplierName, dataType: "function" },
        { propertyName: getManufactureDate, dataType: "function" },
        { propertyName: getExpiryDate, dataType: "function" },
        { propertyName: "total_qty", dataType: "string" },
        { propertyName: getUsableQty, dataType: "function" },
        { propertyName: getNotUsableQty, dataType: "function" }];



    //retrive data From the database
    let materialStock = getServiceRequest("/stock/alldata");

    //Calling common function to fill data into table
    fillDataIntoTable1(tableStockBody, materialStock, propertyList, stockFormRefill, stockDelete, stockView, true);


    $('#stockTable').DataTable();

}


const getMaterialName = (dataOb) => {

    return dataOb.material_id.material_name;

}

const getGrnNo = (dataOb) => {

    return dataOb.grn_id.grn_no;

}


const getSupplierName = (dataOb) => {

    return dataOb.grn_id.supplier_id.supplier_name;

}


const getNotUsableQty = (dataOb) => {

    return `<p style='background-color:red;'> ${dataOb.not_usable_qty}</p>`;
}

const getUsableQty = (dataOb) => {

    return `<p style='background-color:green;'> ${dataOb.usable_qty}</p>`;
}

const getManufactureDate = (dataOb) => {

    return `<p class='fw-bold text-success'> ${dataOb.manufacture_date}</p>`;
}

const getExpiryDate = (dataOb) => {

    return `<p class='fw-bold text-danger'> ${dataOb.exp_date}</p>`;
}



//check errors in the form
const checkFormError = () => {

    //need to check all required properties

    let errors = "";

    if (stock.material_id == null) {
        errors = errors + "Please Select the material..!\n";

    }

    if (stock.grn_id == null) {
        errors = errors + "Please Select GRN No..!\n";

    }

    if (stock.supplier_id == null) {
        errors = errors + "Please Select the supplier Name..!\n";

    }
    if (stock.receivedDate == null) {
        errors = errors + "Please Enter the received Date.!\n";

    }


    if (stock.manufacture_date == null) {
        errors = errors + "Please Enter the Manufacture Date..!\n";

    }


    if (stock.exp_date == null) {
        errors = errors + "Please Enter the Expire Date..!\n";

    }


    if (stock.total_qty == null) {
        errors = errors + "Please Enter the Total Qty..!\n";


    }

    if (stock.usable_qty == null) {
        errors = errors + "Please Enter the Usable Qty..!\n";

    }

    if (stock.not_usable_qty == null) {
        errors = errors + "Please Enter the Not Usable Qty..!\n";

    }



    return errors;



}


//form submit event function 
const buttonStockSubmit = () => {

    //Check form error for required element
    let errors = checkFormError();
    console.log(stock);


    if (errors == "") {

        let userConfirmMsg1 =

            "\n Material Name :" + stock.material_id.material_name +
            "\n GRN No :" + stock.grn_id.grn_no +
            "\n Supplier Name :" + stock.supplier_id.supplier_name +
            "\n Received Date :" + stock.receivedDate +
            "\n Manufacture Date :" + stock.manufacture_date +
            "\n Expire Date :" + stock.exp_date +
            "\n Total Qty :" + stock.total_qty +
            "\n Usable Qty :" + stock.usable_qty +
            "\n Not Usable Qty :" + stock.not_usable_qty;


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
                    let postResponce = getHTTPServiceRequest("/stock/insert", "POST", stock);
                    if (postResponce == "OK") {
                        swal("Saved Successfully ....!");



                        refreshStockTable();
                        refreshForm();
                        $("#materialStockForm").modal("hide");



                    } else {
                        swal("Failed to submit..! \n" + postResponce);

                    }


                }





            });



    } else {

        swal("Form has following errors...\n\n" + errors);


    }



}






//function define for refill customer form
const stockFormRefill = (dataOb, index) => {
    console.log("Edit", dataOb, index);


    //Creating two objects to comparison in update function
    stock = JSON.parse(JSON.stringify(dataOb));
    oldStock = JSON.parse(JSON.stringify(dataOb));


    //Filling data From database
    selectRawMaterial.value = JSON.stringify(dataOb.material_id);
    selectGRN.value = JSON.stringify(dataOb.grn_id);
    selectSupplier.value = JSON.stringify(dataOb.grn_id.supplier_id);
    textReceivedDate.value = dataOb.grn_id.received_date;
    textManufactureDate.value = dataOb.manufacture_date;
    textExpiryDate.value = dataOb.exp_date;
    textTotalQty.value = dataOb.total_qty;
    textUsableQty.value = dataOb.usable_qty;
    textNotUsableQty.value = dataOb.not_usable_qty;





    //Asigning values of DB to front end object in order to avoid mismatch
    stock.material_id = dataOb.material_id.material_name;
    oldStock.material_id = dataOb.material_id.material_name;

    stock.grn_id = dataOb.grn_id.grn_no;
    oldStock.grn_id = dataOb.grn_id.grn_no;

    stock.supplier_id = dataOb.grn_id.supplier_id.supplier_name;
    oldStock.supplier_id = dataOb.grn_id.supplier_id.supplier_name;

    stock.receivedDate = dataOb.grn_id.received_date;
    oldStock.receivedDate = dataOb.grn_id.received_date;



    //Submit button getsdissapeared when Edit function executed
    buttonSubmit.style.display = "none";
    buttonUpdate.style.display = "block";


    $("#materialStockForm").modal("show");





}



//form Update event function 
const checkFormUpdate = () => {

    let updates = "";

    if (stock != null && oldStock != null) {

        if (stock.material_id.material_name != oldStock.material_id.material_name) {

            updates = updates + "Material has changed..!\n";

        }

        if (stock.bill_no != oldStock.bill_no) {

            updates = updates + "Supplier Bill No has changed..!\n";

        }

        if (stock.grn_id.grn_no != oldStock.grn_id.grn_no) {

            updates = updates + "GRN No has changed..!\n";

        }

        if (stock.supplier_id.supplier_name != oldStock.supplier_id.supplier_name) {

            updates = updates + "Supplier Name has changed..!\n";

        }

        if (stock.receivedDate != oldStock.receivedDate) {

            updates = updates + "Received Date has changed..!\n";

        }

        if (stock.manufacture_date != oldStock.manufacture_date) {

            updates = updates + "Manufacture Date has changed..!\n";

        }

        if (stock.exp_date != oldStock.exp_date) {

            updates = updates + "Expiery Date has changed..!\n";

        }

        if (stock.total_qty != oldStock.total_qty) {

            updates = updates + "Total Qty has changed..!\n";

        }

        if (stock.usable_qty != oldStock.usable_qty) {

            updates = updates + "Usable Qty has changed..!\n";

        }

        if (stock.not_usable_qty != oldStock.not_usable_qty) {

            updates = updates + "Not Usable Qty has changed..!\n";

        }




        return updates;



        refreshGRNTable();


    }
}


//Update button
const buttonStockUpdate = () => {

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
                    let putResponce = getHTTPServiceRequest("/stock/update", "PUT", stock);
                    if (putResponce == "OK") {
                        swal("Updated Successfully ....!");

                        refreshForm();
                        refreshStockTable();
                        $("#materialStockForm").modal("hide");

                    } else {
                        swal("Failed to Update..! \n" + putResponce);

                    }


                }


            });

    }




}


//function define for delete customer record
const stockDelete = (dataOb, index) => {
    console.log("Delete", dataOb, index);


    //need to get user confirmation
    let userConfirmMsg =
        "\n Raw Material :" + dataOb.material_id.material_name +
        "\n GRN No :" + dataOb.grn_id.grn_no +
        "\n Supplier Name:" + dataOb.grn_id.supplier_id.supplier_name +
        "\n Total Qty:" + dataOb.total_qty +
        "\n Usable Qty:" + dataOb.usable_qty +
        "\n Not Usable Qty:" + dataOb.not_usable_qty;



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


                let deleteResponce = getHTTPServiceRequest("/stock/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });


                    refreshStockTable();
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
const stockView = (dataOb, index) => {
    console.log("View", dataOb, index);

    tdMaterial.innerText = dataOb.material_id.material_name;
    tdGRNNo.innerText = dataOb.grn_id.grn_no;
    tdSupplierName.innerText = dataOb.grn_id.supplier_id.supplier_name;
    tdTotalQty.innerText = dataOb.total_qty;
    tdUsableQty.innerText = dataOb.usable_qty;
    tdNotUsableQty.innerText = dataOb.not_usable_qty;


    $("#modalStockView").modal("show")

    refreshStockTable();
    refreshForm();


}

const printMaterialStockRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-user</title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
        "<body>" + tableRawStockView.outerHTML + "</body>";


    newWindow.document.write(printView);



    //Print window
    setTimeout(() => {

        newWindow.stop();
        newWindow.print();
        newWindow.close();

    }, 500)


    $("#modalStockView").modal("hide");


}













//form delete event function 
const buttonStockDelete = () => {
    refreshStockTable();
    refreshForm();


}














