package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.ProductionStatusDao;

import lk.cckcakesandbakery.entity.ProductionStatus;

@RestController
public class ProductionStatusController {

    @Autowired // generate instance
    private ProductionStatusDao productionStatusDao;

    // request mapping for load customer type all data [URL--->
    // /customertype/alldata]
    @GetMapping(value = "/productionstatus/alldata", produces = "application/json")
    public List<ProductionStatus> findAllData() {
        return productionStatusDao.findAll();
    }

}
