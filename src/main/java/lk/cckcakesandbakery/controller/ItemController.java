package lk.cckcakesandbakery.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lk.cckcakesandbakery.entity.ItemHasMaterial;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import lk.cckcakesandbakery.dao.ItemDao;
import lk.cckcakesandbakery.dao.ItemStatusDao;
import lk.cckcakesandbakery.dao.UserDao;
import lk.cckcakesandbakery.entity.Item;
import lk.cckcakesandbakery.entity.Privilege;
import lk.cckcakesandbakery.entity.User;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
public class ItemController {

    @Autowired
    private ItemDao itemDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private ItemStatusDao itemStatusDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    // request mapping for load item form[URL --->/item]
    @RequestMapping(value = "/item")
    public ModelAndView loadItemForm() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView itemFormUI = new ModelAndView();
        itemFormUI.setViewName("item.html");
        itemFormUI.addObject("loggedusername", auth.getName());
        itemFormUI.addObject("title", "item form");

        return itemFormUI;
    }


    // request mapping for get item object [URL --->/item/getbyid=] ---> For refill
    // function
    @GetMapping(value = "/item/getbyid", params = { "id" }, produces = "application/json")
    public Item getItemById(@RequestParam("id") Integer id) {
        // check logged user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Item");

        // This checks the privileges of the user to update/refill the item Form
        if (userPrivilege.getPrivi_update()) {

            // Return an object according to the id of the database
            return itemDao.getReferenceById(id);
        } else {

            // This returns an empty object
            return new Item();

        }

    }

    // request mapping for get returning items by item status [URL --->/item/returningbyitemstatus]
    @GetMapping(value = "/item/returningbyitemstatus", produces = "application/json")
    public List<Item> getByItemStatus() {

            return itemDao.getByItemStatusId(1);


    }

    // ..........................................CRUD
    // OPerations.................................................

    // 1.................................Select.....................................

    // request mapping for get item all data [URL --->//item/alldata]
    @GetMapping(value = "/item/alldata", produces = "application/json")
    public List<Item> getAllItemData() {

        // check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Item");

        if (userPrivilege.getPrivi_select()) {
            // return itemDao.findAllDataByEssentials();............Not Working this
            // method.......
            return itemDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();

        }

    }


    // 2...............................Insert......................................

    // Mapping for save fontend dataob to the database
    @PostMapping(value = "/item/insert")
    public String saveItemData(@RequestBody Item item) {

        // Check logged User Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Item");
        if (userPrivilege.getPrivi_insert()) {

            // Item name Duplicate Check
            Item extItemByName = itemDao.getByName(item.getItem_name());
            if (extItemByName != null && extItemByName.getId() != item.getId()) {
                // return "Save Not Completed : Material already exist...!";
                return "Save Not Completed  : Entered Item " + item.getItem_name() + " already exist...!";

            }

            try {

                // Set auto added data
                item.setAdd_date_time((LocalDateTime.now()));
                item.setAdd_user_id(loggedUser.getId());
                item.setItem_code(itemDao.getNextItemCode());

//                Saving inner form data in the association table
              for (ItemHasMaterial ihm : item.getItemHasMaterialList()) {
                  ihm.setItem_id(item);
              }

                // Save operator(save fontend data object)
                itemDao.save(item);
                return "OK";
            } catch (Exception e) {

                return "Save Not Completed :" + e.getMessage();
            }

        } else {
            return "Save not Comppleted..! User Do not have privileges..!";

        }

    }

    // 3....................Delete..................................................
    /// Delete rawmaterial data from the frontend [URL --->//rawmaterial/delete]
    @DeleteMapping(value = "/item/delete")
    public String deleteItem(@RequestBody Item item) {

        // Check logged User Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check user Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Item");

        if (userPrivilege.getPrivi_delete()) {

            // Check ext (Existing)
            if (item.getId() == null) {
                return "Delete not completed : Item not exists..!";

            } // This refers there is no id in the object,so cannot delete..!

            Item extItemById = itemDao.getReferenceById(item.getId());

            if (extItemById == null) {
                return "Delete Not Completed : Item not exists...!";

            } // This refferes to there is a id of thre object,but ithat id is not in the
              // database so cannot delete...!

            try {

                // Set auto added data
                extItemById.setDelete_date_time(LocalDateTime.now());
                extItemById.setDelete_user_id(loggedUser.getId());

                // Wecannot delete data .So we change the status....!
                extItemById.setItem_status_id(itemStatusDao.getReferenceById(3));

                itemDao.save(extItemById);

                // Dependancy

                return "OK";

            } catch (Exception e) {
                return "Delete not completed : " + e.getMessage();
            }

        } else {
            return "Cannot Delete..! User do not have Privileges..!";

        }

    }

    // 4..........................Update.............................................

    // Mapping for save fontend dataob to the database
    @PutMapping("item/update")
    public String updateItemData(@RequestBody Item item) {

        // Check logged User Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check user Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Item");

        if (userPrivilege.getPrivi_update()) {

            // Item name Duplicate Check
            Item extItemByName = itemDao.getByName(item.getItem_name());
            if (extItemByName != null && extItemByName.getId() != item.getId()) {

                return "Save Not Completed  : Entered Item " + item.getItem_name() + " already exist...!";

            }

            try {

                // Set auto added data
                item.setUpdate_date_time((LocalDateTime.now()));
                item.setUpdate_user_id(loggedUser.getId());

                // Save operator(save fontend data object)
                itemDao.save(item);
                return "OK";
            } catch (Exception e) {

                return "Update Not Completed :" + e.getMessage();
            }

        } else {

            return "Cannot Update..! User do not have Privileges..!";
        }

    }

}
