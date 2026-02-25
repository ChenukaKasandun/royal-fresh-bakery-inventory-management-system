

//Identifying elements in supplier form

const selectAllItemElement = document.querySelector("#selectAllItem");
const selectSelectedItemElement = document.querySelector(" #selectSelectedItem");
const selectSupplierStatusElement = document.querySelector("#selectSupplierStatus");
const txtSupplierAddressElement = document.querySelector("#txtSupplierAddress");
const txtContactNoElement = document.querySelector("#txtContactNo");
const txtEmailElement = document.querySelector("#txtEmail");
const txtAccountNoElement = document.querySelector("#txtAccountNo");
const txtHolderNameElement = document.querySelector("#txtHolderName");
const selectBankElement = document.querySelector("#selectBank");
const selectBranchElement = document.querySelector("#selectBranch");
const selectDeliveryStatusElement = document.querySelector("#selectDeliveryStatus");

//Onload event
window.addEventListener('load', () => {


    refreshForm();
    refreshSupplierTable();
    //unable tooltip
    $('[data-bs-toggle="tooltip" ]').tooltip();

})


//Validation Of Dynamic dropdown  
const dynamicElementValidator = (element, object, property) => {

    const dynamicElement = element.value;

    supplier[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");


}

const refreshForm = () => {

    //Cleaning supplier form attribute fields
    supplierForm.reset();

    //Removing Validation using a common function
    setDefault([
        selectAllItem,
        selectSelectedItem,
        selectSupplierStatus,
        txtSupplierAddress,
        txtContactNo,
        txtEmail,
        txtAccountNo,
        txtHolderName,
        selectBank,
        selectBranch,
        selectDeliveryStatus]);


    //For data binding at front end
    supplier = new Object();

    //To load items from association table "supplier_has_items"
    supplier.rawMaterials = new Array();

    allMaterials = getServiceRequest("/rawmaterial/list");
    console.log(allMaterials);
    fillDataIntoSelect(selectAllItemElement,"",allMaterials,"material_name");
    fillDataIntoSelect(selectSelectedItemElement,"",supplier.rawMaterials,"material_name");


     supplierStatus = getServiceRequest("/supplierstatus/alldataexceptdelete");
    //Filling supplier status dropdown
    fillDataIntoSelect(selectSupplierStatusElement, "Please select Supplier Status..!", supplierStatus, "status");



    // let supplierMaterial = getServiceRequest("rawmaterial/alldata");
    // //Filling supplier status dropdown
    // fillDataIntoSelect(selectSupplierMaterial, "Please select Supplier Material..!", supplierMaterial, "material_name");
    //


     supplierBank = getServiceRequest("bank/alldata");
    //Filling supplier status dropdown
    fillDataIntoSelect(selectBankElement, "Please select Supplier Bank..!", supplierBank, "name");



     supplierBranch = getServiceRequest("branch/alldata");
    //Filling supplier status dropdown
    fillDataIntoSelect(selectBranchElement, "Please select Supplier Branch..!", supplierBranch, "name");

     deliveryStatus = getServiceRequest("/supplierdeliverymethod/alldata");
    //Filling supplier status dropdown
    fillDataIntoSelect(selectDeliveryStatusElement, "Please select Delivery Status..!", deliveryStatus, "name");

    //Update button getsdissapeared when edit function executed
    buttonSubmit.style.display = "block";
    buttonUpdate.style.display = "none";



}

//..........Item Selector............................
//Single select
const addSingleItem = () =>{
    if (selectAllItemElement.value != ""){
        console.log(selectAllItemElement.value);
      let selectedItem = JSON.parse(selectAllItemElement.value);

        //Add into selected side
        supplier.rawMaterials.push(selectedItem);
        fillDataIntoSelect(selectSelectedItemElement,"", supplier.rawMaterials,"material_name");

        //Remove from all side
        let extIndex = allMaterials.map(itm=>itm.id).indexOf(selectedItem.id);
        if (extIndex > -1){
            allMaterials.splice(extIndex,1);
            fillDataIntoSelect(selectAllItemElement,"",allMaterials,"material_name");
        }
    }else{
       swal("Please select a Raw Material..!");
    }

}

//Multiple Select
const addMultipleItem = () =>{

  //Filling selected item field
    allMaterials.forEach(mtrl =>{
        supplier.rawMaterials.push(mtrl);
   })
    fillDataIntoSelect(selectSelectedItemElement,"", supplier.rawMaterials,"material_name");

   //Empting the select itemfield
    allMaterials = [];
    fillDataIntoSelect(selectAllItemElement,"",allMaterials,"material_name");

}

//Single Remove
const removeSingleItem = () =>{

    if (selectSelectedItemElement.value != ""){
        console.log(selectSelectedItemElement.value);

        let selectedItem = JSON.parse(selectSelectedItemElement.value);

        //Add into "select item" side
        allMaterials.push(selectedItem);
        fillDataIntoSelect(selectAllItemElement,"",allMaterials,"material_name");

        //Remove from "selected items" side
        let extIndex = supplier.rawMaterials.map(mtrl=>mtrl.id).indexOf(selectedItem.id);
        if (extIndex > -1){
            supplier.rawMaterials.splice(extIndex,1);
            fillDataIntoSelect(selectSelectedItemElement,"",supplier.rawMaterials,"material_name");
        }
    }else{
        swal("Please select a Raw Material..!");
    }
}


//Removing all items
const removeMultipleItem = () =>{

    //Filling select All item field
    supplier.rawMaterials.forEach(mtrl =>{
        allMaterials.push(mtrl);
    })
    fillDataIntoSelect(selectAllItemElement,"",allMaterials,"material_name");


    //Removing all items from "Selected items"
    supplier.rawMaterials = [];
    fillDataIntoSelect(selectSelectedItemElement,"",supplier.rawMaterials,"material_name");


}


//Supplier Table
const refreshSupplierTable = () => {

    //string => string/sate/number
    //function => object/array/boolean
    let propertyList = [{ propertyName: "supplier_name", dataType: "string" },
    { propertyName: getMaterial, dataType: "function" },
    { propertyName: "supplier_address", dataType: "string" },
    { propertyName: "supplier_contact", dataType: "string" },
    { propertyName: "supplier_email", dataType: "string" },
        { propertyName: getSupplierStatus, dataType: "function" },
    ];



    //Defining table 
    let suppliers = getServiceRequest("/supplier/alldata");


    // Calling common function to fill data into table
    fillDataIntoTable1(tableSupplyBody, suppliers, propertyList, buttonSupplyRefill, buttonSupplyDelete, buttonSupplierView, true);

    $('#supplyTable').DataTable();


}
//Functions to get properties for table
const getSupplierStatus = (dataOb) => {

    if (dataOb.supplier_registration_status_id.status == "Deleted"){
        return `<P style='background-color:red'>${dataOb.supplier_registration_status_id.status}</P>`;

    }else{
        return dataOb.supplier_registration_status_id.status;
    }



}

const getMaterial = (dataOb) => {
    return dataOb.material_id.material_name;
}

//Check Form Error
const checkFormError = () => {


    let errors = "";

    if (supplier.supplier_name == null) {
        errors = errors + "Please add a valid supplier name..!\n";

    }

    if (supplier.supplier_registration_status_id == null) {
        errors = errors + "Please add a valid supplier status..!\n";

    }

    if (supplier.supplier_address == null) {
        errors = errors + "Please add a valid supplier address..!\n";

    }

    if (supplier.supplier_contact == null) {
        errors = errors + "Please add a valid supplier contact..!\n";

    }

    if (supplier.supplier_email == null) {
        errors = errors + "Please add a valid supplier email..!\n";
    }

    if (supplier.account_no == null) {
        errors = errors + "Please add a valid supplier account no..!\n";
    }

    if (supplier.holder_name == null) {
        errors = errors + "Please add a valid supplier holder name..!\n";
    }

    if (supplier.bank_id == null) {
        errors = errors + "Please add a valid supplier account bank..!\n";
    }

    if (supplier.branch_id == null) {
        errors = errors + "Please add a valid supplier account branch..!\n";
    }

    if (supplier.supplier_delivery_method_id == null) {
        errors = errors + "Please add Delivery Status..!\n";
    }

    return errors;
}



//form submit event function 
const buttonSupplySubmit = () => {

    //Check form error for required element
    let errors = checkFormError();
    console.log(supplier);

    if (errors == "") {

        let userConfirmMsg1 =

            "\n Supplier Name :" + supplier.supplier_name +
            "\n Supplier Status :" + supplier.supplier_registration_status_id.status +
            "\n Supplier  Address:" + supplier.supplier_address +
            "\n Supplier contact:" + supplier.supplier_contact +
            "\n Supplier Email:" + supplier.supplier_email +
            "\n Supplier Account No:" + supplier.account_no +
            "\n Supplier holder name:" + supplier.holder_name +
            "\n Supplier Account Bank:" + supplier.bank_id.name +
            "\n Supplier Account Branch:" + supplier.branch_id.name +
            "\n Delivery Status:" + supplier.supplier_delivery_method_id.name;



        swal({
            title: "Are you sure to Submit Following Details..?",
            text: userConfirmMsg1,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((userResponce) => {

            if (userResponce) {
                //call post service
                let postResponce = getHTTPServiceRequest("/supplier/insert", "POST", supplier);
                if (postResponce == "OK") {
                    swal("Saved Successfully ....!");


                    refreshForm();
                    refreshSupplierTable();
                    $("#supplierForm").modal("hide");



                } else {
                    swal("Failed to submit..! \n" + postResponce);

                }


            }





        })
    } else {

        swal("Form has following errors...\n" + errors);


    }


    refreshSupplierTable();


}




//form Update event function 
const buttonSupplyRefill = (dataOb, index) => {

    //To get comparison between new and old supplier data
    supplier = JSON.parse(JSON.stringify(dataOb));
    oldSupplier = JSON.parse(JSON.stringify(dataOb));

    //Refilling values from  backend
    selectSupplierMaterial.value = JSON.stringify(dataOb.material_id);
    txtSupplierName.value = dataOb.supplier_name;
    selectSupplierStatus.value = JSON.stringify(dataOb.supplier_registration_status_id);
    txtSupplierAddress.value = dataOb.supplier_address;
    txtContactNo.value = dataOb.supplier_contact;
    txtEmail.value = dataOb.supplier_email;
    txtAccountNo.value = dataOb.account_no;
    txtHolderName.value = dataOb.holder_name;
    selectBank.value = JSON.stringify(dataOb.bank_id);
    selectBranch.value = JSON.stringify(dataOb.branch_id);
    selectDeliveryStatus.value = JSON.stringify(dataOb.supplier_delivery_method_id);


    ///Assigning database values to the frontend data object to avoid mismatches
    supplier.material_id = dataOb.material_id.material_name;
    oldSupplier.material_id = dataOb.material_id.material_name;

    supplier.supplier_registration_status_id = dataOb.supplier_registration_status_id.status;
    oldSupplier.supplier_registration_status_id = dataOb.supplier_registration_status_id.status;

    supplier.supplier_delivery_method_id = dataOb.supplier_delivery_method_id.name;
    oldSupplier.supplier_delivery_method_id = dataOb.supplier_delivery_method_id.name;




    //Submit button getsdissapeared when edit function executed
    buttonUpdate.style.display = "block";
    buttonSubmit.style.display = "none";



    $("#supplierForm").modal("show");

    //Submit button getsdissapeared when edit function executed
    buttonUpdate.style.display = "block";
    buttonSubmit.style.display = "none";

}



const checkFormUpdate = () => {


    let updates = "";


    if (supplier != null && oldSupplier != null) {

        if (supplier.supplier_name != oldSupplier.supplier_name) {
            updates = updates + "Supplier Name has changed..!\n";
        }

        if (supplier.material_id.material_name != oldSupplier.material_id.material_name) {
            updates = updates + "Material has changed..!\n";
        }

        if (supplier.supplier_registration_status_id.status != oldSupplier.supplier_registration_status_id.status) {
            updates = updates + "Supplier status has changed..!\n";
        }

        if (supplier.supplier_address != oldSupplier.supplier_address) {
            updates = updates + " Supplier Address has changed..!\n";
        }

        if (supplier.supplier_contact != oldSupplier.supplier_contact) {
            updates = updates + "Supplier Contact has changed..!\n";
        }

        if (supplier.supplier_email != oldSupplier.supplier_email) {
            updates = updates + "Supplier Email has changed..!\n";
        }

        if (supplier.account_no != oldSupplier.account_no) {
            updates = updates + "Supplier Account No has changed..!\n";
        }

        if (supplier.holder_name != oldSupplier.holder_name) {
            updates = updates + "Supplier Holder Name has changed..!\n";
        }

        if (supplier.bank_id.name != oldSupplier.bank_id.name) {
            updates = updates + "Supplier Bank has changed..!\n";
        }

        if (supplier.branch_id.name != oldSupplier.branch_id.name) {
            updates = updates + "Supplier Branch has changed..!\n";
        }

        if (supplier.supplier_delivery_method_id.name != oldSupplier.supplier_delivery_method_id.name) {
            updates = updates + "Delivery Status has changed..!\n";
        }



    }


    return updates;

}

//form Update event function 
const buttonSupplierUpdate = () => {

    //need to check form errors
    let errors = checkFormError();


    if (errors == "") {

        let updates = checkFormUpdate();
        if (updates == "") {
            swal("Nothing to update..!");

        } else {
            let userConfirmMsg = "Are you sure to update Supplier...?";

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
                        let putResponce = getHTTPServiceRequest("supplier/update", "PUT", supplier);
                        if (putResponce == "OK") {
                            swal("Updated Successfully ....!");


                            refreshForm();
                            refreshSupplierTable();
                            $("#supplierForm").modal("hide");



                        } else {
                            swal("Failed to Update..! \n" + putResponce);

                        }


                    }





                });
        }

    } else {
        swal("Form has following error..\n" + errors)

    }

    refreshSupplierTable();

}




//form delete event function 
const buttonSupplyDelete = (dataOb, index) => {

    //need to get user confirmation


    let userConfirmMsg =
        "\n Supplier Name :" + dataOb.supplier_name +
        "\n Material :" + dataOb.material_id.material_name +
        "\n Supplier Registration Status :" + dataOb.supplier_registration_status_id.status +
        "\n Supplier Address :" + dataOb.supplier_address +
        "\n Supplier Contact :" + dataOb.supplier_contact +
        "\n Supplier email:" + dataOb.supplier_email;



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


                let deleteResponce = getHTTPServiceRequest("/supplier/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });


                    refreshForm();
                    refreshSupplierTable();


                } else {
                    swal("Delete Not Sccessfull...!", {
                        icon: "error", text: deleteResponce
                    });

                }

            }



        });


    refreshSupplierTable();



}

//form View event function 
const buttonSupplierView = (dataOb, index) => {
    console.log("View", dataOb, index);



    tdSupplierName.innerText = dataOb.supplier_name;
    tdMaterial.innerText = dataOb.material_id.material_name;
    tdSupplierStatus.innerText = dataOb.supplier_registration_status_id.status;
    tdSupplierAddress.innerText = dataOb.supplier_address;
    tdSupplierContact.innerText = dataOb.supplier_contact;
    tdEmail.innerText = dataOb.supplier_email;



    $("#modalSupplierView").modal("show");


}


const printSupplerRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-Supplier details </title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
        "<body>" + tableSupplierView.outerHTML + "</body>";


    newWindow.document.write(printView);



    //Print window
    setTimeout(() => {

        newWindow.stop();
        newWindow.print();
        newWindow.close();

    }, 500)


    $("#modalSupplierView").modal("hide");


}











