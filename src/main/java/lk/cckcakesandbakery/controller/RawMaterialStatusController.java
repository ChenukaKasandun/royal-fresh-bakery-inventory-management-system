package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.RawMaterialStatusDao;
import lk.cckcakesandbakery.entity.RawMaterialStatus;

@RestController
public class RawMaterialStatusController {

    @Autowired
    private RawMaterialStatusDao rawMaterialStatusDao;

    // request mapping for get rawmaterial status all data [URL
    // --->//rawmaterialstatus/alldata]
    @GetMapping(value = "rawmaterialstatus/alldata", produces = "application/json")
    public List<RawMaterialStatus> findAllData() {
        return rawMaterialStatusDao.findAll();

    }

}
