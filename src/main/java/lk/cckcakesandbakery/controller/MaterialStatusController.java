package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.MaterialStatusDao;
import lk.cckcakesandbakery.entity.MaterialStatus;

@RestController
public class MaterialStatusController {

    @Autowired
    private MaterialStatusDao materialStatusDao;

    // request mapping for get item all data [URL --->//itemstatus/alldata]
    @GetMapping(value = "/materialstatus/alldata", produces = "application/json")
    public List<MaterialStatus> findAllData() {
        return materialStatusDao.findAll();

    }

}
