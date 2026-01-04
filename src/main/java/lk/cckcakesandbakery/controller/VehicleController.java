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
import lk.cckcakesandbakery.dao.VehicleDao;
import lk.cckcakesandbakery.entity.Privilege;
import lk.cckcakesandbakery.entity.User;
import lk.cckcakesandbakery.entity.Vehicle;

@RestController
public class VehicleController {
    @Autowired // generate instance
    private VehicleDao vehicleDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    // request mapping for load vehicle ui[URL --->/vehicle]
    @RequestMapping(value = "/vehicle")
    public ModelAndView loadVehicleUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView vehicleUI = new ModelAndView();
        vehicleUI.setViewName("vehicle.html");
        vehicleUI.addObject("loggedusername", auth.getName());
        vehicleUI.addObject("title", "vehicle");

        return vehicleUI;
    }

    // ..........CRUD Operations.............

    // 1...................Select.............
    // request mapping for load vehicle route all data [URL--->
    // /vehicleroute/alldata]
    @GetMapping(value = "/vehicle/alldata", produces = "application/json")
    public List<Vehicle> findAllData() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Vehicle");

        if (userPrivilege.getPrivi_select()) {
            return vehicleDao.findAll(Sort.by(Direction.DESC, "id"));

        } else {
            return new ArrayList<>();
        }

    }

    // 2..................Insert..........................
    // request mapping for insert vehicle data from the frontend [URL
    // --->//vehicle/insert]
    @PostMapping(value = "/vehicle/insert")
    public String saveGrnData(@RequestBody Vehicle vehicle) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Vehicle");

        if (userPrivilege.getPrivi_insert()) {

            // duplicate check

            try {

                // Set auto added data
                vehicle.setAdded_date_time(LocalDateTime.now());
                vehicle.setAdded_user_id(loggedUser.getId());

                // save operator(save frontend object)
                vehicleDao.save(vehicle);
                return "OK";
            } catch (Exception e) {
                return "Save not completed :" + e.getMessage();
            }

        } else {

            return "Cannot Submit..!User havn't Privileges..........!";
        }

    }

    // 3....................Delete..........................
    /// Delete Vehicle data from the frontend [URL --->//vehicle/delete]
    @DeleteMapping(value = "/vehicle/delete")
    public String deleteVehicle(@RequestBody Vehicle vehicle) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Vehicle");

        if (userPrivilege.getPrivi_delete()) {

            // Check ext (Existing)
            if (vehicle.getId() == null) {
                return "Delete not completed : Vehicle not exists..!";

            } // This refers there is no id in the object,so cannot delete..!

            Vehicle extVehicleById = vehicleDao.getReferenceById(vehicle.getId());

            if (extVehicleById == null) {
                return "Delete Not Completed : GRN not exists...!";

            } // This refferes to there is a id of thre object,but ithat id is not in the
              // database

            try {

                // Set auto added data
                extVehicleById.setDelete_date_time(LocalDateTime.now());
                extVehicleById.setDelete_user_id(loggedUser.getId());

                vehicleDao.delete(extVehicleById);

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
    @PutMapping("vehicle/update")
    public String updateInvoiceData(@RequestBody Vehicle vehicle) {

        // Check logged User Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Vehicle");

        if (userPrivilege.getPrivi_update()) {

            try {

                // Set auto added data
                vehicle.setUpdate_date_time((LocalDateTime.now()));
                vehicle.setUpdate_user_id(loggedUser.getId());

                // Save operator(save fontend data object)
                vehicleDao.save(vehicle);
                return "OK";
            } catch (Exception e) {

                return "Update Not Completed :" + e.getMessage();
            }

        } else {

            return "Cannot Update..! User do not have Privileges..!";
        }

    }

}
