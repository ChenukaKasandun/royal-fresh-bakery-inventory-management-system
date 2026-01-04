package lk.cckcakesandbakery.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.cckcakesandbakery.dao.UserDao;
import lk.cckcakesandbakery.entity.Privilege;
import lk.cckcakesandbakery.entity.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class UserController {

  private final BCryptPasswordEncoder bCryptPasswordEncoder;

  @Autowired
  private UserDao userDao;

  @Autowired
  private UserPrivilegeController userPrivilegeController;

  UserController(BCryptPasswordEncoder bCryptPasswordEncoder) {
    this.bCryptPasswordEncoder = bCryptPasswordEncoder;
  }

  // request mapping for load user ui[URL --->/user]
  @RequestMapping(value = "/user")
  public ModelAndView loadUserUI() {

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();// This can access authentication
                                                                                 // object which has numerous
                                                                                 // properties

    ModelAndView userUI = new ModelAndView();
    userUI.setViewName("user.html");
    userUI.addObject("loggedusername", auth.getName());// This returns the name of the logged user in the
                                                       // User UI
    userUI.addObject("title", "User Management");// Inserting title from the backend using Thymeleaf
    // Function

    return userUI;
  }

  // request mapping for get user all data [URL --->//user/alldata]
  @GetMapping(value = "/user/alldata", produces = "application/json")
  public List<User> findAllData() {
    // Check User authentication and Authorization
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "User");
    if (userPrivilege.getPrivi_select()) {
      return userDao.findAll(auth.getName());// find all ---> retriving data as logged user cannot see the own
                                             // information and admin's information.(Query-->UserDao)

    } else {
      return new ArrayList<>();

    }

  }

  // insert post mapping for insert user data[URL ---> /user/insert]
  @PostMapping("/user/insert") // @RequestBody ---->Can access data object comming from the front end
  public String saveUserData(@RequestBody User user) {

    // checked logged user authorization

    // duplicate check

    try {

      // set autoadded data

      user.setAdded_date_time(LocalDateTime.now()); // auto added datetime
      user.setAdded_user_id(1); // auto added user id
      user.setPassword(bCryptPasswordEncoder.encode(user.getEmail())); // encrypt password

      // Save operator

      userDao.save(user);

      // Dependancy
      return "OK";

    } catch (Exception e) {
      return "Save Not Completed : " + e.getMessage();
    }

  }

  // Delete mapping for the user data [url-->/user/delete]
  @DeleteMapping(value = "/user/delete") // @Request mapping --> can access dataOb from front end
  public String deleteUser(@RequestBody User user) {

    // check logged user authentication and authorization
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "User");
    if (userPrivilege.getPrivi_delete()) {

      // Check Ext
      User extUser = userDao.getReferenceById(user.getId());
      if (extUser == null) {
        return "Delete not Completed : User Not Exist..!";

      }

      try {
        // set auto added data

        extUser.setDelete_date_time(LocalDateTime.now());
        extUser.setDelete_user_id(1);
        extUser.setStatus(false);

        // Delete operator
        userDao.save(extUser);

        // dependancy
        return "OK";

      } catch (Exception e) {

        return "Delete Not Completed : " + e.getMessage();
      }

    } else {
      return "Cannot Delete User..! You don't have permissions..!";
    }

  }

  // Update Function mapping
  @PutMapping("/user/update")
  public String updateUserData(@RequestBody User user) {
    // Check logged user authorization

    // dupplicate check

    try {

      // Set auto added data
      user.setUpdate_date_time(LocalDateTime.now());
      user.setUpdate_user_id(1);

      // Save operator ----> same as update operator
      userDao.save(user);

      // dependancies

      return "OK";
    } catch (Exception e) {
      return "Update Not Completed : " + e.getMessage();
    }

  }

}
