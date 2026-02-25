
//refresh production table
window.addEventListener('load', () => {

    refreshProductionTable();
    refreshForm();

})



//Validation Of Dynamic dropdown  
const dynamicElementValidator = (element, object, property) => {

    const dynamicElement = element.value;

    production[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");


}






const refreshForm = () => {

    production = new Object();

    //Clean inner HTML of attributes
    selectProductionOrderNo.value = "";
    dateProductionDate.value = "";
    selectItemName.value = "";
    txtQuantity.value = "";
    selectProductionSession.value = "";
    textNote.value = "";


    //Remove validation
    selectProductionOrderNo.classList.remove("is-invalid");
    selectProductionOrderNo.classList.remove("is-valid");

    dateProductionDate.classList.remove("is-invalid");
    dateProductionDate.classList.remove("is-valid");

    selectItemName.classList.remove("is-invalid");
    selectItemName.classList.remove("is-valid");

    txtQuantity.classList.remove("is-invalid");
    txtQuantity.classList.remove("is-valid");

    selectProductionSession.classList.remove("is-invalid");
    selectProductionSession.classList.remove("is-valid");

    textNote.classList.remove("is-invalid");
    textNote.classList.remove("is-valid");




    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let productionOrderNo = getServiceRequest("/productionorder/alldata");

    //Filling data into dropdowns
    fillDataIntoSelect(selectProductionOrderNo, "Please select Production Order No..!", productionOrderNo, "production_order_no");


    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let item = getServiceRequest("/item/alldata");

    //Filling data into dropdowns
    fillDataIntoSelect(selectItemName, "Please select Item Name..!", item, "item_name");

    //Retriving data from the data base using ajax common function defined in the coomonFunctions.js
    let session = getServiceRequest("/productionsession/alldata")

    //filling data into dropdown
    fillDataIntoSelect(selectProductionSession, "Please select Production session..!", session, "name");

    //Update button getsdissapeared when refreshForm
    buttonSubmit.style.display = "block";
    buttonUpdate.style.display = "none";




}



const refreshProductionTable = () => {

    //string => string/date/number
    //function => object/array/boolean
    let propertyList = [{ propertyName: "production_date", dataType: "string" },
    { propertyName: getProductionOrderNo, dataType: "function" },
    { propertyName: getItemName, dataType: "function" },
    { propertyName: "quantity", dataType: "string" },
    { propertyName: getProductionSession, dataType: "function" }];



    let production = getServiceRequest("/production/alldata");

    //calling function to fill data into the table
    fillDataIntoTable1(tableProductionBody, production, propertyList, buttonProductionRefill, buttonProductionDelete, buttonProductionView, true);


    $('#productionTable').DataTable();


}


const getItemName = (dataOb) => {
    return dataOb.item_id.item_name;
}

const getProductionSession = (dataOb) => {
    return dataOb.item_production_order_id.production_session_id.name;
}

const getProductionOrderNo = (dataOb) => {
    return dataOb.item_production_order_id.production_order_no;
}



const checkFormError = () => {

    let errors = "";

    if (production.production_date == null) {
        errors = errors + "Please Enter a valid Production Date...!\n";

    }

    if (production.item_production_order_id == null) {
        errors = errors + "Please Select the production Order No...!\n";

    }

    if (production.item_id == null) {
        errors = errors + "Please Enter a valid Item Name...!\n";

    }


    if (production.quantity == null) {
        errors = errors + "Please Enter a valid Quantity...!\n";

    }

    if (production.production_session_id == null) {
        errors = errors + "Please Enter a valid Production Session...!\n";

    }


    return errors;
}



const buttonProductionSubmit = () => {

    console.log(production);

    //Check form error for required element
    let errors = checkFormError();

    if (errors == "") {

        let userConfirm =

            "\n Production Date :" + production.production_date +
            "\n Production Date :" + production.item_production_order_id.production_order_no +
            "\n Item Name :" + production.item_id.item_name +
            "\n Production Quantity:" + production.quantity +
            "\n Production Session:" + production.production_session_id.name;



        swal({
            title: "Are you sure to Submit Following Details..?",
            text: userConfirm,
            icon: "warning",
            buttons: true,
            dangerMode: true,

        }).then((userResponce) => {

            if (userResponce) {
                //call post service
                let postResponce = getHTTPServiceRequest("/production/insert", "POST", production);
                if (postResponce == "OK") {
                    swal("Saved Successfully ....!");




                    refreshProductionTable();
                    refreshForm();
                    $("#modalProductionForm").modal("hide");



                } else {
                    swal("Failed to submit..! \n" + postResponce);

                }
            }

        });

    } else {

        swal("Form has following errors...\n\n" + errors);

    }

    console.log(production);

}

const buttonProductionRefill = (dataOb, index) => {


    //creating 2 objects for update comparison
    production = JSON.parse(JSON.stringify(dataOb));
    oldProduction = JSON.parse(JSON.stringify(dataOb));

    //Refilling attributes 
    dateProductionDate.value = dataOb.production_date;
    selectProductionOrderNo.value = JSON.stringify(dataOb.item_production_order_id);
    selectItemName.value = JSON.stringify(dataOb.item_id);
    txtQuantity.value = dataOb.quantity;
    selectProductionSession.value = JSON.stringify(dataOb.item_production_order_id.production_session_id);

    //Assigning the data values in dataOb og DB to the front end dataOb for databinding
    production.production_session_id = dataOb.item_production_order_id.production_session_id;
    oldProduction.production_session_id = dataOb.item_production_order_id.production_session_id;


    production.item_production_order_id = dataOb.item_production_order_id.production_order_no;
    oldProduction.item_production_order_id = dataOb.item_production_order_id.production_order_no;



    //Opening the form modal when refilling
    $("#modalProductionForm").modal("show");


    //Submit button getsdissapeared when edit function executed
    buttonUpdate.style.display = "block";
    buttonSubmit.style.display = "none";

}




const checkFormUpdate = () => {

    let updates = "";

    if (production != null && oldProduction != null) {

        if (production.production_date != oldProduction.production_date) {
            updates = updates + "Production Date Has Changed..!\n";

        }

        if (production.item_production_order_id.production_order_no != oldProduction.item_production_order_id.production_order_no) {
            updates = updates + "Production Order No  has Changed..!\n";

        }

        if (production.item_id.item_name != oldProduction.item_id.item_name) {
            updates = updates + "Item Has Changed..!\n";

        }


        if (production.quantity != oldProduction.quantity) {
            updates = updates + "Production Quantity Has Changed..!\n";

        }


        if (production.production_session_id.name != oldProduction.production_session_id.name) {
            updates = updates + "Production Session Has Changed..!\n";

        }

    }
    return updates;

}


//form update event function
const buttonProductionUpdate = () => {

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
                        let putResponce = getHTTPServiceRequest("/production/update", "PUT", production);
                        if (putResponce == "OK") {
                            swal("Updated Successfully ....!");

                            refreshProductionTable();
                            refreshForm();
                            $("#modalProductionForm").modal("hide");

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


//function define for delete customer record
const buttonProductionDelete = (dataOb, index) => {
    console.log("Delete", dataOb, index);


    //need to get user confirmation
    let userConfirmMsg1 =
        "\n Production  Date :" + dataOb.production_date +
        "\n Production  Order No :" + dataOb.item_production_order_id.production_order_no +
        "\nItem Name :" + dataOb.item_id.item_name +
        "\n Quantity:" + dataOb.quantity +
        "\n Production Session:" + dataOb.item_production_order_id.production_session_id.name;




    //Sweet alert function
    swal({
        title: "Are you sure to delete..?",
        text: userConfirmMsg1,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((userResponce) => {
            if (userResponce) {


                let deleteResponce = getHTTPServiceRequest("/production/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });

                    refreshProductionTable();
                    refreshForm();

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

    tdProductionDate.innerText = dataOb.production_date;
    tdProductionOrderNo.innerText = dataOb.item_production_order_id.production_order_no;
    tdItemName.innerText = dataOb.item_id.item_name;
    tdItemQty.innerText = dataOb.quantity;
    tdProductionSession.innerText = dataOb.item_production_order_id.production_session_id.name;



    $("#modalProductionView").modal("show");
}



//Print button at the modal
const printProductionRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-production</title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
        "<body>" + tableProductionView.outerHTML + "</body>";


    newWindow.document.write(printView);



    //Print window
    setTimeout(() => {

        newWindow.stop();
        newWindow.print();
        newWindow.close();

    }, 500)


    $("#modalProductionView").modal("hide");


}

















