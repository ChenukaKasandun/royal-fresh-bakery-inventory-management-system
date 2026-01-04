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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.cckcakesandbakery.dao.SupplierPaymentDao;
import lk.cckcakesandbakery.dao.UserDao;
import lk.cckcakesandbakery.entity.Privilege;
import lk.cckcakesandbakery.entity.SupplierPayment;
import lk.cckcakesandbakery.entity.User;

@RestController
public class supplierPaymentController {

    @Autowired
    private SupplierPaymentDao supplierPaymentDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    // request mapping for load supplier payment ui[URL --->/supplierPayment]
    @RequestMapping(value = "/supplierpayment")
    public ModelAndView loadSupplierPaymentUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView supplierPaymentUI = new ModelAndView();
        supplierPaymentUI.setViewName("supplierPayment.html");

        supplierPaymentUI.addObject("loggedusername", auth.getName());
        supplierPaymentUI.addObject("title", "supplier payment");

        return supplierPaymentUI;
    }

    // .................CRUD......................
    // 1...............Select.....................
    // request mapping for get supplier payment all data [URL
    // --->//supplierPayment/alldata]
    @GetMapping(value = "/supplierpayment/alldata", produces = "application/json")
    public List<SupplierPayment> findAllData() {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()),
                "supplier_payment");

        if (userPrivilege.getPrivi_select()) {

            return supplierPaymentDao.findAll(Sort.by(Direction.DESC, "id"));

        } else {

            return new ArrayList<>();

        }

    }

    // 2.....................Insert......................
    // request mapping for insert supplier payment data from the frontend [URL
    // --->//supplier/insert]
    @PostMapping(value = "/supplierpayment/insert")
    public String saveSupplierPaymentData(@RequestBody lk.cckcakesandbakery.entity.SupplierPayment supplierPayment) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "supplier_payment");

        if (userPrivilege.getPrivi_insert()) {

            try {

                // Set auto added data
                supplierPayment.setAdded_date_time(LocalDateTime.now());
                supplierPayment.setAdded_user_id(loggedUser.getId());

                // save operator(save frontend object)
                supplierPaymentDao.save(supplierPayment);
                return "OK";
            } catch (Exception e) {
                return "Save not completed :" + e.getMessage();
            }
        } else {

            return "Cannot Submit..!User Do not have privileges.......!";

        }

        // duplicate check

    }

    // ........................Delete...................
    /// Delete rawmaterial data from the frontend [URL --->//rawmaterial/delete]
    @DeleteMapping(value = "/supplierpayment/delete")
    public String deleteSupplierPayment(@RequestBody SupplierPayment supplierPayment) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "supplier_payment");

        if (userPrivilege.getPrivi_delete()) {

            // Check ext (Existing)
            if (supplierPayment.getId() == null) {
                return "Delete not completed : Supplier Payment not exists..!";

            } // This refers there is no id in the object,so cannot delete..!

            SupplierPayment extSupplierPaymentById = supplierPaymentDao.getReferenceById(supplierPayment.getId());

            if (extSupplierPaymentById == null) {
                return "Delete Not Completed : Supplier Payment not exists...!";

            } // This refferes to there is a id of thre object,but ithat id is not in the
              // database

            try {

                // Set auto added data
                extSupplierPaymentById.setDelete_date_time(LocalDateTime.now());
                extSupplierPaymentById.setDelete_user_id(loggedUser.getId());

                supplierPaymentDao.delete(extSupplierPaymentById);

                // Dependancy

                return "OK";

            } catch (Exception e) {
                return "Delete not completed : " + e.getMessage();
            }

        } else {

            return "Cannot Delete...! User do not have permissions...!";

        }

    }

    // 4................Update.....................
    // Mapping for save fontend dataob to the database
    @PutMapping("supplierpayment/update")
    public String updateSupplierPaymentData(@RequestBody SupplierPayment supplierPayment) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()),
                "supplier_payment");

        if (userPrivilege.getPrivi_update()) {

            // duplicate check

            try {

                // Set auto added data
                supplierPayment.setUpdate_date_time((LocalDateTime.now()));
                supplierPayment.setUpdate_user_id(loggedUser.getId());

                // Save operator(save fontend data object)
                supplierPaymentDao.save(supplierPayment);
                return "OK";
            } catch (Exception e) {

                return "Update Not Completed :" + e.getMessage();
            }
        } else {

            return "Cannot Update..!User havn't permissions..!";

        }

    }

}
