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

import lk.cckcakesandbakery.dao.UserDao;
import lk.cckcakesandbakery.dao.WalkingCustomerDao;
import lk.cckcakesandbakery.entity.Privilege;
import lk.cckcakesandbakery.entity.User;
import lk.cckcakesandbakery.entity.WalkingCustomer;

@RestController
public class WalkingCustomerController {

    @Autowired // generate instance
    private WalkingCustomerDao walkingCustomerDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    @Autowired
    private UserDao userDao;

    // request mapping for load stock ui[URL --->/stock]
    @RequestMapping(value = "/walkingcustomer")
    public ModelAndView loadWalkingCustomerUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView walkingCustomerUI = new ModelAndView();
        walkingCustomerUI.setViewName("walkingcustomer.html");

        walkingCustomerUI.addObject("loggedusername", auth.getName());
        walkingCustomerUI.addObject("title", "walking customer");

        return walkingCustomerUI;
    }

    // .............CRUD Operations......................

    // 1..................Select........................S
    // request mapping for load vehicle type all data [URL--->
    // /vehicletype/alldata]
    @GetMapping(value = "/walkingcustomer/alldata", produces = "application/json")
    public List<WalkingCustomer> findAllData() {

        // check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()),
                "Walking_Customer");

        if (userPrivilege.getPrivi_select()) {

            return walkingCustomerDao.findAll(Sort.by(Direction.DESC, "id"));

        } else {

            return new ArrayList<>();

        }

    }

    // 2...............................Insert......................................

    // Mapping for save fontend dataob to the database
    @PostMapping(value = "/walkingcustomer/insert")
    public String saveWalkingCustomerData(@RequestBody WalkingCustomer walkingCustomer) {

        // Check logged User Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()),
                "Walking_Customer");
        if (userPrivilege.getPrivi_insert()) {

            try {

                // Set auto added data
                walkingCustomer.setAdded_date_time(LocalDateTime.now());
                walkingCustomer.setAdded_user_id(loggedUser.getId());

                // Save operator(save fontend data object)
                walkingCustomerDao.save(walkingCustomer);
                return "OK";
            } catch (Exception e) {

                return "Save Not Completed :" + e.getMessage();
            }

        } else {
            return "Save not Comppleted..! User Do not have privileges..!";

        }

    }

    // 3.........................Update.............................................

    // Mapping for save fontend dataob to the database
    @PutMapping("walkingcustomer/update")
    public String updateWalkingCustomerData(@RequestBody WalkingCustomer walkingCustomer) {

        // Check logged User Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check user Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()),
                "Walking_Customer");

        if (userPrivilege.getPrivi_update()) {

            try {

                // Set auto added data
                walkingCustomer.setUpdate_date_time((LocalDateTime.now()));
                walkingCustomer.setUpdate_user_id(loggedUser.getId());

                // Save operator(save fontend data object)
                walkingCustomerDao.save(walkingCustomer);
                return "OK";
            } catch (Exception e) {

                return "Update Not Completed :" + e.getMessage();
            }

        } else {

            return "Cannot Update..! User do not have Privileges..!";
        }

    }

    // 4....................Delete..................................................
    /// Delete rawmaterial data from the frontend [URL --->//rawmaterial/delete]
    @DeleteMapping(value = "/walkingcustomer/delete")
    public String deleteWalkingCustomerData(@RequestBody WalkingCustomer walkingCustomer) {

        // Check logged User Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check user Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()),
                "Walking_Customer");

        if (userPrivilege.getPrivi_delete()) {

            WalkingCustomer extWalkingCustomerById = walkingCustomerDao.getReferenceById(walkingCustomer.getId());

            try {

                // Set auto added data
                extWalkingCustomerById.setDelete_date_time(LocalDateTime.now());
                extWalkingCustomerById.setDelete_user_id(loggedUser.getId());

                walkingCustomerDao.delete(extWalkingCustomerById);

                // Dependancy

                return "OK";

            } catch (Exception e) {
                return "Delete not completed : " + e.getMessage();
            }

        } else {
            return "Cannot Delete..! User do not have Privileges..!";

        }

    }

}
