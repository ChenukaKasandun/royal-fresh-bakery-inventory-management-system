
//load event
window.addEventListener('load', () => {

    refreshForm();
    refreshItemTable();


})


//Refreshing Form
const refreshForm = () => {

    //Reset Item Form
    itemForm.reset();

    //Defining new item object to data binding at front end
    item = new Object();

    //Removing Validation Colours using a common function declared in common.js
    setDefault([txtItemName, selectItemCategoryType, selectItemStatus,selectItemReturningState]);

    //Creating a new array to push data from the inner form to the inner table and main form(association link)
    item.itemHasMaterialList = new Array();


    //Item Category
    let itemCategory = getServiceRequest("/itemcategory/alldata");

    //Calling function to fill data into select
    fillDataIntoSelect(selectItemCategoryType, "Please select Item Category ", itemCategory, "name");


    //Item Status
    let itemStatus = getServiceRequest("/itemstatus/notdeletestatusalldata");

    //Calling Function to fill data into select
    fillDataIntoSelect(selectItemStatus, "Please Select Item Status ", itemStatus, "status");


    //Item Status
    let itemReturningState = getServiceRequest("/itemreturnstatus/alldata");

    //Calling Function to fill data into select
    fillDataIntoSelect(selectItemReturningState, "Please Select Item Returning Status ", itemReturningState, "status");


    //Update button getsdissapeared when refreshForm function executed
    buttonSubmit.style.display = "block";
    buttonUpdate.style.display = "none";

    // Inner Form and inner Table
    refreshInnerFormAndInnerTable();


}



//dynamic element validator
const dyanamicElementValidator = (element, object, property) => {

    //creating a dynamic element variable to pic the element value
    const dynamicElement = element.value;

    //assigning the value to the property  of the data object
    item[property] = JSON.parse(dynamicElement);

    //Adding validation
    element.classList.add("is-valid");

}



//check errors in the form
const checkFormError = () => {

    //need to check all required properties

    let errors = "";

    if (item.item_name == null) {
        errors = errors + "Please Enter a valid Item Name!\n";
    }

    if (item.item_status_id == null) {
        errors = errors + "Please Enter a Item Status..!\n";
    }

    if (item.item_return_status_id == null) {
        errors = errors + "Please Enter a Item Returning Status..!\n";
    }


    if (item.item_category_id == null) {
        errors = errors + "Please Enter a Item Category.!\n";
    }

    return errors;

}


//form submit event function
const buttonItemSubmit = () => {

    //Check form error for required element
    let errors = checkFormError();
    console.log(item);

    if (errors == "") {

        let userConfirmMsg1 =


            "\n Item Category :" + item.item_category_id.name+
            "\n Item Name :" + item.item_name +
            "\n Item Status :" + item.item_status_id.status +
            "\n Item Category :" + item.item_return_status_id.status;


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
                    let postResponce = getHTTPServiceRequest("/item/insert", "POST", item);
                    if (postResponce == "OK") {
                        swal("Saved Successfully ....!");

                        refreshForm();
                        refreshItemTable();

                        $("#modalItemForm").modal("hide");

                    } else {
                        swal("Failed to submit..! \n" + postResponce);

                    }

                }

            });


    } else {

        swal("Form has following errors...\n" + errors);

    }

}

//form Update event function
const checkFormUpdate = () => {

    let updates = "";

    if (item != null && oldItem != null) {

        if (item.item_name != oldItem.item_name) {

            updates = updates + "Item Name  has changed..!\n";

        }

        if (item.item_status_id.status != oldItem.item_status_id.status) {

            updates = updates + "Item Status has changed..!\n";

        }

        if (item.item_return_status_id.status != oldItem.item_return_status_id.status) {

            updates = updates + "Item Returning Status has changed..!\n";

        }


        if (item.item_category_id.name != oldItem.item_category_id.name) {

            updates = updates + "Item Category has changed..!\n";

        }

        return updates;

    }
}


//Update button
const buttonItemUpdate = () => {

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
                    let putResponce = getHTTPServiceRequest("/item/update", "PUT", item);
                    if (putResponce == "OK") {
                        swal("Updated Successfully ....!");

                        refreshForm();
                        refreshItemTable();
                        $("#modalItemForm").modal("hide");

                    } else {
                        swal("Failed to Update..! \n" + putResponce);

                    }

                }

            });

    }

}



//Refresh Table
const refreshItemTable = () => {

    console.log("-----------------------");


    //string => string/sate/number
    //function => object/array/boolean
    //Decimal => price
    let propertyList = [
        { propertyName: "item_code", dataType: "string" },
        { propertyName: getItemCategory, dataType: "function" },
        { propertyName: "item_name", dataType: "string" },
        { propertyName: getItemStatus, dataType: "function" },
        { propertyName: getItemReturningStatus, dataType: "function" },

    ];


    //Defining table
    let items = getServiceRequest("/item/alldata");

    //Calling common function to fill data into table
    fillDataIntoTable1(itemTableBody, items, propertyList, ItemFormRefill, buttonItemDelete, buttonItemView, true);


    $('#itemTable').DataTable();

}


//Get Item Status
const getItemStatus = (dataOb) => {
    if (dataOb?.item_status_id?.status == "Deleted") {
        return `<P style='background-color:red'>${dataOb.item_status_id.status}</P>`;

    } else {
        return dataOb?.item_status_id?.status;
    }
}
const getItemReturningStatus =(dataOb) =>{
    return dataOb?.item_return_status_id?.status;
}


//Get Item Category
const getItemCategory = (dataOb) => {
    return dataOb?.item_category_id?.name;
}


//form delete event function
const ItemFormRefill = (dataOb, index) => {

    console.log(dataOb);

    if (dataOb?.item_status_id?.name != "Deleted"){
        //Creating two objects for comparison --> Update Item
        item = JSON.parse(JSON.stringify(dataOb));
        oldItem = JSON.parse(JSON.stringify(dataOb));

        txtItemName.value = dataOb.item_name;
        selectItemCategoryType.value = JSON.stringify(dataOb?.item_category_id);
        selectItemStatus.value = JSON.stringify(dataOb?.item_status_id);
        selectItemReturningState.value = JSON.stringify(dataOb?.item_return_status_id);

        //Submit button get dissapeared when Edit Function executed
        buttonUpdate.style.display = "block";
        buttonSubmit.style.display = "none";


        $("#modalItemForm").modal("show");

    }


}



//form delete event function
const buttonItemDelete = (dataOb, index) => {

    console.log("Delete", dataOb, index);

    //need to get user confirmation
    let userConfirmMsg =

        "\n Item Code:" + dataOb.item_code +
        "\n Item Category:" + dataOb?.item_category_id?.name+
        "\n Item Name :" + dataOb.item_name +
        "\n Item Status:" + dataOb?.item_status_id?.status+
        "\n Item Category:" + dataOb?.iitem_return_status_id?.status;



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


                let deleteResponce = getHTTPServiceRequest("/item/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });

                    refreshItemTable();
                    refreshForm();


                } else {
                    swal("Delete Not Sccessfull...!", {
                        icon: "error", text: deleteResponce
                    });

                }
            }

        });

}



//Table View  function
const buttonItemView = (dataOb, index) => {

    console.log("View", dataOb, index);

    tdItemCode.innerText = dataOb.item_code;
    tdItemName.innerText = dataOb.item_name;
    tdItemCategory.innerText = dataOb?.item_category_id?.name;
    tdItemStatus.innerText = dataOb?.item_status_id?.status;
    tdItemReturningStatus.innerText = dataOb?.item_return_status_id?.status;


    $("#modalItemView").modal("show");

    refreshItemTable();

}


//inner row in view
const printItemRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-item</title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
        "<body>" + tableItemView.outerHTML + "</body>";


    newWindow.document.write(printView);


    //Print window
    setTimeout(() => {

        newWindow.stop();
        newWindow.print();
        newWindow.close();

    }, 500)


    $("#modalItemView").modal("hide");

}



// .......................Inner Form  and Inner Table.............................

const refreshInnerFormAndInnerTable = () =>{

    //Inner Form..

    //Cleaning the attributes of inner form
    materialInnerForm.reset();

    //Removing Validation Colours using a common function declared in common.js
    setDefault([selectMaterialName,txtQty]);

    //Creating an object for data binding
    itemHasMaterial = new Object();

    //Filling inner Drop down
    let material = getServiceRequest("/rawmaterial/alldata");
    //Calling function to fill data into select
    fillDataIntoSelect(selectMaterialName, "Please select Material ", material, "material_name");


    // Inner Table...
    let innerColumns = [{ propertyName: getMaterialName, dataType: "function" },
        { propertyName: "qty", dataType: "decimal" },
    ];

// Calling common function to fill data into table
    fillDataIntoInnerTable(tableInnerItemBody, item.itemHasMaterialList, innerColumns, buttonMaterialInnerRefill, buttonMaterialInnerDelete, true);

}

// Get Material name for the inner table
const getMaterialName = (dataOb) =>{

    return dataOb?.material_id?.material_name;
}

const checkInnerFormError = () =>{
    //need to check all required properties

    let errors = "";

    if (itemHasMaterial.material_id == null) {
        errors = errors + "Please Select a material...!\n";
    }

    if (itemHasMaterial.qty == null) {
        errors = errors + "Please Enter Quantity...!\n";
    }

    return errors;
}


// Submit inner form data
const buttonInnerFormSubmit = () =>{

    console.log(item);
    console.log(itemHasMaterial);

    //Check form error for required element
    let errors = checkInnerFormError();


    if (errors == "") {

        let userConfirmMsg2 =

            "\n Material Name :" + itemHasMaterial.material_id.material_name +
            "\n No Of Quantity :" +itemHasMaterial.qty;
        swal({
            title: "Are you sure to add following details..?",
            text: userConfirmMsg2,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((userResponce) => {

                if (userResponce) {
                    //call post service
                    let postResponce = "OK";
                    if (postResponce == "OK") {
                        //Pushing inner object to the association table
                        item.itemHasMaterialList.push(itemHasMaterial);

                        swal("Added Successfully ....!");
                        refreshInnerFormAndInnerTable();

                    }

                }


            });


    } else {

        swal(errors);

    }

}


//dynamic element validator for inner form
const dyanamicElementValidator2 = (element, object, property) => {

    //creating a dynamic element variable to pic the element value
    const dynamicElement = element.value;

    //assigning the value to the property  of the data object
    itemHasMaterial[property] = JSON.parse(dynamicElement);

    //Adding validation
    element.classList.add("is-valid");

}

const buttonMaterialInnerRefill = () =>{

}

const buttonMaterialInnerDelete = () =>{

}

