package lk.cckcakesandbakery.controller;


import jakarta.transaction.Transactional;
import lk.cckcakesandbakery.dao.CustomerOrderHasItemDao;
import lk.cckcakesandbakery.entity.CustomerOrderHasItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Transactional
public class CustomerOrderHasItemController {



    @Autowired
    private CustomerOrderHasItemDao customerOrderHasItemDao;


    // request mapping for load customerOrderKasItem all data [URL--->
    // /customerorderhasitem/alldata]
    @GetMapping(value = "/customerorderhasitem/alldata", produces = "application/json")
    public List<CustomerOrderHasItem> findAllData() {
        return customerOrderHasItemDao.findAll();
    }

//Create mapping for getting CustomerOrderHasItemData by giving the customer id;
    @GetMapping(value = "/customerorderhasitem/bycustomerorderid",params = {"customerorderid"}, produces = "application/json")
    public List<CustomerOrderHasItem> findByCustomerid(@RequestParam("customerorderid")Integer customerorderid) {
        return customerOrderHasItemDao.findCustomerOrderHasItemByCustomerId(customerorderid);
    }

    //Create mapping for getting CustomerOrderHasItemData by giving the Invoice No;
    @GetMapping(value = "/customerorderhasitem/byinvoiceno",params = {"invoiceno"}, produces = "application/json")
    public List<CustomerOrderHasItem> findByInvoiceNo(@RequestParam("invoiceno")String invoiceno) {
        return customerOrderHasItemDao.findCustomerOrderHasItemByInvoiceNo(invoiceno);
    }

    //Create mapping for getting CustomerOrderHasItemData by giving Customer OrderId and SessionId;
    @GetMapping(value = "/customerorderhasitem/byorderidandsessionid",produces = "application/json")
    public List<CustomerOrderHasItem> findBySessionIdandOrderId(@RequestParam("sessionId")Integer sessionId,
    @RequestParam("customerOrderId") Integer customerOrderId) {
        return customerOrderHasItemDao.findCustomerOrderHasItemByProductionSessionIdAndOrderId(sessionId,customerOrderId);
    }

}


