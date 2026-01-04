package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.CustomerPaymentTypeDao;

import lk.cckcakesandbakery.entity.CustomerPaymentType;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class CustomerPaymentTypeController {
    @Autowired // generate instance
    private CustomerPaymentTypeDao customerPaymentTypeDao;

    // request mapping for load customer payment all data [URL--->
    // /customerpaymenttype/alldata]
    @GetMapping(value = "/customerpaymenttype/alldata", produces = "application/json")
    public List<CustomerPaymentType> findAllData() {
        return customerPaymentTypeDao.findAll();
    }

}
