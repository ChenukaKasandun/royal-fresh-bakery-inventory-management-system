

//Common Validator Function(Reusable)
const textValidator = (element, dataPattern, object, property) => {

    const mobileValue = element.value;

    const regExp = new RegExp(dataPattern);

    // Catch the object from databinded object from the form....
    const ob = window[object];  // window ---> any object in the entire screen 


    if (mobileValue != "") {


        if (regExp.test(mobileValue)) {

            // element.style.border = "2px solid green";

            element.classList.remove("is-invalid");
            element.classList.add("is-valid");
            ob[property] = mobileValue;

        } else {

            // element.style.border = "2px solid red";
            element.classList.remove("is-valid");
            element.classList.add("is-invalid");
            ob[property] = null;



        }

    } else {

        element.classList.remove("is-valid");
        ob[property] = null;

        if (element.required) {

            element.classList.add("is-invalid");

        } else {

            element.classList.remove("is-invalid");

        }

    }

}

