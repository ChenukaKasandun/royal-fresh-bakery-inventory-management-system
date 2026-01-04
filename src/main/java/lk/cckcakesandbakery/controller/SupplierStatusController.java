package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.SupplierStatuSDao;

import lk.cckcakesandbakery.entity.SupplierRegStatus;

@RestController
public class SupplierStatusController {

    @Autowired
    private SupplierStatuSDao supplierStatuSDao;

    // request mapping for get supplier Status all data [URL
    // --->//supplierstatus/alldata]
    @GetMapping(value = "/supplierstatus/alldata", produces = "application/json")
    public List<SupplierRegStatus> findAllData() {
        return supplierStatuSDao.findAll();

    }

}
