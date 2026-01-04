package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.EmployeeCivilStatusDao;

import lk.cckcakesandbakery.entity.EmployeeCivilStatus;

@RestController
public class EmployeeCivilStatusController {

    @Autowired // generate instance
    private EmployeeCivilStatusDao employeeCivilStatusDao;

    // request mapping for load civil status all data [URL--->

    @GetMapping(value = "/emplyeecivilstatus/alldata", produces = "application/json")
    public List<EmployeeCivilStatus> findAllData() {
        return employeeCivilStatusDao.findAll();
    }

}
