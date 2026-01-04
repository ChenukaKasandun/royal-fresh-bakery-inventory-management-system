package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.CustomerTypeDao;

import lk.cckcakesandbakery.entity.CustomerTypes;

@RestController
public class CustomerTypeController {

    @Autowired // generate instance
    private CustomerTypeDao customerTypeDao;

    // request mapping for load customer type all data [URL--->
    // /customertype/alldata]
    @GetMapping(value = "/customertype/alldata", produces = "application/json")
    public List<CustomerTypes> findAllData() {
        return customerTypeDao.findAll();
    }

}
