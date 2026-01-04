package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.CustomerOrderTypeDao;

import lk.cckcakesandbakery.entity.CustomerOrderType;

@RestController
public class CustomerOrderTypeController {

    @Autowired // generate instance
    private CustomerOrderTypeDao customerOrderTypeDao;

    // request mapping for load customer Order type all data [URL--->
    // /customerordertype/alldata]
    @GetMapping(value = "/customerordertype/alldata", produces = "application/json")
    public List<CustomerOrderType> findAllData() {
        return customerOrderTypeDao.findAll();
    }
}
