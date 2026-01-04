package lk.cckcakesandbakery.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;


@RestController
public class CustomerDashboardController {

    // mapping for return dashboard page url --> [/dashboard]
    @RequestMapping(value = { "/customerdashboard" })
    public ModelAndView uiCustomerDashboardPage() {

        //Authentication auth = SecurityContextHolder.getContext().getAuthentication();// This can access authentication
        // object which has numerous
        // properties

        ModelAndView customerDashboardPage = new ModelAndView();
        customerDashboardPage.setViewName("customerDashboard.html");
        //customerDashboardPage.addObject("loggedusername", auth.getName());// This returns the name of the logged user in the
        // dashboard
        return customerDashboardPage;

    }
}
