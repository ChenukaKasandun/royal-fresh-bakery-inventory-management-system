package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.InvoiceStatusDao;

import lk.cckcakesandbakery.entity.InvoiceStatus;

@RestController
public class InvoiceStatusController {

    @Autowired // generate instance
    private InvoiceStatusDao invoiceStatusDao;

    // request mapping for load customer payment all data [URL--->
    // /customer/payment/alldata]
    @GetMapping(value = "/invoicestatus/alldata", produces = "application/json")
    public List<InvoiceStatus> findAllData() {
        return invoiceStatusDao.findAll();
    }

}
