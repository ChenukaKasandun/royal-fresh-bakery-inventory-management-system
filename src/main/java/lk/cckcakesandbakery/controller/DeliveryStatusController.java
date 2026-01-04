package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.DeliveryStatusDao;

import lk.cckcakesandbakery.entity.DeliveryStatus;

@RestController
public class DeliveryStatusController {

    @Autowired // generate instance
    private DeliveryStatusDao deliveryStatusDao;

    // request mapping for load customer payment all data [URL--->
    // /customer/payment/alldata]
    @GetMapping(value = "/deliverystatus/alldata", produces = "application/json")
    public List<DeliveryStatus> findAllData() {
        return deliveryStatusDao.findAll();
    }

}
