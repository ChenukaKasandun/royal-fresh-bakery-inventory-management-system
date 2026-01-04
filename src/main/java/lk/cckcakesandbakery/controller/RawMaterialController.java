package lk.cckcakesandbakery.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lk.cckcakesandbakery.entity.Item;
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

import lk.cckcakesandbakery.dao.RawMaterialDao;
import lk.cckcakesandbakery.dao.RawMaterialStatusDao;
import lk.cckcakesandbakery.dao.UserDao;
import lk.cckcakesandbakery.entity.Material;
import lk.cckcakesandbakery.entity.Privilege;
import lk.cckcakesandbakery.entity.User;

@RestController
public class RawMaterialController {

    @Autowired
    private RawMaterialDao rawMaterialDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    @Autowired
    private RawMaterialStatusDao rawMaterialStatusDao;

    // request mapping for load rawMaterial ui[URL --->/rawmaterial]
    @RequestMapping(value = "/rawmaterial")
    public ModelAndView loadRawMaterialUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView rawMaterialnUI = new ModelAndView();
        rawMaterialnUI.setViewName("rawMaterial.html");

        rawMaterialnUI.addObject("loggedusername", auth.getName());
        rawMaterialnUI.addObject("title", "rawmaterial management");

        return rawMaterialnUI;
    }

    // ........................CRUD
    // Operations............................................

    // 1...............................Select.................
    // request mapping for get rawmaterial all data [URL --->//rawmaterial/alldata]
    @GetMapping(value = "/rawmaterial/alldata", produces = "application/json")
    public List<Material> findAllData() {

        // check logged user authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Raw_Material");
        if (userPrivilege.getPrivi_select()) {
            return rawMaterialDao.findAll(Sort.by(Direction.DESC, "id"));

        } else {
            return new ArrayList<>();

        }

    }

    // request mapping for get selected material  [URL --->/rawmaterial/list]
    @GetMapping(value = "/rawmaterial/list", produces = "application/json")
    public List<Material> getSelectedMaterial() {
        return  rawMaterialDao.list();

    }

    // 2.......................Insert.....................................
    // request mapping for insert rawmaterial data from the frontend [URL
    // --->//rawmaterial/insert]
    @PostMapping(value = "/rawmaterial/insert")
    public String saveRawmaterialData(@RequestBody Material material) {

        // Check logged user Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Raw_Material");
        if (userPrivilege.getPrivi_insert()) {

            // duplicate check

            // Raw material name Duplicate Check
            Material extMaterialByName = rawMaterialDao.getByName(material.getMaterial_name());
            if (extMaterialByName != null && extMaterialByName.getId() != material.getId()) {
                // return "Save Not Completed : Material already exist...!";
                return "Save Not Completed  : Entered Material " + material.getMaterial_name() + " already exist...!";

            }

            try {

                // Set auto added data
                material.setAdd_date_time(LocalDateTime.now());
                material.setAdd_user_id(loggedUser.getId());

                // save operator(save frontend object)
                rawMaterialDao.save(material);
                return "OK";
            } catch (Exception e) {
                return "Save not completed :" + e.getMessage();
            }

        } else {

            return "Cannot Insert..! User do not have privileges..!";

        }

    }

    // 3.....................Update...........................
    // request mapping for update rawmaterial data from the frontend [URL
    // --->//rawmaterial/update]
    @PutMapping(value = "/rawmaterial/update")
    public String updateRawmaterialData(@RequestBody Material material) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check ext(Existing)
        if (material.getId() == null) {
            return "Update Not completed : Material Not exists..!";

        } // -------> This reffers to their is no id of the object so cannot update

        Material extById = rawMaterialDao.getReferenceById(material.getId());

        if (extById == null) {
            return "UpdateNot Completed : Material  not exists..!";

        } // ------> This refferes to there is a id of the object but there is no sch a

        // duplicate check

        // Raw material name Duplicate Check
        Material extMaterialByName = rawMaterialDao.getByName(material.getMaterial_name());
        if (extMaterialByName != null && extMaterialByName.getId() != material.getId()) {
            // return "Save Not Completed : Material already exist...!";
            return "Save Not Completed  : Entered Material " + material.getMaterial_name() + " already exist...!";

        }

        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Raw_Material");

        if (userPrivilege.getPrivi_update()) {

            try {

                // Set auto added data
                material.setUpdate_date_time(LocalDateTime.now());
                material.setUpdate_user_id(loggedUser.getId());

                // save operator(save frontend object)
                rawMaterialDao.save(material);
                return "OK";
            } catch (Exception e) {
                return "Update not completed :" + e.getMessage();
            }

        } else {
            return "Cannot Update...! User do not have privileges..!";

        }

    }

    // 4............................Delete.....................................
    /// Delete rawmaterial data from the frontend [URL --->//rawmaterial/delete]
    @DeleteMapping(value = "/rawmaterial/delete")
    public String deleteRawmaterial(@RequestBody Material material) {

        // Check logged User Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Raw_Material");

        if (userPrivilege.getPrivi_delete()) {

            // Check ext (Existing)
            if (material.getId() == null) {
                return "Delete not completed : material not exists..!";

            } // This refers there is no id in the object,so cannot delete..!

            Material extMaterialById = rawMaterialDao.getReferenceById(material.getId());

            if (extMaterialById == null) {
                return "Delete Not Completed : material not exists...!";

            } // This refferes to there is a id of thre object,but ithat id is not in the
              // database

            try {

                // Set auto added data
                extMaterialById.setDelete_date_time(LocalDateTime.now());
                extMaterialById.setDelete_user_id(loggedUser.getId());
                extMaterialById.setRawmaterial_status_id(rawMaterialStatusDao.getReferenceById(2));

                rawMaterialDao.save(extMaterialById);

                // Dependancy

                return "OK";

            } catch (Exception e) {
                return "Delete not completed : " + e.getMessage();
            }

        } else {

            return "Cannot Delete...! User do not have privilegs..!";

        }

    }

}
