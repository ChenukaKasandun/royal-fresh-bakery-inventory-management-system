

//get birth year function from birthdate

const getBirthYear = () => {
    return dataOb.dob.substring(0, 4);

    //or

    return new Date(dataOb.date).getFullYear();
}



