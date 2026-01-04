package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import lk.cckcakesandbakery.dao.ItemReturnStatusDao;
import lk.cckcakesandbakery.entity.ItemReturnStatus;

@RestController
public class ItemReturnStatusController {

    @Autowired
    private ItemReturnStatusDao itemReturnStatusDao;

    // request mapping for get grn all data [URL --->//grnstatus/alldata]
    @GetMapping(value = "/itemreturnstatus/alldata", produces = "application/json")
    public List<ItemReturnStatus> findAllData() {
        return itemReturnStatusDao.findAll();

    }

}
