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

import lk.cckcakesandbakery.dao.GrnDao;
import lk.cckcakesandbakery.dao.UserDao;
import lk.cckcakesandbakery.entity.Grn;
import lk.cckcakesandbakery.entity.Privilege;
import lk.cckcakesandbakery.entity.User;

@RestController
public class GrnController {

    @Autowired
    private GrnDao grnDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    // request mapping for load grn ui[URL --->/grn]
    @RequestMapping(value = "/grn")
    public ModelAndView loadGrnUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView grnUI = new ModelAndView();
        grnUI.setViewName("grn.html");
        grnUI.addObject("loggedusername", auth.getName());
        grnUI.addObject("title", "grn");

        return grnUI;
    }

    // ..........................CRUD Operations.....................

    // 1.................Select.......................................
    // request mapping for get grn all data [URL --->//grn/alldata]
    @GetMapping(value = "/grn/alldata", produces = "application/json")
    public List<Grn> findAllData() {
        // check logged user Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "grn");
        if (userPrivilege.getPrivi_select()) {

            return grnDao.findAll(Sort.by(Direction.DESC, "id"));

        } else {

            return new ArrayList<>();

        }

    }

    // 2..................Insert..........................
    // request mapping for insert grn data from the frontend [URL
    // --->//grn/insert]
    @PostMapping(value = "/grn/insert")
    public String saveGrnData(@RequestBody Grn grn) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "grn");

        if (userPrivilege.getPrivi_insert()) {

            // duplicate check

            try {

                // Set auto added data
                grn.setAdd_date_time(LocalDateTime.now());
                grn.setAdd_user_id(loggedUser.getId());
                grn.setGrn_no(grnDao.getNextGrnNo());

                // save operator(save frontend object)
                grnDao.save(grn);
                return "OK";
            } catch (Exception e) {
                return "Save not completed :" + e.getMessage();
            }

        } else {

            return "Cannot Submit..!User havn't Privileges..........!";
        }

    }

    // 3....................Delete..........................
    /// Delete rawmaterial data from the frontend [URL --->//rawmaterial/delete]
    @DeleteMapping(value = "/grn/delete")
    public String deleteGrn(@RequestBody Grn grn) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "grn");

        if (userPrivilege.getPrivi_delete()) {

            // Check ext (Existing)
            if (grn.getId() == null) {
                return "Delete not completed : GRN not exists..!";

            } // This refers there is no id in the object,so cannot delete..!

            Grn extGrnById = grnDao.getReferenceById(grn.getId());

            if (extGrnById == null) {
                return "Delete Not Completed : GRN not exists...!";

            } // This refferes to there is a id of thre object,but ithat id is not in the
              // database

            try {

                // Set auto added data
                extGrnById.setDelete_date_time(LocalDateTime.now());
                extGrnById.setDelete_user_id(loggedUser.getId());

                grnDao.delete(extGrnById);

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
    @PutMapping("grn/update")
    public String updateInvoiceData(@RequestBody Grn grn) {

        // Check logged User Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "grn");

        if (userPrivilege.getPrivi_update()) {

            // Item name Duplicate Check
            Grn extGrnByNo = grnDao.getByGrnNo(grn.getGrn_no());
            if (extGrnByNo != null && extGrnByNo.getId() != grn.getId()) {

                return "Save Not Completed  : Selected Invoice " + grn.getGrn_no() + " already exist...!";

            }

            try {

                // Set auto added data
                grn.setUpdate_date_time((LocalDateTime.now()));
                grn.setUpdate_user_id(loggedUser.getId());

                // Save operator(save fontend data object)
                grnDao.save(grn);
                return "OK";
            } catch (Exception e) {

                return "Update Not Completed :" + e.getMessage();
            }

        } else {

            return "Cannot Update..! User do not have Privileges..!";
        }

    }

}
