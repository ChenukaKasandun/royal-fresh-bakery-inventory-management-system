package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.OrderCollectionMethodDao;

import lk.cckcakesandbakery.entity.OrderCollectionMethod;

@RestController
public class OrderCollectionMethodController {

    @Autowired // generate instance
    private OrderCollectionMethodDao orderCollectionMethodDao;

    // request mapping for load order collection method all data [URL--->
    // /ordercollectionmethod/alldata]
    @GetMapping(value = "/ordercollectionmethod/alldata", produces = "application/json")
    public List<OrderCollectionMethod> findAllData() {
        return orderCollectionMethodDao.findAll();
    }

}
