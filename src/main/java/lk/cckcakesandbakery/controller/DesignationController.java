package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.DesignationDao;
import lk.cckcakesandbakery.entity.Designation;

@RestController
public class DesignationController {

    @Autowired // generate instance
    private DesignationDao designationDao;

    // request mapping for load designation all data [URL---> /designation/alldata]
    @GetMapping(value = "/designation/alldata", produces = "application/json")
    public List<Designation> findAllData() {
        return designationDao.findAll();
    }

}
