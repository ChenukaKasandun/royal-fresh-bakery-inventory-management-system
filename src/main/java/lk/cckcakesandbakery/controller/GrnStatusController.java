package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.GrnStatusDao;

import lk.cckcakesandbakery.entity.GrnStatus;

@RestController
public class GrnStatusController {

    @Autowired
    private GrnStatusDao grnStatusDao;

    // request mapping for get grn all data [URL --->//grnstatus/alldata]
    @GetMapping(value = "/grnstatus/alldata", produces = "application/json")
    public List<GrnStatus> findAllData() {
        return grnStatusDao.findAll();

    }

}
