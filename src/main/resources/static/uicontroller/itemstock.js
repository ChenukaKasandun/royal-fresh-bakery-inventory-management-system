
//refresh production table
window.addEventListener('load', () => {

    refreshProductionTable();


})



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

















