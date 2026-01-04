package lk.cckcakesandbakery.controller;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.cckcakesandbakery.dao.RoleDao;
import lk.cckcakesandbakery.dao.UserDao;
import lk.cckcakesandbakery.entity.Role;
import lk.cckcakesandbakery.entity.User;

@RestController
public class CustomerLoginController {

    // @Autowired
    // private UserDao userDao;

    // @Autowired
    // private RoleDao roleDao;

    // @Autowired
    // private BCryptPasswordEncoder bCryptPasswordEncoder; // In order to encrypt
    // Admin's password

    // request mapping for load user login ui[URL --->/login]
    @RequestMapping(value = "/customerlogin")
    public ModelAndView loadCustomerLoginUI() {

        ModelAndView customerLoginUI = new ModelAndView();
        customerLoginUI.setViewName("customerLogin.html");

        return customerLoginUI;
    }

    // // mapping for return index page url --> [/index or /]
    // @RequestMapping(value = { "/dashboard" })
    // public ModelAndView uiDashboardPage() {

    // Authentication auth =
    // SecurityContextHolder.getContext().getAuthentication();// This can access
    // // authentication
    // // object which has numerous
    // // properties

    // ModelAndView dashboardPage = new ModelAndView();
    // dashboardPage.setViewName("dashboard2.html");
    // dashboardPage.addObject("loggedusername", auth.getName());// This returns the
    // name of the logged user in the
    // // dashboard
    // return dashboardPage;

    // }

    // mapping for return error page url --> [/errorpage]
    // @RequestMapping(value = { "/errorpage" })
    // public ModelAndView errorPageUI() {
    // ModelAndView errorPageView = new ModelAndView();
    // errorPageView.setViewName("errorpage.html");
    // return errorPageView;

    // }

    // // mapping for create User "Admin"
    // @RequestMapping(value = { "/createadmin" })
    // public ModelAndView generateAdminAccount() {
    // User extAdminUser = userDao.getByUsername("Admin");
    // // If there is no existing Admin, we haveto generated a new Admin,if there
    // is,no
    // // need
    // if (extAdminUser == null) {
    // User adminUser = new User();
    // adminUser.setUsername("Admin");
    // adminUser.setEmail("Admin@gmail.com");
    // adminUser.setStatus(true);
    // adminUser.setAdded_date_time(LocalDateTime.now());
    // adminUser.setPassword(bCryptPasswordEncoder.encode("12345"));// Admin's
    // passwprd
    // Set<Role> roles = new HashSet<>();
    // Role adminRole = roleDao.getReferenceById(11);
    // roles.add(adminRole);

    // adminUser.setRoles(roles);

    // userDao.save(adminUser);
    // }
    // ModelAndView loginUI = new ModelAndView();
    // loginUI.setViewName("login3.html");
    // return loginUI;

    // }

}
