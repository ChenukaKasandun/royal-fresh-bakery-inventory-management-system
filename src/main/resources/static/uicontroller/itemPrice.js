
//refresh production table
window.addEventListener('load', () => {

    refreshItemPriceTable();
    refreshForm();

})


//Validation Of Dynamic dropdown
const dynamicElementValidator = (element, object, property) => {

    const dynamicElement = element.value;

    itemPrice[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");

}


//Refresh form
const refreshForm = () => {

    //Resetting Item Form
    itemPriceForm.reset()

    //Removing Validation Colours using a common function declared in common.js
    setDefault([txtDate,selectItem, txtRawMaterialCost, txtProductionCost, txtTotalProductionCost,txtWholeSaleProfitRatio,
        txtRetailProfitRatio,txtWholeSalePrice,txtRetailPrice,txtReturnPrice,textNote]);

    //Creation of new object for front end data binding
    itemPrice = new Object();

    //Retrieving data from the database using ajax common function defined in the commonFunctions.js
    let itemName = getServiceRequest("/item/alldata");

    //Filling data into dropdowns
    fillDataIntoSelect(selectItem, "Please select Item..!", itemName, "item_name");

    //Update button getsdissapeared when refreshForm
    buttonSubmit.style.display = "block";
    buttonUpdate.style.display = "none";

}

// Generation production Cost
const generateProductionCost = () =>{
    let rawMaterialCost = parseFloat(txtRawMaterialCost.value);

    // Assume that the production cost is equal to the 20% of the raw material cost of an every item
    let productionCost  = (rawMaterialCost * 0.20)

    txtProductionCost.value = productionCost.toFixed(2);
    itemPrice.production_cost = txtProductionCost.value;
    txtProductionCost.classList.add("is-valid");
    generateTotalProductionCost();
}

// Generate Total Production Cost
const generateTotalProductionCost = () =>{

    let rawMaterialCost = parseFloat(txtRawMaterialCost.value);
    let productionCost = parseFloat(txtProductionCost.value);

    let totalProductionCost = (rawMaterialCost + productionCost);

    txtTotalProductionCost.value = totalProductionCost.toFixed(2);
    itemPrice.total_production_cost = txtTotalProductionCost.value;
    txtTotalProductionCost.classList.add("is-valid");
    generateWholeSalePrice();
    generateRetailPrice();
}


// Generate Wholesale price
const generateWholeSalePrice = () =>{

    let totalProductionCost = parseFloat(txtTotalProductionCost.value);
    let wholeSaleProfitRatio = parseFloat(txtWholeSaleProfitRatio.value);

    // Assume that the wholesale Profit Ratio is = 20%
    let wholeSalePrice = totalProductionCost + (totalProductionCost * (wholeSaleProfitRatio/100));

    txtWholeSalePrice.value = wholeSalePrice.toFixed(2);
    itemPrice.whole_sale_price =  txtWholeSalePrice.value;
    txtWholeSalePrice.classList.add("is-valid");
}


// Generate Retail price
const generateRetailPrice = () =>{
    let totalProductionCost = parseFloat(txtTotalProductionCost.value);
    let retailPriceRatio = parseFloat(txtRetailProfitRatio.value);

    // Assume that retail Profit Ratio is 30%
    let retailPrice = totalProductionCost + (totalProductionCost * (retailPriceRatio/100));

    txtRetailPrice.value = retailPrice.toFixed(2);
    itemPrice.retail_price = txtRetailPrice.value;
    txtRetailPrice.classList.add("is-valid");

}



//Refresh Item Price Table
const refreshItemPriceTable = () => {

    //string => string/date/number
    //function => object/array/boolean
    let propertyList = [{ propertyName: "date", dataType: "string" },
        { propertyName: getItemName, dataType: "function" },
        { propertyName: "raw_material_cost", dataType: "decimal" },
        { propertyName: "production_cost", dataType: "decimal" },
        { propertyName: "total_production_cost", dataType: "decimal" },
        { propertyName: getWholeSalePrice, dataType: "function" },
        { propertyName: getRetailPrice, dataType: "function" },
        { propertyName: getReturnedPrice, dataType: "function" },
        { propertyName: getStatus, dataType: "function" }
    ];


    let itemPrice = getServiceRequest("/itemprice/alldata");

    //calling function to fill data into the table
    fillDataIntoTable1(itemPriceTableBody, itemPrice, propertyList,buttonItemPriceRefill, buttonProductionDelete, buttonProductionView, true);

    //Jquery function for table
    $('#itemPriceTable').DataTable();
}


//Getting Item Name
const getItemName = (dataOb) => {
    return dataOb.item_id.item_name;
}



//Getting Status
const getStatus= (dataOb) => {

    if (dataOb?.item_price_status_id?.status == "Deleted") {
        return `<P style='background-color:red'>${dataOb?.item_price_status_id?.status}</P>`;

    } else {
        return "";

    }
}


const getWholeSalePrice = (dataOb) =>{

    return `<p class ="fw-bold" style="background-color : green">${(dataOb?.whole_sale_price)?.toFixed(2)}</p>`;
}

const getRetailPrice = (dataOb) =>{
    return `<p class ="fw-bold" style="background-color : #fd00d7">${(dataOb?.retail_price)?.toFixed(2)}</p>`;
}


const getReturnedPrice= (dataOb) =>{
    return `<p class ="fw-bold" style="background-color : #fda400">${(dataOb?.returned_price)?.toFixed(2)}</p>`;
}

//Checking Form Errors
const checkFormError = () => {

    //need to check all required properties
    let errors = "";

    if (itemPrice.date == null) {
        errors = errors + "Please Select a Date.....!\n";

    }

    if (itemPrice.item_id == null) {
        errors = errors + "Please Select an Item.....!\n";

    }

    if (itemPrice.wholesale_profit_ratio == null) {
        errors = errors + "Please Enter Whole Sale Profit Ratio....!\n";

    }

    if (itemPrice.reatil_profit_ratio == null) {
        errors = errors + "Please Enter Retail Profit Ratio.....!\n";

    }

    if (itemPrice.returned_price == null) {
        errors = errors + "Please Enter the Returning Price.....!\n";

    }

    return errors;
}



//form submit event function
const buttonItemPriceSubmit = () => {

    //Check form error for required element
    let errors = checkFormError();
    console.log(itemPrice);

    if (errors == "") {

        let userConfirmMsg1 =

            "\n Date :" + itemPrice.date +
            "\n Item Name :" + itemPrice.item_id.item_name +
            "\n Whole sale Profit Ratio:" + itemPrice.wholesale_profit_ratio+
            "\n Retail Profit Ratio :" + itemPrice.reatil_profit_ratio +
            "\n Returned Price:" + itemPrice.returned_price;

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
                    let postResponce = getHTTPServiceRequest("/itemprice/insert", "POST", itemPrice);
                    if (postResponce == "OK") {
                        swal("Saved Successfully ....!");
                        console.log(itemPrice);

                        refreshItemPriceTable();
                        refreshForm();

                        $("#modalItemPrice").modal("hide");

                    } else {
                        swal("Failed to submit..! \n" + postResponce);

                    }

                }

            });


    } else {

        swal("Form has following errors...\n\n" + errors);

    }
    refreshItemPriceTable();
}



//Refilling data into fields in the item price form
const buttonItemPriceRefill = (dataOb, index) => {

    if (dataOb?.item_price_status_id?.status != "Deleted" ){
        //Creating two objects for comparison --> Update Item
        itemPrice = JSON.parse(JSON.stringify(dataOb));
        oldItemPrice = JSON.parse(JSON.stringify(dataOb));

        //Refilling data From database to the form attributes
        txtDate.value = dataOb.date;
        selectItem.value = JSON.stringify(dataOb.item_id);
        txtRawMaterialCost.value = dataOb.raw_material_cost;
        txtProductionCost.value = dataOb.production_cost;
        txtTotalProductionCost.value = dataOb.total_production_cost;
        txtWholeSaleProfitRatio.value = dataOb.wholesale_profit_ratio;
        txtWholeSalePrice.value = dataOb.whole_sale_price;
        txtRetailProfitRatio.value = dataOb.reatil_profit_ratio;
        txtRetailPrice.value =dataOb.retail_price;
        txtReturnPrice.value = dataOb.returned_price;

        //Assigning values from dataOb to front end  object in order to avoid mismatch
        itemPrice.item_id = dataOb.item_id;
        oldItemPrice.item_id = dataOb.item_id;


        //Submit button get disappeared when Edit Function executed
        buttonUpdate.style.display = "block";
        buttonSubmit.style.display = "none";

        $("#modalItemPrice").modal("show");
        refreshItemPriceTable();
    }

}



//Checking form Updates
const checkFormUpdate = () => {

    let updates = "";

    if (itemPrice != null && oldItemPrice != null) {

        if (itemPrice.date != oldItemPrice.date) {
            updates = updates + "Date Has Changed..!\n";

        }

        if (itemPrice.item_id != oldItemPrice.item_id) {
            updates = updates + "Item Name Has Changed..!\n";

        }

        if (itemPrice.raw_material_cost != oldItemPrice.raw_material_cost) {
            updates = updates + " Raw Material Cost Has Changed..!\n";

        }

        if (itemPrice.production_cost != oldItemPrice.production_cost) {
            updates = updates + "Production  Cost Has Changed..!\n";

        }
        if (itemPrice.total_production_cost != oldItemPrice.total_production_cost) {
            updates = updates + " Total Production CostsHas Changed..!\n";

        }

        if (itemPrice.wholesale_profit_ratio != oldItemPrice.wholesale_profit_ratio) {
            updates = updates + "Wholesale Profit Ratio Has Changed..!\n";

        }

        if (itemPrice.whole_sale_price != oldItemPrice.whole_sale_price) {
            updates = updates + "Whole Sale Price Has Changed..!\n";

        }

        if (itemPrice.reatil_profit_ratio != oldItemPrice.reatil_profit_ratio) {
            updates = updates + "Retail Profit Ratio Has Changed..!\n";

        }

        if (itemPrice.retail_price != oldItemPrice.retail_price) {
            updates = updates + "Retail Price Has Changed..!\n";

        }

        if (itemPrice.returned_price != oldItemPrice.returned_price) {
            updates = updates + "Return Price Has Changed..!\n";

        }
    }
    return updates;

}


//form update event function
const buttonItemPriceUpdate = () => {

    //need to check form errors
    let errors = checkFormError();

    if (errors == "") {

        let updates = checkFormUpdate();
        if (updates == "") {
            swal("Nothing to update..!");

        } else {
            let userConfirmMsg2 = "Are you sure to update Following...?";

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
                        let putResponce = getHTTPServiceRequest("/itemprice/update", "PUT", itemPrice);
                        if (putResponce == "OK") {
                            swal("Updated Successfully ....!");

                            refreshItemPriceTable();
                            refreshForm();

                            $("#modalItemPrice").modal("hide");

                        } else {
                            swal("Failed to Update..! \n" + putResponce);

                        }
                    }

                });

        }

    } else {
        swal("Form has following error..\n" + errors)

    }

}


//function define for delete Item Price  record
const buttonProductionDelete = (dataOb, index) => {

    console.log("Delete", dataOb, index);

    //need to get user confirmation
    let userConfirmMsg =

        "\n Item Name :" + dataOb.item_id.item_name +
        "\n Raw material Cost :" + parseFloat(dataOb.raw_material_cost).toFixed(2)+
        "\n Production Cost :" + parseFloat(dataOb.production_cost).toFixed(2)+
        "\n Total Production Cost :" + parseFloat(dataOb.total_production_cost).toFixed(2)+
        "\n Wholesale Price :" + parseFloat(dataOb.whole_sale_price).toFixed(2)+
        "\n Retail Price :" + parseFloat(dataOb.retail_price).toFixed(2) +
        "\n Return Price :" + parseFloat(dataOb.returned_price).toFixed(2);


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

                let deleteResponce = getHTTPServiceRequest("/itemprice/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });
                    refreshItemPriceTable();
                    refreshForm();
                    $("#modalItemPrice").modal(hide)


                } else {
                    swal("Delete Not Sccessfull...!", {
                        icon: "error", text: deleteResponce
                    });

                }

            }

        });

}



//form view event function 
const buttonProductionView = (dataOb, index) => {

    tdDate.innerText = dataOb.date;
    tdItemName.innerText = dataOb.item_id.item_name;
    tdRawMaterialCost.innerText = parseFloat(dataOb.raw_material_cost).toFixed(2);
    tdProductionCost.innerText = parseFloat(dataOb.production_cost).toFixed(2);
    tdTotalProductionCost.innerText = parseFloat(dataOb.total_production_cost).toFixed(2);
    tdWholeSalePrice.innerText = parseFloat(dataOb.whole_sale_price).toFixed(2);
    tdRetailPrice.innerText = parseFloat(dataOb.retail_price).toFixed(2);
    tdReturnPrice.innerText = parseFloat(dataOb.returned_price).toFixed(2);

    $("#modalItemPriceView").modal("show");
}



//Print button at the modal
const printItemPriceRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-Item Price</title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
        "<body>" + tableItemPriceView.outerHTML + "</body>";

    newWindow.document.write(printView);

    //Print window
    setTimeout(() => {

        newWindow.stop();
        newWindow.print();
        newWindow.close();

    }, 500)


    $("#modalItemPriceView").modal("hide");


}

