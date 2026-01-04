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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.cckcakesandbakery.dao.PrivilegeDao;

import lk.cckcakesandbakery.entity.Privilege;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class PrivilegeController {

    @Autowired
    private PrivilegeDao privilegeDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    // request mapping for load employee ui[URL --->/employee]
    @RequestMapping(value = "/privilege")
    public ModelAndView loadPrivilegeUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();// This can access authentication
        // object which has numerous
        // properties

        ModelAndView privilegeUI = new ModelAndView();
        privilegeUI.setViewName("privilege.html");
        privilegeUI.addObject("loggedusername", auth.getName());// This returns the name of the logged user in the
        // Privilege UI
        privilegeUI.addObject("title", "Privilege Management");// Inserting title from the backend using Thymeleaf
                                                               // Function

        return privilegeUI;
    }

    // request mapping for get privilege all data [URL --->//privilege/alldata]
    @GetMapping(value = "/privilege/alldata", produces = "application/json")
    public List<Privilege> getAllPrivilegeData() {

        // check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Privilege");

        if (userPrivilege.getPrivi_select()) {
            return privilegeDao.findAll(Sort.by(Direction.DESC, "id"));

        } else {
            return new ArrayList<>();

        }

    }

    // Insert post mapping for insert data into the data Base[URL
    // --->/privilege/insert]
    @PostMapping("/privilege/insert") // @RequestBody---> can access dataOb comming from frontend
    public String insertPrivilege(@RequestBody Privilege privilege) {

        // checked logged user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Privilege");

        if (userPrivilege.getPrivi_insert()) {

            // duplicate check
            Privilege extPrivilege = privilegeDao.getPrivilegeByRoleModule(privilege.getRole_id().getId(),
                    privilege.getModule_id().getId());
            if (extPrivilege != null) {
                return "Save not Completed : Privilege Allready exists..!";

            }

            try {

                privilege.setAdded_date_time(LocalDateTime.now());
                privilege.setAdded_user_id(1);

                // save operator
                privilegeDao.save(privilege);

                // Depedancy

                return "OK";

            } catch (Exception e) {

                return "Save Not Completed : " + e.getMessage();

            }

        } else {

            return "Save Not Completed : you haven't permission...! ";

        }

    }

    // Update put mapping for privilege[url--->("/privilege/update")]
    @PutMapping("/privilege/update")
    public String updatePrivilegeData(@RequestBody Privilege privilege) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Privilege");

        if (userPrivilege.getPrivi_update()) {

            // Check ext(Existing)
            if (privilege.getId() == null) {
                return "Update Not completed : Privilege Not exists..!";

            } // -------> This reffers to their is no id of the object so cannot update

            Privilege extById = privilegeDao.getReferenceById(privilege.getId());

            if (extById == null) {
                return "UpdateNot Completed : Privilege not exists..!";

            }

            // duplicate check
            Privilege extPrivilege = privilegeDao.getPrivilegeByRoleModule(privilege.getRole_id().getId(),
                    privilege.getModule_id().getId());
            if (extPrivilege != null && extPrivilege.getId() != privilege.getId()) {
                return "Update not Completed : Privilege Allready exists..!";

            }

            try {

                // Set auto added data
                privilege.setUpdate_date_time(LocalDateTime.now());
                privilege.setUpdate_user_id(1);

                // Save operator ----> same as update operator
                privilegeDao.save(privilege);

                // dependancies

                return "OK";
            } catch (Exception e) {
                return "Update Not Completed : " + e.getMessage();
            }

        } else {
            return "Update Not Completed : you havn't permission..! ";

        }

    }

    // Delete mapping for the privilege data [url-->/privilege/delete]
    @DeleteMapping(value = "/privilege/delete") // @Request mapping --> can access dataOb from front end
    public String deletePrivilege(@RequestBody Privilege privilege) {

        // check logged user authorization

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Privilege");

        if (userPrivilege.getPrivi_delete()) {
            // check existing

            try {

                // Delete operator
                privilege.setPrivi_select(false);// Removing all privileges
                privilege.setPrivi_insert(false);
                privilege.setPrivi_delete(false);
                privilege.setPrivi_update(false);

                privilegeDao.save(privilege);

                // dependancy
                return "OK";

            } catch (Exception e) {

                return "Delete Not Completed : " + e.getMessage();
            }

        } else {

            return "Delete Not Completed :you havn't permission..! ";

        }

    }

}
