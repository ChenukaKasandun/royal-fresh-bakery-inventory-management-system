package lk.cckcakesandbakery.controller;


import jakarta.transaction.Transactional;
import lk.cckcakesandbakery.dao.CustomerHasItemDao;
import lk.cckcakesandbakery.entity.Bank;
import lk.cckcakesandbakery.entity.CustomerHasItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Transactional
public class CustomerHasItemController {



    @Autowired
    private CustomerHasItemDao  customerHasItemDao;
    // request mapping for load bank all data [URL--->
    // /customerhasitem/alldata]
    @GetMapping(value = "/customerhasitem/alldata", produces = "application/json")
    public List<CustomerHasItem> findAllData() {
        return customerHasItemDao.findAll();
    }

//Create mapping for getting CustomerHasItemData by giving the customer id;
    @GetMapping(value = "/customerhasitem/bycustomerid",params = {"customerid"}, produces = "application/json")
    public List<CustomerHasItem> findByCustomerid(@RequestParam("customerid")Integer customerid) {
        return customerHasItemDao.findCustomerItemByCustomerId(customerid);
    }

}


