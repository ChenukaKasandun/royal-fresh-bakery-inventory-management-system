package lk.cckcakesandbakery.controller;


import jakarta.transaction.Transactional;
import lk.cckcakesandbakery.dao.CustomerHasItemDao;
import lk.cckcakesandbakery.dao.InvoiceHaItemDao;
import lk.cckcakesandbakery.entity.CustomerHasItem;
import lk.cckcakesandbakery.entity.InvoiceHasItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Transactional
public class InvoiceHasItemController {



    @Autowired
    private InvoiceHaItemDao invoiceHaItemDao;
    // request mapping for load InvoiceHasItem all data [URL--->
    // /invoicehasitem/alldata]
    @GetMapping(value = "/invoicehasitem/alldata", produces = "application/json")
    public List<InvoiceHasItem> findAllData() {
        return invoiceHaItemDao.findAll();
    }

//Create mapping for getting InvoiceHasItem by giving the invoice id;
    @GetMapping(value = "/invoicehasitem/byinvoiceid",params = {"invoiceid"}, produces = "application/json")
    public List<InvoiceHasItem> findByInvoiceId(@RequestParam("invoiceid")Integer invoiceid) {
        return invoiceHaItemDao.findInvoiceHaItemByInvoiceId(invoiceid);
    }

}


