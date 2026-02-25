
package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.CustomerStatusDao;
import lk.cckcakesandbakery.entity.CustomerStatus;

@RestController
public class CustomerStatusController {

    @Autowired // generate instance
    private CustomerStatusDao customerStatusDao;

    // request mapping for load customer payment all data [URL--->
    // /customer/payment/alldata]
    @GetMapping(value = "/customerstatus/alldata", produces = "application/json")
    public List<CustomerStatus> findAllData() {
        return customerStatusDao.findAll();
    }

    //Retriving customer status other than "Deleted"
    @GetMapping(value = "/customerstatus/getbycustomerstatus", produces = "application/json")
    public List<CustomerStatus>getByCustomerStatusotherthanDelete(){

        return customerStatusDao.getByCustomerStatus();
    }


}
