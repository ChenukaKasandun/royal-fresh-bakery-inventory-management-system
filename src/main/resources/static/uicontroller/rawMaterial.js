
//onload event 
window.addEventListener('load', () => {
    refreshForm();
    refreshRawMaterialTable();


})



const refreshForm = () => {


    //Defining a new object for data binding
    material = new Object();

    //clean the properties when refreshing form
    txtMaterialName.value = "";
    selectSIunit.value = "";
    textPurchasingUnit.value = "";
    textUsingUnit.value = "";
    textROP.value = "";
    textROQ.value = "";
    textNote.value = "";



    //set initial validation colour when refreshing form
    txtMaterialName.classList.remove("is-valid");
    txtMaterialName.classList.remove("is-invalid");


    selectSIunit.classList.remove("is-valid");
    selectSIunit.classList.remove("is-invalid");

    textPurchasingUnit.classList.remove("is-valid");
    textPurchasingUnit.classList.remove("is-invalid");

    textUsingUnit.classList.remove("is-valid");
    textUsingUnit.classList.remove("is-invalid");


    textROP.classList.remove("is-valid");
    textROP.classList.remove("is-invalid");



    //material status calling from backend using a common function declared in commonFunction.js
    let siUnit = getServiceRequest("/siunit/alldata");

    fillDataIntoSelect(selectSIunit, "Please Select SI Unit...!", siUnit, "name");

    //Update button getsdissapeared when edit function executed
    buttonSubmit.style.display = "block";
    buttonUpdate.style.display = "none";


}



//refresh Table
const refreshRawMaterialTable = () => {


    //string => string/sate/number
    //function => object/array/boolean
    let propertyList = [{ propertyName: "material_name", dataType: "string" },
    { propertyName: getUnitType, dataType: "function" },
    { propertyName: "purchasing_unit", dataType: "string" },
    { propertyName: "measuring_unit", dataType: "string" },
    { propertyName: "rop", dataType: "string" },
    { propertyName: "roq", dataType: "string" },
    { propertyName: getRawMaterialStatus, dataType: "function" }];


    //Defining raw materials using ajax function calling defined in the commonFunctions.js
    let rawMaterials = getServiceRequest("/rawmaterial/alldata");


    //Calling common function to fill data into table
    fillDataIntoTable1(tableRawMaterialBody, rawMaterials, propertyList, materialFormRefill, buttonRawMaterialDelete, buttonRawMaterialView, true);


    $('#rawMaterialTable').DataTable();
}



//Function declared to get unit Type
const getUnitType = (dataOb) => {

    return dataOb.unit_type_id.name;
}

const getRawMaterialStatus = (dataOb) => {

    if (dataOb.rawmaterial_status_id?.status == "Deleted") {

        return `<p style='background-color: red;'>${dataOb.rawmaterial_status_id.status}</p>`;



    } else {
        return "";

    }

}


const checkFormError = () => {

    let errors = "";
    if (material.material_name == null) {
        errors = errors + "Material Name is required.\n";
    }

    if (material.unit_type_id == null) {
        errors = errors + "SI Unit is required.\n";
    }
    if (material.purchasing_unit == null) {
        errors = errors + "Purchasing Unit is required.\n";
    }
    if (material.measuring_unit == null) {
        errors = errors + "Measuring Unit is required.\n";
    }
    if (material.rop == null) {
        errors = errors + "Reorder Point is required.\n";
    }
    if (material.roq == null) {
        errors = errors + "Reorder Quantity is required.\n";
    }

    return errors;
}



//form submit event function 
const buttonRawMaterialSubmit = () => {


    //Check form error for required element
    let errors = checkFormError();

    if (errors == "") {

        let userConfirmMsg1 =

            "\n Material Name :" + material.material_name +
            "\n SI Unit :" + material.unit_type_id.name +
            "\n Purchasing Unit :" + material.purchasing_unit +
            "\n Measuring Unit :" + material.measuring_unit +
            "\n ROP :" + material.rop +
            "\n ROQ :" + material.roq;


        swal({
            title: "Are you sure to Submit Following Details..?",
            text: userConfirmMsg1,
            icon: "warning",
            buttons: true,
            dangerMode: true,

        }).then((userResponce) => {

            if (userResponce) {
                //call post service
                let postResponce = getHTTPServiceRequest("/rawmaterial/insert", "POST", material);
                if (postResponce == "OK") {
                    swal("Saved Successfully ....!");



                    //to reload Table only
                    refreshRawMaterialTable();

                    //to reload Form only
                    refreshForm();
                    $("#materialFormModal").modal("hide");



                } else {
                    swal("Failed to submit..! \n" + postResponce);

                }


            }





        });


    } else {

        swal("Form has following errors...\n" + errors);
        //window.alert("Form has following errors...\n" + errors);

    }




}


const materialFormRefill = (dataOb, index) => {

    txtMaterialName.value = dataOb.material_name;
    selectSIunit.value = JSON.stringify(dataOb.unit_type_id);
    textPurchasingUnit.value = dataOb.measuring_unit;;
    textUsingUnit.value = dataOb.purchasing_unit;
    textROP.value = dataOb.rop;
    textROQ.value = dataOb.roq;

    //create two copies for comparison for update
    material = JSON.parse(JSON.stringify(dataOb));
    oldMaterial = JSON.parse(JSON.stringify(dataOb));

    $("#materialFormModal").modal("show");

    //Submit button getsdissapeared when edit function executed
    buttonUpdate.style.display = "block";
    buttonSubmit.style.display = "none";





}


const checkFormUpdates = () => {


    let updates = "";

    if (material != null && oldMaterial != null) {
        if (material.material_name != oldMaterial.material_name) {
            updates = updates + "Material Name has changed..! \n";
        }


        if (material.unit_type_id.name != oldMaterial.unit_type_id.name) {
            updates = updates + "SI unit has changed..! \n";
        }

        if (material.purchasing_unit != oldMaterial.purchasing_unit) {
            updates = updates + "Purchasing Unit has changed..! \n";
        }

        if (material.measuring_unit != oldMaterial.measuring_unit) {
            updates = updates + "Measuring Unit has changed..! \n";
        }


        if (material.rop != oldMaterial.rop) {
            updates = updates + "Reorder Point has changed..! \n";
        }

        if (material.roq != oldMaterial.roq) {
            updates = updates + "Reorder Quantity has changed..! \n";
        }
    }

    console.log(material);
    console.log(oldMaterial);



    return updates;



}



//form Update event function 
const buttonRawMaterialUpdate = (dataOb, index) => {

    let errors = checkFormError();


    if (errors == "") {

        let updates = checkFormUpdates();
        if (updates == "") {
            swal("Nothing to update..!");

        } else {
            let userConfirmMsg = "Are you sure to update Raw Material...?";

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
                        let putResponce = getHTTPServiceRequest("/rawmaterial/update", "PUT", material);
                        if (putResponce == "OK") {
                            swal("Updated Successfully ....!");




                            refreshForm();
                            refreshRawMaterialTable();

                            $("#materialFormModal").modal("hide");



                        } else {
                            swal("Failed to Update..! \n" + putResponce);

                        }


                    }





                });

        }

    } else {
        swal("Form has following error..\n" + errors)

    }


    refreshRawMaterialTable();



}


//form View event function 
const buttonRawMaterialView = (dataOb, index) => {

    tdMaterial.innerText = dataOb.material_name;
    tdSIunit.innerText = dataOb.unit_type_id.name;
    tdMeasuringUnit.innerText = dataOb.measuring_unit;
    tdPurchasingUnit.innerText = dataOb.purchasing_unit;
    tdROP.innerText = dataOb.rop;
    tdROQ.innerText = dataOb.roq;

    $("#modalRawView").modal("show")
    refreshRawMaterialTable();
    refreshForm();




}


const printRawMaterialRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-raw</title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
        "<body>" + tableRawView.outerHTML + "</body>";


    newWindow.document.write(printView);



    //Print window
    setTimeout(() => {

        newWindow.stop();
        newWindow.print();
        newWindow.close();

    }, 500)


    $("#modalRawView").modal("hide");


}


//form delete event function 
const buttonRawMaterialDelete = (dataOb, index) => {
    //need to get user confirmation
    let userConfirmMsg =
        "\n Raw Material :" + dataOb.material_name +
        "\nSI Unit :" + dataOb.unit_type_id.name +
        "\n Available Qty :" + dataOb.measuring_unit +
        "\n Required Qty :" + dataOb.purchasing_unit +
        "\n Qty to be supplied:" + dataOb.rop +
        "\n Usable Qty:" + dataOb.roq;


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


                let deleteResponce = getHTTPServiceRequest("/rawmaterial/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });

                    refreshForm();
                    refreshRawMaterialTable();


                } else {
                    swal("Delete Not Sccessfull...!", {
                        icon: "error", text: deleteResponce
                    });

                }

            }



        });


    refreshRawMaterialTable();
    refreshForm();


}









