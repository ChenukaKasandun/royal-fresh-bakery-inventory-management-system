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
import lk.cckcakesandbakery.dao.DeliveryManagementDao;
import lk.cckcakesandbakery.dao.UserDao;
import lk.cckcakesandbakery.entity.DeliveryManagement;
import lk.cckcakesandbakery.entity.Privilege;
import lk.cckcakesandbakery.entity.User;

@RestController
public class DeliveryManagementController {

    @Autowired // generate instance
    private DeliveryManagementDao deliveryManagementDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    @Autowired
    private UserDao userDao;

    // request mapping for load delivery ui[URL --->/delivery]
    @RequestMapping(value = "/delivery")
    public ModelAndView loadDeliveryUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView deliveryUI = new ModelAndView();
        deliveryUI.setViewName("delivery.html");
        deliveryUI.addObject("loggedusername", auth.getName());

        return deliveryUI;
    }

    // ......................CRUD Operations...........................

    // 1....................Select....................................
    // request mapping for load delivery all data [URL--->
    // /delivery/alldata]
    @GetMapping(value = "/delivery/alldata", produces = "application/json")
    public List<DeliveryManagement> findAllData() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Delivery");

        if (userPrivilege.getPrivi_select()) {

            return deliveryManagementDao.findAll(Sort.by(Direction.DESC, "id"));

        } else {

            return new ArrayList<>();

        }

    }

    // 2..................Insert..........................
    // request mapping for insert delivery data from the frontend [URL
    // --->//grn/insert]
    @PostMapping(value = "/delivery/insert")
    public String saveGrnData(@RequestBody DeliveryManagement delivery) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "delivery");

        if (userPrivilege.getPrivi_insert()) {

            // duplicate check

            try {

                // Set auto added data
                delivery.setAdd_date_time(LocalDateTime.now());
                delivery.setAdd_user_id(loggedUser.getId());
                delivery.setDeliver_no(deliveryManagementDao.getNextDeliveryNo());

                // save operator(save frontend object)
                deliveryManagementDao.save(delivery);
                return "OK";
            } catch (Exception e) {
                return "Save not completed :" + e.getMessage();
            }

        } else {

            return "Cannot Submit..!User havn't Privileges..........!";
        }

    }

    // 3...............Delete.....................
    @DeleteMapping(value = "/delivery/delete")
    public String deleteGrn(@RequestBody DeliveryManagement delivery) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "delivery");

        if (userPrivilege.getPrivi_delete()) {

            // Check ext (Existing)
            if (delivery.getId() == null) {
                return "Delete not completed : Delivery not exists..!";

            } // This refers there is no id in the object,so cannot delete..!

            DeliveryManagement extDeliveryById = deliveryManagementDao.getReferenceById(delivery.getId());

            if (extDeliveryById == null) {
                return "Delete Not Completed : Delivery not exists...!";

            } // This refferes to there is a id of thre object,but ithat id is not in the
              // database

            try {

                // Set auto added data
                extDeliveryById.setDelete_date_time(LocalDateTime.now());
                extDeliveryById.setDelete_user_id(loggedUser.getId());

                deliveryManagementDao.delete(extDeliveryById);

                // Dependancy

                return "OK";

            } catch (Exception e) {
                return "Delete not completed : " + e.getMessage();
            }

        } else {

            return "Cannot Delete...!User do not have Privileges.!";

        }

    }

    // 4....................Update............................
    @PutMapping("delivery/update")
    public String updateInvoiceData(@RequestBody DeliveryManagement delivery) {

        // Check logged User Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "delivery");

        if (userPrivilege.getPrivi_update()) {

            // Item name Duplicate Check
            DeliveryManagement extDeliveryNo = deliveryManagementDao.getByDeliveryNo(delivery.getDeliver_no());
            if (extDeliveryNo != null && extDeliveryNo.getId() != delivery.getId()) {

                return "Save Not Completed  : Selected Delivery " + delivery.getDeliver_no() + " already exist...!";

            }

            try {

                // Set auto added data
                delivery.setUpdate_date_time((LocalDateTime.now()));
                delivery.setUpdate_user_id(loggedUser.getId());

                // Save operator(save fontend data object)
                deliveryManagementDao.save(delivery);
                return "OK";
            } catch (Exception e) {

                return "Update Not Completed :" + e.getMessage();
            }

        } else {

            return "Cannot Update..! User do not have Privileges..!";
        }

    }

}
