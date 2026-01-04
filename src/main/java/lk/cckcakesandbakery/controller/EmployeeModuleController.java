package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.EmployeeModuleDao;

import lk.cckcakesandbakery.entity.EmployeeModule;

@RestController
public class EmployeeModuleController {

    @Autowired // generate instance
    private EmployeeModuleDao employeeModuleDao;

    // request mapping for load employee module all data [URL--->
    // /employeemodule/alldata]
    @GetMapping(value = "/employeemodule/alldata", produces = "application/json")
    public List<EmployeeModule> findAllData() {
        return employeeModuleDao.findAll();
    }

}
