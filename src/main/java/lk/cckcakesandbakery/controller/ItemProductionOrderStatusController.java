package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.ItemProductionOrderStatusDao;

import lk.cckcakesandbakery.entity.ItemProductionOrderStatus;

@RestController
public class ItemProductionOrderStatusController {

    @Autowired
    private ItemProductionOrderStatusDao itemProductionOrderStatusDao;

    // request mapping for get order all data [URL --->//orderstatus/alldata]
    @GetMapping(value = "/productionOrderStatus/alldata", produces = "application/json")
    public List<ItemProductionOrderStatus> findAllData() {
        return itemProductionOrderStatusDao.findAll();

    }

}
