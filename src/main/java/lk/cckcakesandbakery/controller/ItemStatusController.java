package lk.cckcakesandbakery.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import lk.cckcakesandbakery.dao.ItemStatusDao;
import lk.cckcakesandbakery.entity.ItemStatus;

@RestController
public class ItemStatusController {

    @Autowired
    private ItemStatusDao itemStatusDao;

    // request mapping for get item all data [URL --->//itemstatus/alldata]
    @GetMapping(value = "/itemstatus/alldata", produces = "application/json")
    public List<ItemStatus> findAllData() {
        return itemStatusDao.findAll();

    }

    // request mapping for get item all data [URL --->//itemstatusbyid/alldata]
    @GetMapping(value = "/itemstatusbyid/alldata", produces = "application/json")
    public List<ItemStatus> findAllDatabyId() {
        return itemStatusDao.getStatusById();

    }

}
