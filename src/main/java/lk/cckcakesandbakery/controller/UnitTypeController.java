package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.UnitTypeDao;

import lk.cckcakesandbakery.entity.UnitType;

@RestController
public class UnitTypeController {

    @Autowired
    private UnitTypeDao unitTypeDao;

    // request mapping for get item all data [URL --->//siunit/alldata]
    @GetMapping(value = "/siunit/alldata", produces = "application/json")
    public List<UnitType> findAllData() {
        return unitTypeDao.findAll();

    }

}
