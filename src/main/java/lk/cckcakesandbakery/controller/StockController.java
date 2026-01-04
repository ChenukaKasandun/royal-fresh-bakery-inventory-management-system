package lk.cckcakesandbakery.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

import lk.cckcakesandbakery.dao.StockDao;
import lk.cckcakesandbakery.dao.UserDao;
import lk.cckcakesandbakery.entity.Privilege;
import lk.cckcakesandbakery.entity.User;
import lk.cckcakesandbakery.entity.stock;

@RestController
public class StockController {

    @Autowired
    private StockDao stockDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    // request mapping for load stock ui[URL --->/stock]
    @RequestMapping(value = "/stock")
    public ModelAndView loadStockUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView stockUI = new ModelAndView();
        stockUI.setViewName("stock management.html");
        stockUI.addObject("loggedusername", auth.getName());
        stockUI.addObject("title", "raw material stock");

        return stockUI;
    }

    // ...................CRUD Operations.......................

    // 1.....................Select........................
    // request mapping for get stock all data [URL --->//stock/alldata]
    @GetMapping(value = "/stock/alldata", produces = "application/json")
    public List<stock> findAllData() {

        // check logged user Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Stock");

        if (userPrivilege.getPrivi_select()) {
            return stockDao.findAll();

        } else {
            return new ArrayList<>();

        }

    }

    // 2..............Insert....................

    // request mapping for insert stock data from the frontend [URL
    // --->//stock/insert]
    @PostMapping(value = "/stock/insert")
    public String saveStockData(@RequestBody stock stock) {

        // Check logged user authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Stock");

        if (userPrivilege.getPrivi_insert()) {
            // duplicate check

            try {

                // Set auto added data
                stock.setAdd_date_time(LocalDateTime.now());
                stock.setAdd_user_id(loggedUser.getId());

                // save operator(save frontend object)
                stockDao.save(stock);
                return "OK";
            } catch (Exception e) {
                return "Save not completed :" + e.getMessage();
            }

        } else {
            return "Cannot Submit ........! User havn't permissions..!";

        }

    }

    // .3...................Delete......................
    /// Delete rawmaterial data from the frontend [URL --->//rawmaterial/delete]
    @DeleteMapping(value = "/stock/delete")
    public String deleteStock(@RequestBody stock stock) {

        // Check logged user authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Stock");

        if (userPrivilege.getPrivi_delete()) {

            // Check ext (Existing)
            if (stock.getId() == null) {
                return "Delete not completed : Stock not exists..!";

            } // This refers there is no id in the object,so cannot delete..!

            stock extStockById = stockDao.getReferenceById(stock.getId());

            if (extStockById == null) {
                return "Delete Not Completed : Stock not exists...!";

            } // This refferes to there is a id of thre object,but ithat id is not in the
              // database

            try {

                // Set auto added data
                extStockById.setDelete_date_time(LocalDateTime.now());
                extStockById.setDelete_user_id(loggedUser.getId());

                stockDao.delete(extStockById);

                // Dependancy

                return "OK";

            } catch (Exception e) {
                return "Delete not completed : " + e.getMessage();
            }

        } else {

            return "Cannot Delete.....! User havn't permissions...!";

        }

    }

    // 4....................Update............................
    @PutMapping("stock/update")
    public String updateInvoiceData(@RequestBody stock stock) {

        // Check logged User Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Stock");

        if (userPrivilege.getPrivi_update()) {

            try {

                // Set auto added data
                stock.setUpdate_date_time((LocalDateTime.now()));
                stock.setUpdate_user_id(loggedUser.getId());

                // Save operator(save fontend data object)
                stockDao.save(stock);
                return "OK";
            } catch (Exception e) {

                return "Update Not Completed :" + e.getMessage();
            }

        } else {

            return "Cannot Update..! User do not have Privileges..!";
        }

    }

}
