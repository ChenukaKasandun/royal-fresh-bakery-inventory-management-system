


window.addEventListener('load', () => {

    refreshVehicleTable();
    refreshForm();


})

//Validation Of Dynamic dropdown  
const dynamicElementValidator = (element, object, property) => {

    const dynamicElement = element.value;

    vehicle[property] = JSON.parse(dynamicElement);

    element.classList.add("is-valid");


}



//................................................................
function checkBoxValidator() {
    // // Get all checkboxes with class 'form-check-input'
    // const checkboxes = document.querySelectorAll('.form-check-input');
    // checkboxes.forEach(checkbox => {
    //     if (checkbox.checked) {
    //         vehicle.vehicle_route_id.push(checkbox.value);
    //     }
    // });
    // console.log("Selected Routes:", vehicle.vehicle_route_id);
    // // You can now use vehicle.routes to send to your backend
}





const refreshForm = () => {

    //defining a new object for data binding
    vehicle = new Object();


    //Resetting the feilds in the form
    vehicleForm.reset();


    //remove the validation of attributes using a common function 
    setDefault([txtVehicleName, selectVehicleType, txtVehiclePlateNo, txtVehicleModel, selectVehicleStatus, selectDriverName, textNote])


    checkRouteA.checked = false;
    checkRouteB.checked = false;
    checkRouteC.checked = false;
    checkRouteD.checked = false;


    //Define Vehicle Type
    let vehicleType = getServiceRequest("/vehicletype/alldata");
    //Calling function fill data into select
    fillDataIntoSelect(selectVehicleType, "Please select Vehicle Type...!", vehicleType, "type");


    //Define Vehicle Status
    let vehicleStatus = getServiceRequest("/vehiclstatus/alldata");
    //Calling function fill data into select
    fillDataIntoSelect(selectVehicleStatus, "Please select Vehicle Status", vehicleStatus, "status");

    // //Define Driver Name
    let driverName = getServiceRequest("/employee/alldata");
    //Calling function fill data into select
    fillDataIntoSelect(selectDriverName, "Please select Driver Name..!", driverName, "fullname");




}



const refreshVehicleTable = () => {

    //string => string/sate/number
    //function => object/array/boolean
    let propertyList = [{ propertyName: "name", dataType: "string" },
    { propertyName: getVehicleType, dataType: "function" },
    { propertyName: "number_plate_no", dataType: "string" },
    { propertyName: "model", dataType: "string" },
    { propertyName: getVehicleStatus, dataType: "function" },
    { propertyName: getDriverName, dataType: "function" }
    ];

    //Calling a common function to retrive data from the database to the table
    let vehicleData = getServiceRequest("/vehicle/alldata");
    //Calling common function to fill data into table
    fillDataIntoTable1(vehicleTableBody, vehicleData, propertyList, vehicleFormRefill, vehicleDelete, vehicleView, true);


    $('#vehicleTable').DataTable();

}

const getVehicleType = (dataOb) => {

    return dataOb.vehicle_type_id.type;
}

const getVehicleStatus = (dataOb) => {


    return `<p class='fw-bold' style="color: green;">${dataOb.vehicle_status_id.status}</p>`;
}


const getDriverName = (dataOb) => {

    return dataOb.employee_id.fullname;
}



//check errors in the form
const checkFormError = () => {

    //need to check all required properties

    let errors = "";

    if (vehicle.name == null) {
        errors = errors + "Please Enter Vehicle Name..!\n";

    }


    if (vehicle.vehicle_type_id == null) {
        errors = errors + "Please Select Vehicle Type.!\n";

    }


    if (vehicle.number_plate_no == null) {
        errors = errors + "Please Enter Vehicle No plate No!\n";

    }


    if (vehicle.model == null) {
        errors = errors + "Please Enter a Vehicle Model..!\n";

    }


    if (vehicle.vehicle_status_id == null) {
        errors = errors + "Please Select Vehicle Status ..!\n";

    }


    if (vehicle.employee_id == null) {
        errors = errors + "Please Select Employee..!\n";

    }

    return errors;



}


//Employee form Submit Function
const buttonVehicleSubmit = () => {


    console.log(vehicle);

    //Check form error for required element
    let errors = checkFormError();

    if (errors == "") {


        let userConfirmMsg1 =

            "\n Vehicle Name :" + vehicle.name +
            "\n Vehicle Type :" + vehicle.vehicle_type_id.type +
            "\n Number Plate No :" + vehicle.number_plate_no +
            "\n Vehicle Model :" + vehicle.model +
            "\n Vehicle Status :" + vehicle.vehicle_status_id.status +
            "\n Driver Name :" + vehicle.employee_id.fullname;



        swal({
            title: "Are you sure to Submit Following Details..?",
            text: userConfirmMsg1,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((userResponce) => {

            if (userResponce) {
                //call post service
                let postResponce = getHTTPServiceRequest("/vehicle/insert", "POST", vehicle);
                if (postResponce == "OK") {
                    swal("Saved Successfully ....!");

                    refreshVehicleTable();
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
const vehicleFormRefill = (dataOb, index) => {
    console.log("Edit", dataOb, index);


    //Refilling feilds 
    txtVehicleName.value = dataOb.name;
    selectVehicleType.value = JSON.stringify(dataOb.vehicle_type_id);
    txtVehiclePlateNo.value = dataOb.number_plate_no;
    txtVehicleModel.value = dataOb.model;
    selectVehicleStatus.value = JSON.stringify(dataOb.vehicle_status_id);
    selectDriverName.value = JSON.stringify(dataOb.employee_id);



    //Creating two objects for update function
    vehicle = JSON.parse(JSON.stringify(dataOb));
    oldVehicle = JSON.parse(JSON.stringify(dataOb));

    //Assigning values to the front end object properties to avoid mismatches in front end

    //Vehicle Object
    vehicle.vehicle_type_id = dataOb.vehicle_type_id?.type;
    vehicle.vehicle_status_id = dataOb.vehicle_status_id?.status;
    vehicle.employee_id = dataOb.employee_id?.fullname;


    //oldVehicle Object
    oldVehicle.vehicle_type_id = dataOb.vehicle_type_id?.type;
    oldVehicle.vehicle_status_id = dataOb.vehicle_status_id?.status;
    oldVehicle.employee_id = dataOb.employee_id?.fullname;

    $("#modalVehicleForm").modal("show");




}


//form Update event function 
const checkFormUpdate = () => {

    let updates = "";

    if (vehicle != null && oldVehicle != null) {

        if (vehicle.name != oldVehicle.name) {

            updates = updates + "Vehicle has changed..!\n";

        }

        if (vehicle.vehicle_type_id.type != oldVehicle.vehicle_type_id.type) {

            updates = updates + "Vehicle Type has changed..!\n";

        }


        if (vehicle.number_plate_no != oldVehicle.number_plate_no) {

            updates = updates + "Vehicle Nuber Plate No has changed..!\n";

        }


        if (vehicle.model != oldVehicle.model) {

            updates = updates + "Modal has changed..!\n";

        }

        if (vehicle.vehicle_status_id.status != oldVehicle.vehicle_status_id.status) {

            updates = updates + "Vehicle Status has changed..!\n";

        }


        if (vehicle.employee_id.fullname != oldVehicle.employee_id.fullname) {

            updates = updates + "Employee Full name has changed..!\n";

        }

        return updates;



    }
}

//Update button
const buttonVehicleUpdate = () => {

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
                    let putResponce = getHTTPServiceRequest("/vehicle/update", "PUT", vehicle);
                    if (putResponce == "OK") {
                        swal("Updated Successfully ....!");

                        refreshVehicleTable();
                        refreshForm();
                        $("#modalVehicleForm").modal("hide");

                    } else {
                        swal("Failed to Update..! \n" + putResponce);

                    }


                }


            });

    }




}





//function define for delete customer record
const vehicleDelete = (dataOb, index) => {
    console.log("Delete", dataOb, index);


    //need to get user confirmation
    let userConfirmMsg =
        "\n Vehicle Name :" + dataOb.name +
        "\n No plate No :" + dataOb.number_plate_no +
        "\n Model:" + dataOb.model +
        "\n Vehicle Type:" + dataOb.vehicle_type_id.type +
        "\n Vehicle Status:" + dataOb.vehicle_status_id.status +
        "\n Driver Name:" + dataOb.employee_id.fullname;



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


                let deleteResponce = getHTTPServiceRequest("/vehicle/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });

                    refreshVehicleTable();
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
const vehicleView = (dataOb, index) => {
    console.log("View", dataOb, index);


    tdVehicleName.innerText = dataOb.name;
    tdVehicleType.innerText = dataOb.vehicle_type_id.type;
    tdNoPlateNo.innerText = dataOb.number_plate_no;
    tdModel.innerText = dataOb.model;
    tdStatus.innerText = dataOb.vehicle_status_id.status;
    tdDriverName.innerText = dataOb.employee_id.fullname;


    $("#modalVehicleView").modal("show")


    refreshVehicleTable();
    refreshForm();


}

const printVehicleRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-user</title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
        "<body>" + tableVehicleView.outerHTML + "</body>";


    newWindow.document.write(printView);



    //Print window
    setTimeout(() => {

        newWindow.stop();
        newWindow.print();
        newWindow.close();

    }, 500)


    $("#modalVehicleView").modal("hide");


}









