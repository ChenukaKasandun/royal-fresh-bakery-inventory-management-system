package lk.cckcakesandbakery.controller;

import lk.cckcakesandbakery.dao.ItemReturnStatusDao;
import lk.cckcakesandbakery.entity.ItemReturnStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ItemReturningStatusController {

    @Autowired
    private ItemReturnStatusDao itemReturnStatusDao;


    // request mapping for get item all data [URL --->/itemreturnstatus/alldata]
    @GetMapping(value = "/itemreturnstatus/alldata", produces = "application/json")
    public List<ItemReturnStatus> findAllData() {
        return itemReturnStatusDao.findAll();

    }



}
