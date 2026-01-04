package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.SupplierDeliveryMethodDao;
import lk.cckcakesandbakery.entity.SupplierDeliveryMethod;

@RestController
public class SupplierDeliveryMethodController {

    @Autowired
    private SupplierDeliveryMethodDao supplierDeliveryMethodDao;

    // request mapping for get stock all data [URL --->//stockstatus/alldata]
    @GetMapping(value = "/supplierdeliverymethod/alldata", produces = "application/json")
    public List<SupplierDeliveryMethod> findAllData() {
        return supplierDeliveryMethodDao.findAll();

    }

}
