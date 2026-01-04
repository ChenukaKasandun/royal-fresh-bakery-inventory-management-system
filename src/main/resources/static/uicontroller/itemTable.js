

//load event
window.addEventListener('load', () => {

    refreshItemTable();

})




//Refresh Table
const refreshItemTable = () => {

    console.log("-----------------------");


    //string => string/sate/number
    //function => object/array/boolean
    //Decimal => price
    let propertyList = [
        { propertyName: "item_code", dataType: "string" },
        { propertyName: "item_name", dataType: "string" },
        { propertyName: getItemStatus, dataType: "function" },
        { propertyName: getItemCategory, dataType: "function" },

    ];




    //Defining table 
    let items = getServiceRequest("/item/alldata");

    //Calling common function to fill data into table
    fillDataIntoTable1(itemTableBody, items, propertyList, ItemFormRefill, buttonItemDelete, buttonItemView, true);


    $('#itemTable').DataTable();

}




//Get Item Status
const getItemStatus = (dataOb) => {
    if (dataOb.item_status_id.name == "Deleted") {
        return `<P style='background-color:red'>${dataOb.item_status_id.name}</P>`;

    } else {
        return dataOb.item_status_id.name;

    }

}

//Get Item Category
const getItemCategory = (dataOb) => {
    return dataOb.item_category_id.name;
}





//form delete event function 
const buttonItemDelete = (dataOb, index) => {

    console.log("Delete", dataOb, index);


    //need to get user confirmation
    let userConfirmMsg =

        "\n Item Code:" + dataOb.item_code +
        "\n Item Name :" + dataOb.item_name +
        "\n Item Status:" + dataOb.item_status_id.name +
        "\n Item Category:" + dataOb.item_category_id.name;






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


//form delete event function 
const ItemFormRefill = (dataOb, index) => {

    //This redirects to the item form page
    window.location.replace("/itemform?itemid=" + dataOb.id);

}



//Table View  function 
const buttonItemView = (dataOb, index) => {

    console.log("View", dataOb, index);

    tdItemCode.innerText = dataOb.item_code;
    tdItemName.innerText = dataOb.item_name;
    tdItemCategory.innerText = dataOb.profit_rate;
    tdItemStatus.innerText = dataOb.item_status_id.name;


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
























