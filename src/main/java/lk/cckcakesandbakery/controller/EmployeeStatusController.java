package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.EmployeeStatusDao;

import lk.cckcakesandbakery.entity.EmployeeStatus;

@RestController
public class EmployeeStatusController {

    @Autowired
    private EmployeeStatusDao employeeStatusDao;

    // request mapping for get employee all data [URL --->//employeestatus/alldata]
    @GetMapping(value = "/employeestatus/alldata", produces = "application/json")
    public List<EmployeeStatus> findAllData() {
        return employeeStatusDao.findAll();

    }

}
