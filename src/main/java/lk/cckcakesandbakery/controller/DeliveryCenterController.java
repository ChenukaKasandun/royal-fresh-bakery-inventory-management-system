package lk.cckcakesandbakery.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class DeliveryCenterController {

    // request mapping for load stock ui[URL --->/deliverycenter]
    @RequestMapping(value = "/deliverycenter")
    public ModelAndView loadDeliveryCenterUI() {
        ModelAndView deliveryCenterUI = new ModelAndView();
        deliveryCenterUI.setViewName("deliverycenter.html");

        return deliveryCenterUI;
    }

}
