package lk.cckcakesandbakery.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lk.cckcakesandbakery.dao.SupplierStatuSDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import lk.cckcakesandbakery.dao.SupplierDao;
import lk.cckcakesandbakery.dao.UserDao;
import lk.cckcakesandbakery.entity.Privilege;
import lk.cckcakesandbakery.entity.Supplier;
import lk.cckcakesandbakery.entity.User;

@RestController
public class SupplyController {

    @Autowired
    private SupplierDao supplierDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    @Autowired
    private SupplierStatuSDao supplierStatuSDao;

    // request mapping for load supply ui[URL --->/supply]
    @RequestMapping(value = "/supplier")
    public ModelAndView loadSupplyUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView supplyUI = new ModelAndView();
        supplyUI.setViewName("supplierManagement.html");

        supplyUI.addObject("loggedusername", auth.getName());
        supplyUI.addObject("title", "supplir");

        return supplyUI;
    }

//    Requesting Supplier object relevant to given purchase order id
@GetMapping(value = "/supplier/getsuppliernamebypono/{poId}" , produces = "application/json")
public List<Supplier> getSupplierNameByPoNo(@PathVariable ("poId")  Integer poId) {
        return supplierDao.getSupplierByPoId(poId);
}


    // .............CRUD.............................

    // 1...................Select................... .
    // request mapping for get supplier all data [URL --->//supplier/alldata]
    @GetMapping(value = "/supplier/alldata", produces = "application/json")
    public List<lk.cckcakesandbakery.entity.Supplier> findAllData() {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Supplier");

        if (userPrivilege.getPrivi_select()) {
            return supplierDao.findAll(Sort.by(Sort.Direction.DESC, "id"));

        } else {

            return new ArrayList<>();
        }

    }

    // 2.....................Insert..........................
    // request mapping for insert supplier data from the frontend [URL
    // --->//supplier/insert]
    @PostMapping(value = "/supplier/insert")
    public String saveSupplierData(@RequestBody lk.cckcakesandbakery.entity.Supplier supplier) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Supplier");

        if (userPrivilege.getPrivi_insert()) {

            // duplicate check

            // Email Duplicate Check
            Supplier extSupplierByEmail = supplierDao.getSupplierByEmail(supplier.getSupplier_email());
            if (extSupplierByEmail != null && extSupplierByEmail.getId() != supplier.getId()) {
                // return "Save not Completed : Email Allready exist..! ";
                return "Update Not Completed  : Entered Email " + supplier.getSupplier_email() + " already exist...!";

            }

            // Mobile No Duplicate Check
            Supplier extSupplierByMobile = supplierDao.getSupplierByMobileNo(supplier.getSupplier_contact());
            if (extSupplierByMobile != null && extSupplierByMobile.getId() != supplier.getId()) {
                return "Update Not Completed : Entered Mobile No " + supplier.getSupplier_contact()
                        + "already exists...!";

            }

            try {

                // Set auto added data
                supplier.setAdd_date_time(LocalDateTime.now());
                supplier.setAdd_user_id(loggedUser.getId());

                // save operator(save frontend object)
                supplierDao.save(supplier);
                return "OK";
            } catch (Exception e) {
                return "Save not completed :" + e.getMessage();
            }

        } else {

            return " CannotSubmit...! User do not have Permissions..!";

        }

    }

    // 3.............Delete................................
    /// Delete rawmaterial data from the frontend [URL --->//rawmaterial/delete]
    @DeleteMapping(value = "/supplier/delete")
    public String deleteSupplier(@RequestBody Supplier supplier) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Supplier");

        if (userPrivilege.getPrivi_delete()) {

            // Check ext (Existing)
            if (supplier.getId() == null) {
                return "Delete not completed : Supplier not exists..!";

            } // This refers there is no id in the object,so cannot delete..!

            Supplier extSupplierById = supplierDao.getReferenceById(supplier.getId());

            if (extSupplierById == null) {
                return "Delete Not Completed : Customer not exists...!";

            } // This refferes to there is a id of thre object,but ithat id is not in the
              // database

            try {

                // Set auto added data
                extSupplierById.setDelete_date_time(LocalDateTime.now());
                extSupplierById.setDelete_user_id(loggedUser.getId());
                extSupplierById.setSupplier_registration_status_id(supplierStatuSDao.getReferenceById(3));

                supplierDao.save(extSupplierById);

                // Dependancy

                return "OK";

            } catch (Exception e) {
                return "Delete not completed : " + e.getMessage();
            }

        } else {
            return "Cannot Delete..! User do not have permissions...!";
        }

    }

    // 4................Update.....................
    // Mapping for save fontend dataob to the database
    @PutMapping("supplier/update")
    public String updateSupplierData(@RequestBody Supplier supplier) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Supplier");

        if (userPrivilege.getPrivi_update()) {

            // duplicate check

            // Email Duplicate Check
            Supplier extSupplierByEmail = supplierDao.getSupplierByEmail(supplier.getSupplier_email());
            if (extSupplierByEmail != null && extSupplierByEmail.getId() != supplier.getId()) {
                // return "Save not Completed : Email Allready exist..! ";
                return "Update Not Completed  : Entered Email " + supplier.getSupplier_email() + " already exist...!";

            }

            // Mobile No Duplicate Check
            Supplier extSupplierByMobile = supplierDao.getSupplierByMobileNo(supplier.getSupplier_contact());
            if (extSupplierByMobile != null && extSupplierByMobile.getId() != supplier.getId()) {
                return "Update Not Completed : Entered Mobile No " + supplier.getSupplier_contact()
                        + "already exists...!";

            }

            try {

                // Set auto added data
                supplier.setUpdate_date_time((LocalDateTime.now()));
                supplier.setUpdate_user_id(loggedUser.getId());

                // Save operator(save fontend data object)
                supplierDao.save(supplier);
                return "OK";
            } catch (Exception e) {

                return "Update Not Completed :" + e.getMessage();
            }
        } else {

            return "Cannot Update..!User havn't permissions..!";

        }

    }

}
