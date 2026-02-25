package lk.cckcakesandbakery.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lk.cckcakesandbakery.dao.ItemPriceStatusDao;
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

import lk.cckcakesandbakery.dao.ItemDao;
import lk.cckcakesandbakery.dao.ItemPriceDao;
import lk.cckcakesandbakery.dao.UserDao;
import lk.cckcakesandbakery.entity.ItemPrice;
import lk.cckcakesandbakery.entity.Privilege;
import lk.cckcakesandbakery.entity.User;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class ItemPriceController {

    @Autowired
    private ItemPriceDao itemPriceDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    @Autowired
    private ItemDao itemDao;

    @Autowired
    private ItemPriceStatusDao itemPriceStatusDao;

    // request mapping for load invoice ui[URL --->/invoice]
    @RequestMapping(value = "/itemprice")
    public ModelAndView loadItemPriceUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView itemPriceUI = new ModelAndView();

        itemPriceUI.setViewName("itemPrice.html");
        itemPriceUI.addObject("loggedusername", auth.getName());
        itemPriceUI.addObject("title", "item price");

        return itemPriceUI;
    }

    // Map to get raw material cost by item name
    @RequestMapping(value = "/itemprice/getrawmaterialcost")
    public List<String> getRawmaterialCost(@RequestParam(name = "itemName") String itemName) {
        return itemDao.getRawMaterialCostByItemName(itemName);

    }

    // request mapping for get invice all data [URL --->//invoice/alldata]
    @GetMapping(value = "/itemprice/alldata", produces = "application/json")

    public List<ItemPrice> findAllData() {
        // Check logged user authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Item_Price");
        if (userPrivilege.getPrivi_select()) {
            return itemPriceDao.findAll(Sort.by(Direction.DESC, "id"));

        } else {
            return new ArrayList<>();

        }

    }

    // Mapping for save fontend dataob to the database
    @PostMapping(value = "/itemprice/insert")
    public String saveItemData(@RequestBody ItemPrice itemPrice) {

        // Check logged User Authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Item_Price");

        if (userPrivilege.getPrivi_insert()) {
            // Dupllicate check
            // Item name Duplicate Check
            // NIC Duplicate Check
            // ItemPrice extItemPriceByItemId =
            // itemPriceDao.getByItem_id(itemPrice.getItem_id());
            // .......................................
            // if (extItemPriceByItemId != null && extItemPriceByItemId.getId() !=
            // itemPrice.getId()) {
            // // return "Save Not Completed : Nic already exist...!";
            // return "Save Not Completed : Entered Item already exist...!";

            // }

            try {

                // Set auto added data
                itemPrice.setAdded_date_time((LocalDateTime.now()));
                itemPrice.setAdded_user_id(loggedUser.getId());

                // Save operator(save frontend data object)
                itemPriceDao.save(itemPrice);
                return "OK";
            } catch (Exception e) {

                return "Save Not Completed :" + e.getMessage();
            }

        } else {

            return "Cannot save..! User Do not have permissions..!";

        }

    }

    /// Delete rawmaterial data from the frontend [URL --->//rawmaterial/delete]
    @DeleteMapping(value = "/itemprice/delete")
    public String deleteItem(@RequestBody ItemPrice itemPrice) {

        // Check logged User Authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Item_Price");
        if (userPrivilege.getPrivi_delete()) {

            // Check ext (Existing)
            if (itemPrice.getId() == null) {
                return "Delete not completed : Item Price not exists..!";

            } // This refers there is no id in the object,so cannot delete..!

            ItemPrice extItemPriceById = itemPriceDao.getReferenceById(itemPrice.getId());

            if (extItemPriceById == null) {
                return "Delete Not Completed : Item Price not exists...!";

            } // This refferes to there is a id of thre object,but ithat id is not in the
              // database

            try {

                // Set auto added data
                extItemPriceById.setDelete_date_time(LocalDateTime.now());
                extItemPriceById.setDelete_user_id(loggedUser.getId());
                extItemPriceById.setItem_price_status_id(itemPriceStatusDao.getReferenceById(2));


                itemPriceDao.save(extItemPriceById);

                // Dependancy

                return "OK";

            } catch (Exception e) {
                return "Delete not completed : " + e.getMessage();
            }

        } else {

            return "Cannot Delete..!You don't have permisions..!";

        }

    }

    // Update front end data object
    @PutMapping(value = "/itemprice/update")
    public String updateItemPriceData(@RequestBody ItemPrice itemPrice) {

        // Check logged User Authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Item_Price");

        if (userPrivilege.getPrivi_update()) {

            // Dupllicate check ......................................

            try {

                // Set auto added data
                itemPrice.setUpdate_date_time((LocalDateTime.now()));
                itemPrice.setUpdate_user_id(loggedUser.getId());

                // Save operator(save fontend data object)
                itemPriceDao.save(itemPrice);
                return "OK";
            } catch (Exception e) {

                return "Update Not Completed :" + e.getMessage();
            }

        } else {
            return "Cannot Update..!You do not have Permissions...!";

        }

    }

}
