package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.BankDao;
import lk.cckcakesandbakery.entity.Bank;

@RestController
public class BankController {

    @Autowired // generate instance
    private BankDao bankDao;

    // request mapping for load bank all data [URL--->
    // /bank/alldata]
    @GetMapping(value = "/bank/alldata", produces = "application/json")
    public List<Bank> findAllData() {
        return bankDao.findAll();
    }

}
