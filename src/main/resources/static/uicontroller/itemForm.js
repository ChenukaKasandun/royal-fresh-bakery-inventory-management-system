

//load event
window.addEventListener('load', () => {




    refreshForm();

    //This finds any parameter in the URL
    let queryParam = window.location.search;
    console.log(queryParam);


    //URLSearchParams- It parses the query string from the URL (everything after the ?) into a structured object.
    let searchParam = new URLSearchParams(queryParam);

    //This logs whether that object contains the parameter "itemid"
    console.log(searchParam.has("itemid"));


    //This logs the value of "itemid"
    console.log(searchParam.get("itemid"));


    if (searchParam.has("itemid")) {

        //This return a full item object from backend, "searchParam.get("itemid") --> attach the value of parameter "itemid" at the end of the url"
        item = getServiceRequest("/item/getbyid?id=" + searchParam.get("itemid"));

        console.log(item);

        ItemFormRefill(item);


    }

    //Simply what happens here-----> 
    //When pressing the  "Edit" at the item Form, it will redirects to the item form page with the url "'/itemform?itemid=' + dataOb.id" and "id"
    //comes as a parameter to the website. it catch by the itemForm.js "queryParam = window.location.search;"and extracts the respective id of the object.
    //Then "item = getServiceRequest("/item/getbyid?id=" + searchParam.get("itemid")); requests  the full dataOb from the backend respective to the requested id.
    //Finally it refills the item Form

})


//Refreshing Form
const refreshForm = () => {


    //Reset Item Form
    itemForm.reset();
    //Defining new item object to data binding at front end
    item = new Object();





    //Removing Validation Colours using a common function declared in common.js

    setDefault([txtItemName, selectItemCategoryType, selectItemStatus]);



    //Iten Category
    let itemCategory = getServiceRequest("/itemcategory/alldata");

    //Calling function to fill data into select
    fillDataIntoSelect(selectItemCategoryType, "Please select Item Category ", itemCategory, "name");



    //Iten Status
    let itemStatus = getServiceRequest("/itemstatusbyid/alldata");

    //Calling Function to fill data into select
    fillDataIntoSelect(selectItemStatus, "Please Select Item Status ", itemStatus, "name");

    //Update button getsdissapeared when refreshForm function executed
    buttonSubmit.style.display = "block";
    buttonUpdate.style.display = "none";



}



//dynamic element validator  
const dyanamicElementValidator = (element, object, property) => {

    //creating a dynamic element variable to pic the element value
    const dynamicElement = element.value;



    //assigning the value to the property  of the data object
    item[property] = JSON.parse(dynamicElement);


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


            "\n Item Name :" + item.item_name +
            "\n Item Status :" + item.item_status_id.name +
            "\n Item Category :" + item.item_category_id.name;




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
                        $("#itemForm").modal("hide");



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


        if (item.item_status_id.name != oldItem.item_status_id.name) {

            updates = updates + "Item Status has changed..!\n";

        }


        if (item.item_category_id.name != oldItem.item_category_id.name) {

            updates = updates + "Item Category has changed..!\n";

        }


        return updates;



        refreshItemTable();


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
                        $("#itemForm").modal("hide");

                    } else {
                        swal("Failed to Update..! \n" + putResponce);

                    }


                }


            });


    }




}




//form delete event function 
const ItemFormRefill = (dataOb, index) => {

    console.log(dataOb);


    //Creating two objects for comparison --> Update Item
    item = JSON.parse(JSON.stringify(dataOb));
    oldItem = JSON.parse(JSON.stringify(dataOb));


    txtItemName.value = dataOb.item_name;
    selectItemCategoryType.value = JSON.stringify(dataOb.item_category_id);
    selectItemStatus.value = JSON.stringify(dataOb.item_status_id);
    txtRawMaterialCost.value = dataOb.raw_material_cost;


    //Submit button get dissapeared when Edit Function executed
    buttonUpdate.style.display = "block";
    buttonSubmit.style.display = "none";



}
