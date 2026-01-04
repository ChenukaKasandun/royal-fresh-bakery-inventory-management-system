


window.addEventListener('load', () => {


    refreshForm();
    refreshWalkingCustomerTable();


})


const refreshForm = () => {


    walkingCustomer = new Object();

    //Cleaning the inner HTML
    dateDate.value = "";
    txtTotalItemsSold.value = "";
    txtTotalIncome.value = "";
    textNote.value = "";





    //Removing the boostrap validation
    dateDate.classList.remove("is-invalid");
    dateDate.classList.remove("is-valid");

    txtTotalItemsSold.classList.remove("is-invalid");
    txtTotalItemsSold.classList.remove("is-valid");

    txtTotalIncome.classList.remove("is-invalid");
    txtTotalIncome.classList.remove("is-valid");

    textNote.classList.remove("is-invalid");
    textNote.classList.remove("is-valid");



    //Update button getsdissapeared when refresh form
    buttonSubmit.style.display = "block";
    buttonUpdate.style.display = "none";



}



const refreshWalkingCustomerTable = () => {

    //string => string/sate/number
    //function => object/array/boolean
    let propertyList = [{ propertyName: "date", dataType: "string" },
    { propertyName: "total_items_sold", dataType: "string" },
    { propertyName: "total_price", dataType: "string" }
    ];


    //Calling a common function to retrive data from the database to the table
    let walkingCustomer = getServiceRequest("/walkingcustomer/alldata");
    //Calling common function to fill data into table
    fillDataIntoTable1(walkingCustomerTableBody, walkingCustomer, propertyList, walkingCustomerFormRefill, walkingCustomerDelete, walkingCustomerView, true);


    $('#walkingCustomerTable').DataTable();

}



const checkFormError = () => {

    let errors = "";

    if (walkingCustomer.date == null) {
        errors = errors + "Please Enter a valid date..!\n";

    }

    if (walkingCustomer.total_price == null) {
        errors = errors + "Please Enter Total Income..!\n";

    }

    if (walkingCustomer.total_items_sold == null) {
        errors = errors + "Please Enter Total Items Sold...!\n";

    }



    return errors;
}



//Employee form Submit Function
const buttonWalkingCustomerSubmit = () => {


    console.log(walkingCustomer);

    //Check form error for required element
    let errors = checkFormError();

    if (errors == "") {



        let userConfirmMsg1 =

            "\n Date :" + walkingCustomer.date +
            "\n TotalItems Sold :" + walkingCustomer.total_items_sold +
            "\n Total Income:" + walkingCustomer.total_price;


        swal({
            title: "Are you sure to Submit Following Details..?",
            text: userConfirmMsg1,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((userResponce) => {

            if (userResponce) {
                //call post service
                let postResponce = getHTTPServiceRequest("/walkingcustomer/insert", "POST", walkingCustomer);
                if (postResponce == "OK") {
                    swal("Saved Successfully ....!");

                    refreshForm();
                    refreshWalkingCustomerTable();
                    $("#walkingCustomerForm").modal("hide");


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
const walkingCustomerFormRefill = (dataOb, index) => {
    console.log("Edit", dataOb, index);



    //Creating two objects for update function
    walkingCustomer = JSON.parse(JSON.stringify(dataOb));
    oldWalkingCustomer = JSON.parse(JSON.stringify(dataOb));

    dateDate.value = dataOb.date;
    txtTotalItemsSold.value = dataOb.total_price;
    txtTotalIncome.value = dataOb.total_items_sold;


    //Update button getsdissapeared when refresh form
    buttonSubmit.style.display = "none";
    buttonUpdate.style.display = "block";



    $("#walkingCustomerForm").modal("show");




}


//form Update event function 
const checkFormUpdate = () => {

    let updates = "";

    if (walkingCustomer != null && oldWalkingCustomer != null) {

        if (walkingCustomer.date != oldWalkingCustomer.date) {

            updates = updates + "Date changed..!\n";

        }

        if (walkingCustomer.total_items_sold != oldWalkingCustomer.total_items_sold) {

            updates = updates + "Total Items Sold changed..!\n";

        }

        if (walkingCustomer.total_price != oldWalkingCustomer.total_price) {

            updates = updates + "Total Income..!\n";

        }



        return updates;

    }

    refreshWalkingCustomerTable();
}



//Update button
const buttonWalkingCustomerUpdate = () => {

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
                    let putResponce = getHTTPServiceRequest("/walkingcustomer/update", "PUT", walkingCustomer);
                    if (putResponce == "OK") {
                        swal("Updated Successfully ....!");

                        refreshForm();
                        refreshWalkingCustomerTable();
                        $("#walkingCustomerForm").modal("hide");


                    } else {
                        swal("Failed to update..! \n" + postResponce);

                    }


                }





            });

    }




}



//function define for delete customer record
const walkingCustomerDelete = (dataOb, index) => {
    console.log("Delete", dataOb, index);


    //need to get user confirmation
    let userConfirmMsg =
        "\n Date :" + dataOb.date +
        "\n Total Items Sold:" + dataOb.total_items_sold +
        "\n Total Income:" + dataOb.total_price;

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


                let deleteResponce = getHTTPServiceRequest("/walkingcustomer/delete", "DELETE", dataOb)

                if (deleteResponce == "OK") {
                    swal("Deleted successfully....!", {
                        icon: "success",
                    });

                    refreshForm();
                    refreshWalkingCustomerTable();


                } else {
                    swal("Delete Not Sccessfull...!", {
                        icon: "error", text: deleteResponce
                    });

                }

            }



        });


}


//function define for view/print  stock record
const walkingCustomerView = (dataOb, index) => {
    console.log("View", dataOb, index);

    tdDate.innerText = dataOb.date;
    tdTotalItemsSold.innerText = dataOb.total_items_sold;
    tdTotalIncome.innerText = dataOb.total_price;



    $("#modalWalkingCustomerView").modal("show")

    refreshForm();
    refreshWalkingCustomerTable();


}

const printWalkingCustomerRow = () => {

    let newWindow = window.open();
    let printView = "<head> <title>print-user</title><link rel = 'stylesheet' href = '/bootstrap-5.2.3/css/bootstrap.min.css'><script src='/bootstrap-5.2.3/js/bootstrap.bundle.min.js'></script></head> " +
        "<body>" + TablewalkingCustomerView.outerHTML + "</body>";


    newWindow.document.write(printView);



    //Print window
    setTimeout(() => {

        newWindow.stop();
        newWindow.print();
        newWindow.close();

    }, 500)


    $("#modalWalkingCustomerView").modal("hide");


}





















