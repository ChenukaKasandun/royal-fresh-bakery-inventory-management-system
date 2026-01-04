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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.cckcakesandbakery.dao.CustomerDao;
import lk.cckcakesandbakery.dao.CustomerStatusDao;
import lk.cckcakesandbakery.dao.UserDao;
import lk.cckcakesandbakery.entity.Customer;
import lk.cckcakesandbakery.entity.Privilege;
import lk.cckcakesandbakery.entity.User;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
public class CustomerController {

  @Autowired
  private CustomerDao customerDao;

  @Autowired
  private UserDao userDao;
  @Autowired
  private UserPrivilegeController userPrivilegeController;

  @Autowired
  private CustomerStatusDao customerStatusDao;

  // request mapping for load customer ui[URL --->/customer]
  @RequestMapping(value = "/customer")
  public ModelAndView loadCustomerUI() {

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    ModelAndView customerUI = new ModelAndView();
    customerUI.setViewName("Customer Management.html");
    customerUI.addObject("loggedusername", auth.getName());
    customerUI.addObject("title", "customer management");

    return customerUI;
  }

  // Requesting customers based on customer type ----> Individual
  @GetMapping("/customer/alldataByCustomerTypeIndividual")
  public List<Customer> findAllDataByCustomerTypeIndividual() {
    return customerDao.getCustomerByType(1);
  }

  // Requesting customers based on customer type ----> Individual
  @GetMapping("/customer/alldataByCustomerTypeShop")
  public List<Customer> findAllDataByCustomerTypeShop() {
    return customerDao.getCustomerByType(2);
  }

  // .................CRUD Operations...................

  // 1................Select...............................
  // request mapping for get customer all data [URL --->//customer/alldata]
  @GetMapping(value = "/customer/alldata", produces = "application/json")
  public List<Customer> findAllData() {

    // Check User Authentication
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    // Check User Authorization
    Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Customer_Management");

    if (userPrivilege.getPrivi_select()) {

      return customerDao.findAll(Sort.by(Direction.DESC, "id"));// this sets the data in descending order

    } else {

      return new ArrayList<>();

    }

  }

  // 2.................Insert.................................

  // request mapping for insert customer data from the frontend [URL
  // --->//customer/insert]
  @PostMapping(value = "/customer/insert")
  public String saveCustomerData(@RequestBody Customer customer) {

    // Check logged user authentication
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    User loggedUser = userDao.getByUsername(auth.getName());

    // Check logged user authorization
    Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Customer_Management");

    if (userPrivilege.getPrivi_insert()) {

      // duplicate check

      // Email Duplicate Check
      Customer extCustomerByEmail = customerDao.getCustomerByEmail(customer.getEmail());
      if (extCustomerByEmail != null && extCustomerByEmail.getId() != customer.getId()) {
        // return "Save not Completed : Email Allready exist..! ";
        return "Save Not Completed  : Entered Email " + customer.getEmail() + " already exist...!";

      }

      // Mobile No Duplicate Check
      Customer extCustomerByMobile = customerDao.getCustomerByMobileNo(customer.getMobileno());
      if (extCustomerByMobile != null && extCustomerByMobile.getId() != customer.getId()) {
        return "Save Not Completed : Entered Mobile No " + customer.getMobileno() + "already exists...!";

      }

      try {

        // Set auto added data
        customer.setAdd_date_time(LocalDateTime.now());
        customer.setAdd_user_id(loggedUser.getId());
        customer.setReg_no(customerDao.getNextCustomerRegNo());

        // save operator(save frontend object)
        customerDao.save(customer);
        return "OK";
      } catch (Exception e) {
        return "Save not completed :" + e.getMessage();
      }

    } else {

      return "Cannot Submit..! You don't have permissions..!";

    }

  }

  // 3.......................Delete..........................
  /// Delete rawmaterial data from the frontend [URL --->//rawmaterial/delete]
  @DeleteMapping(value = "/customer/delete")
  public String deleteCustomer(@RequestBody Customer customer) {

    // Check logged User Authentication

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    User loggedUser = userDao.getByUsername(auth.getName());

    // Check logged User Authorization
    Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Customer_Management");

    if (userPrivilege.getPrivi_delete()) {

      // Check ext (Existing)
      if (customer.getId() == null) {
        return "Delete not completed : Customer not exists..!";

      } // This refers there is no id in the object,so cannot delete..!

      Customer extCustomerById = customerDao.getReferenceById(customer.getId());

      if (extCustomerById == null) {
        return "Delete Not Completed : Customer not exists...!";

      } // This refferes to there is a id of thre object,but ithat id is not in the
        // database

      try {

        // Set auto added data
        extCustomerById.setDelete_date_time(LocalDateTime.now());
        extCustomerById.setDelete_user_id(loggedUser.getId());
        extCustomerById.setCustomer_status_id(customerStatusDao.getReferenceById(3));

        customerDao.save(extCustomerById);

        // Dependancy

        return "OK";

      } catch (Exception e) {
        return "Delete not completed : " + e.getMessage();
      }

    } else {

      return "Cannnot Delerte.!User Do not have permissions..!";

    }

  }

  // 4................Update.....................
  // Mapping for save fontend dataob to the database
  @PutMapping("customer/update")
  public String updateCustomerData(@RequestBody Customer customer) {

    // Check logged User Authentication
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    User loggedUser = userDao.getByUsername(auth.getName());

    // Check logged User Authorization
    Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Customer_Management");

    if (userPrivilege.getPrivi_update()) {

      // duplicate check

      // Email Duplicate Check
      Customer extCustomerByEmail = customerDao.getCustomerByEmail(customer.getEmail());
      if (extCustomerByEmail != null && extCustomerByEmail.getId() != customer.getId()) {
        // return "Save not Completed : Email Allready exist..! ";
        return "Update Not Completed  : Entered Email " + customer.getEmail() + " already exist...!";

      }

      // Mobile No Duplicate Check
      Customer extCustomerByMobile = customerDao.getCustomerByMobileNo(customer.getMobileno());
      if (extCustomerByMobile != null && extCustomerByMobile.getId() != customer.getId()) {
        return "Update Not Completed : Entered Mobile No " + customer.getMobileno() + "already exists...!";

      }

      try {

        // Set auto added data
        customer.setUpdate_date_time((LocalDateTime.now()));
        customer.setUpdate_user_id(loggedUser.getId());

        // Save operator(save fontend data object)
        customerDao.save(customer);
        return "OK";
      } catch (Exception e) {

        return "Update Not Completed :" + e.getMessage();
      }
    } else {

      return "Cannot Update..!User havn't permissions..!";

    }

  }

}
