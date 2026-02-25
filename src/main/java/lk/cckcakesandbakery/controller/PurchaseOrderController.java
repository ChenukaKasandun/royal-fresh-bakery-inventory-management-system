package lk.cckcakesandbakery.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lk.cckcakesandbakery.dao.PurchaseOrderStatusDao;
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

import lk.cckcakesandbakery.dao.PurchaseOrderDao;
import lk.cckcakesandbakery.dao.UserDao;
import lk.cckcakesandbakery.entity.Privilege;
import lk.cckcakesandbakery.entity.PurchaseOrder;
import lk.cckcakesandbakery.entity.User;

@RestController
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderDao purchaseOrderDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    @Autowired
    private PurchaseOrderStatusDao purchaseOrderStatusDao;

    // request mapping for load purchase Order ui[URL --->/purchaseorder]
    @RequestMapping(value = "/purchaseorder")
    public ModelAndView loadPurchaseOrderUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView purchaseOrderUI = new ModelAndView();
        purchaseOrderUI.setViewName("purchaseOrder.html");

        purchaseOrderUI.addObject("loggedusername", auth.getName());
        purchaseOrderUI.addObject("title", "purchaseorder");

        return purchaseOrderUI;
    }

    // .................CRUD Operations.................
    // 1...................Select........................
    // request mapping for get customer all data [URL --->//customer/alldata]
    @GetMapping(value = "/purchaseorder/alldata", produces = "application/json")
    public List<PurchaseOrder> findAllData() {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Purchase_Order");

        if (userPrivilege.getPrivi_select()) {

            return purchaseOrderDao.findAll(Sort.by(Direction.DESC, "id"));// Sort.by(Direction.DESC,"id")--> this is
                                                                           // for
            // sort the data in
            // descending order by id

        } else {

            return new ArrayList<>();
        }

    }

    // 2.................Insert....................
    // request mapping for insert purchase order data from the frontend [URL
    // --->//purchaseorder/insert]
    @PostMapping(value = "/purchaseorder/insert")
    public String savePurchaseOrderData(@RequestBody PurchaseOrder purchaseOrder) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Purchase_Order");

        if (userPrivilege.getPrivi_insert()) {

            // duplicate check

            try {

                // Set auto added data
                purchaseOrder.setAdded_date_time(LocalDateTime.now());
                purchaseOrder.setAdded_user_id(loggedUser.getId());
                purchaseOrder.setOrder_no(purchaseOrderDao.getNextOrderNo());

                // save operator(save frontend object)
                purchaseOrderDao.save(purchaseOrder);
                return "OK";
            } catch (Exception e) {
                return "Save not completed :" + e.getMessage();
            }

        } else {

            return "Cannot Submit..! User do not have permissions...!";

        }

    }

    // 3..................Delete.....................

    /// Delete rawmaterial data from the frontend [URL --->//rawmaterial/delete]
    @DeleteMapping(value = "/purchaseorder/delete")
    public String deletePurchaseOrder(@RequestBody PurchaseOrder purchaseoOrder) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Purchase_Order");

        if (userPrivilege.getPrivi_delete()) {

            // Check ext (Existing)
            if (purchaseoOrder.getId() == null) {
                return "Delete not completed : Purchase Order not exists..!";

            } // This refers there is no id in the object,so cannot delete..!

            PurchaseOrder extPurchaseOrderById = purchaseOrderDao.getReferenceById(purchaseoOrder.getId());

            if (extPurchaseOrderById == null) {
                return "Delete Not Completed : Purchase Order not exists...!";

            } // This refferes to there is a id of thre object,but ithat id is not in the
              // database

            try {

                // Set auto added data
                extPurchaseOrderById.setDelete_date_time(LocalDateTime.now());
                extPurchaseOrderById.setDelete_user_id(loggedUser.getId());
                extPurchaseOrderById.setPurchase_order_status_id(purchaseOrderStatusDao.getReferenceById(4));

                purchaseOrderDao.save(extPurchaseOrderById);

                // Dependancy

                return "OK";

            } catch (Exception e) {
                return "Delete not completed : " + e.getMessage();
            }

        } else {

            return "Cannot Delete..! User do not have Permissions.......!";

        }

    }

    // 4................Update.....................
    // Mapping for save fontend dataob to the database
    @PutMapping("purchaseorder/update")
    public String updatePuchaseOrderData(@RequestBody PurchaseOrder purchaseOrder) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Purchase_Order");

        if (userPrivilege.getPrivi_update()) {

            // duplicate check

            try {

                // Set auto added data
                purchaseOrder.setUpdate_date_time((LocalDateTime.now()));
                purchaseOrder.setUpdate_user_id(loggedUser.getId());

                // Save operator(save fontend data object)
                purchaseOrderDao.save(purchaseOrder);
                return "OK";
            } catch (Exception e) {

                return "Update Not Completed :" + e.getMessage();
            }
        } else {

            return "Cannot Update..!User havn't permissions..!";

        }

    }

}
