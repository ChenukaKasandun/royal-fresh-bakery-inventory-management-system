package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.OrderStatusDao;

import lk.cckcakesandbakery.entity.OrderStatus;

@RestController
public class OrderStatusController {

    @Autowired
    private OrderStatusDao orderStatusDao;

    // request mapping for get order all data [URL --->//orderstatus/alldata]
    @GetMapping(value = "/orderstatus/alldata", produces = "application/json")
    public List<OrderStatus> findAllData() {
        return orderStatusDao.findAll();

    }

}
