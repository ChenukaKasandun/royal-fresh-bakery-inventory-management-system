package lk.cckcakesandbakery.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import lk.cckcakesandbakery.entity.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
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

import lk.cckcakesandbakery.dao.ItemProductionOrderDao;
import lk.cckcakesandbakery.dao.UserDao;
import lk.cckcakesandbakery.entity.ItemProductionOrder;
import lk.cckcakesandbakery.entity.Privilege;
import lk.cckcakesandbakery.entity.User;

@RestController
public class ItemProductionOrderController {

    @Autowired
    private ItemProductionOrderDao itemProductionOrderDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    // request mapping for load itemProductionOrder ui[URL --->/productionorder]
    @RequestMapping(value = "/productionorder")
    public ModelAndView loadProductionOrderUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView productionOrderUI = new ModelAndView();
        productionOrderUI.setViewName("itemproductionorder.html");
        productionOrderUI.addObject("loggedusername", auth.getName());

        return productionOrderUI;
    }

    // Requesting customers based on customer type ----> Individual
    @GetMapping("/productionorder/alldatagetbydate")
    public List<ItemProductionOrder> findAllDataByDate() {
        return itemProductionOrderDao.getItemProductionOrderNoByDate("production_date");
    }


    // ........................CRUD Operations..................

    // 1....................Select..............................
    // request mapping for get itemproductionorder all data [URL
    // --->//itemproductionorder/alldata]
    @GetMapping(value = "/productionorder/alldata", produces = "application/json")
    public List<ItemProductionOrder> findAllData() {

        // check logged user Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Production_order");

        if (userPrivilege.getPrivi_select()) {

            return itemProductionOrderDao.findAll(Sort.by(Sort.Direction.DESC, "id"));

        } else {

            return new ArrayList<>();

        }

    }

    // 2..............Insert.................
    // request mapping for insert stock data from the frontend [URL
    // --->//productionorder/insert]
    @PostMapping(value = "/productionorder/insert")
    public String saveProductionOrderData(@RequestBody ItemProductionOrder productionOrder) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Production_order");

        if (userPrivilege.getPrivi_insert()) {

            try {
                // duplicate check
                // Set auto added data
                productionOrder.setAdd_date_time(LocalDateTime.now());
                productionOrder.setAdded_user_id(loggedUser.getId());
                productionOrder.setProduction_order_no(itemProductionOrderDao.getNextProductionOrderNo());

                // save operator(save frontend object)
                itemProductionOrderDao.save(productionOrder);
                return "OK";
            } catch (Exception e) {
                return "Save not completed :" + e.getMessage();
            }

        } else {

            return "Cannot Submit..!User havn't Permissions....!";
        }

    }

    // 3.......................Delete.................
    /// Delete rawmaterial data from the frontend [URL --->//rawmaterial/delete]
    @DeleteMapping(value = "/productionorder/delete")
    public String deleteItem(@RequestBody ItemProductionOrder productionOrder) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Production_order");

        if (userPrivilege.getPrivi_delete()) {

            // Check ext (Existing)
            if (productionOrder.getId() == null) {
                return "Delete not completed : Production Order not exists..!";

            } // This refers there is no id in the object,so cannot delete..!

            ItemProductionOrder extProductionOrderById = itemProductionOrderDao
                    .getReferenceById(productionOrder.getId());

            if (extProductionOrderById == null) {
                return "Delete Not Completed : Item not exists...!";

            } // This refferes to there is a id of thre object,but ithat id is not in the
              // database

            try {

                // Set auto added data
                extProductionOrderById.setDelete_date_time(LocalDateTime.now());
                extProductionOrderById.setAdded_user_id(loggedUser.getId());

                itemProductionOrderDao.delete(extProductionOrderById);

                // Dependancy

                return "OK";

            } catch (Exception e) {
                return "Delete not completed : " + e.getMessage();
            }

        } else {

            return "Cannot Delete...! User havn't permissions..!";
        }

    }

    // 4....................Update............................
    @PutMapping("productionorder/update")
    public String updateInvoiceData(@RequestBody ItemProductionOrder productionOrder) {

        // Check logged User Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()),
                "Production_order");

        if (userPrivilege.getPrivi_update()) {

            try {

                // Set auto added data
                productionOrder.setUpdate_date_time((LocalDateTime.now()));
                productionOrder.setUpdate_user_id(loggedUser.getId());

                // Save operator(save fontend data object)
                itemProductionOrderDao.save(productionOrder);
                return "OK";
            } catch (Exception e) {

                return "Update Not Completed :" + e.getMessage();
            }

        } else {

            return "Cannot Update..! User do not have Privileges..!";
        }

    }

}
