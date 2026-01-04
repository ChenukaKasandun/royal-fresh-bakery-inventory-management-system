

//Function to request alldata from the database 

const getServiceRequest = (url) => {

    let getServiceResponce = [];
    $.ajax({
        url: url,//The url to which the request is sent
        type: 'GET',//The HTTP method to use for the request(GET,POST,etc)
        contentType: 'json',
        async: false,
        success: function (response) {
            //Code to execute if the request suceeds
            console.log('Success:', response);
            getServiceResponce = response;
        },
        error: function (xhr, status, error) {
            console.log('Error:', error);
        }
    });
    return getServiceResponce;
}



//Define function for POST,PUT,Delete service request
const getHTTPServiceRequest = (url, method, data) => {

    let getServiceResponce = "";
    $.ajax({
        url: url,//The url to which the request is sent
        type: method,//The HTTP method to use for the request(GET,POST,etc)
        contentType: 'application/json',
        data: JSON.stringify(data),
        async: false,
        success: function (response) {
            //Code to execute if the request suceeds
            console.log('Success:', response);
            getServiceResponce = response;
        },
        error: function (xhr, status, error) {
            console.log('Error:', error);
            getServiceResponce = error;
        }
    });
    return getServiceResponce;
}




const setDefault = (elements) => {
    elements.forEach(element => {
        //element.style.border = "1px solid #dee2e6";

        //To remove boostrap classes
        element.classList.remove("is-valid");
        element.classList.remove("is-invalid");

    });
}





//  Define function for fill data into select(elementid , displaymessege,dataListname,displaypropertyname)
const fillDataIntoSelect = (parentId, messege, dataList, displayProperty) => {
    //Cleaning the parent field id
    parentId.innerHTML = "";

    if (messege != ""){
        let optionMsgES = document.createElement("option");
        optionMsgES.value = "";
        optionMsgES.selected = "selected";
        optionMsgES.disabled = "disabled";
        optionMsgES.innerText = messege;
        parentId.appendChild(optionMsgES);


    }

    dataList.forEach(dataOb => {
        let option = document.createElement("option");
        option.value = JSON.stringify(dataOb);
        option.innerText = dataOb[displayProperty];
        parentId.appendChild(option);



    });

}





//Common Function For Fill data onto table(tableBodyId,dataList,propertyList,editFunction,DeleteFunction,ViewFunction)
const fillDataIntoTable = (tableBodyId, dataList, propertyList, editFunction, deleteFunction, viewFunction, buttonVisibility) => {

    tableBodyId.innerHTML = "";

    dataList.forEach((dataOb, index) => {

        let tr = document.createElement("tr");

        let tdIndex = document.createElement("td");
        tdIndex.innerText = parseInt(index) + 1;
        tr.appendChild(tdIndex);

        for (const property of propertyList) {

            let td = document.createElement("td");

            if (property.dataType == "string") {
                td.innerText = dataOb[property.propertyName];
            }

            if (property.dataType == "function") {
                td.innerHTML = property.propertyName(dataOb);


            }

            tr.appendChild(td);
        }


        // let tdStatus = document.createElement("td");
        // tdStatus.innerText = dataOb.status;
        // tr.appendChild(tdStatus);


        let tdbuttons = document.createElement("td");

        let buttonEdit = document.createElement("button");
        buttonEdit.className = "btn btn-outline-warning";
        buttonEdit.innerHTML = "<i class='fa-solid fa-pen'></i>Edit";
        tdbuttons.appendChild(buttonEdit);
        buttonEdit.onclick = () => {
            console.log("Edit", dataOb);
            editFunction(dataOb, index);

        }

        let buttonDelete = document.createElement("button");
        buttonDelete.className = "btn btn-outline-danger ms-1 me-1";
        buttonDelete.innerHTML = "<i class='fa-solid fa-trash'></i>Delete"
        tdbuttons.appendChild(buttonDelete);
        buttonDelete.onclick = () => {
            console.log("Delete", dataOb);
            deleteFunction(dataOb, index);


        }


        let buttonView = document.createElement("button");
        buttonView.className = "btn btn-outline-info";
        buttonView.innerHTML = "<i class='fa-regular fa-eye'></i>View";
        tdbuttons.appendChild(buttonView);
        buttonView.onclick = () => {
            console.log("View", dataOb);
            viewFunction(dataOb, index);


        }



        if (buttonVisibility) {
            tr.appendChild(tdbuttons);


        } else {

        }

        tableBodyId.appendChild(tr);

    });


}




//Common Function For Fill data onto table=> drop down architecture(tableBodyId,dataList,propertyList,editFunction,DeleteFunction,ViewFunction)
const fillDataIntoTable1 = (tableBodyId, dataList, propertyList, editFunction, deleteFunction, viewFunction, buttonVisibility) => {

    tableBodyId.innerHTML = "";

    dataList.forEach((dataOb, index) => {

        let tr = document.createElement("tr");

        let tdIndex = document.createElement("td");
        tdIndex.innerText = parseInt(index) + 1;
        tr.appendChild(tdIndex);

        for (const property of propertyList) {

            let td = document.createElement("td");

            if (property.dataType == "string") {
                td.innerText = dataOb[property.propertyName];
            }

            if (property.dataType == "function") {
                td.innerHTML = property.propertyName(dataOb);
            }

            //Convert string to two decimal places
            if (property.dataType == "decimal") {
                td.innerHTML = parseFloat(dataOb[property.propertyName]).toFixed(2);
            }

            tr.appendChild(td);
        }


        // let tdStatus = document.createElement("td");
        // tdStatus.innerText = dataOb.status;
        // tr.appendChild(tdStatus);


        let tdbuttons = document.createElement("td");

        let div = document.createElement("div");
        div.className = "dropdown";
        tdbuttons.appendChild(div);


        let dropdownButton = document.createElement("button");
        dropdownButton.className = "btn ";
        dropdownButton.setAttribute("data-bs-toggle", "dropdown");
        dropdownButton.setAttribute("aria-expanded", "false");
        dropdownButton.innerHTML = "<i class='fa-solid fa-bars fa-lg' style='color: #ff3d77;'></i>";

        div.appendChild(dropdownButton);


        let dropDownUl = document.createElement("ul");
        dropDownUl.className = "dropdown-menu";
        div.appendChild(dropDownUl);


        //Edit
        let liEdit = document.createElement("li");
        liEdit.className = "dropdown-item";

        let buttonEdit = document.createElement("button");
        buttonEdit.className = "btn btn-outline-warning";
        buttonEdit.innerText = "Edit";

        buttonEdit.onclick = () => {
            console.log("Edit", dataOb);
            editFunction(dataOb, index);

        }

        liEdit.appendChild(buttonEdit);
        dropDownUl.appendChild(liEdit);





        //Delete
        let liDelete = document.createElement("li");
        liDelete.className = "dropdown-item";

        let buttonDelete = document.createElement("button");
        buttonDelete.className = "btn btn-outline-danger";
        buttonDelete.innerText = "Delete";

        buttonDelete.onclick = () => {
            console.log("Edit", dataOb);
            deleteFunction(dataOb, index);

        }


        liDelete.appendChild(buttonDelete);
        dropDownUl.appendChild(liDelete);

        //View

        let liView = document.createElement("li");
        liView.className = "dropdown-item";

        let buttonView = document.createElement("button");
        buttonView.className = "btn btn-outline-info";
        buttonView.innerText = "View";


        buttonView.onclick = () => {
            console.log("Edit", dataOb);
            viewFunction(dataOb, index);

        }

        liView.appendChild(buttonView);
        dropDownUl.appendChild(liView);



        //Visibility of buttons
        if (buttonVisibility) {
            tr.appendChild(tdbuttons);


        } else {

        }

        tableBodyId.appendChild(tr);

    });


}


