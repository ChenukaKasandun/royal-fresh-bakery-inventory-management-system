
//refresh production table
window.addEventListener('load', () => {

    refreshItemPriceTable();
    refreshForm();





})



const returningStatusValidator = () => {

    if (returningRadio.checked) {

        itemPrice.item_return_status_id = { id: 1, status: "Returns Accepted" };

    }

    if (notReturningRadio.checked) {

        itemPrice.item_return_status_id = { id: 2, status: "Returns  Not Accepted" };

    }


}





const generateSellingPrice = () => {

    let totalProductionCost = txtTotalProductionCost.value;
    let profitRatio = txtProfitRatio.value;

    let sellingPrice = (parseFloat(totalProductionCost) * parseFloat(profitRatio) / 100) + parseFloat(totalProductionCost);


    txtSellingPrice.value = sellingPrice;
    itemPrice.selling_price = txtSellingPrice.value;
    txtSellingPrice.classList.add("is-valid");


}





//JavaScript to toggle collapse  --->Returning status collapse
const returningRadio = document.getElementById('returningRadio');
const notReturningRadio = document.getElementById('notReturningRadio');
const collapseTarget = document.getElementById('returnDetails');
const bsCollapse = new bootstrap.Collapse(collapseTarget, { toggle: false });

returningRadio.addEventListener('change', () => {
    if (returningRadio.checked) {
        bsCollapse.show();
    }
});

notReturningRadio.addEventListener('change', () => {
    if (notReturningRadio.checked) {
        bsCollapse.hide();
    }
});






//Validation Of Dynamic dropdown  
const dynamicElementValidator = (element, object, property) => {

    const dynamicElement = element.value;

    itemPrice[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");


}






const refreshForm = () => {

    itemPrice = new Object();

    selectItem.value = "";
    txtRawMaterialCost.value = "";
    txtTotalProductionCost.value = "";
    txtProfitRatio.value = "";
    txtSellingPrice.value = "";
    txtReturningPrice.value = "";
    textNote.value = "";


    notReturningRadio.checked = false;
    returningRadio.checked = false;



    selectItem.classList.remove("is-invalid");
    selectItem.classList.remove("is-valid");

    txtRawMaterialCost.classList.remove("is-invalid");
    txtRawMaterialCost.classList.remove("is-valid");

    txtTotalProductionCost.classList.remove("is-invalid");
    txtTotalProductionCost.classList.remove("is-valid");

    txtProfitRatio.classList.remove("is-invalid");
    txtProfitRatio.classList.remove("is-valid");

    txtSellingPrice.classList.remove("is-invalid");
    txtSellingPrice.classList.remove("is-valid");

    returningRadio.classList.remove("is-invalid");
    returningRadio.classList.remove("is-valid");

    textNote.classList.remove("is-invalid");
    textNote.classList.remove("is-valid");





    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let itemName = getServiceRequest("/item/alldata");

    //Filling data into dropdowns
    fillDataIntoSelect(selectItem, "Please select Item..!", itemName, "item_name");



    let selectItemName = document.querySelector("#selectItem");

    selectItemName.addEventListener("change", () => {

        let itemName = JSON.parse(selectItemName.value);

        let rawmaterialCost = getServiceRequest("/itemprice/getrawmaterialcost?itemName=" + itemName.item_name);

        txtRawMaterialCost.value = rawmaterialCost;

        //Binding the value of materialCost to the dataOb
        itemPrice.materialCost = txtRawMaterialCost.value;


        txtRawMaterialCost.classList.add("is-valid");
    })


    //Update button getsdissapeared when refreshForm
    buttonSubmit.style.display = "block";
    buttonUpdate.style.display = "none";




}



const refreshItemPriceTable = () => {

    //string => string/date/number
    //function => object/array/boolean
    let propertyList = [{ propertyName: getItemName, dataType: "function" },
    { propertyName: "total_production_cost", dataType: "decimal" },
    { propertyName: "profit_ratio", dataType: "decimal" },
    { propertyName: "selling_price", dataType: "decimal" },
    { propertyName: getReturnedPrice, dataType: "function" }
    ];



    let itemPrice = getServiceRequest("/itemprice/alldata");

    //calling function to fill data into the table
    fillDataIntoTable1(itemPriceTableBody, itemPrice, propertyList, buttonItemPriceRefill, buttonProductionDelete, buttonProductionView, true);


    $('#itemPriceTable').DataTable();


}


const getItemName = (dataOb) => {
    return dataOb.item_id.item_name;
}

const getReturnedPrice = (dataOb) => {
    if (dataOb.returned_price == null) {
        return "-";

    } else {
        return parseFloat(dataOb.returned_price).toFixed(2);

    }

}




const checkFormError = () => {


    //need to check all required properties

    let errors = "";

    if (itemPrice.item_id == null) {
        errors = errors + "Please Select an Item.....!\n";

    }

    if (itemPrice.materialCost == null) {
        errors = errors + "Please Enter Raw  Material Cost.....!\n";

    }


    if (itemPrice.total_production_cost == null) {
        errors = errors + "Please Enter Total Production Cost....!\n";

    }

    if (itemPrice.profit_ratio == null) {
        errors = errors + "Please Enter Profit Ratio.....!\n";

    }

    if (itemPrice.selling_price == null) {
        errors = errors + "Please Enter Selling Price.....!\n";

    }


    if (itemPrice.item_return_status_id == null) {
        errors = errors + "Please Select Return Status.....!\n";

    }


    if (returningRadio.checked) {

        if (itemPrice.returned_price == null) {
            errors = errors + "Please Enter Returned Price.....!\n";

        }

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


            "\n Item Name :" + itemPrice.item_id.item_name +
            "\n Material Cost :" + itemPrice.materialCost +
            "\n Total Production Cost :" + itemPrice.total_production_cost +
            "\n Profit Ratio :" + itemPrice.profit_ratio +
            "\n Sellling Price :" + itemPrice.selling_price +
            "\n Returning Status :" + itemPrice.item_return_status_id.status;


        if (returningRadio.checked) {
            userConfirmMsg1 +=
                "\n Returning  Price:" + itemPrice.returned_price;

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
                    let postResponce = getHTTPServiceRequest("/itemprice/insert", "POST", itemPrice);
                    if (postResponce == "OK") {
                        swal("Saved Successfully ....!");


                        refreshItemPriceTable();
                        refreshForm();

                        $("#itemPriceForm").modal("hide");



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


const buttonItemPriceRefill = (dataOb, index) => {


    //Creating two objects for comparison --> Update Item
    itemPrice = JSON.parse(JSON.stringify(dataOb));
    oldItemPrice = JSON.parse(JSON.stringify(dataOb));

    //Refilling data From database to the form atrributes

    selectItem.value = JSON.stringify(dataOb.item_id);
    txtRawMaterialCost.value = dataOb.item_id.production_cost;
    txtTotalProductionCost.value = dataOb.total_production_cost;
    txtProfitRatio.value = dataOb.profit_ratio;
    txtSellingPrice.value = dataOb.selling_price;
    txtRawMaterialCost.value = dataOb.item_id.raw_material_cost;

    if (dataOb.item_return_status_id.status == "Returns Accepted") {
        returningRadio.checked = true;

        txtReturningPrice.value = dataOb.returned_price;

    }

    if (dataOb.item_return_status_id.status == "Returns  Not Accepted") {

        notReturningRadio.checked = true;
    }

    //Assigning values ffrom dataOb to front end  object in order to avoid mismatch

    itemPrice.item_id = dataOb.item_id.item_name;
    itemPrice.materialCost = dataOb.item_id.raw_material_cost;


    oldItemPrice.item_id = dataOb.item_id.item_name;
    oldItemPrice.materialCost = dataOb.item_id.raw_material_cost;


    //Submit button get dissapeared when Edit Function executed
    buttonUpdate.style.display = "block";
    buttonSubmit.style.display = "none";


    $("#itemPriceForm").modal("show");
    refreshItemPriceTable();
}




const checkFormUpdate = () => {

    let updates = "";

    if (itemPrice != null && oldItemPrice != null) {

        if (itemPrice.item_id != oldItemPrice.item_id) {
            updates = updates + "Item Name Has Changed..!\n";

        }

        if (itemPrice.materialCost != oldItemPrice.materialCost) {
            updates = updates + "Material Cost Has Changed..!\n";

        }

        if (itemPrice.total_production_cost != oldItemPrice.total_production_cost) {
            updates = updates + "Production  Costs Has Changed..!\n";

        }

        if (itemPrice.profit_ratio != oldItemPrice.profit_ratio) {
            updates = updates + "Profit Ratio Has Changed..!\n";

        }

        if (itemPrice.selling_price != oldItemPrice.selling_price) {
            updates = updates + "Selling Price Has Changed..!\n";

        }

        if (itemPrice.item_return_status_id.status != oldItemPrice.item_return_status_id.status) {
            updates = updates + "Return Status Has Changed..!\n";

        }

        if (returningRadio.checked) {

            if (itemPrice.returned_price != oldItemPrice.returned_price) {
                updates = updates + "Returning Price Has Changed..!\n";

            }

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

                            $("#itemForm").modal("hide");



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


//function define for delete Item Pricce  record
const buttonProductionDelete = (dataOb, index) => {

    console.log("Delete", dataOb, index);


    //need to get user confirmation
    let userConfirmMsg =

        "\n Item Name:" + dataOb.item_id.item_name +
        "\n TotalProduction Cost :" + parseFloat(dataOb.total_production_cost).toFixed(2) +
        "\n Selling Price:" + parseFloat(dataOb.selling_price).toFixed(2);

    if (dataOb.returned_price != null) {
        userConfirmMsg +=

            "\n Returning Price:" + parseFloat(dataOb.returned_price).toFixed(2);
    }

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
                    $("#itemPriceForm").modal(hide)


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

    tdItemName.innerText = dataOb.item_id.item_name;
    tdTotalProductionCost.innerText = dataOb.total_production_cost;
    tdSelllingPrice.innerText = dataOb.selling_price;
    tdReturningPrice.innerText = dataOb.tdReturningPrice;



    $("#modalItemPriceView").modal("show");
}



//Print button at the modal
const printItemPriceRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-production</title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
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

