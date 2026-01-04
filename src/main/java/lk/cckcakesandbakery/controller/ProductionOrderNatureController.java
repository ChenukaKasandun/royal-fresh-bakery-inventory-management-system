package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.ProductionOrderNatureDao;

import lk.cckcakesandbakery.entity.ProductionOrderNature;

@RestController
public class ProductionOrderNatureController {

    @Autowired
    private ProductionOrderNatureDao productionOrderNatureDao;

    // request mapping for get Production Order Nature all data [URL
    // --->//productionorderstatus/alldata]
    @GetMapping(value = "/productionordernature/alldata", produces = "application/json")
    public List<ProductionOrderNature> findAllData() {
        return productionOrderNatureDao.findAll();

    }

}
