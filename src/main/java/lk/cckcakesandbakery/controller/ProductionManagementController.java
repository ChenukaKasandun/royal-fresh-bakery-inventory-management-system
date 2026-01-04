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

import lk.cckcakesandbakery.dao.ProductionManagementDao;
import lk.cckcakesandbakery.dao.UserDao;
import lk.cckcakesandbakery.entity.Privilege;
import lk.cckcakesandbakery.entity.ProductionManagement;
import lk.cckcakesandbakery.entity.User;

@RestController
public class ProductionManagementController {

    @Autowired
    private ProductionManagementDao productionManagementDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    // request mapping for load Production Management ui[URL --->/production]
    @RequestMapping(value = "/production")
    public ModelAndView loadProductionUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView productionUI = new ModelAndView();
        productionUI.setViewName("productionManagement.html");
        productionUI.addObject("loggedusername", auth.getName());

        return productionUI;
    }

    // .............................CRUD Operations...............

    // 1....................Select.................................
    // request mapping for get employee all data [URL --->//production/alldata]
    @GetMapping(value = "/production/alldata", produces = "application/json")
    public List<ProductionManagement> findAllData() {

        // check logged user Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Production");

        if (userPrivilege.getPrivi_select()) {
            return productionManagementDao.findAll(Sort.by(Direction.DESC, "id"));

        } else {
            return new ArrayList<>();
        }

    }

    // 2........................Insert.....................
    // request mapping for insert production from the frontend [URL
    // --->//productionorder/insert]
    @PostMapping(value = "/production/insert")
    public String saveProductionOrderData(@RequestBody ProductionManagement production) {

        // Check logged user authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Production");

        if (userPrivilege.getPrivi_insert()) {

            // duplicate check

            try {

                // Set auto added data
                production.setAdded_date_time(LocalDateTime.now());
                production.setAdded_user_id(loggedUser.getId());

                // save operator(save frontend object)
                productionManagementDao.save(production);
                return "OK";
            } catch (Exception e) {
                return "Save not completed :" + e.getMessage();
            }

        } else {

            return "Cannot Submit..! User havn't permissions..!";

        }

    }

    // 3..................Delete.......................
    /// Delete rawmaterial data from the frontend [URL --->//rawmaterial/delete]
    @DeleteMapping(value = "/production/delete")
    public String deleteItem(@RequestBody ProductionManagement production) {

        // Check logged user authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Production");

        if (userPrivilege.getPrivi_delete()) {

            // Check ext (Existing)
            if (production.getId() == null) {
                return "Delete not completed : Production not exists..!";

            } // This refers there is no id in the object,so cannot delete..!

            ProductionManagement extProductionById = productionManagementDao.getReferenceById(production.getId());

            if (extProductionById == null) {
                return "Delete Not Completed : Production not exists...!";

            } // This refferes to there is a id of thre object,but ithat id is not in the
              // database

            try {

                // Set auto added data
                extProductionById.setDelete_date_time(LocalDateTime.now());
                extProductionById.setAdded_user_id(loggedUser.getId());

                productionManagementDao.delete(extProductionById);

                // Dependancy

                return "OK";

            } catch (Exception e) {
                return "Delete not completed : " + e.getMessage();
            }

        } else {

            return "Cannot Delete...!User havn't permissions..!";

        }

    }

    // 4....................Update............................
    @PutMapping("production/update")
    public String updateInvoiceData(@RequestBody ProductionManagement production) {

        // Check logged User Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Production");

        if (userPrivilege.getPrivi_update()) {

            try {

                // Set auto added data
                production.setUpdate_date_time((LocalDateTime.now()));
                production.setUpdate_user_id(loggedUser.getId());

                // Save operator(save fontend data object)
                productionManagementDao.save(production);
                return "OK";
            } catch (Exception e) {

                return "Update Not Completed :" + e.getMessage();
            }

        } else {

            return "Cannot Update..! User do not have Privileges..!";
        }

    }
}
