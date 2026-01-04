package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.CustomerPaymentMethodDao;

import lk.cckcakesandbakery.entity.CustomerPaymentMethod;

@RestController
public class CustomerPaymentMethodController {
    @Autowired // generate instance
    private CustomerPaymentMethodDao customerPaymentMethodDao;

    // request mapping for load customer payment all data [URL--->
    // /customer/payment/alldata]
    @GetMapping(value = "/customerpaymentmethod/alldata", produces = "application/json")
    public List<CustomerPaymentMethod> findAllData() {
        return customerPaymentMethodDao.findAll();
    }

}
