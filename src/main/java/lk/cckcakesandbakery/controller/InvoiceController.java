package lk.cckcakesandbakery.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.cckcakesandbakery.dao.CustomerDao;
import lk.cckcakesandbakery.dao.InvoiceDao;
import lk.cckcakesandbakery.dao.InvoiceStatusDao;
import lk.cckcakesandbakery.dao.UserDao;
import lk.cckcakesandbakery.entity.Invoice;
import lk.cckcakesandbakery.entity.Privilege;
import lk.cckcakesandbakery.entity.User;

@RestController
public class InvoiceController {

    @Autowired
    private InvoiceDao invoiceDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private CustomerDao customerDao;

    @Autowired
    private InvoiceStatusDao invoiceStatusDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    // request mapping for load invoice ui[URL --->/invoice]
    @RequestMapping(value = "/invoice")
    public ModelAndView loadInvoiceUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView invoiceUI = new ModelAndView();
        invoiceUI.setViewName("Invoice Management.html");

        invoiceUI.addObject("loggedusername", auth.getName());
        invoiceUI.addObject("title", "invoice");

        return invoiceUI;
    }

    // request mapping for get invoice no by customer name [URL
    // --->//invoiceno/customer]
    @GetMapping(value = "/invoice/invoicenobycustomername", params = {
            "customerName" }, produces = "application/json")
    public List<String> findAllInvoiceNoByCustomerName(@RequestParam(name = "customerName") String customerName) {

        // Get Customer ID from Customer Name
        Integer customerId = customerDao.getCustomerIdByName(customerName);
        // Get Invoice No by Customer ID
        return invoiceDao.getInvoiceNoByCustomerId(customerId);
    }

    // ...................CRUD Operations.......................

    // 1..................Select................................
    // request mapping for get invice all data [URL --->//invoice/alldata]
    @GetMapping(value = "/invoice/alldata", produces = "application/json")
    public List<Invoice> findAllData() {

        // check logged user Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Invoice");

        if (userPrivilege.getPrivi_select()) {
            return invoiceDao.findAll(Sort.by(Direction.DESC, "id"));

        } else {
            return new ArrayList<>();
        }

    }

    // request mapping for insert invoice data from the frontend [URL
    // --->//invoice/insert]

    // ...............Insert.......................
    @PostMapping(value = "/invoice/insert")
    public String saveInvoiceData(@RequestBody Invoice invoice) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Invoice");

        if (userPrivilege.getPrivi_insert()) {

            // duplicate check

            try {

                // Set auto added data
                invoice.setAdd_date_time(LocalDateTime.now());
                invoice.setAdd_user_id(loggedUser.getId());
                invoice.setInvoice_no(invoiceDao.getNextInvoiceNo());

                // save operator(save frontend object)
                invoiceDao.save(invoice);
                return "OK";
            } catch (Exception e) {
                return "Save not completed :" + e.getMessage();
            }

        } else {

            return "Cannot Submit..!User do not have Permissions..!";

        }

    }

    // 3.........................Delete................
    /// Delete rawmaterial data from the frontend [URL --->//rawmaterial/delete]
    @DeleteMapping(value = "/invoice/delete")
    public String deleteInvoice(@RequestBody Invoice invoice) {

        // Check logged User Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check user Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Invoice");

        if (userPrivilege.getPrivi_delete()) {

            // Check ext (Existing)
            if (invoice.getId() == null) {
                return "Delete not completed :Invoice not exists..!";

            } // This refers there is no id in the object,so cannot delete..!

            Invoice extInvoiceById = invoiceDao.getReferenceById(invoice.getId());

            if (extInvoiceById == null) {
                return "Delete Not Completed : Invoice not exists...!";

            } // This refferes to there is a id of thre object,but ithat id is not in the
              // database

            try {

                // Set auto added data
                extInvoiceById.setDelete_date_time(LocalDateTime.now());
                extInvoiceById.setDelete_user_id(loggedUser.getId());
                extInvoiceById.setInvoice_status_id(invoiceStatusDao.getReferenceById(3));

                invoiceDao.save(extInvoiceById);

                // invoiceDao.delete(extInvoiceById);

                // Dependancy

                return "OK";

            } catch (Exception e) {
                return "Delete not completed : " + e.getMessage();
            }

        } else {

            return "Cannot Delete..! User Do not have Permissions..!";

        }

    }

    // 4....................Update............................
    @PutMapping("invoice/update")
    public String updateInvoiceData(@RequestBody Invoice invoice) {

        // Check logged User Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Invoice");

        if (userPrivilege.getPrivi_update()) {

            // Item name Duplicate Check
            Invoice extInvoiceByNo = invoiceDao.getByInvoiceNo(invoice.getInvoice_no());
            if (extInvoiceByNo != null && extInvoiceByNo.getId() != invoice.getId()) {

                return "Save Not Completed  : Selected Invoice " + invoice.getInvoice_no() + " already exist...!";

            }

            try {

                // Set auto added data
                invoice.setUpdate_date_time((LocalDateTime.now()));
                invoice.setUpdate_user_id(loggedUser.getId());

                // Save operator(save fontend data object)
                invoiceDao.save(invoice);
                return "OK";
            } catch (Exception e) {

                return "Update Not Completed :" + e.getMessage();
            }

        } else {

            return "Cannot Update..! User do not have Privileges..!";
        }

    }

}
