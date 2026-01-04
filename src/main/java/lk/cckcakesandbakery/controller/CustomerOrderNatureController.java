package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.CustomerOrderNatureDao;

import lk.cckcakesandbakery.entity.CustomerOrderNature;

@RestController
public class CustomerOrderNatureController {

    @Autowired // generate instance
    private CustomerOrderNatureDao customerOrderNatureDao;

    // request mapping for load customer Order Nature all data [URL--->
    // /customerordernature/alldata]
    @GetMapping(value = "/customerordernature/alldata", produces = "application/json")
    public List<CustomerOrderNature> findAllData() {
        return customerOrderNatureDao.findAll();
    }

}
