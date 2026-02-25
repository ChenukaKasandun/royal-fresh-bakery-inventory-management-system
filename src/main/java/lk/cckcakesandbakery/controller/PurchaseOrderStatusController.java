package lk.cckcakesandbakery.controller;


import lk.cckcakesandbakery.dao.PurchaseOrderStatusDao;
import lk.cckcakesandbakery.entity.EmployeeStatus;
import lk.cckcakesandbakery.entity.PurchaseOrderStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PurchaseOrderStatusController {


    @Autowired
    private PurchaseOrderStatusDao purchaseOrderStatusDao;

    // request mapping for get purchase Order Status other than "Delete"
    @GetMapping(value = "/purchaseorder/statusexceptdelete", produces = "application/json")
    public List<PurchaseOrderStatus> findAllData() {
        return purchaseOrderStatusDao.FindPurchaseOrderStatusExceptDelete();

    }

}
