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

import lk.cckcakesandbakery.dao.CustomerPaymentDao;
import lk.cckcakesandbakery.dao.UserDao;
import lk.cckcakesandbakery.entity.CustomerPayment;
import lk.cckcakesandbakery.entity.Privilege;
import lk.cckcakesandbakery.entity.User;

@RestController
public class CustomerPaymentController {

    @Autowired // generate instance
    private CustomerPaymentDao customerPaymentDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    // request mapping for load customer ui[URL --->/customerpayment]
    @RequestMapping(value = "/customerpayment")
    public ModelAndView loadCustomerUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView customerUI = new ModelAndView();
        customerUI.setViewName("customerpayment.html");

        customerUI.addObject("loggedusername", auth.getName());
        customerUI.addObject("title", "customer payment");

        return customerUI;
    }

    // ..................CRUD Operations.........................

    // 1.................Select................................
    // request mapping for load customer payment all data [URL--->
    // /customer/payment/alldata]
    @GetMapping(value = "/customerpayment/alldata", produces = "application/json")
    public List<CustomerPayment> findAllData() {

        // check logged user Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Customer_Payment");

        if (userPrivilege.getPrivi_select()) {
            return customerPaymentDao.findAll(Sort.by(Direction.DESC, "id"));

        } else {

            return new ArrayList<>();

        }

    }

    // 2 .............Insert.......................
    // request mapping for insert customer payment data from the frontend [URL
    // --->//customerpayment/insert]
    @PostMapping(value = "/customerpayment/insert")
    public String saveCustomerPaymentData(@RequestBody CustomerPayment customerPayment) {

        // check logged user Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Customer_Payment");

        if (userPrivilege.getPrivi_insert()) {

            // duplicate check

            try {

                // Set auto added data
                customerPayment.setAdd_date_time(LocalDateTime.now());
                customerPayment.setAdd_user_id(loggedUser.getId());

                // save operator(save frontend object)
                customerPaymentDao.save(customerPayment);
                return "OK";
            } catch (Exception e) {
                return "Save not completed :" + e.getMessage();
            }

        } else {

            return "Cannot Submit..! User havn't permissions..!";

        }

    }

    // 3....................delete.............................
    /// Delete rawmaterial data from the frontend [URL --->//rawmaterial/delete]
    @DeleteMapping(value = "/customerpayment/delete")
    public String deleteCustomer(@RequestBody CustomerPayment customerPayment) {

        // check logged user Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Customer_Payment");

        if (userPrivilege.getPrivi_delete()) {

            // Check ext (Existing)
            if (customerPayment.getId() == null) {
                return "Delete not completed : Customer Payment not exists..!";

            } // This refers there is no id in the object,so cannot delete..!

            CustomerPayment extCustomerPaymentById = customerPaymentDao.getReferenceById(customerPayment.getId());

            if (extCustomerPaymentById == null) {
                return "Delete Not Completed : Customer Payment not exists...!";

            } // This refferes to there is a id of thre object,but ithat id is not in the
              // database

            try {

                // Set auto added data
                // extCustomerPaymentById.setAdd_date_time(LocalDateTime.now());
                // extCustomerPaymentById.setAdd_user_id(loggedUser.getId());

                customerPaymentDao.delete(extCustomerPaymentById);

                // Dependancy

                return "OK";

            } catch (Exception e) {
                return "Delete not completed : " + e.getMessage();
            }

        } else {

            return "Cannot Delete...! User havn't permissions";

        }

    }

    // 4....................Update............................
    @PutMapping("customerpayment/update")
    public String updateCustomerPaymentData(@RequestBody CustomerPayment customerPayment) {

        // Check logged User Authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // User loggedUser = userDao.getByUsername(auth.getName());

        // Check User Authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()),
                "customer_payment");

        if (userPrivilege.getPrivi_update()) {

            // I Duplicate Check

            try {

                // Set auto added data
                // customerPayment.setUpdate_date_time((LocalDateTime.now()));
                // customerPayment.setUpdate_user_id(loggedUser.getId());

                // Save operator(save fontend data object)
                customerPaymentDao.save(customerPayment);
                return "OK";
            } catch (Exception e) {

                return "Update Not Completed :" + e.getMessage();
            }

        } else {

            return "Cannot Update..! User do not have Privileges..!";
        }

    }

}
