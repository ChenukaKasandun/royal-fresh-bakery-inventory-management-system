package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.ProductionOrderStatusDao;
import lk.cckcakesandbakery.entity.ItemProductionOrderStatus;

@RestController
public class ProductionOrderStatusController {

    @Autowired
    private ProductionOrderStatusDao productionOrderStatusDao;

    // request mapping for get order all data [URL
    // --->//productionorderstatus/alldata]
    @GetMapping(value = "/productionorderstatus/alldata", produces = "application/json")
    public List<ItemProductionOrderStatus> findAllData() {
        return productionOrderStatusDao.findAll();

    }

}
