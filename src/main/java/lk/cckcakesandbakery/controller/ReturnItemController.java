package lk.cckcakesandbakery.controller;

import lk.cckcakesandbakery.dao.ReturnItemDao;
import lk.cckcakesandbakery.dao.UserDao;
import lk.cckcakesandbakery.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.List;

@RestController
public class ReturnItemController {

    @Autowired // generate instance
    private ReturnItemDao returnItemDao;

    @Autowired
    private UserDao userDao;

    // request mapping for load bank all data [URL--->
    // /returnitem/alldata]
    @GetMapping(value = "/returnitems/alldata", produces = "application/json")
    public List<ReturnItems> findAllData() {
        return returnItemDao.findAll(Sort.by(Sort.Direction.DESC, "Id"));
    }

    // request mapping for getTotal Return Price by Invoice No [URL
    // --->/returnitems/totalreturningpricebyinvoiceid]
    @GetMapping(value = "/returnitems/totalreturningpricebyinvoiceid", params = {
            "invoiceid" }, produces = "application/json") // produces = "application/json" --> Data from the database
    // pases to the front end in json format...
    public Double findTotalReturningPriceByInvoice(@RequestParam(name = "invoiceid") Integer invoiceid) {

        return returnItemDao.getTotalReturningPrice(invoiceid);
    }


    // request mapping for load stock ui[URL --->/returnitems]
    @RequestMapping(value = "/returnitems")
    public ModelAndView loadReturnItemsUI() {
        ModelAndView returnItemsUI = new ModelAndView();
        returnItemsUI.setViewName("returnItems.html");

        return returnItemsUI;
    }


    // 2..................Insert..........................
    // request mapping for insert return item data from the frontend [URL
    // --->//returnitem/insert]
    @PostMapping(value = "/returnitem/insert")
    public String saveGrnData(@RequestBody ReturnItems returnItems) {

        // Check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

            try {

                // Set auto added data
                returnItems.setAdded_date_time(LocalDateTime.now());
                returnItems.setAdded_user_id(loggedUser.getId());


            // Saving data in association table
                for (ReturnItemHasItem rihs :returnItems.getReturnItemHasItemList() ){
                    rihs.setReturn_items_id(returnItems);
                }

                // save operator(save frontend object)
               returnItemDao.save(returnItems);
                return "OK";
            } catch (Exception e) {
                return "Save not completed :" + e.getMessage();
            }

    }


    // 4....................Update............................
    @PutMapping("/returnitem/update")
    public String updateReturnItemData(@RequestBody ReturnItems returnItems) {

        // Check logged User Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

            try {

                // Set auto added data
                returnItems.setAdded_date_time(LocalDateTime.now());
                returnItems.setUpdate_user_id(loggedUser.getId());

                // Save operator(save fontend data object)
                returnItemDao.save(returnItems);
                return "OK";
            } catch (Exception e) {

                return "Update Not Completed :" + e.getMessage();
            }


    }

}
