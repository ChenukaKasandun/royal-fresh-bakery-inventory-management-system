





//define function for fill data into table(tablebodyid,dataList,propertyList,editFunctionName,deleteFunctionName,viewFunctionName)
const fillDataIntoTable = (tableEmployeeBody,dataList,propertyList,editFunction,deleteFunction,viewFunction,) =>{

    tableEmployeeBody.innerHTML = "";

    dataList.forEach((dataOb, index) => {

        let tr = document.createElement("tr");

        let tdIndex = document.createElement("td");
        tdIndex.innerText = parseInt(index) + 1;
        tr.appendChild(tdIndex);


        for (const property of propertyList) {

            let td= document.createElement("td");

            if (property.dataType=="string") {
                td.innerText = dataOb[property.propertyName];
                
            }

            if (property.dataType=="function") {
                td.innerHTML = property.propertyName(dataOb);
                
            }




            tr.appendChild(td);
            
        }
        
        

        let tdButtons = document.createElement("td");

        let buttonEdit = document.createElement("buttons");
        buttonEdit.className = "btn btn-outline-warning";
        buttonEdit.innerHTML = "<i class='fa-solid fa-eye'></i>Edit";

        tdButtons.appendChild(buttonEdit);
        buttonEdit.onclick = ()=> {
            console.log("edit" ,dataOb);
            editFunction(dataOb,index);
            
        }


        let buttonDelete = document.createElement("buttons");
        buttonDelete.className = "btn btn-outline-danger ms-1 me-1";
        buttonDelete.innerHTML = " <i class='fa fa-trash'></i>Delete";

        tdButtons.appendChild(buttonDelete);
        buttonDelete.onclick = ()=> {
            console.log("delete" ,dataOb);
            deleteFunction(dataOb,index);
            
        }

        
        let buttonView = document.createElement("buttons");
        buttonView.className = "btn btn-outline-info ";
        buttonView.innerHTML = "<i class='fa-solid fa-eye'></i>View";

        tdButtons.appendChild(buttonView);
        buttonView.onclick = () => {
            console.log("view" ,dataOb);
            viewFunction(dataOb,index);
            
        }

       

        tr.appendChild(tdButtons);


        tableEmployeeBody.appendChild(tr);

    });


}




//define function for fill data into table(tablebodyid,dataList,propertyList,editFunctionName,deleteFunctionName,viewFunctionName)
const fillDataIntoTableTwo = (tableEmployeeBody,dataList,propertyList,editFunction,deleteFunction,viewFunction,buttonVisibility = true) =>{

    tableEmployeeBody.innerHTML = "";

    dataList.forEach((dataOb, index) => {

        let tr = document.createElement("tr");

        let tdIndex = document.createElement("td");
        tdIndex.innerText = parseInt(index) + 1;
        tr.appendChild(tdIndex);


        for (const property of propertyList) {

            let td= document.createElement("td");

            if (property.dataType=="string") {
                td.innerText = dataOb[property.propertyName];
                
            }

            if (property.dataType=="function") {
                td.innerHTML = property.propertyName(dataOb);
                
            }




            tr.appendChild(td);
            
        }
        
        

        let tdButtons = document.createElement("td");

        let div = document.createElement("div");
        div.className = "dropdown";
        tdButtons.appendChild(div);

        let dropdownButton =document.createElement("button");
        dropdownButton.className = "btn btn-secondary dropdown-toggle";
        dropdownButton.setAttribute("data-bs-toggle","dropdown");
        dropdownButton.setAttribute("aria-expanded","false");
        dropdownButton.innerHTML= "<i class='fa-solid fa-bars' style='color: #FFD43B;'></i>";

        div.appendChild(dropdownButton);

        let dropdownUl = document.createElement("ul");
        dropdownUl.className = "dropdown-menu";
        div.appendChild(dropdownUl);

        let liEdit = document.createElement("li");
        liEdit.className = "dropdown-item";

        let buttonEdit = document.createElement("buttons");
        buttonEdit.className = "btn btn-outline-warning";
        buttonEdit.innerHTML = "<i class='fa-solid fa-eye'></i>Edit";

        //tdButtons.appendChild(buttonEdit);
        buttonEdit.onclick = ()=> {
            console.log("edit" ,dataOb);
            editFunction(dataOb,index);
            
        }

        liEdit.appendChild(buttonEdit);
        dropdownUl.appendChild(liEdit);


        let liDelete = document.createElement("li");
        liDelete.className = "dropdown-item";

        let buttonDelete = document.createElement("buttons");
        buttonDelete.className = "btn btn-outline-danger ms-1 me-1";
        buttonDelete.innerHTML = " <i class='fa fa-trash'></i>Delete";

        //tdButtons.appendChild(buttonDelete);
        buttonDelete.onclick = ()=> {
            console.log("delete" ,dataOb);
            deleteFunction(dataOb,index);
            
        }

        liDelete.appendChild(buttonDelete);
        dropdownUl.appendChild(liDelete);


        let liView = document.createElement("li");
        liView.className = "dropdown-item";

         
        let buttonView = document.createElement("buttons");
        buttonView.className = "btn btn-outline-info ";
        buttonView.innerHTML = "<i class='fa-solid fa-eye'></i>View";

       // tdButtons.appendChild(buttonView);
        buttonView.onclick = () => {
            console.log("view" ,dataOb);
            viewFunction(dataOb,index);
            
        }

        liView.appendChild(buttonView);
        dropdownUl.appendChild(liView);

        if (buttonVisibility) {
            tr.appendChild(tdButtons);
            
        }


        tableEmployeeBody.appendChild(tr);

    });


}




//define function for fill data into table(tablebodyid,dataList,propertyList,editFunctionName,deleteFunctionName,viewFunctionName)
const fillDataIntoTableThree = (tableEmployeeBody,dataList,propertyList,editFunction,deleteFunction,viewFunction,buttonVisibility = true) =>{

    tableEmployeeBody.innerHTML = "";

    dataList.forEach((dataOb, index) => {

        let tr = document.createElement("tr");

        let tdIndex = document.createElement("td");
        tdIndex.innerText = parseInt(index) + 1;
        tr.appendChild(tdIndex);


        for (const property of propertyList) {

            let td= document.createElement("td");

            if (property.dataType=="string") {
                td.innerText = dataOb[property.propertyName];
                
            }

            if (property.dataType=="function") {
                td.innerHTML = property.propertyName(dataOb);
                
            }




            tr.appendChild(td);
            
        }
        
        

        let tdButtons = document.createElement("td");

        let buttonEdit = document.createElement("buttons");
        buttonEdit.className = "btn btn-outline-warning";
        buttonEdit.innerHTML = "<i class='fa-solid fa-eye'></i>Edit";

        tdButtons.appendChild(buttonEdit);
        buttonEdit.onclick = ()=> {
            console.log("edit" ,dataOb);
            editFunction(dataOb,index);
            
        }


        let buttonDelete = document.createElement("buttons");
        buttonDelete.className = "btn btn-outline-danger ms-1 me-1";
        buttonDelete.innerHTML = " <i class='fa fa-trash'></i>Delete";

        tdButtons.appendChild(buttonDelete);
        buttonDelete.onclick = ()=> {
            console.log("delete" ,dataOb);
            deleteFunction(dataOb,index);
            
        }

        
        let buttonView = document.createElement("buttons");
        buttonView.className = "btn btn-outline-info ";
        buttonView.innerHTML = "<i class='fa-solid fa-eye'></i>View";

        tdButtons.appendChild(buttonView);
        buttonView.onclick = () => {
            console.log("view" ,dataOb);
            viewFunction(dataOb,index);
            
        }

       

        tr.appendChild(tdButtons);


        tableEmployeeBody.appendChild(tr);

    });


}





