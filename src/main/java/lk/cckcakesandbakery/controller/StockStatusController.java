package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.StockStatusDao;

import lk.cckcakesandbakery.entity.StockStatus;

@RestController
public class StockStatusController {

    @Autowired
    private StockStatusDao stockStatusDao;

    // request mapping for get stock all data [URL --->//stockstatus/alldata]
    @GetMapping(value = "/stockstatus/alldata", produces = "application/json")
    public List<StockStatus> findAllData() {
        return stockStatusDao.findAll();

    }

}
