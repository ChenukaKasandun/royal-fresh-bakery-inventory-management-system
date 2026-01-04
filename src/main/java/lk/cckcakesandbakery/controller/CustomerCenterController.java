package lk.cckcakesandbakery.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class CustomerCenterController {

    // request mapping for load stock ui[URL --->/customercenter]
    @RequestMapping(value = "/customercenter")
    public ModelAndView loadCustomerCenterUI() {
        ModelAndView customerCenterUI = new ModelAndView();
        customerCenterUI.setViewName("customercenter.html");

        return customerCenterUI;
    }

}
