package lk.cckcakesandbakery.controller;

import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.ProductionSessionDao;
import lk.cckcakesandbakery.entity.ProductionSession;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class ProductionSessionController {

    @Autowired
    private ProductionSessionDao productionSessionDao;

    // request mapping for get production session all data [URL
    // --->//productionsession/alldata]
    @GetMapping(value = "/productionsession/alldata", produces = "application/json")
    public List<ProductionSession> findAllData() {
        return productionSessionDao.findAll();

    }

}
