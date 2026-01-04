package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.SupplierPaymentStatusDao;
import lk.cckcakesandbakery.entity.SupplierPaymentStatus;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class SupplierPaymentStatusController {

    @Autowired
    private SupplierPaymentStatusDao supplierPaymentStatusDao;;

    // request mapping for get stock all data [URL --->//stockstatus/alldata]
    @GetMapping(value = "/supplierpaymentstatus/alldata", produces = "application/json")
    public List<SupplierPaymentStatus> findAllData() {
        return supplierPaymentStatusDao.findAll();

    }

}
