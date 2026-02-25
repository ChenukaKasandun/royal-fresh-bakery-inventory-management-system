package lk.cckcakesandbakery.controller;

import lk.cckcakesandbakery.dao.DeliveryStatusDao;
import lk.cckcakesandbakery.dao.WalkingCustomerPaymentDao;
import lk.cckcakesandbakery.entity.DeliveryStatus;
import lk.cckcakesandbakery.entity.WalkingCustomerPayment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController
public class WalkingCustomerPaymentController {

    // request mapping for load customer ui[URL --->/walkingcustomerpayment]
    @RequestMapping(value = "/walkingcustomerpayment")
    public ModelAndView loadWalkingCustomerPaymentUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView WalkingCustomerPaymentUI = new ModelAndView();
        WalkingCustomerPaymentUI.setViewName("walkingCustomerPayment.html");
        WalkingCustomerPaymentUI.addObject("loggedusername", auth.getName());
        WalkingCustomerPaymentUI.addObject("title", "Walking Customer Payment");

        return WalkingCustomerPaymentUI;
    }


    @Autowired // generate instance
    private WalkingCustomerPaymentDao walkingCustomerPaymentDao;
    // request mapping for load customer payment all data [URL--->
    // /walkingcustomerpayment/alldata]
    @GetMapping(value = "/walkingcustomerpayment/alldata", produces = "application/json")
    public List<WalkingCustomerPayment> findAllData() {
        return walkingCustomerPaymentDao.findAll();
    }

}
