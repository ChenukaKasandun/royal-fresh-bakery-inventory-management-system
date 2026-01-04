package lk.cckcakesandbakery.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import lk.cckcakesandbakery.dao.ProductionOrderTypeDao;
import lk.cckcakesandbakery.entity.ProductionOrderType;

@RestController
public class ProductionOrderTypeController {

    @Autowired
    ProductionOrderTypeDao productionOrderTypeDao;

    // request mapping for get order all data [URL
    // --->//productionordertype/alldata]
    @GetMapping(value = "/productionordertype/alldata", produces = "application/json")
    public List<ProductionOrderType> findAllData() {
        return productionOrderTypeDao.findAll();

    }

}
